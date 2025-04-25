from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Season, Team, Division

router = APIRouter(prefix="/api/meta", tags=["Meta"])

@router.get("/seasons")
def get_seasons(db: Session = Depends(get_db)):
    return db.query(Season).order_by(Season.id.desc()).all()

@router.get("/teams")
def get_teams(db: Session = Depends(get_db)):
    return db.query(Team).order_by(Team.name).all()

@router.get("/divisions")
def get_divisions(db: Session = Depends(get_db)):
    return db.query(Division).order_by(Division.name).all()
