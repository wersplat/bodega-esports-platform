from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Season

router = APIRouter()

class SeasonCreate(BaseModel):
    name: str
    league_id: int

class SeasonOut(SeasonCreate):
    id: int

    class Config:
        orm_mode = True

@router.get("/", response_model=list[SeasonOut])
def list_seasons(db: Session = Depends(get_db)):
    return db.query(Season).all()

@router.post("/", response_model=SeasonOut)
def create_season(data: SeasonCreate, db: Session = Depends(get_db)):
    new = Season(name=data.name, league_id=data.league_id)
    db.add(new); db.commit(); db.refresh(new)
    return new

@router.get("/{season_id}", response_model=SeasonOut)
def get_season(season_id: int, db: Session = Depends(get_db)):
    season = db.get(Season, season_id)
    if not season:
        raise HTTPException(404, "Season not found")
    return season
