# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

# Project imports
from app.models import League
from app.api.v2.base import not_found_error, conflict_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/api/v2",
    tags=["Leagues"],
    responses={
        404: {"description": "League not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Conflict"}
    }
)


class LeagueBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"


class LeagueCreate(LeagueBase):
    pass


class LeagueUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class LeagueResponse(LeagueBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("", response_model=ListResponse[LeagueResponse])
async def get_leagues(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = Query(None)
):
    """Get a list of leagues"""
    query = select(League)
    
    if status:
        query = query.where(League.status == status)
    
    total = await db.execute(select(func.count()).select_from(query.subquery()))
    total_count = total.scalar() or 0
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    leagues = result.scalars().all()
    return ListResponse(
        items=leagues,
        pagination={
            "total": total_count,
            "page": skip // limit + 1,
            "per_page": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    )


@router.get("/{league_id}", response_model=SingleResponse[LeagueResponse])
async def get_league(
    league_id: int = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a league by ID"""
    result = await db.execute(select(League).where(League.id == league_id))
    league = result.scalars().first()
    
    if not league:
        not_found_error(f"League with ID {league_id} not found")
    
    return SingleResponse(item=league)


@router.post("", response_model=SingleResponse[LeagueResponse], status_code=201)
async def create_league(
    league: LeagueCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new league"""
    # Check if league with same name exists
    exists = await db.execute(select(League).where(League.name == league.name))
    if exists.scalars().first():
        conflict_error(f"League with name '{league.name}' already exists")
    
    db_league = League(**league.dict())
    db.add(db_league)
    await db.commit()
    await db.refresh(db_league)
    
    return SingleResponse(item=db_league)


@router.patch("/{league_id}", response_model=SingleResponse[LeagueResponse])
async def update_league(
    league_update: LeagueUpdate,
    league_id: int = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Update a league"""
    result = await db.execute(select(League).where(League.id == league_id))
    db_league = result.scalars().first()
    
    if not db_league:
        not_found_error(f"League with ID {league_id} not found")
    
    # Update fields if they are provided
    update_data = league_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_league, key, value)
    
    await db.commit()
    await db.refresh(db_league)
    
    return SingleResponse(item=db_league)
