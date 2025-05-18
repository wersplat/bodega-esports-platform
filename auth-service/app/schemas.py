from pydantic import BaseModel
from uuid import UUID

class UserOut(BaseModel):
    id: UUID
    role: str

    class Config:
        orm_mode = True