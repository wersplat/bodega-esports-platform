# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, and_, desc

# Project imports
from app.models import Match, MatchSubmission
from app.models.models import User as Profile
from app.api.v2.base import not_found_error, conflict_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

router = APIRouter(
    prefix="/api/v2",
    tags=["Match Submissions"],
    responses={
        404: {"description": "Match or submission not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Conflict"}
    }
)


class SubmissionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class MatchSubmissionBase(BaseModel):
    match_id: str
    submitter_id: str  # Profile ID of the person submitting
    team1_score: int
    team2_score: int
    status: SubmissionStatus = SubmissionStatus.PENDING
    evidence_url: Optional[str] = None
    notes: Optional[str] = None


class MatchSubmissionCreate(MatchSubmissionBase):
    pass


class MatchSubmissionUpdate(BaseModel):
    team1_score: Optional[int] = None
    team2_score: Optional[int] = None
    status: Optional[SubmissionStatus] = None
    evidence_url: Optional[str] = None
    notes: Optional[str] = None


class MatchSubmissionResponse(MatchSubmissionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("", response_model=ListResponse[MatchSubmissionResponse])
async def get_match_submissions(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    match_id: Optional[str] = Query(None),
    submitter_id: Optional[str] = Query(None),
    status: Optional[SubmissionStatus] = Query(None)
):
    """Get a list of match submissions"""
    query = select(MatchSubmission)
    
    if match_id:
        query = query.where(MatchSubmission.match_id == match_id)
    
    if submitter_id:
        query = query.where(MatchSubmission.submitter_id == submitter_id)
    
    if status:
        query = query.where(MatchSubmission.status == status)
    
    total = await db.execute(select(func.count()).select_from(query.subquery()))
    total_count = total.scalar() or 0
    
    query = query.order_by(desc(MatchSubmission.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    submissions = result.scalars().all()
    
    return ListResponse(
        items=submissions,
        pagination={
            "total": total_count,
            "page": skip // limit + 1,
            "per_page": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    )


@router.get("/{submission_id}", response_model=SingleResponse[MatchSubmissionResponse])
async def get_match_submission(
    submission_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a match submission by ID"""
    result = await db.execute(select(MatchSubmission).where(MatchSubmission.id == submission_id))
    submission = result.scalars().first()
    
    if not submission:
        not_found_error(f"Match submission with ID {submission_id} not found")
    
    return SingleResponse(item=submission)


@router.post("", response_model=SingleResponse[MatchSubmissionResponse], status_code=201)
async def create_match_submission(
    submission: MatchSubmissionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new match submission"""
    # Check if match exists
    match_result = await db.execute(select(Match).where(Match.id == submission.match_id))
    match = match_result.scalars().first()
    if not match:
        not_found_error(f"Match with ID {submission.match_id} not found")
    
    # Check if submitter exists
    submitter_result = await db.execute(select(Profile).where(Profile.id == submission.submitter_id))
    submitter = submitter_result.scalars().first()
    if not submitter:
        not_found_error(f"Profile with ID {submission.submitter_id} not found")
    
    # Check if a pending submission already exists for this match
    exists = await db.execute(
        select(MatchSubmission).where(
            and_(
                MatchSubmission.match_id == submission.match_id,
                MatchSubmission.status == SubmissionStatus.PENDING
            )
        )
    )
    if exists.scalars().first():
        conflict_error(f"A pending submission already exists for match {submission.match_id}")
    
    db_submission = MatchSubmission(**submission.dict())
    db.add(db_submission)
    await db.commit()
    await db.refresh(db_submission)
    
    return SingleResponse(item=db_submission)


@router.patch("/{submission_id}", response_model=SingleResponse[MatchSubmissionResponse])
async def update_match_submission(
    submission_update: MatchSubmissionUpdate,
    submission_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Update a match submission"""
    result = await db.execute(select(MatchSubmission).where(MatchSubmission.id == submission_id))
    db_submission = result.scalars().first()
    
    if not db_submission:
        not_found_error(f"Match submission with ID {submission_id} not found")
    
    update_data = submission_update.dict(exclude_unset=True)
    
    # Update fields
    for key, value in update_data.items():
        setattr(db_submission, key, value)
    
    await db.commit()
    await db.refresh(db_submission)
    
    # If submission is approved, update the match with the scores
    if db_submission.status == SubmissionStatus.APPROVED:
        match_result = await db.execute(select(Match).where(Match.id == db_submission.match_id))
        match = match_result.scalars().first()
        if match:
            match.team1_score = db_submission.team1_score
            match.team2_score = db_submission.team2_score
            match.status = "completed"
            await db.commit()
    
    return SingleResponse(item=db_submission)
