# FastAPI imports
from fastapi import APIRouter, Depends, Query

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

# Project imports
from app.models.models import PlayerStat as PlayerStats  # Renamed to match actual model
from app.api.v2.base import raise_error, not_found_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

router = APIRouter(
    prefix="/api/v2",
    tags=["Players"],
    responses={
        404: {"description": "Player not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Player conflict"}
    }
)

class Position(str, Enum):
    GUARD = "guard"
    FORWARD = "forward"
    CENTER = "center"
    WING = "wing"
    BIG = "big"

class PlayerBase(BaseModel):
    id: int = Field(description="Player ID")
    profile_id: str = Field(description="Profile ID")
    team_id: Optional[int] = Field(default=None, description="Team ID")
    position: Position = Field(description="Player position")
    jersey_number: Optional[int] = Field(default=None, description="Jersey number")
    status: str = Field(description="Player status")
    created_at: datetime = Field(description="Creation timestamp")
    updated_at: datetime = Field(description="Last update timestamp")

class PlayerCreate(BaseModel):
    profile_id: str = Field(description="Profile ID")
    team_id: Optional[int] = Field(default=None, description="Team ID")
    position: Position = Field(description="Player position")
    jersey_number: Optional[int] = Field(default=None, description="Jersey number")
    status: str = Field(default="active", description="Player status")

class PlayerUpdate(BaseModel):
    team_id: Optional[int] = Field(default=None, description="Team ID")
    position: Optional[Position] = Field(default=None, description="Player position")
    jersey_number: Optional[int] = Field(default=None, description="Jersey number")
    status: Optional[str] = Field(default=None, description="Player status")
    name: str
    position: str
    number: Optional[int]
    team: Optional[Dict[str, str]]
    stats: Dict[str, Any]
    
    class Config:
        from_attributes = True
        validate_by_name = True

class PlayerCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    position: Position
    jersey_number: Optional[int]
    bio: Optional[str] = Field(max_length=500)
    profile_picture: Optional[str]
    social_links: Optional[Dict[str, str]]

class PlayerUpdate(BaseModel):
    name: Optional[str] = Field(min_length=1, max_length=100)
    position: Optional[Position]
    jersey_number: Optional[int]
    bio: Optional[str] = Field(max_length=500)
    profile_picture: Optional[str]
    social_links: Optional[Dict[str, str]]

class PlayerStatsOut(BaseModel):
    games_played: int
    minutes: float
    points: float
    assists: float
    rebounds: float
    steals: float
    blocks: float
    field_goals: float
    three_points: float
    free_throws: float
    plus_minus: float
    
    class Config:
        from_attributes = True

class PlayerOut(BaseModel):
    id: int
    name: str
    position: Position
    jersey_number: Optional[int]
    bio: Optional[str]
    profile_picture: Optional[str]
    social_links: Optional[Dict[str, str]]
    stats: Dict[str, Any]
    team: Optional[Dict[str, Any]]
    career_stats: Dict[str, Any]
    achievements: List[str]
    
    class Config:
        from_attributes = True
        validate_by_name = True

class PlayerStats(BaseModel):
    games_played: int
    points: int
    assists: int
    rebounds: int
    steals: int
    blocks: int
    field_goals: int
    three_points: int
    free_throws: int
    
    class Config:
        from_attributes = True

class PlayerHistory(BaseModel):
    event_id: int
    date: datetime
    points: int
    assists: int
    rebounds: int
    outcome: str

class PlayerAwards(BaseModel):
    id: int
    name: str
    date: datetime
    description: str

class PlayerComparison(BaseModel):
    player1_id: int
    player2_id: int
    head_to_head: Dict[str, Any]
    stats_comparison: Dict[str, Any]
    recent_games: List[Dict[str, Any]]

class PlayerHistory(BaseModel):
    player_id: int
    season_id: int
    team_id: int
    team_name: str
    games_played: int
    stats: Dict[str, Any]
    achievements: List[str]

@router.get(
    "/players",
    response_model=ListResponse[PlayerOut],
    summary="List players with filtering and sorting",
    description="""
    List all players with optional filtering and sorting.
    Supports filtering by:
    - Position
    - Team
    - Season
    - Minimum stats
    - Date range
    """
)
async def list_players(
    position: Optional[Position] = Query(None, description="Filter by player position"),
    team_id: Optional[int] = Query(None, description="Filter by team ID"),
    season_id: Optional[int] = Query(None, description="Filter by season ID"),
    min_games: Optional[int] = Query(None, description="Minimum games played"),
    min_points: Optional[float] = Query(None, description="Minimum points per game"),
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
        # Base query with joins
        stmt = select(Player)
        stmt = stmt.join(PlayerStats, Player.id == PlayerStats.player_id)
        
        # Apply filters
        if team_id:
            stmt = stmt.where(Player.team_id == team_id)
        if position:
            stmt = stmt.where(Player.position == position)
        if min_games:
            stmt = stmt.where(PlayerStats.games_played >= min_games)
            
        # Count total items
        total_stmt = select(func.count()).select_from(stmt.subquery())
        total = await db.execute(total_stmt)
        total = total.scalar()
        
        # Apply sorting
        sort_field = getattr(PlayerStats, sort_by)
        stmt = stmt.order_by(sort_field.desc())
        
        # Apply pagination
        offset = (page - 1) * per_page
        stmt = stmt.offset(offset).limit(per_page)
        
        # Get results
        result = await db.execute(stmt)
        players = result.scalars().all()
        
        return ListResponse(
            items=players,
            pagination={
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": (total + per_page - 1) // per_page
            },
            metadata={
                "sort_by": sort_by,
                "min_games": min_games
            }
        )
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch players",
            details={"error": str(e)}
        )

@router.post(
    "/players",
    response_model=SingleResponse[PlayerOut],
    summary="Create a new player",
    description="""
    Create a new player with the specified details.
    
    Returns:
    - Player details including name, position, and stats
    
    Triggers webhook events:
    - player_update
    """
)
async def create_player(
    player_data: PlayerCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        # Create player
        player = Player(**player_data.dict())
        db.add(player)
        await db.commit()
        await db.refresh(player)
        
        # Trigger webhook event
        from app.api.v2.webhooks import handle_player_update
        await handle_player_update(player.id, db)
        
        return SingleResponse(item=player)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to create player",
            details={"error": str(e)}
        )

@router.get("/players/{player_id}", response_model=SingleResponse[PlayerBase])
async def get_player(
    player_id: int,
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get player details
        stmt = select(Player)
        stmt = stmt.where(Player.id == player_id)
        result = await db.execute(stmt)
        player = result.scalar()
        
        if not player:
            raise not_found_error("Player", player_id)
            
        # Get player stats
        stats_stmt = select(PlayerStats)
        stats_stmt = stats_stmt.where(PlayerStats.player_id == player_id)
        stats_result = await db.execute(stats_stmt)
        stats = stats_result.scalar()
        
        # Get player history
        history_stmt = select(
            Event.id,
            Event.date,
            EventResult.points,
            EventResult.assists,
            EventResult.rebounds,
            EventResult.outcome
        ).join(EventResult, EventResult.event_id == Event.id)
        history_stmt = history_stmt.where(EventResult.player_id == player_id)
        history_stmt = history_stmt.order_by(Event.date.desc())
        history_result = await db.execute(history_stmt)
        history = history_result.all()
        
        # Format response
        player_data = {
            **player.dict(),
            "stats": stats.dict(),
            "history": [
                {
                    "event_id": h.id,
                    "date": h.date,
                    "points": h.points,
                    "assists": h.assists,
                    "rebounds": h.rebounds,
                    "outcome": h.outcome
                }
                for h in history
            ]
        }
        
        return SingleResponse(item=player_data)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch player details",
            details={"error": str(e)}
        )

@router.get("/players/{player_id}/awards", response_model=ListResponse[PlayerAwards])
async def get_player_awards(
    player_id: int,
    db: AsyncSession = Depends(get_db)
):
    try:
        stmt = select(Award)
        stmt = stmt.where(Award.player_id == player_id)
        stmt = stmt.order_by(Award.date.desc())
        
        result = await db.execute(stmt)
        awards = result.scalars().all()
        
        return ListResponse(items=awards)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch player awards",
            details={"error": str(e)}
        )
