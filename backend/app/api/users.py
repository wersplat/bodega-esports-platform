from fastapi import APIRouter, Depends, HTTPException
from app.database import database  # your SQLAlchemy db engine or supabase client
from pydantic import BaseModel
import uuid

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    discord_id: str
    email: str

@router.post("/")
async def create_user(user: UserCreate):
    query = """
    INSERT INTO users (id, username, discord_id, email)
    VALUES (:id, :username, :discord_id, :email)
    RETURNING *;
    """
    uid = str(uuid.uuid4())
    result = database.fetch_one(query, values={**user.dict(), "id": uid})
    return result
