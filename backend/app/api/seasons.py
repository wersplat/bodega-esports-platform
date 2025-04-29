from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Season

router = APIRouter()

@router.get("/api/seasons")
def get_seasons(db: Session = Depends(get_db)):
    """Fetch all seasons."""
    try:
        seasons = db.query(Season).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return [
        {
            "id": season.id if season.id else None,
            "name": season.name if season.name else "Unnamed Season",
            "league_id": season.league_id if season.league_id else None,
        }
        for season in seasons
    ]
