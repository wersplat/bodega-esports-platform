from fastapi import Depends, HTTPException, Header
from jose import jwt
from os import getenv
from sqlalchemy.orm import Session
from app.models.models import Profile
from app.database import get_db  # ✅ Missing import fixed

# === JWT Parsing ===
JWT_SECRET = getenv("JWT_SECRET", "your-default-secret")

def get_current_user_id(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("sub")  # Supabase UID is stored in `sub`
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# === Admin Check ===
def is_admin(user_id: str, db: Session):
    user = db.query(Profile).filter(Profile.id == user_id).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

# === Admin Dependency ===
def admin_required(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
) -> str:
    is_admin(user_id, db)
    return user_id

# === Profile Dependency ===
def get_profile(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
) -> Profile:
    user = db.query(Profile).filter(Profile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")
    return user
