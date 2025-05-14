# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, and_

# Project imports
from app.models import Division, Season
from app.api.v2.base import not_found_error, conflict_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/api/v2",
    tags=["Divisions"],
    responses={
        404: {"description": "Division not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Conflict"}
    }
)


class DivisionBase(BaseModel):
    name: str
    description: Optional[str] = None
    season_id: str


class DivisionCreate(DivisionBase):
    pass


class DivisionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class DivisionResponse(DivisionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("", response_model=ListResponse[DivisionResponse])
async def get_divisions(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    season_id: Optional[str] = Query(None)
):
    """Get a list of divisions"""
    query = select(Division)
    
    if season_id:
        query = query.where(Division.season_id == season_id)
    
    total = await db.execute(select(func.count()).select_from(query.subquery()))
    total_count = total.scalar() or 0
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    divisions = result.scalars().all()
    
    return ListResponse(
        items=divisions,
        pagination={
            "total": total_count,
            "page": skip // limit + 1,
            "per_page": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    )


@router.get("/{division_id}", response_model=SingleResponse[DivisionResponse])
async def get_division(
    division_id: int = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a division by ID"""
    result = await db.execute(select(Division).where(Division.id == division_id))
    division = result.scalars().first()
    
    if not division:
        not_found_error(f"Division with ID {division_id} not found")
    
    return SingleResponse(item=division)


@router.post("", response_model=SingleResponse[DivisionResponse], status_code=201)
async def create_division(
    division: DivisionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new division"""
    # Check if season exists
    season_result = await db.execute(select(Season).where(Season.id == division.season_id))
    season = season_result.scalars().first()
    if not season:
        not_found_error(f"Season with ID {division.season_id} not found")
    
    # Check if division with same name exists in the season
    exists = await db.execute(
        select(Division).where(
            and_(
                Division.name == division.name,
                Division.season_id == division.season_id
            )
        )
    )
    if exists.scalars().first():
        conflict_error(f"Division with name '{division.name}' already exists in this season")
    
    db_division = Division(**division.dict())
    db.add(db_division)
    await db.commit()
    await db.refresh(db_division)
    
    return SingleResponse(item=db_division)


@router.patch("/{division_id}", response_model=SingleResponse[DivisionResponse])
async def update_division(
    division_update: DivisionUpdate,
    division_id: int = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Update a division"""
    result = await db.execute(select(Division).where(Division.id == division_id))
    db_division = result.scalars().first()
    
    if not db_division:
        not_found_error(f"Division with ID {division_id} not found")
    
    # Update fields if they are provided
    update_data = division_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_division, key, value)
    
    await db.commit()
    await db.refresh(db_division)
    
    return SingleResponse(item=db_division)
