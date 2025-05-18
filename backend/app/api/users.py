from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError, jwt
from app.database import get_db
from app.models import Profile
from datetime import datetime
import uuid

router = APIRouter()

# Dependency: Auth-service JWT token header
from fastapi import HTTPException, status
import os

SECRET_KEY = os.getenv("AUTH_SERVICE_JWT_SECRET", "your_auth_service_secret")
ALGORITHM = "HS256"

async def get_current_user(authorization: str = Header(...), db: AsyncSession = Depends(get_db)):

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        stmt = select(Profile).where(Profile.id == user_id)
        result = await db.execute(stmt)
        user = result.scalars().first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_response.user


@router.post("/me")
async def create_or_get_profile(
    db: AsyncSession = Depends(get_db),
    supa_user=Depends(get_current_user)
):
    stmt = select(Profile).where(Profile.id == supa_user.id)
    result = await db.execute(stmt)
    profile = result.scalars().first()

    if profile:
        return {"status": "exists", "profile": profile}

    new_profile = Profile(
        id=supa_user.id,
        email=supa_user.email,
        username=supa_user.user_metadata.get("full_name", ""),
        discord_id=supa_user.user_metadata.get("provider_id", ""),
        created_at=datetime.utcnow()
    )
    db.add(new_profile)
    await db.commit()
    await db.refresh(new_profile)

    return {"status": "created", "profile": new_profile}
