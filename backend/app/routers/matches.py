from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.models import Match
from app.database import get_db
from app.schemas.match import MatchCreate, MatchRead

router = APIRouter(prefix="/matches", tags=["Matches"])

@router.post("/", response_model=MatchRead)
def create_match(match: MatchCreate, db: Session = Depends(get_db)):
    db_match = Match(**match.dict())
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

@router.get("/", response_model=list[MatchRead])
def get_matches(db: Session = Depends(get_db)):
    return db.query(Match).all()
