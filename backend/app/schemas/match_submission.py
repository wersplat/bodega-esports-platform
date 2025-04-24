from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MatchSubmissionBase(BaseModel):
    match_id: int
    submitted_by: int
    comment: Optional[str] = None
    submitted_at: Optional[datetime] = None


class MatchSubmissionCreate(MatchSubmissionBase):
    pass


class MatchSubmissionRead(MatchSubmissionBase):
    id: int

    class Config:
        from_attributes = True
