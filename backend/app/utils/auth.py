from functools import wraps
from fastapi import Depends, HTTPException, status, APIRouter, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
# Removed unused import
from app.models.models import Profile

import os
SECRET_KEY = os.getenv("AUTH_SERVICE_JWT_SECRET", "your_auth_service_secret")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

router = APIRouter(prefix="/auth", tags=["Auth"])

# AUTH HELPERS

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
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


def admin_required(get_current_user):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            user = await get_current_user()
            if not user.is_admin:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized",
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator


# ROUTES


@router.get("/me")
def read_current_user(current_user: Profile = Depends(get_current_user)):
    return current_user