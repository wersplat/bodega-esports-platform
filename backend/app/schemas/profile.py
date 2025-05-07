from pydantic import BaseModel
from typing import Optional, List

class ProfileBase(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

class ProfileCreate(ProfileBase):
    password: str

class ProfileRead(ProfileBase):
    id: str  # UUID as string
    is_admin: Optional[bool] = False
    display_name: Optional[str] = None
    platform: Optional[str] = None
    gamer_tag: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: Optional[str] = None
    positions: Optional[str] = None
    career_ppg: Optional[float] = None
    career_apg: Optional[float] = None
    career_rpg: Optional[float] = None
    role: Optional[str] = None
    preferred_positions: Optional[List[str]] = None
    photo_url: Optional[str] = None
    discord_id: Optional[str] = None

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
