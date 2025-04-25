from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi import APIRouter

from app.database import get_db
from app.models.models import Player
from app.schemas.player import PlayerCreate, PlayerRead

# Ensure the router is properly defined
router = APIRouter(prefix="/api/players", tags=["Players"])


@router.post("/", response_model=PlayerRead)
def create_player(
    player: PlayerCreate, db: Session = Depends(get_db)
):
    db_player = Player(**player.dict())
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player


@router.get("/", response_model=list[PlayerRead])
def get_players(db: Session = Depends(get_db)):
    return db.query(Player).all()


@router.get("/{player_id}", response_model=PlayerRead)
def get_player(
    player_id: int, db: Session = Depends(get_db)
):
    player = db.query(Player).filter(Player.id == player_id).first()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )
    return player


@router.put("/{player_id}", response_model=PlayerRead)
def update_player(
    player_id: int, player: PlayerCreate, db: Session = Depends(get_db)
):
    db_player = db.query(Player).filter(Player.id == player_id).first()
    if not db_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )
    for key, value in player.dict().items():
        setattr(db_player, key, value)
    db.commit()
    db.refresh(db_player)
    return db_player


@router.delete("/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(
    player_id: int, db: Session = Depends(get_db)
):
    db_player = db.query(Player).filter(Player.id == player_id).first()
    if not db_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Player not found",
        )
    db.delete(db_player)
    db.commit()
