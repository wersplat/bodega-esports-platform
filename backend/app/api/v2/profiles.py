# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, and_, or_

# Project imports
from app.models.models import User as Profile
from app.api.v2.base import not_found_error, conflict_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

router = APIRouter(
    prefix="/api/v2/profiles",
    tags=["Users"],
    responses={
        404: {"description": "User not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "User conflict"}
    }
)


# Re-export the ProfileStatus from models
from app.models.models import ProfileStatus


class ProfileBase(BaseModel):
    username: Optional[str] = None
    display_name: Optional[str] = None
    platform: Optional[str] = None
    gamer_tag: Optional[str] = None
    avatar_url: Optional[str] = None
    email: Optional[str] = None
    status: ProfileStatus = ProfileStatus.ACTIVE
    discord_id: Optional[str] = None
    is_admin: bool = False


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    display_name: Optional[str] = None
    platform: Optional[str] = None
    gamer_tag: Optional[str] = None
    avatar_url: Optional[str] = None
    email: Optional[str] = None
    status: Optional[ProfileStatus] = None
    discord_id: Optional[str] = None


class RoleInfo(BaseModel):
    id: str
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileResponse(ProfileBase):
    id: str
    created_at: datetime
    updated_at: datetime
    roles: List[RoleInfo] = []

    class Config:
        from_attributes = True


@router.get("", response_model=ListResponse[ProfileResponse])
async def get_profiles(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    username: Optional[str] = Query(None),
    status: Optional[ProfileStatus] = Query(None),
    search: Optional[str] = Query(None)
):
    """Get a list of profiles"""
    query = select(Profile)
    
    if username:
        query = query.where(Profile.username == username)
    
    if status:
        query = query.where(Profile.status == status)
    
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Profile.username.ilike(search_term),
                Profile.display_name.ilike(search_term),
                Profile.gamer_tag.ilike(search_term)
            )
        )
    
    total = await db.execute(select(func.count()).select_from(query.subquery()))
    total_count = total.scalar() or 0
    
    query = query.order_by(Profile.username).offset(skip).limit(limit)
    result = await db.execute(query)
    profiles = result.scalars().all()
    
    return ListResponse(
        items=profiles,
        pagination={
            "total": total_count,
            "page": skip // limit + 1,
            "per_page": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    )


@router.get("/{profile_id}", response_model=SingleResponse[ProfileResponse])
async def get_profile(
    profile_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a profile by ID"""
    result = await db.execute(select(Profile).where(Profile.id == profile_id))
    profile = result.scalars().first()
    
    if not profile:
        not_found_error(f"Profile with ID {profile_id} not found")
    
    return SingleResponse(item=profile)


@router.post("", response_model=SingleResponse[ProfileResponse], status_code=201)
async def create_profile(
    profile: ProfileCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new profile"""
    # Check if username or email already exists
    if profile.username:
        username_exists = await db.execute(select(Profile).where(Profile.username == profile.username))
        if username_exists.scalars().first():
            conflict_error(f"Username '{profile.username}' is already taken")
    
    if profile.email:
        email_exists = await db.execute(select(Profile).where(Profile.email == profile.email))
        if email_exists.scalars().first():
            conflict_error(f"Email '{profile.email}' is already registered")
    
    db_profile = Profile(**profile.dict())
    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    
    return SingleResponse(item=db_profile)


@router.patch("/{profile_id}", response_model=SingleResponse[ProfileResponse])
async def update_profile(
    profile_update: ProfileUpdate,
    profile_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Update a profile"""
    result = await db.execute(select(Profile).where(Profile.id == profile_id))
    db_profile = result.scalars().first()
    
    if not db_profile:
        not_found_error(f"Profile with ID {profile_id} not found")
    
    update_data = profile_update.dict(exclude_unset=True)
    
    # Check if username is being updated and already exists
    if "username" in update_data and update_data["username"] != db_profile.username:
        username_exists = await db.execute(
            select(Profile).where(
                and_(
                    Profile.username == update_data["username"],
                    Profile.id != profile_id
                )
            )
        )
        if username_exists.scalars().first():
            conflict_error(f"Username '{update_data['username']}' is already taken")
    
    # Check if email is being updated and already exists
    if "email" in update_data and update_data["email"] != db_profile.email:
        email_exists = await db.execute(
            select(Profile).where(
                and_(
                    Profile.email == update_data["email"],
                    Profile.id != profile_id
                )
            )
        )
        if email_exists.scalars().first():
            conflict_error(f"Email '{update_data['email']}' is already registered")
    
    # Update fields
    for key, value in update_data.items():
        setattr(db_profile, key, value)
    
    await db.commit()
    await db.refresh(db_profile)
    
    return SingleResponse(item=db_profile)
