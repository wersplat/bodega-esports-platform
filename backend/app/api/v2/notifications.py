# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select, desc, update

# Project imports
from app.models import Notification
from app.api.v2.base import not_found_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from enum import Enum

router = APIRouter(
    prefix="/api/v2",
    tags=["Notifications"],
    responses={
        404: {"description": "Notification not found"},
        400: {"description": "Invalid parameters"}
    }
)


class NotificationType(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"


class NotificationBase(BaseModel):
    title: str
    message: str
    type: NotificationType = NotificationType.INFO
    read: bool = False


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(BaseModel):
    title: Optional[str] = None
    message: Optional[str] = None
    type: Optional[NotificationType] = None
    read: Optional[bool] = None


class NotificationResponse(NotificationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.get("", response_model=ListResponse[NotificationResponse])
async def get_notifications(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    read: Optional[bool] = Query(None),
    type: Optional[NotificationType] = Query(None)
):
    """Get a list of notifications"""
    query = select(Notification)
    
    if read is not None:
        query = query.where(Notification.read == read)
    
    if type:
        query = query.where(Notification.type == type)
    
    total = await db.execute(select(func.count()).select_from(query.subquery()))
    total_count = total.scalar() or 0
    
    query = query.order_by(desc(Notification.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    notifications = result.scalars().all()
    
    return ListResponse(
        items=notifications,
        pagination={
            "total": total_count,
            "page": skip // limit + 1,
            "per_page": limit,
            "total_pages": (total_count + limit - 1) // limit
        }
    )


@router.get("/{notification_id}", response_model=SingleResponse[NotificationResponse])
async def get_notification(
    notification_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a notification by ID"""
    result = await db.execute(select(Notification).where(Notification.id == notification_id))
    notification = result.scalars().first()
    
    if not notification:
        not_found_error(f"Notification with ID {notification_id} not found")
    
    return SingleResponse(item=notification)


@router.post("", response_model=SingleResponse[NotificationResponse], status_code=201)
async def create_notification(
    notification: NotificationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new notification"""
    db_notification = Notification(**notification.dict())
    db.add(db_notification)
    await db.commit()
    await db.refresh(db_notification)
    
    return SingleResponse(item=db_notification)


@router.patch("/{notification_id}", response_model=SingleResponse[NotificationResponse])
async def update_notification(
    notification_update: NotificationUpdate,
    notification_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Update a notification"""
    result = await db.execute(select(Notification).where(Notification.id == notification_id))
    db_notification = result.scalars().first()
    
    if not db_notification:
        not_found_error(f"Notification with ID {notification_id} not found")
    
    update_data = notification_update.dict(exclude_unset=True)
    
    # Update fields
    for key, value in update_data.items():
        setattr(db_notification, key, value)
    
    await db.commit()
    await db.refresh(db_notification)
    
    return SingleResponse(item=db_notification)


@router.patch("/mark-all-read", response_model=Dict[str, Any])
async def mark_all_read(db: AsyncSession = Depends(get_db)):
    """Mark all notifications as read"""
    query = update(Notification).where(Notification.read == False).values(read=True)
    result = await db.execute(query)
    await db.commit()
    
    return {"success": True, "message": "All notifications marked as read", "count": result.rowcount}
