from pydantic import BaseModel
from typing import Optional


class TeamBase(BaseModel):
    name: str
    league_id: Optional[int] = None


class TeamCreate(TeamBase):
    pass


class TeamRead(TeamBase):
    id: int

    class Config:
        from_attributes = True
