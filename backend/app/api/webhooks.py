from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Webhook

router = APIRouter()

@router.get("/api/webhooks")
def get_webhooks(db: Session = Depends(get_db)):
    """Fetch all saved webhooks."""
    webhooks = db.query(Webhook).all()
    return [
        {
            "id": webhook.id,
            "name": webhook.name,
            "url": webhook.url,
        }
        for webhook in webhooks
    ]
