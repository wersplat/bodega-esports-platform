from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Team

router = APIRouter(prefix="/api/teams", tags=["Teams"])

@router.get("/")
def get_all_teams(db: Session = Depends(get_db)):
    teams = db.query(Team).all()
    return [{"id": team.id, "name": team.name} for team in teams]
