from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Team

router = APIRouter()

class TeamCreate(BaseModel):
    name: str
    season_id: int

class TeamOut(TeamCreate):
    id: int

    class Config:
        orm_mode = True

@router.get("/", response_model=list[TeamOut])
def list_teams(db: Session = Depends(get_db)):
    return db.query(Team).all()

@router.post("/", response_model=TeamOut)
def create_team(data: TeamCreate, db: Session = Depends(get_db)):
    new = Team(name=data.name, season_id=data.season_id)
    db.add(new); db.commit(); db.refresh(new)
    return new

@router.get("/{team_id}", response_model=TeamOut)
def get_team(team_id: int, db: Session = Depends(get_db)):
    team = db.get(Team, team_id)
    if not team:
        raise HTTPException(404, "Team not found")
    return team
