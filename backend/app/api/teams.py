from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Team

router = APIRouter()


@router.get("/api/teams")
def get_teams(db: Session = Depends(get_db)):
    """Fetch all teams."""
    teams = db.query(Team).all()
    return [
        {
            "id": team.id,
            "name": team.name,
            "league_id": team.league_id,
        }
        for team in teams
    ]

