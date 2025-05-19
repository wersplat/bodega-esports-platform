from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status
from fastapi import APIRouter

from app.database import get_db
from app.models.models import User as Profile
from app.schemas.profile import ProfileCreate, ProfileRead, ProfileUpdate

# Ensure the router is properly defined
router = APIRouter(prefix="/api/players", tags=["Players"])


@router.post("/", response_model=ProfileRead)
async def create_player(
    player: ProfileCreate, db: AsyncSession = Depends(get_db)
):
    db_player = Profile(**player.model_dump())
    db.add(db_player)
    await db.commit()
    await db.refresh(db_player)
    return db_player


@router.get("/", response_model=list[ProfileRead])
async def get_players(db: AsyncSession = Depends(get_db)):
    stmt = select(Profile)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{player_id}", response_model=ProfileRead)
async def get_player(
    player_id: int, db: AsyncSession = Depends(get_db)
):
    stmt = select(Profile).where(Profile.id == player_id)
    result = await db.execute(stmt)
    player = result.scalars().first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )
    return player


@router.put("/{player_id}", response_model=ProfileRead)
async def update_profile(
    player_id: int, player: ProfileUpdate, db: AsyncSession = Depends(get_db)
):
    from sqlalchemy.future import select
    stmt = select(Profile).where(Profile.id == player_id)
    result = await db.execute(stmt)
    db_player = result.scalars().first()
    if not db_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )
    for key, value in player.model_dump(exclude_unset=True).items():
        setattr(db_player, key, value)
    await db.commit()
    await db.refresh(db_player)
    return db_player


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(
    player_id: int, db: AsyncSession = Depends(get_db)
):
    from sqlalchemy.future import select
    stmt = select(Profile).where(Profile.id == player_id)
    result = await db.execute(stmt)
    db_player = result.scalars().first()
    if not db_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )
    await db.delete(db_player)
    await db.commit()
    return None
