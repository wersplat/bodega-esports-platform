from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.models import User as Profile
from app.schemas.profile import ProfileCreate, ProfileRead, ProfileUpdate

router = APIRouter(prefix="/api/users", tags=["Users"])

from sqlalchemy.future import select

@router.post("/", response_model=ProfileRead)
async def create_profile(profile: ProfileCreate, db: AsyncSession = Depends(get_db)):
    """Create a new user profile."""
    db_profile = Profile(**profile.dict())
    db.add(db_profile)
    await db.commit()
    await db.refresh(db_profile)
    return db_profile

@router.get("/{profile_id}", response_model=ProfileRead)
@router.get("/{profile_id}", response_model=ProfileRead)
async def get_profile(profile_id: int, db: AsyncSession = Depends(get_db)):
    """Retrieve a user profile by ID."""
    stmt = select(Profile).where(Profile.id == profile_id)
    result = await db.execute(stmt)
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/{profile_id}", response_model=ProfileRead)
@router.put("/{profile_id}", response_model=ProfileRead)
async def update_profile(profile_id: int, profile_update: ProfileUpdate, db: AsyncSession = Depends(get_db)):
    """Update an existing user profile."""
    stmt = select(Profile).where(Profile.id == profile_id)
    result = await db.execute(stmt)
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    for key, value in profile_update.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    await db.commit()
    await db.refresh(profile)
    return profile

@router.delete("/{profile_id}")
@router.delete("/{profile_id}")
async def delete_profile(profile_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a user profile by ID."""
    stmt = select(Profile).where(Profile.id == profile_id)
    result = await db.execute(stmt)
    profile = result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    await db.delete(profile)
    await db.commit()
    return {"status": "success", "message": "Profile deleted successfully."}
