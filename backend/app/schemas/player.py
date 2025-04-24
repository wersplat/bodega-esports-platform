from pydantic import BaseModel
from typing import Optional


class PlayerBase(BaseModel):
    username: str
    role: Optional[str] = None
    team_id: Optional[int] = None


class PlayerCreate(PlayerBase):
    pass


class PlayerRead(PlayerBase):
    id: int

    class Config:
        from_attributes = True
