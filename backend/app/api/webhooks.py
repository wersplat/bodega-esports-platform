from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.models import Webhook

router = APIRouter()


@router.get("/api/webhooks")
async def get_webhooks(db: AsyncSession = Depends(get_db)):
    """Fetch all saved webhooks."""
    result = await db.execute(select(Webhook))
    webhooks = result.scalars().all()
    return [
        {
            "id": webhook.id,
            "name": webhook.name,
            "url": webhook.url,
        }
        for webhook in webhooks
    ]
