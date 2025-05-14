from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.models.models import MatchSubmission
from app.schemas.match_submission import MatchSubmissionCreate, MatchSubmissionRead
from app.database import get_db
from app.utils.auth import admin_required
from app.utils.hash import hash_submission  #  New utility import

router = APIRouter(prefix="/api/match-submissions", tags=["Match Submissions"])


from sqlalchemy.future import select

@router.post("/", response_model=MatchSubmissionRead)
async def create_submission(
    submission: MatchSubmissionCreate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(admin_required)
):
    submission_data = submission.dict()
    submission_data["submitted_by"] = user_id
    submission_data["submitted_at"] = (
        submission_data.get("submitted_at") or datetime.utcnow()
    )
    submission_data["hash"] = hash_submission(submission_data)
    db_submission = MatchSubmission(**submission_data)
    db.add(db_submission)
    await db.commit()
    await db.refresh(db_submission)
    return db_submission


@router.get("/", response_model=list[MatchSubmissionRead])
async def get_submissions(db: AsyncSession = Depends(get_db)):
    stmt = select(MatchSubmission)
    result = await db.execute(stmt)
    return result.scalars().all()
