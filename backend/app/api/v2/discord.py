# FastAPI imports
from fastapi import APIRouter, Depends, BackgroundTasks

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Project imports
from app.models import Team
from app.models.models import User as Profile
from app.api.v2.base import raise_error, not_found_error, conflict_error
from app.api.v2.responses import SingleResponse
from app.database import get_db

# Type imports
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum

router = APIRouter(
    prefix="/api/v2",
    tags=["Discord"],
    responses={
        404: {"description": "Resource not found"},
        400: {"description": "Invalid parameters"},
        401: {"description": "Unauthorized"},
        403: {"description": "Forbidden"}
    }
)


class DiscordLinkStatus(str, Enum):
    PENDING = "pending"
    LINKED = "linked"
    FAILED = "failed"


class DiscordLinkRequest(BaseModel):
    profile_id: str
    discord_id: str
    discord_username: str


class DiscordRoleSyncRequest(BaseModel):
    profile_id: str
    team_id: Optional[str] = None


class DiscordLinkResponse(BaseModel):
    profile_id: str
    discord_id: str
    discord_username: str
    status: DiscordLinkStatus
    message: Optional[str] = None


class DiscordSyncResponse(BaseModel):
    success: bool
    message: str
    roles_added: List[str] = []
    roles_removed: List[str] = []


@router.post("/link", response_model=SingleResponse[DiscordLinkResponse])
async def link_discord_account(
    link_request: DiscordLinkRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Link a Discord account to a profile"""
    # Check if profile exists
    profile_result = await db.execute(select(Profile).where(Profile.id == link_request.profile_id))
    profile = profile_result.scalars().first()
    
    if not profile:
        not_found_error(f"Profile with ID {link_request.profile_id} not found")
    
    # Check if profile already has a Discord account linked
    if profile.discord_id and profile.discord_id != link_request.discord_id:
        conflict_error(
            "Profile already has a different Discord account linked", 
            {"current_discord_id": profile.discord_id}
        )
    
    # Update profile with Discord information
    profile.discord_id = link_request.discord_id
    await db.commit()
    
    # Process Discord linking in background (mock implementation)
    background_tasks.add_task(process_discord_link, profile.id, link_request.discord_id)
    
    return SingleResponse(
        item=DiscordLinkResponse(
            profile_id=str(profile.id),
            discord_id=link_request.discord_id,
            discord_username=link_request.discord_username,
            status=DiscordLinkStatus.PENDING,
            message="Discord account link request submitted"
        )
    )


@router.post("/sync-roles", response_model=SingleResponse[DiscordSyncResponse])
async def sync_discord_roles(
    sync_request: DiscordRoleSyncRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Sync Discord roles for a profile"""
    # Check if profile exists
    profile_result = await db.execute(select(Profile).where(Profile.id == sync_request.profile_id))
    profile = profile_result.scalars().first()
    
    if not profile:
        not_found_error(f"Profile with ID {sync_request.profile_id} not found")
    
    # Check if profile has Discord account linked
    if not profile.discord_id:
        raise_error(
            code="DISCORD_NOT_LINKED",
            message="Profile does not have a Discord account linked",
            status_code=400
        )
    
    # If team specified, check if profile is member of that team
    if sync_request.team_id:
        team_result = await db.execute(select(Team).where(Team.id == sync_request.team_id))
        team = team_result.scalars().first()
        
        if not team:
            not_found_error(f"Team with ID {sync_request.team_id} not found")
    
    # Process role sync in background (mock implementation)
    background_tasks.add_task(
        process_discord_role_sync, 
        profile.id, 
        profile.discord_id,
        sync_request.team_id
    )
    
    return SingleResponse(
        item=DiscordSyncResponse(
            success=True,
            message="Discord role sync request submitted"
        )
    )


@router.get("/webhook", response_model=Dict[str, Any])
async def get_discord_webhook_info():
    """Get Discord webhook information"""
    return {
        "webhook_url": "https://api.bodegacatsgc.gg/api/v2/discord/webhook",
        "auth_requirements": "API key in Authorization header",
        "documentation_url": "https://docs.bodegacatsgc.gg/discord-integration"
    }


# Mock functions for background tasks
async def process_discord_link(profile_id: str, discord_id: str):
    """Process Discord account linking (mock implementation)"""
    # In a real implementation, this would communicate with Discord API
    # to verify the link and handle the necessary Discord side setup
    pass


async def process_discord_role_sync(profile_id: str, discord_id: str, team_id: Optional[str]):
    """Process Discord role sync (mock implementation)"""
    # In a real implementation, this would:
    # 1. Determine which Discord roles the user should have based on their teams and roles
    # 2. Communicate with Discord API to add/remove roles
    # 3. Log the changes
    pass
