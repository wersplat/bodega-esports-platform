from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.models import Player
from database import get_db
from schemas.player import PlayerCreate, PlayerRead

router = APIRouter(prefix="/players", tags=["Players"])

@router.post("/", response_model=PlayerRead)
def create_player(player: PlayerCreate, db: Session = Depends(get_db)):
    db_player = Player(username=player.username, role=player.role, team_id=player.team_id)
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

@router.get("/", response_model=list[PlayerRead])
def get_players(db: Session = Depends(get_db)):
    return db.query(Player).all()
