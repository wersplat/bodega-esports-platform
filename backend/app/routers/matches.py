from fastapi import APIRouter, Depends
from app.utils.discord import send_discord_webhook  # Assuming you have this

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

@router.post("/{match_id}/submit-result")
async def submit_match_result(match_id: str):
    """
    Submit final match result.
    """
    # TODO: Fetch webhook for match results
    # webhook_url = fetch_webhook_url(webhook_type="match_result")
    # send_discord_webhook(content=f"Result submitted for match {match_id}", webhook_url=webhook_url)

    pass

@router.post("/{match_id}/dispute")
async def dispute_match(match_id: str):
    """
    Dispute a match result.
    """
    pass

@router.post("/{match_id}/admin-verify")
async def verify_match(match_id: str):
    """
    Admin manually verifies match result.
    """
    pass