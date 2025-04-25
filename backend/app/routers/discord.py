from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.discord import send_discord_message

router = APIRouter(prefix="/api/discord", tags=["Discord Announcements"])

@router.post("/announcements")
def send_announcement(webhook_url: str, title: str, description: str):
    """Send a general announcement to Discord."""
    embed = {"title": title, "description": description, "color": 5814783}
    try:
        send_discord_message(webhook_url, content="", embeds=[embed])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send announcement: {str(e)}")
    return {"status": "success", "message": "Announcement sent successfully."}

@router.post("/standings")
def send_standings_update(webhook_url: str, standings: dict):
    """Send standings updates to Discord."""
    embed = {"title": "Standings Update", "description": str(standings), "color": 3447003}
    try:
        send_discord_message(webhook_url, content="", embeds=[embed])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send standings update: {str(e)}")
    return {"status": "success", "message": "Standings update sent successfully."}

@router.post("/stats")
def send_stat_update(webhook_url: str, stats: dict):
    """Send stat updates to Discord."""
    embed = {"title": "Stat Update", "description": str(stats), "color": 16776960}
    try:
        send_discord_message(webhook_url, content="", embeds=[embed])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send stat update: {str(e)}")
    return {"status": "success", "message": "Stat update sent successfully."}

@router.post("/export")
def send_export_notification(webhook_url: str, file_url: str):
    """Send a notification to Discord about an exported file."""
    embed = {"title": "Export Completed", "description": f"File available at: {file_url}", "color": 65280}
    try:
        send_discord_message(webhook_url, content="", embeds=[embed])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send export notification: {str(e)}")
    return {"status": "success", "message": "Export notification sent successfully."}

@router.post("/message")
def send_message(webhook_url: str, channel: str, content: str):
    """Send a custom message to a specific Discord channel."""
    try:
        send_discord_message(webhook_url, content=f"[{channel}] {content}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")
    return {"status": "success", "message": "Message sent successfully."}
