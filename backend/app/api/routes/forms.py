# backend/app/api/routes/forms.py

from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import FormSubmission
import httpx
import os

router = APIRouter()
DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")

@router.post("/api/forms/registration")
async def submit_registration(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        data = await request.json()
        team_name = data.get("Team Name", "Unknown Team")
        coach_email = data.get("Coach Email", "N/A")
        logo_url = data.get("Logo Upload", None)

        submission = FormSubmission(
            form_type="registration",
            payload=data,
        )
        db.add(submission)
        await db.commit()

        embed = {
            "title": f"📥 New Registration: {team_name}",
            "fields": [{"name": "Coach Email", "value": coach_email, "inline": True}],
            "timestamp": submission.created_at.isoformat(),
        }
        if logo_url:
            embed["thumbnail"] = {"url": logo_url}

        async with httpx.AsyncClient() as client:
            await client.post(DISCORD_WEBHOOK_URL, json={"embeds": [embed]})

        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
