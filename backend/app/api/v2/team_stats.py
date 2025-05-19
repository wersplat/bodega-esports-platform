from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api.v2.base import raise_error, not_found_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.models import Team, TeamMember
from app.models.models import User as Profile
from app.models.models import PlayerStat as PlayerStats
from sqlalchemy import func, select, desc
from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime, date
from enum import Enum

router = APIRouter(
    prefix="/api/v2",
    tags=["Team Stats"],
    responses={
        404: {"description": "Team not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Conflict"}
    }
)

class StatType(str, Enum):
    POINTS = "points"
    ASSISTS = "assists"
    REBOUNDS = "rebounds"
    BLOCKS = "blocks"
    STEALS = "steals"

class StatFilter(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    season_id: Optional[int] = None
    player_id: Optional[str] = None
    min_games: Optional[int] = None
    stat_type: Optional[StatType] = None

class PlayerStatsOut(BaseModel):
    player_id: str
    name: str
    team_id: str
    team_name: str
    games_played: int
    points_per_game: float = Field(alias="ppg")
    assists_per_game: float = Field(alias="apg")
    rebounds_per_game: float = Field(alias="rpg")
    steals_per_game: float = Field(alias="spg")
    blocks_per_game: float = Field(alias="bpg")
    field_goal_percentage: float = Field(alias="fgp")
    three_point_percentage: float = Field(alias="3pp")
    free_throw_percentage: float = Field(alias="ftp")
    last_updated: datetime
    position: Optional[str]
    jersey_number: Optional[int]
    games_played: int
    points: int
    assists: int
    rebounds: int
    steals: int
    blocks: int
    field_goals: float
    three_points: float
    free_throws: float
    minutes: float
    plus_minus: int
    
    class Config:
        from_attributes = True

class TeamStatsOut(BaseModel):
    team_id: int
    name: str
    season_id: int
    games_played: int
    wins: int
    losses: int
    points_for: int
    points_against: int
    avg_points: float
    avg_assists: float
    avg_rebounds: float
    avg_field_goals: float
    avg_three_points: float
    avg_free_throws: float
    
    class Config:
        from_attributes = True

@router.get("/teams/{team_id}/stats", response_model=SingleResponse[TeamStatsOut])
async def get_team_stats(
    team_id: int = Path(
        ..., 
        description="The ID of the team to retrieve stats for",
        example=1
    ),
    filters: StatFilter = Depends(),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get team info
        team_stmt = select(Team)
        team_stmt = team_stmt.where(Team.id == team_id)
        team_result = await db.execute(team_stmt)
        team = team_result.scalar()
        
        if not team:
            raise not_found_error("Team", team_id)
            
        # Base query for team stats
        team_stats_stmt = select(
            func.count(PlayerStats.game_id).label("games_played"),
            func.sum(PlayerStats.points).label("points_for"),
            func.sum(PlayerStats.assists).label("assists"),
            func.sum(PlayerStats.rebounds).label("rebounds"),
            func.avg(PlayerStats.points).label("avg_points"),
            func.avg(PlayerStats.assists).label("avg_assists"),
            func.avg(PlayerStats.rebounds).label("avg_rebounds"),
            func.avg(PlayerStats.field_goals).label("avg_field_goals"),
            func.avg(PlayerStats.three_points).label("avg_three_points"),
            func.avg(PlayerStats.free_throws).label("avg_free_throws")
        ).join(TeamMember, PlayerStats.team_member_id == TeamMember.id)
        team_stats_stmt = team_stats_stmt.where(TeamMember.team_id == team_id)
        
        # Apply filters
        if filters.season_id:
            team_stats_stmt = team_stats_stmt.where(TeamMember.season_id == filters.season_id)
        if filters.start_date:
            team_stats_stmt = team_stats_stmt.where(PlayerStats.game_date >= filters.start_date)
        if filters.end_date:
            team_stats_stmt = team_stats_stmt.where(PlayerStats.game_date <= filters.end_date)
        
        team_stats_result = await db.execute(team_stats_stmt)
        team_stats = team_stats_result.first()
        
        # Get wins/losses
        wins_losses_stmt = select(
            func.count().filter(PlayerStats.points > 0).label("wins"),
            func.count().filter(PlayerStats.points <= 0).label("losses")
        ).join(TeamMember, PlayerStats.team_member_id == TeamMember.id)
        wins_losses_stmt = wins_losses_stmt.where(TeamMember.team_id == team_id)
        wins_losses_result = await db.execute(wins_losses_stmt)
        wins_losses = wins_losses_result.first()
        
        return SingleResponse(item={
            "team_id": team_id,
            "name": team.name,
            "season_id": team.season_id,
            "games_played": team_stats.games_played,
            "wins": wins_losses.wins,
            "losses": wins_losses.losses,
            "points_for": team_stats.points_for,
            "points_against": 0,  # TODO: Calculate points against
            "avg_points": team_stats.avg_points,
            "avg_assists": team_stats.avg_assists,
            "avg_rebounds": team_stats.avg_rebounds,
            "avg_field_goals": team_stats.avg_field_goals,
            "avg_three_points": team_stats.avg_three_points,
            "avg_free_throws": team_stats.avg_free_throws
        })
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch team stats",
            details={"error": str(e)}
        )

@router.get("/teams/{team_id}/stats/players", response_model=ListResponse[PlayerStatsOut])
async def get_team_player_stats(
    team_id: int = Path(
        ..., 
        description="The ID of the team to retrieve player stats for",
        example=1
    ),
    filters: StatFilter = Depends(),
    sort_by: str = Query(
        "points",
        enum=["points", "assists", "rebounds", "field_goals", "three_points", "free_throws"],
        description="Sort results by this statistic"
    ),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get team info
        team_stmt = select(Team)
        team_stmt = team_stmt.where(Team.id == team_id)
        team_result = await db.execute(team_stmt)
        team = team_result.scalar()
        
        if not team:
            raise not_found_error("Team", team_id)
            
        # Base query for player stats
        player_stats_stmt = select(
            TeamMember.user_id,
            Profile.username,
            TeamMember.position,
            TeamMember.jersey_number,
            func.count(PlayerStats.game_id).label("games_played"),
            func.sum(PlayerStats.points).label("points"),
            func.sum(PlayerStats.assists).label("assists"),
            func.sum(PlayerStats.rebounds).label("rebounds"),
            func.sum(PlayerStats.steals).label("steals"),
            func.sum(PlayerStats.blocks).label("blocks"),
            func.avg(PlayerStats.field_goals).label("field_goals"),
            func.avg(PlayerStats.three_points).label("three_points"),
            func.avg(PlayerStats.free_throws).label("free_throws"),
            func.avg(PlayerStats.minutes).label("minutes"),
            func.sum(PlayerStats.plus_minus).label("plus_minus")
        ).join(TeamMember, PlayerStats.team_member_id == TeamMember.id)
        player_stats_stmt = player_stats_stmt.join(Profile)
        player_stats_stmt = player_stats_stmt.where(TeamMember.team_id == team_id)
        
        # Apply filters
        if filters.season_id:
            player_stats_stmt = player_stats_stmt.where(TeamMember.season_id == filters.season_id)
        if filters.player_id:
            player_stats_stmt = player_stats_stmt.where(TeamMember.user_id == filters.player_id)
        if filters.min_games:
            player_stats_stmt = player_stats_stmt.having(func.count(PlayerStats.game_id) >= filters.min_games)
        if filters.start_date:
            player_stats_stmt = player_stats_stmt.where(PlayerStats.game_date >= filters.start_date)
        if filters.end_date:
            player_stats_stmt = player_stats_stmt.where(PlayerStats.game_date <= filters.end_date)
        
        # Count total items
        total_stmt = select(func.count()).select_from(player_stats_stmt.subquery())
        total = await db.execute(total_stmt)
        total = total.scalar()
        
        # Apply sorting
        sort_field = getattr(PlayerStats, sort_by)
        player_stats_stmt = player_stats_stmt.order_by(desc(sort_field))
        
        # Apply pagination
        offset = (page - 1) * per_page
        player_stats_stmt = player_stats_stmt.offset(offset).limit(per_page)
        
        # Execute query
        result = await db.execute(player_stats_stmt)
        player_stats = result.all()
        
        return ListResponse(
            items=[{
                "player_id": p.user_id,
                "name": p.username,
                "position": p.position,
                "jersey_number": p.jersey_number,
                "games_played": p.games_played,
                "points": p.points,
                "assists": p.assists,
                "rebounds": p.rebounds,
                "steals": p.steals,
                "blocks": p.blocks,
                "field_goals": p.field_goals,
                "three_points": p.three_points,
                "free_throws": p.free_throws,
                "minutes": p.minutes,
                "plus_minus": p.plus_minus
            } for p in player_stats],
            pagination={
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": (total + per_page - 1) // per_page
            }
        )
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch player stats",
            details={"error": str(e)}
        )
