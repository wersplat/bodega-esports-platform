from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.models import PlayerStat
from app.schemas.player_stat import PlayerStatCreate, PlayerStatRead
from app.database import get_db
from app.utils.hash import hash_statline

router = APIRouter(prefix="/api/player-stats", tags=["Player Stats"])

@router.post("/", response_model=PlayerStatRead)
def create_player_stat(stat: PlayerStatCreate, db: Session = Depends(get_db)):
    stat_dict = stat.dict()
    stat_hash = hash_statline(stat_dict)

    # Check if identical stat already exists (deduplication)
    existing = db.query(PlayerStat).filter(PlayerStat.stat_hash == stat_hash).first()
    if existing:
        raise HTTPException(status_code=409, detail="Duplicate stat submission detected.")

    db_stat = PlayerStat(**stat_dict, stat_hash=stat_hash)
    db.add(db_stat)
    db.commit()
    db.refresh(db_stat)
    return db_stat

@router.get("/", response_model=list[PlayerStatRead])
def get_player_stats(db: Session = Depends(get_db)):
    return db.query(PlayerStat).all()
