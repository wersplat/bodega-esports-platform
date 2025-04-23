from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.models import PlayerStat
from database import get_db
from schemas.player_stat import PlayerStatCreate, PlayerStatRead

router = APIRouter(prefix="/player-stats", tags=["Player Stats"])

@router.post("/", response_model=PlayerStatRead)
def create_player_stat(stat: PlayerStatCreate, db: Session = Depends(get_db)):
    db_stat = PlayerStat(**stat.dict())
    db.add(db_stat)
    db.commit()
    db.refresh(db_stat)
    return db_stat

@router.get("/", response_model=list[PlayerStatRead])
def get_player_stats(db: Session = Depends(get_db)):
    return db.query(PlayerStat).all()
