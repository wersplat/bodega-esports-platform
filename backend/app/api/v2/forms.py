# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

# Project imports
from app.models import FormSubmission
from app.api.v2.base import not_found_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/api/v2",
    tags=["Forms"],
    responses={
        404: {"description": "Form submission not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Form submission conflict"}
    }
)


class FormSubmissionBase(BaseModel):
    form_id: str
    profile_id: Optional[str] = None
    data: Dict[str, Any]


class FormSubmissionCreate(FormSubmissionBase):
    pass


class FormSubmissionResponse(FormSubmissionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.post("", response_model=SingleResponse[FormSubmissionResponse], status_code=201)
async def create_form_submission(
    submission: FormSubmissionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Submit a form"""
    db_submission = FormSubmission(**submission.dict())
    db.add(db_submission)
    await db.commit()
    await db.refresh(db_submission)
    
    return SingleResponse(item=db_submission)


@router.get("", response_model=ListResponse[FormSubmissionResponse])
async def get_form_submissions(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    form_id: Optional[str] = Query(None),
    profile_id: Optional[str] = Query(None)
):
    """Get form submissions"""
    query = select(FormSubmission)
    
    if form_id:
        query = query.where(FormSubmission.form_id == form_id)
    
    if profile_id:
        query = query.where(FormSubmission.profile_id == profile_id)
    
    total = await db.execute(select(func.count()).select_from(query.subquery()))
    total_count = total.scalar() or 0
    
    query = query.offset(skip).limit(limit)
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


@router.get("/{submission_id}", response_model=SingleResponse[FormSubmissionResponse])
async def get_form_submission(
    submission_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a form submission by ID"""
    result = await db.execute(select(FormSubmission).where(FormSubmission.id == submission_id))
    submission = result.scalars().first()
    
    if not submission:
        not_found_error(f"Form submission with ID {submission_id} not found")
    
    return SingleResponse(item=submission)
