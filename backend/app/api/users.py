from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db, supabase_client
from app.models import Profile
from datetime import datetime
import uuid

router = APIRouter()

# Dependency: Supabase token header
def get_current_user(authorization: str = Header(...)):
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Supabase not configured")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ")[1]
    user_response = supabase_client.auth.get_user(token)

    if not user_response or not user_response.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user_response.user


@router.post("/me")
def create_or_get_profile(
    db: Session = Depends(get_db),
    supa_user=Depends(get_current_user)
):
    profile = db.query(Profile).filter(Profile.id == supa_user.id).first()

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
    db.commit()
    db.refresh(new_profile)

    return {"status": "created", "profile": new_profile}
