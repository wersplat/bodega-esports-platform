from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Roster

router = APIRouter()

class RosterCreate(BaseModel):
    profile_id: str
    team_id: int
    season_id: int
    is_captain: bool = False

class RosterOut(RosterCreate):
    id: int
    joined_at: datetime

    class Config:
        orm_mode = True

@router.get("/", response_model=list[RosterOut])
def list_rosters(db: Session = Depends(get_db)):
    return db.query(Roster).all()

@router.post("/", response_model=RosterOut)
def create_roster(entry: RosterCreate, db: Session = Depends(get_db)):
    exists = db.query(Roster).filter_by(
        profile_id=entry.profile_id,
        team_id=entry.team_id,
        season_id=entry.season_id
    ).first()
    if exists:
        raise HTTPException(400, "Already on that roster")
    new = Roster(
        profile_id=entry.profile_id,
        team_id=entry.team_id,
        season_id=entry.season_id,
        is_captain=entry.is_captain,
        joined_at=datetime.utcnow()
    )
    db.add(new); db.commit(); db.refresh(new)
    return new

@router.get("/{roster_id}", response_model=RosterOut)
def get_roster(roster_id: int, db: Session = Depends(get_db)):
    r = db.get(Roster, roster_id)
    if not r:
        raise HTTPException(404, "Roster entry not found")
    return r
