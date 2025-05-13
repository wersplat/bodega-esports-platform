from fastapi import APIRouter, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_db
from app.models import FormSubmission  # your SQLAlchemy model

router = APIRouter()

@router.post("/api/forms/registration")
async def register_form_submission(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        data = await request.json()
        form_type = "registration"

        new_submission = FormSubmission(
            form_type=form_type,
            payload=data
        )
        db.add(new_submission)
        await db.commit()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
