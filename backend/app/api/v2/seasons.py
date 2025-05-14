# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, and_

# Project imports
from app.models import Season, League
from app.api.v2.base import not_found_error, conflict_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import Optional, Union
from pydantic import BaseModel
from datetime import datetime, date

router = APIRouter(
    prefix="/api/v2",
    tags=["Seasons"],
    responses={
        404: {"description": "Season not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Conflict"}
    }
)


class SeasonBase(BaseModel):
    name: str
    description: Optional[str] = None
    league_id: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: str = "upcoming"  # upcoming, active, completed, cancelled


class SeasonCreate(SeasonBase):
    pass


class SeasonUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    league_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None


class SeasonResponse(SeasonBase):
    id: Union[int, str]  # Could be UUID or integer
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("", response_model=ListResponse[SeasonResponse])
async def get_seasons(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    league_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None)
):
    """Get a list of seasons"""
    query = select(Season)
    
    if league_id:
        query = query.where(Season.league_id == league_id)
    
    if status:
        query = query.where(Season.status == status)
    
    total = await db.execute(select(func.count()).select_from(query.subquery()))
    total_count = total.scalar() or 0
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    seasons = result.scalars().all()
    
    return ListResponse(
        items=seasons,
        pagination={
            "total": total_count,
            "page": skip // limit + 1,
            "per_page": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    )


@router.get("/{season_id}", response_model=SingleResponse[SeasonResponse])
async def get_season(
    season_id: Union[int, str] = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a season by ID"""
    result = await db.execute(select(Season).where(Season.id == season_id))
    season = result.scalars().first()
    
    if not season:
        not_found_error(f"Season with ID {season_id} not found")
    
    return SingleResponse(item=season)


@router.post("", response_model=SingleResponse[SeasonResponse], status_code=201)
async def create_season(
    season: SeasonCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new season"""
    # Check if league exists
    league_result = await db.execute(select(League).where(League.id == season.league_id))
    league = league_result.scalars().first()
    if not league:
        not_found_error(f"League with ID {season.league_id} not found")
    
    # Check if season with same name exists in the league
    exists = await db.execute(
        select(Season).where(
            and_(
                Season.name == season.name,
                Season.league_id == season.league_id
            )
        )
    )
    if exists.scalars().first():
        conflict_error(f"Season with name '{season.name}' already exists in this league")
    
    db_season = Season(**season.dict())
    db.add(db_season)
    await db.commit()
    await db.refresh(db_season)
    
    return SingleResponse(item=db_season)


@router.patch("/{season_id}", response_model=SingleResponse[SeasonResponse])
async def update_season(
    season_update: SeasonUpdate,
    season_id: Union[int, str] = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Update a season"""
    result = await db.execute(select(Season).where(Season.id == season_id))
    db_season = result.scalars().first()
    
    if not db_season:
        not_found_error(f"Season with ID {season_id} not found")
    
    # Check if league_id is being updated and if it exists
    update_data = season_update.dict(exclude_unset=True)
    if "league_id" in update_data:
        league_result = await db.execute(select(League).where(League.id == update_data["league_id"]))
        league = league_result.scalars().first()
        if not league:
            not_found_error(f"League with ID {update_data['league_id']} not found")
    
    # Update fields if they are provided
    for key, value in update_data.items():
        setattr(db_season, key, value)
    
    await db.commit()
    await db.refresh(db_season)
    
    return SingleResponse(item=db_season)
