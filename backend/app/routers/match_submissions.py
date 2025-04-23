from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.models import MatchSubmission
from app.schemas.match_submission import MatchSubmissionCreate, MatchSubmissionRead
from app.database import get_db
from app.utils.auth import admin_required
from app.utils.hash import hash_submission  #  New utility import

router = APIRouter(prefix="/match-submissions", tags=["Match Submissions"])

@router.post("/", response_model=MatchSubmissionRead)
def create_submission(
    submission: MatchSubmissionCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(admin_required)
):
    submission_data = submission.dict()
    submission_data["submitted_by"] = user_id
    submission_data["submitted_at"] = submission_data.get("submitted_at") or datetime.utcnow()

    submission_hash = hash_submission(submission_data)

    # 🔁 Check for duplicate by hash
    if db.query(MatchSubmission).filter(MatchSubmission.submission_hash == submission_hash).first():
        raise HTTPException(status_code=409, detail="Duplicate match submission detected.")

    db_submission = MatchSubmission(**submission_data, submission_hash=submission_hash)
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

@router.get("/", response_model=list[MatchSubmissionRead])
def get_submissions(db: Session = Depends(get_db)):
    return db.query(MatchSubmission).all()
