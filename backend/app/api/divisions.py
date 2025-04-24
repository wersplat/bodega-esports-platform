from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Division

router = APIRouter()


@router.get("/api/divisions")
def get_divisions(db: Session = Depends(get_db)):
    """Fetch all divisions."""
    divisions = db.query(Division).all()
    return [
        {
            "id": division.id,
            "name": division.name,
            "season_id": division.season_id,
        }
        for division in divisions
    ]