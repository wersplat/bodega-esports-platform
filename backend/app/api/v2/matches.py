# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, or_

# Project imports
from app.models import Match, Team, Season
from app.api.v2.base import not_found_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import Optional
from pydantic import BaseModel
from datetime import datetime, date
from enum import Enum

router = APIRouter(
    prefix="/api/v2",
    tags=["Matches"],
    responses={
        404: {"description": "Match not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Conflict"}
    }
)


class MatchStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"


class MatchBase(BaseModel):
    team1_id: str
    team2_id: str
    scheduled_at: datetime
    season_id: str
    location: Optional[str] = None
    notes: Optional[str] = None
    status: MatchStatus = MatchStatus.SCHEDULED


class MatchCreate(MatchBase):
    pass


class MatchUpdate(BaseModel):
    team1_id: Optional[str] = None
    team2_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[MatchStatus] = None
    team1_score: Optional[int] = None
    team2_score: Optional[int] = None


class MatchResponse(MatchBase):
    id: str
    team1_score: Optional[int] = None
    team2_score: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("", response_model=ListResponse[MatchResponse])
async def get_matches(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    season_id: Optional[str] = Query(None),
    team_id: Optional[str] = Query(None),
    status: Optional[MatchStatus] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None)
):
    """Get a list of matches"""
    query = select(Match)
    
    if season_id:
        query = query.where(Match.season_id == season_id)
    
    if team_id:
        query = query.where(or_(Match.team1_id == team_id, Match.team2_id == team_id))
    
    if status:
        query = query.where(Match.status == status)
    
    if start_date:
        start_datetime = datetime.combine(start_date, datetime.min.time())
        query = query.where(Match.scheduled_at >= start_datetime)
    
    if end_date:
        end_datetime = datetime.combine(end_date, datetime.max.time())
        query = query.where(Match.scheduled_at <= end_datetime)
    
    total = await db.execute(select(func.count()).select_from(query.subquery()))
    total_count = total.scalar() or 0
    
    query = query.order_by(Match.scheduled_at).offset(skip).limit(limit)
    result = await db.execute(query)
    matches = result.scalars().all()
    
    return ListResponse(
        items=matches,
        pagination={
            "total": total_count,
            "page": skip // limit + 1,
            "per_page": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    )


@router.get("/{match_id}", response_model=SingleResponse[MatchResponse])
async def get_match(
    match_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a match by ID"""
    result = await db.execute(select(Match).where(Match.id == match_id))
    match = result.scalars().first()
    
    if not match:
        not_found_error(f"Match with ID {match_id} not found")
    
    return SingleResponse(item=match)


@router.post("", response_model=SingleResponse[MatchResponse], status_code=201)
async def create_match(
    match: MatchCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new match"""
    # Check if both teams exist
    team1_result = await db.execute(select(Team).where(Team.id == match.team1_id))
    team1 = team1_result.scalars().first()
    if not team1:
        not_found_error(f"Team with ID {match.team1_id} not found")
    
    team2_result = await db.execute(select(Team).where(Team.id == match.team2_id))
    team2 = team2_result.scalars().first()
    if not team2:
        not_found_error(f"Team with ID {match.team2_id} not found")
    
    # Check if season exists
    season_result = await db.execute(select(Season).where(Season.id == match.season_id))
    season = season_result.scalars().first()
    if not season:
        not_found_error(f"Season with ID {match.season_id} not found")
    
    # Check for scheduling conflicts
    # You could add more sophisticated conflict checking here
    
    db_match = Match(**match.dict())
    db.add(db_match)
    await db.commit()
    await db.refresh(db_match)
    
    return SingleResponse(item=db_match)


@router.patch("/{match_id}", response_model=SingleResponse[MatchResponse])
async def update_match(
    match_update: MatchUpdate,
    match_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Update a match"""
    result = await db.execute(select(Match).where(Match.id == match_id))
    db_match = result.scalars().first()
    
    if not db_match:
        not_found_error(f"Match with ID {match_id} not found")
    
    update_data = match_update.dict(exclude_unset=True)
    
    # Check if team1_id is being updated and if it exists
    if "team1_id" in update_data:
        team1_result = await db.execute(select(Team).where(Team.id == update_data["team1_id"]))
        team1 = team1_result.scalars().first()
        if not team1:
            not_found_error(f"Team with ID {update_data['team1_id']} not found")
    
    # Check if team2_id is being updated and if it exists
    if "team2_id" in update_data:
        team2_result = await db.execute(select(Team).where(Team.id == update_data["team2_id"]))
        team2 = team2_result.scalars().first()
        if not team2:
            not_found_error(f"Team with ID {update_data['team2_id']} not found")
    
    # Update fields
    for key, value in update_data.items():
        setattr(db_match, key, value)
    
    await db.commit()
    await db.refresh(db_match)
    
    return SingleResponse(item=db_match)
