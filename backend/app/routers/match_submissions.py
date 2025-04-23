from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.models import MatchSubmission
from app.database import get_db
from app.schemas.match_submission import MatchSubmissionCreate, MatchSubmissionRead
from app.utils.auth import get_current_user_id, is_admin
from datetime import datetime

router = APIRouter(prefix="/match-submissions", tags=["Match Submissions"])

@router.post("/", response_model=MatchSubmissionRead)
def create_submission(
    submission: MatchSubmissionCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    is_admin(user_id, db)
    db_submission = MatchSubmission(**submission.dict())
    db_submission.submitted_by = user_id
    db_submission.submitted_at = db_submission.submitted_at or datetime.utcnow()
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

from app.utils.auth import admin_required

@router.post("/", response_model=MatchSubmissionRead)
def create_submission(
    submission: MatchSubmissionCreate,
    db: Session = Depends(get_db),
    admin_user_id: str = Depends(admin_required)
):
    db_submission = MatchSubmission(**submission.dict())
    db_submission.submitted_by = admin_user_id
    db_submission.submitted_at = db_submission.submitted_at or datetime.utcnow()
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

from app.utils.auth import get_profile

@router.get("/me")
def get_my_profile(profile = Depends(get_profile)):
    return profile
