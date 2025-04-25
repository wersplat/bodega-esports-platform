from pydantic import BaseModel
from typing import Optional

class ProfileBase(BaseModel):
    username: str
    email: Optional[str] = None

class ProfileCreate(ProfileBase):
    password: str

class ProfileRead(ProfileBase):
    id: int

    class Config:
        orm_mode = True

class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
