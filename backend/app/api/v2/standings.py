# FastAPI imports
from fastapi import APIRouter, Depends, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

# Project imports
from app.models import Team, Season, Match
from app.api.v2.base import not_found_error
from app.api.v2.responses import SingleResponse
from app.database import get_db

# Type imports
from typing import List
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/v2",
    tags=["Standings"],
    responses={
        404: {"description": "Data not found"},
        400: {"description": "Invalid parameters"}
    }
)


class TeamStanding(BaseModel):
    team_id: str
    team_name: str
    wins: int
    losses: int
    draws: int
    points: int
    games_played: int
    rank: int


class SeasonStandings(BaseModel):
    season_id: str
    season_name: str
    standings: List[TeamStanding]


@router.get("/seasons/{season_id}/standings", response_model=SingleResponse[SeasonStandings])
async def get_season_standings(
    season_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get standings for a specific season"""
    # First check if season exists
    season_result = await db.execute(select(Season).where(Season.id == season_id))
    season = season_result.scalars().first()
    
    if not season:
        not_found_error(f"Season with ID {season_id} not found")
    
    # Get all teams in the season
    teams_result = await db.execute(select(Team).where(Team.season_id == season_id))
    teams = teams_result.scalars().all()
    
    if not teams:
        return SingleResponse(
            item=SeasonStandings(
                season_id=str(season_id),
                season_name=season.name,
                standings=[]
            )
        )
    
    # Calculate standings for each team
    standings = []
    for i, team in enumerate(teams):
        # Get team matches
        team_matches = await db.execute(
            select(Match).where(
                or_(
                    Match.team1_id == team.id,
                    Match.team2_id == team.id
                )
            )
        )
        matches = team_matches.scalars().all()
        
        # Calculate wins, losses, draws
        wins = 0
        losses = 0
        draws = 0
        
        for match in matches:
            if match.status != "completed":
                continue
                
            if match.team1_id == team.id:
                if match.team1_score > match.team2_score:
                    wins += 1
                elif match.team1_score < match.team2_score:
                    losses += 1
                else:
                    draws += 1
            else:  # team is team2
                if match.team2_score > match.team1_score:
                    wins += 1
                elif match.team2_score < match.team1_score:
                    losses += 1
                else:
                    draws += 1
        
        # Calculate points and games played
        points = wins * 3 + draws  # 3 points for win, 1 for draw
        games_played = wins + losses + draws
        
        standings.append(TeamStanding(
            team_id=str(team.id),
            team_name=team.name,
            wins=wins,
            losses=losses,
            draws=draws,
            points=points,
            games_played=games_played,
            rank=i + 1  # temporary rank
        ))
    
    # Sort standings by points (descending)
    standings.sort(key=lambda x: x.points, reverse=True)
    
    # Update ranks based on sorted order
    for i, standing in enumerate(standings):
        standing.rank = i + 1
    
    return SingleResponse(
        item=SeasonStandings(
            season_id=str(season_id),
            season_name=season.name,
            standings=standings
        )
    )
