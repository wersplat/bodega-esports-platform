from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.models import Team
from database import get_db
from schemas.team import TeamCreate, TeamRead

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.post("/", response_model=TeamRead)
def create_team(team: TeamCreate, db: Session = Depends(get_db)):
    db_team = Team(name=team.name, league_id=team.league_id)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

@router.get("/", response_model=list[TeamRead])
def get_teams(db: Session = Depends(get_db)):
    return db.query(Team).all()
