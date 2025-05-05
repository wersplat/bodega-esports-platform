from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.discord import send_discord_webhook
from app.database import get_db
from app.models.models import Match

router = APIRouter(
    prefix="/matches",
    tags=["Matches"],
)

@router.post("/create")
async def create_match():
    """
    Create a new match (schedule).
    """
    # TODO: Fetch appropriate webhook URL for match creation
    # webhook_url = fetch_webhook_url(webhook_type="match_created")
    # send_discord_webhook(content="New match scheduled!", webhook_url=webhook_url)
    pass

@router.get("/")
# (Optional) response_model=List[MatchRead]
async def list_matches(db: Session = Depends(get_db)):
    """
    List all matches.
    """
    matches = db.query(Match).all()
    return matches

@router.get("/{match_id}")
async def get_match(match_id: str):
    """
    Fetch match details.
    """
    pass

@router.post("/{match_id}/submit-result")
async def submit_result(match_id: str):
    """
    Submit final match result.
    """
    # TODO: Fetch webhook URL for match result submission
    # webhook_url = fetch_webhook_url(webhook_type="match_result")
    # send_discord_webhook(content=f"Result submitted for match {match_id}", webhook_url=webhook_url)
    pass

@router.post("/{match_id}/dispute")
async def dispute_match(match_id: str):
    """
    Submit a match dispute.
    """
    pass

@router.post("/{match_id}/admin-verify")
async def admin_verify_result(match_id: str):
    """
    Admin manually verifies match result.
    """
    pass
