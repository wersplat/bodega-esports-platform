from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.models import MatchSubmission
from app.database import get_db
from app.schemas.match_submission import MatchSubmissionCreate, MatchSubmissionRead
from datetime import datetime

router = APIRouter(prefix="/match-submissions", tags=["Match Submissions"])

@router.post("/", response_model=MatchSubmissionRead)
def create_submission(submission: MatchSubmissionCreate, db: Session = Depends(get_db)):
    db_submission = MatchSubmission(**submission.dict())
    db_submission.submitted_at = db_submission.submitted_at or datetime.utcnow()
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

@router.get("/", response_model=list[MatchSubmissionRead])
def get_submissions(db: Session = Depends(get_db)):
    return db.query(MatchSubmission).all()
