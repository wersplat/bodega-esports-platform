from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Season

router = APIRouter()


@router.get("/api/seasons")
def get_seasons(db: Session = Depends(get_db)):
    """Fetch all seasons."""
    seasons = db.query(Season).all()
    return [
        {
            "id": season.id,
            "name": season.name,
            "league_id": season.league_id,
        }
        for season in seasons
    ]

