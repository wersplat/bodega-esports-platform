# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path, Body

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

# Project imports
from app.models import Team, TeamMember, Season
from app.models.models import TeamInvitation, User as Profile
from app.models.models import PlayerStat as PlayerStats
from app.api.v2.base import raise_error, not_found_error, conflict_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime, date
from enum import Enum
import uuid

router = APIRouter(
    prefix="/api/v2",
    tags=["Teams"],
    responses={
        404: {"description": "Team not found"},
        403: {"description": "Permission denied"},
        409: {"description": "Conflict"}
    }
)

class Role(str, Enum):
    PLAYER = "player"
    COACH = "coach"
    MANAGER = "manager"
    CAPTAIN = "captain"

# Team Models
class TeamBase(BaseModel):
    id: int = Field(description="Team ID")
    name: str = Field(description="Team name")
    season_id: int = Field(description="Season ID")
    league_id: int = Field(description="League ID")
    created_by: str = Field(description="Creator's profile ID")
    created_at: datetime = Field(description="Creation timestamp")
    updated_at: datetime = Field(description="Last update timestamp")
    status: str = Field(description="Team status")

    class Config:
        from_attributes = True

class TeamCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100, description="Team name")
    season_id: int = Field(description="Season ID")
    league_id: int = Field(description="League ID")
    logo_url: Optional[str] = Field(default=None, description="Team logo URL")
    description: Optional[str] = Field(default=None, description="Team description")
    status: str = Field(default="active", description="Team status")

    class Config:
        from_attributes = True

class TeamUpdate(BaseModel):
    name: Optional[str] = Field(default=None, description="Team name")
    logo_url: Optional[str] = Field(default=None, description="Team logo URL")
    description: Optional[str] = Field(default=None, description="Team description")
    status: Optional[str] = Field(default=None, description="Team status")

    class Config:
        from_attributes = True

# Team Member Models
class TeamMemberCreate(BaseModel):
    email: EmailStr
    role: Role
    position: Optional[str]
    jersey_number: Optional[int]
    stats: Optional[Dict[str, Any]] = Field(default=None, description="Initial player stats")

class TeamMember(BaseModel):
    id: int
    user_id: str
    role: Role
    position: Optional[str]
    jersey_number: Optional[int]
    joined_at: datetime
    stats: Optional[Dict[str, Any]]
    user: Dict[str, Any]
    team: Optional[Dict[str, Any]] = None

class TeamOut(BaseModel):
    id: int
    name: str
    season_id: int
    description: Optional[str]
    logo_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    member_count: int = Field(alias="memberCount")
    captain_id: Optional[str] = Field(alias="captainId")
    season: Dict[str, Any]
    stats: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True
        validate_by_name = True

class TeamRoster(BaseModel):
    team_id: int
    season_id: int
    members: List[TeamMember]
    stats: Dict[str, Any]
    metadata: Dict[str, Any]

class TeamHistory(BaseModel):
    team_id: int
    season_id: int
    season_name: str
    start_date: date
    end_date: date
    wins: int
    losses: int
    points_for: int
    points_against: int
    rank: int
    achievements: List[str]

class TeamComparison(BaseModel):
    team1_id: int
    team2_id: int
    head_to_head: Dict[str, Any]
    stats_comparison: Dict[str, Any]
    recent_games: List[Dict[str, Any]]

class TeamSchedule(BaseModel):
    team_id: int
    upcoming_games: List[Dict[str, Any]]
    recent_games: List[Dict[str, Any]]
    season_progress: Dict[str, Any]

@router.post(
    "/teams/{team_id}/members",
    response_model=SingleResponse[TeamMember],
    summary="Add team member",
    description="""
    Add a new member to a team.

    Returns:
    - Member details including user information

    Triggers webhook events:
    - team_member_update
    """
)
async def add_team_member(
    team_id: int = Path(..., description="The ID of the team to add member to", example=1),
    member_data: TeamMemberCreate = Body(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Check if team exists
        team = await db.get(Team, team_id)
        if not team:
            raise not_found_error("Team", team_id)

        # Check if user exists
        user = await db.get(Profile, member_data.email)
        if not user:
            # Create invitation
            token = uuid.uuid4()
            invitation = TeamInvitation(
                team_id=team_id,
                email=member_data.email,
                role=member_data.role,
                token=str(token),
                status="pending",
                created_at=datetime.utcnow()
            )
            db.add(invitation)
            await db.commit()

            return SingleResponse(item={
                "message": "Invitation sent successfully",
                "invitation": {
                    "token": str(token),
                    "email": member_data.email,
                    "role": member_data.role
                }
            })

        # Check if user is already in team
        existing = await db.execute(
            select(TeamMember).where(
                TeamMember.team_id == team_id,
                TeamMember.user_id == user.id
            )
        )
        if existing.scalar():
            raise conflict_error("Team member", {
                "user_id": user.id,
                "team_id": team_id
            })

        # Add user to team
        member = TeamMember(
            team_id=team_id,
            user_id=user.id,
            role=member_data.role,
            position=member_data.position,
            jersey_number=member_data.jersey_number,
            joined_at=datetime.utcnow()
        )
        db.add(member)
        await db.commit()
        await db.refresh(member)

        # Create invitation record
        token = uuid.uuid4()
        invitation = TeamInvitation(
            team_id=team_id,
            email=member_data.email,
            role=member_data.role,
            token=str(token),
            status="accepted",
            accepted_at=datetime.utcnow(),
            user_id=user.id
        )
        db.add(invitation)
        await db.commit()

        return SingleResponse(item={
            "message": "User added to team",
            "member": {
                "id": member.id,
                "user_id": member.user_id,
                "role": member.role,
                "position": member.position,
                "jersey_number": member.jersey_number
            }
        })

    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to add team member",
            details={"error": str(e)}
        )
