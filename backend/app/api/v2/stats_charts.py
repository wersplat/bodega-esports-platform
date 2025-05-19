from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api.v2.base import raise_error
from app.api.v2.responses import ListResponse
from app.models.models import PlayerStat, Match, Team, User as Profile, Roster
from sqlalchemy import func, select
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

router = APIRouter(
    prefix="/api/v2",
    tags=["Stats Charts"],
    responses={
        404: {"description": "Data not found"},
        400: {"description": "Invalid parameters"}
    }
)

class StatType(str, Enum):
    POINTS = "points"
    ASSISTS = "assists"
    REBOUNDS = "rebounds"
    BLOCKS = "blocks"
    STEALS = "steals"

class TopScorer(BaseModel):
    profile_id: str
    username: str
    avg_points: float
    games_played: int
    highest_score: Optional[int]
    team_name: Optional[str]
    team_id: Optional[int]
    last_updated: datetime

class TeamWin(BaseModel):
    team_id: int
    team_name: str
    wins: int
    total_matches: int
    win_percentage: float
    points_scored: int
    points_against: int
    goal_difference: int
    last_updated: datetime

class StatProgression(BaseModel):
    date: datetime
    value: float
    games_played: int
    rank: int
    percentile: float

class StatProgressionResponse(BaseModel):
    profile_id: str
    username: str
    stat_type: str
    progression: List[StatProgression]
    current_value: float
    current_rank: int
    total_games: int

@router.get("/stats/top-scorers", response_model=ListResponse[TopScorer])
async def top_scorers(
    season_id: int,
    limit: int = Query(10, ge=1, le=100),
    min_games: int = Query(5, ge=1),
    include_team: bool = Query(False),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Base query
        stmt = select(
            PlayerStat.profile_id,
            func.avg(PlayerStat.points).label("avg_points"),
            func.count(PlayerStat.match_id).label("games_played"),
            func.max(PlayerStat.points).label("highest_score"),
            Profile.id,
            Profile.username
        ).join(Profile, PlayerStat.profile_id == Profile.id)
        
        # Apply filters
        stmt = stmt.where(PlayerStat.season_id == season_id)
        stmt = stmt.group_by(PlayerStat.profile_id, Profile.id, Profile.username)
        stmt = stmt.having(func.count(PlayerStat.match_id) >= min_games)
        stmt = stmt.order_by(func.avg(PlayerStat.points).desc())
        stmt = stmt.limit(limit)
        
        # Get results
        result = await db.execute(stmt)
        results = result.all()
        
        # Get team information if requested
        if include_team:
            team_stmt = select(
                Roster.profile_id,
                Team.id.label("team_id"),
                Team.name.label("team_name")
            ).join(Team, Team.id == Roster.team_id)
            team_stmt = team_stmt.where(Roster.season_id == season_id)
            team_result = (await db.execute(team_stmt)).all()
            team_map = {r.profile_id: r for r in team_result}
        
        # Format response
        scorers = []
        for r in results:
            scorer = {
                "profile_id": r.profile_id,
                "username": r.username,
                "avg_points": round(r.avg_points, 2),
                "games_played": r.games_played,
                "highest_score": r.highest_score,
            }
            
            if include_team:
                team_info = team_map.get(r.profile_id)
                if team_info:
                    scorer["team_id"] = team_info.team_id
                    scorer["team_name"] = team_info.team_name
            
            scorers.append(TopScorer(**scorer))
        
        return ListResponse(
            items=scorers,
            pagination={
                "total": len(scorers),
                "page": 1,
                "per_page": limit,
                "total_pages": 1
            }
        )
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch top scorers",
            details={"error": str(e)}
        )

@router.get("/stats/team-wins", response_model=ListResponse[TeamWin])
async def team_wins(
    season_id: int,
    include_stats: bool = Query(False),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Base query
        stmt = select(
            Team.id.label("team_id"),
            Team.name.label("team_name"),
            func.count(Match.winner_id).label("wins"),
            func.count(Match.id).label("total_matches"),
            func.sum(Match.winner_points).label("points_scored"),
            func.sum(Match.loser_points).label("points_against")
        ).join(Match, Match.winner_id == Team.id)
        
        # Apply filters
        stmt = stmt.where(Match.season_id == season_id)
        stmt = stmt.group_by(Team.id, Team.name)
        stmt = stmt.order_by(func.count(Match.winner_id).desc())
        
        # Get results
        result = await db.execute(stmt)
        results = result.all()
        
        # Calculate additional stats
        wins = []
        for r in results:
            win_percentage = (r.wins / r.total_matches) * 100 if r.total_matches > 0 else 0
            goal_difference = r.points_scored - r.points_against
            
            win = TeamWin(
                team_id=r.team_id,
                team_name=r.team_name,
                wins=r.wins,
                total_matches=r.total_matches,
                win_percentage=round(win_percentage, 2),
                points_scored=r.points_scored,
                points_against=r.points_against,
                goal_difference=goal_difference
            )
            wins.append(win)
        
        return ListResponse(
            items=wins,
            pagination={
                "total": len(wins),
                "page": 1,
                "per_page": len(wins),
                "total_pages": 1
            }
        )
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch team wins",
            details={"error": str(e)}
        )

@router.get("/stats/progression", response_model=StatProgressionResponse)
async def stat_progression(
    profile_id: str,
    stat_type: str = Query("points", enum=["points", "rebounds", "assists", "steals"]),
    season_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    try:
        # Validate stat type
        if stat_type not in ["points", "rebounds", "assists", "steals"]:
            raise_error(
                code="INVALID_PARAM",
                message="Invalid stat type",
                details={"valid_types": ["points", "rebounds", "assists", "steals"]}
            )
            
        # Base query
        stmt = select(
            PlayerStat.match_date,
            getattr(PlayerStat, stat_type),
            func.count(PlayerStat.match_id).over(
                order_by=PlayerStat.match_date
            ).label("games_played"),
            Profile.username
        ).join(Profile, Profile.id == PlayerStat.profile_id)
        
        # Apply filters
        stmt = stmt.where(PlayerStat.profile_id == profile_id)
        if season_id:
            stmt = stmt.where(PlayerStat.season_id == season_id)
        stmt = stmt.order_by(PlayerStat.match_date)
        
        # Get results
        result = await db.execute(stmt)
        results = result.all()
        
        # Calculate progression
        progression = []
        current_rank = 1
        total_games = len(results)
        
        for r in results:
            percentile = (current_rank / total_games) * 100
            progression.append(StatProgression(
                date=r.match_date,
                value=r[stat_type],
                games_played=r.games_played,
                rank=current_rank,
                percentile=round(percentile, 2)
            ))
            current_rank += 1
        
        # Get current value
        current_value = getattr(results[-1], stat_type) if results else 0
        
        return StatProgressionResponse(
            profile_id=profile_id,
            username=results[0].username if results else "",
            stat_type=stat_type,
            progression=progression,
            current_value=current_value,
            current_rank=current_rank,
            total_games=total_games
        )
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch stat progression",
            details={"error": str(e)}
        )
