from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.models import User as Profile
from app.api.v2.responses import SingleResponse
import os
from uuid import uuid4
from starlette.responses import JSONResponse

router = APIRouter(prefix="/api/v2", tags=["Media"])

AVATAR_UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../media/avatars/")
os.makedirs(AVATAR_UPLOAD_DIR, exist_ok=True)

@router.post("/avatar/upload")
async def upload_avatar(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    # Validate user
    result = await db.execute(Profile.__table__.select().where(Profile.id == user_id))
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Save file
    ext = os.path.splitext(file.filename)[1]
    filename = f"{user_id}_{uuid4().hex}{ext}"
    file_path = os.path.join(AVATAR_UPLOAD_DIR, filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    # Build URL (assuming static files served from /media/avatars/)
    avatar_url = f"/media/avatars/{filename}"
    # Update user profile
    await db.execute(Profile.__table__.update().where(Profile.id == user_id).values(avatar_url=avatar_url))
    await db.commit()
    return JSONResponse({"url": avatar_url})

@router.post("/avatar/delete")
async def delete_avatar(
    user_id: str = Form(...),
    url: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    # Validate user
    result = await db.execute(Profile.__table__.select().where(Profile.id == user_id))
    user = result.scalar()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Delete file
    if url.startswith("/media/avatars/"):
        file_path = os.path.join(AVATAR_UPLOAD_DIR, os.path.basename(url))
        if os.path.exists(file_path):
            os.remove(file_path)
    # Clear avatar_url
    await db.execute(Profile.__table__.update().where(Profile.id == user_id).values(avatar_url=None))
    await db.commit()
    return JSONResponse({"success": True})
