from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MatchBase(BaseModel):
    league_id: Optional[int] = None
    season_id: Optional[int] = None
    division_id: Optional[int] = None
    team1_id: int
    team2_id: int
    winner_id: Optional[int] = None
    scheduled_time: Optional[datetime] = None


class MatchCreate(MatchBase):
    pass


class MatchRead(MatchBase):
    id: int

    class Config:
        from_attributes = True
