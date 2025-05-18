from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.oauth.discord import get_discord_token, get_discord_user
from app.schemas import UserOut
from app.models import User
from app.database import get_db
from app.config import settings
from jose import jwt

router = APIRouter()

@router.get("/login/discord")
def login():
    return {
        "url": f"https://discord.com/api/oauth2/authorize?client_id={settings.DISCORD_CLIENT_ID}&redirect_uri={settings.DISCORD_REDIRECT_URI}&response_type=code&scope=identify"
    }

@router.get("/callback/discord", response_model=dict)
async def callback(code: str, db: Session = Depends(get_db)):
    token_data = await get_discord_token(code)
    user_info = await get_discord_user(token_data["access_token"])
    
    user = db.query(User).filter_by(discord_id=user_info["id"]).first()
    if not user:
        user = User(discord_id=user_info["id"])
        db.add(user)
        db.commit()
        db.refresh(user)

    jwt_token = jwt.encode({"user_id": str(user.id)}, settings.JWT_SECRET, algorithm="HS256")
    return {"token": jwt_token}

@router.get("/me", response_model=UserOut)
def me(user_id: str = Depends(lambda: "mock")):
    return {"id": user_id, "role": "player"}