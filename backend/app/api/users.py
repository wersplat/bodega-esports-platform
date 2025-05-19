from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError, jwt
from app.database import get_db
from app.models.models import User
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

router = APIRouter()

# JWT Configuration
from fastapi import status
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key")
ALGORITHM = "HS256"

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

async def get_current_user(
    authorization: str = Header(..., description="JWT token in format: Bearer <token>"),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from the JWT token
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Use: Bearer <token>"
        )

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Use 'sub' from JWT as the unique auth_service_id
        auth_service_id: str = payload.get("sub") or payload.get("user_id")
        username = payload.get("username")
        email = payload.get("email")

        if not auth_service_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: No user identifier found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Try to find user by auth_service_id
        stmt = select(User).where(User.auth_service_id == auth_service_id)
        result = await db.execute(stmt)
        user = result.scalars().first()

        if not user:
            # Create a new user if not found
            user = User(
                auth_service_id=auth_service_id,
                username=username,
                email=email,
                status="active"
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        return user
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get the profile of the currently authenticated user
    """
    return current_user

@router.post("/me")
async def create_or_update_profile(
    username: str,
    email: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create or update user profile
    """
    # Update user fields
    current_user.username = username
    if email:
        current_user.email = email
    
    current_user.updated_at = datetime.utcnow()
    
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    
    return {
        "status": "success",
        "message": "Profile updated successfully",
        "user": current_user
    }
