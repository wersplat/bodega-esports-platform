from fastapi import APIRouter

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)

@router.get("/")
async def get_notifications():
    """
    Fetch notifications for the current user.
    """
    pass

@router.post("/{notification_id}/read")
async def mark_as_read(notification_id: str):
    """
    Mark notification as read.
    """
    pass
