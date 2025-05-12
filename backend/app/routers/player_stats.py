from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import PlayerStat
from app.schemas.player_stat import PlayerStatCreate, PlayerStatRead
from app.database import get_db
from app.utils.hash import hash_statline

router = APIRouter(prefix="/api/player-stats", tags=["Player Stats"])

from sqlalchemy.future import select

@router.post("/", response_model=PlayerStatRead)
async def create_profile_stat(stat: PlayerStatCreate, db: AsyncSession = Depends(get_db)):
    stat_dict = stat.dict()
    stat_hash = hash_statline(stat_dict)
    # Check if identical stat already exists (deduplication)
    stmt = select(PlayerStat).where(PlayerStat.stat_hash == stat_hash)
    result = await db.execute(stmt)
    existing = result.scalars().first()
    if existing:
        raise HTTPException(status_code=409, detail="Duplicate stat submission detected.")
    db_stat = PlayerStat(**stat_dict, stat_hash=stat_hash, profile_id=stat_dict["profile_id"])
    db.add(db_stat)
    await db.commit()
    await db.refresh(db_stat)
    return db_stat

@router.get("/", response_model=list[PlayerStatRead])
async def get_profile_stats(db: AsyncSession = Depends(get_db)):
    stmt = select(PlayerStat)
    result = await db.execute(stmt)
    return result.scalars().all()
