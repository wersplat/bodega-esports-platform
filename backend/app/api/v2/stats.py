# FastAPI imports
from fastapi import APIRouter, Depends, Query

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

# Project imports
from app.models.models import Team, Player
from app.models.models import PlayerStat as PlayerStats
from app.api.v2.base import raise_error
from app.api.v2.responses import ListResponse
from app.database import get_db

# Type imports
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

router = APIRouter(
    prefix="/api/v2",
    tags=["Stats"],
    responses={
        404: {"description": "Stats not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Stats conflict"}
    }
)

class StatType(str, Enum):
    POINTS = "points"
    ASSISTS = "assists"
    REBOUNDS = "rebounds"
    BLOCKS = "blocks"
    STEALS = "steals"
    FG_PERCENTAGE = "fg_percentage"
    THREE_PERCENTAGE = "three_percentage"
    FT_PERCENTAGE = "ft_percentage"

class LeaderboardEntry(BaseModel):
    player_id: str = Field(description="Player ID")
    player_name: str = Field(description="Player name")
    team_name: str = Field(description="Team name")
    team_id: str = Field(description="Team ID")
    games_played: int = Field(alias="gamesPlayed", description="Number of games played")
    points_per_game: float = Field(alias="ppg", description="Points per game")
    assists_per_game: float = Field(alias="apg", description="Assists per game")
    rebounds_per_game: float = Field(alias="rpg", description="Rebounds per game")
    steals_per_game: float = Field(alias="spg", description="Steals per game")
    blocks_per_game: float = Field(alias="bpg", description="Blocks per game")
    field_goal_percentage: float = Field(alias="fgp", description="Field goal percentage")
    three_point_percentage: float = Field(alias="3pp", description="Three-point percentage")
    free_throw_percentage: float = Field(alias="ftp", description="Free throw percentage")
    last_updated: datetime = Field(description="Last update timestamp")

class StatFilter(BaseModel):
    stat_type: Optional[StatType] = Field(default=None, description="Type of stat to filter")
    min_games: Optional[int] = Field(default=None, description="Minimum number of games played")
    season_id: Optional[int] = Field(default=None, description="Season ID to filter")
    league_id: Optional[int] = Field(default=None, description="League ID to filter")
    team_id: Optional[str] = Field(default=None, description="Team ID to filter")
    start_date: Optional[datetime] = Field(default=None, description="Start date for stats")
    end_date: Optional[datetime] = Field(default=None, description="End date for stats")
    three_point_percentage: float = Field(alias="tpg")

class LeaderboardResponse(BaseModel):
    entries: List[LeaderboardEntry]
    total_players: int = Field(alias="totalPlayers")
    season_id: int = Field(alias="seasonId")
    updated_at: datetime = Field(alias="updatedAt")

@router.get(
    "/stats/leaderboard",
    response_model=ListResponse[LeaderboardEntry],
    summary="Get player leaderboard",
    description="""
    Retrieve the player leaderboard for a specific season with various sorting options.
    
    Returns:
    - List of players with their stats
    - Total number of players
    - Pagination information
    - Updated timestamp
    
    Sorting Options:
    - ppg: Points per game
    - apg: Assists per game
    - rpg: Rebounds per game
    - spg: Steals per game
    - bpg: Blocks per game
    - fgp: Field goal percentage
    - tpg: Three-point percentage
    """,
    responses={
        200: {
            "description": "Leaderboard retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "items": [
                            {
                                "player_id": "player123",
                                "player_name": "John Doe",
                                "team_name": "Bodega Cats",
                                "games_played": 15,
                                "points_per_game": 24.5,
                                "assists_per_game": 5.2,
                                "rebounds_per_game": 7.8,
                                "steals_per_game": 1.5,
                                "blocks_per_game": 0.9,
                                "field_goal_percentage": 0.48,
                                "three_point_percentage": 0.35
                            }
                        ],
                        "pagination": {
                            "total": 100,
                            "page": 1,
                            "per_page": 25,
                            "total_pages": 4
                        },
                        "metadata": {
                            "season_id": 1,
                            "sort_by": "ppg",
                            "min_games": 5,
                            "updated_at": "2025-05-14T12:11:55+00:00"
                        }
                    }
                }
            }
        }
    }
)
async def get_leaderboard(
    season_id: int = Query(
        ..., 
        description="The ID of the season to retrieve leaderboard for",
        example=1
    ),
    sort_by: str = Query(
        "ppg", 
        enum=["ppg", "apg", "rpg", "spg", "bpg", "fgp", "tpg"],
        description="Field to sort the leaderboard by"
    ),
    min_games: int = Query(
        5, 
        ge=1,
        description="Minimum number of games played to be included in the leaderboard",
        example=5
    ),
    page: int = Query(
        1, 
        ge=1,
        description="Page number for pagination",
        example=1
    ),
    per_page: int = Query(
        25, 
        ge=1, 
        le=100,
        description="Number of players per page",
        example=25
    ),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Base query with joins
        stmt = select(
            PlayerStats,
            Player.username.label("player_name"),
            Team.name.label("team_name")
        ).join(Player, Player.id == PlayerStats.player_id)
        stmt = stmt.join(Team, Team.id == PlayerStats.team_id)
        stmt = stmt.where(PlayerStats.season_id == season_id)
        
        # Calculate total players
        total_stmt = select(func.count()).select_from(stmt.subquery())
        total = await db.execute(total_stmt)
        total = total.scalar()
        
        # Apply minimum games filter
        stmt = stmt.where(PlayerStats.games_played >= min_games)
        
        # Sort by specified field
        sort_field = getattr(PlayerStats, sort_by)
        stmt = stmt.order_by(sort_field.desc())
        
        # Apply pagination
        offset = (page - 1) * per_page
        stmt = stmt.offset(offset).limit(per_page)
        
        # Get results
        result = await db.execute(stmt)
        stats = result.all()
        
        # Format response
        formatted_stats = [
            {
                "player_id": stat.PlayerStats.player_id,
                "player_name": stat.player_name,
                "team_name": stat.team_name,
                "games_played": stat.PlayerStats.games_played,
                "points_per_game": stat.PlayerStats.points_per_game,
                "assists_per_game": stat.PlayerStats.assists_per_game,
                "rebounds_per_game": stat.PlayerStats.rebounds_per_game,
                "steals_per_game": stat.PlayerStats.steals_per_game,
                "blocks_per_game": stat.PlayerStats.blocks_per_game,
                "field_goal_percentage": stat.PlayerStats.field_goal_percentage,
                "three_point_percentage": stat.PlayerStats.three_point_percentage
            }
            for stat in stats
        ]
        
        return ListResponse(
            items=formatted_stats,
            pagination={
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": (total + per_page - 1) // per_page
            },
            metadata={
                "season_id": season_id,
                "sort_by": sort_by,
                "min_games": min_games,
                "updated_at": datetime.utcnow()
            }
        )
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch leaderboard",
            details={"error": str(e)}
        )
