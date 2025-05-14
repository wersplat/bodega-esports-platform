# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select

# Project imports
from app.models import Team, TeamMember, Profile, Season
from app.api.v2.base import raise_error, not_found_error, conflict_error
from app.api.v2.responses import ListResponse, SingleResponse

# Type imports
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

# Add missing imports
from app.database import get_db

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
class TeamMemberBase(BaseModel):
    id: int = Field(description="Team member ID")
    team_id: int = Field(description="Team ID")
    profile_id: str = Field(description="Profile ID")
    role: Role = Field(description="Member role")
    joined_at: datetime = Field(description="Join date")
    status: str = Field(description="Member status")

    class Config:
        from_attributes = True

class TeamMemberCreate(BaseModel):
    team_id: int = Field(description="Team ID")
    profile_id: str = Field(description="Profile ID")
    role: Role = Field(default=Role.PLAYER, description="Member role")
    status: str = Field(default="active", description="Member status")

    class Config:
        from_attributes = True

class TeamMemberUpdate(BaseModel):
    role: Optional[Role] = Field(default=None, description="Member role")
    status: Optional[str] = Field(default=None, description="Member status")

    class Config:
        from_attributes = True
    created_by: Optional[str] = Field(description="ID of the user creating the team")

class TeamUpdate(BaseModel):
    name: Optional[str] = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(max_length=500)
    logo_url: Optional[str]
    season_id: Optional[int]
    captain_id: Optional[str]

class TeamMemberCreate(BaseModel):
    email: EmailStr
    role: Role
    position: Optional[str]
    jersey_number: Optional[int]
    stats: Optional[Dict[str, Any]] = Field(description="Initial player stats")

class TeamMember(BaseModel):
    id: int
    user_id: str
    role: Role
    position: Optional[str]
    jersey_number: Optional[int]
    joined_at: datetime
    stats: Optional[Dict[str, Any]]
    user: Dict[str, Any]
    team: Dict[str, Any]

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
        allow_population_by_field_name = True

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

class TeamMemberCreate(BaseModel):
    email: str
    role: str = Field(enum=["player", "coach", "manager"])
    position: Optional[str]
    jersey_number: Optional[int]

class TeamMember(BaseModel):
    id: int
    user_id: str
    role: str
    position: Optional[str]
    jersey_number: Optional[int]
    joined_at: datetime
    user: dict

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
    
    class Config:
        from_attributes = True
        allow_population_by_field_name = True

@router.get(
    "/teams/user",
    response_model=SingleResponse[TeamOut],
    summary="Get user's team information",
    description="""
    Retrieve detailed information about the team that the specified user belongs to.
    
    Returns:
    - Team details including name, description, and logo
    - Team member count
    - Captain information
    - User's role in the team
    - Season information
    - Team statistics
    """
)
async def get_user_team(
    user_id: str = Query(
        ..., 
        description="The ID of the user to get team information for",
        example="user123"
    ),
    include_stats: bool = Query(
        False,
        description="Include team statistics in response"
    ),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get team membership
        stmt = select(TeamMember, Team, Season).join(Team).join(Season)
        stmt = stmt.where(TeamMember.user_id == user_id)
        result = await db.execute(stmt)
        member_team = result.first()
        
        if not member_team:
            raise not_found_error("Team membership", user_id)
            
        team = member_team.Team
        season = member_team.Season
        member = member_team.TeamMember
        
        # Get team stats if requested
        stats = None
        if include_stats:
            stats_stmt = select(
                func.count(TeamMember.id).label("member_count"),
                func.sum(PlayerStats.points).label("total_points"),
                func.avg(PlayerStats.assists).label("avg_assists"),
                func.avg(PlayerStats.rebounds).label("avg_rebounds")
            ).join(PlayerStats, TeamMember.id == PlayerStats.team_member_id, isouter=True)
            stats_stmt = stats_stmt.where(TeamMember.team_id == team.id)
            stats_result = await db.execute(stats_stmt)
            stats = stats_result.first()
            
        team_data = {
            "id": team.id,
            "name": team.name,
            "season_id": team.season_id,
            "description": team.description,
            "logo_url": team.logo_url,
            "created_at": team.created_at,
            "updated_at": team.updated_at,
            "member_count": stats.member_count if stats else 0,
            "captain_id": team.captain_id,
            "season": {
                "id": season.id,
                "name": season.name,
                "start_date": season.start_date,
                "end_date": season.end_date
            },
            "stats": stats._asdict() if stats else None
        }
        
        return SingleResponse(item=team_data)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch user's team information",
            details={"error": str(e)}
        )

@router.get(
    "/teams/{team_id}",
    response_model=SingleResponse[TeamOut],
    summary="Get team information",
    description="""
    Retrieve detailed information about a specific team.
    
    Returns:
    - Team details including name, description, and logo
    - Team member count
    - Captain information
    - Season information
    - Team statistics
    - Recent games
    """
)
async def get_team(
    team_id: int = Path(
        ..., 
        description="The ID of the team to retrieve",
        example=1
    ),
    include_stats: bool = Query(
        False,
        description="Include team statistics in response"
    ),
    include_members: bool = Query(
        False,
        description="Include team members in response"
    ),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Base query
        stmt = select(Team, Season)
        stmt = stmt.join(Season)
        stmt = stmt.where(Team.id == team_id)
        result = await db.execute(stmt)
        team_season = result.first()
        
        if not team_season:
            raise not_found_error("Team", team_id)
            
        team = team_season.Team
        season = team_season.Season
        
        # Get team stats if requested
        stats = None
        if include_stats:
            stats_stmt = select(
                func.count(TeamMember.id).label("member_count"),
                func.sum(PlayerStats.points).label("total_points"),
                func.avg(PlayerStats.assists).label("avg_assists"),
                func.avg(PlayerStats.rebounds).label("avg_rebounds")
            ).join(PlayerStats, TeamMember.id == PlayerStats.team_member_id, isouter=True)
            stats_stmt = stats_stmt.where(TeamMember.team_id == team_id)
            stats_result = await db.execute(stats_stmt)
            stats = stats_result.first()
            
        # Get members if requested
        members = None
        if include_members:
            members_stmt = select(TeamMember, Profile)
            members_stmt = members_stmt.join(Profile)
            members_stmt = members_stmt.where(TeamMember.team_id == team_id)
            members_stmt = members_stmt.order_by(TeamMember.role)
            members_result = await db.execute(members_stmt)
            members = members_result.all()
            
        team_data = {
            "id": team.id,
            "name": team.name,
            "season_id": team.season_id,
            "description": team.description,
            "logo_url": team.logo_url,
            "created_at": team.created_at,
            "updated_at": team.updated_at,
            "member_count": stats.member_count if stats else 0,
            "captain_id": team.captain_id,
            "season": {
                "id": season.id,
                "name": season.name,
                "start_date": season.start_date,
                "end_date": season.end_date
            },
            "stats": stats._asdict() if stats else None,
            "members": [{
                "id": m.TeamMember.id,
                "user_id": m.TeamMember.user_id,
                "role": m.TeamMember.role,
                "position": m.TeamMember.position,
                "jersey_number": m.TeamMember.jersey_number,
                "joined_at": m.TeamMember.joined_at,
                "user": {
                    "id": m.Profile.id,
                    "username": m.Profile.username,
                    "email": m.Profile.email,
                    "discord_id": m.Profile.discord_id
                }
            } for m in members] if members else None
        }
        
        return SingleResponse(item=team_data)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch team information",
            details={"error": str(e)}
        )

@router.get(
    "/teams/{team_id}/roster",
    response_model=SingleResponse[TeamRoster],
    summary="Get team roster with detailed information",
    description="""
    Get complete team roster with detailed member information, including:
    - Player stats
    - Season information
    - Team statistics
    - Member roles and positions
    """
)
async def get_team_roster(
    team_id: int = Path(
        ..., 
        description="The ID of the team to retrieve roster for",
        example=1
    ),
    include_stats: bool = Query(
        True,
        description="Include player and team statistics"
    ),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get team and season info
        team_stmt = select(Team, Season)
        team_stmt = team_stmt.join(Season)
        team_stmt = team_stmt.where(Team.id == team_id)
        team_result = await db.execute(team_stmt)
        team_season = team_result.first()
        
        if not team_season:
            raise not_found_error("Team", team_id)
            
        team = team_season.Team
        season = team_season.Season
        
        # Get members with stats
        members_stmt = select(TeamMember, Profile, PlayerStats)
        members_stmt = members_stmt.join(Profile)
        members_stmt = members_stmt.join(PlayerStats, TeamMember.id == PlayerStats.team_member_id, isouter=True)
        members_stmt = members_stmt.where(TeamMember.team_id == team_id)
        members_stmt = members_stmt.order_by(TeamMember.role, TeamMember.joined_at)
        members_result = await db.execute(members_stmt)
        members = members_result.all()
        
        # Calculate team stats
        team_stats = None
        if include_stats:
            stats_stmt = select(
                func.count(TeamMember.id).label("member_count"),
                func.sum(PlayerStats.points).label("total_points"),
                func.avg(PlayerStats.assists).label("avg_assists"),
                func.avg(PlayerStats.rebounds).label("avg_rebounds"),
                func.avg(PlayerStats.field_goals).label("avg_fg"),
                func.avg(PlayerStats.three_points).label("avg_3p"),
                func.avg(PlayerStats.free_throws).label("avg_ft")
            ).join(PlayerStats, TeamMember.id == PlayerStats.team_member_id, isouter=True)
            stats_stmt = stats_stmt.where(TeamMember.team_id == team_id)
            stats_result = await db.execute(stats_stmt)
            team_stats = stats_result.first()
            
        # Format member data
        member_list = [{
            "id": m.TeamMember.id,
            "user_id": m.TeamMember.user_id,
            "role": m.TeamMember.role,
            "position": m.TeamMember.position,
            "jersey_number": m.TeamMember.jersey_number,
            "joined_at": m.TeamMember.joined_at,
            "stats": m.PlayerStats._asdict() if m.PlayerStats else None,
            "user": {
                "id": m.Profile.id,
                "username": m.Profile.username,
                "email": m.Profile.email,
                "discord_id": m.Profile.discord_id
            }
        } for m in members]
        
        return SingleResponse(item={
            "team_id": team_id,
            "season_id": season.id,
            "members": member_list,
            "stats": team_stats._asdict() if team_stats else None,
            "metadata": {
                "season": {
                    "name": season.name,
                    "start_date": season.start_date,
                    "end_date": season.end_date
                },
                "team": {
                    "name": team.name,
                    "captain_id": team.captain_id,
                    "created_at": team.created_at
                }
            }
        })
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch team roster",
            details={"error": str(e)}
        )

@router.get(
    "/teams/{team_id}/members",
    response_model=ListResponse[TeamMember],
    summary="List team members",
    description="""
    Retrieve a list of team members with optional filtering and pagination.
    
    Returns:
    - List of team members with their details
    - Pagination information
    - Member count
    """
)
async def get_team_members(
    team_id: int = Path(
        ..., 
        description="The ID of the team to retrieve members for",
        example=1
    ),
    db: AsyncSession = Depends(get_db),
    page: int = Query(
        1, 
        ge=1,
        description="Page number for pagination",
        example=1
    ),
    per_page: int = Query(
        10, 
        ge=1, 
        le=100,
        description="Number of items per page",
        example=10
    ),
    role: Optional[str] = Query(
        None, 
        enum=["player", "coach", "manager", "captain"],
        description="Filter by member role"
    )
):
    try:
        # Base query
        stmt = select(
            TeamMember,
            Profile.username,
            Profile.email,
            Profile.profile_picture
        ).join(Profile, Profile.id == TeamMember.user_id)
        stmt = stmt.where(TeamMember.team_id == team_id)
        
        # Apply filters
        if role:
            stmt = stmt.where(TeamMember.role == role)
            
        # Count total items
        total_stmt = select(func.count()).select_from(stmt.subquery())
        total = await db.execute(total_stmt)
        total = total.scalar()
        
        # Apply pagination
        offset = (page - 1) * per_page
        stmt = stmt.offset(offset).limit(per_page)
        
        # Get results
        result = await db.execute(stmt)
        members = result.all()
        
        # Format response
        formatted_members = [
            {
                "id": member.TeamMember.id,
                "user_id": member.TeamMember.user_id,
                "role": member.TeamMember.role,
                "position": member.TeamMember.position,
                "jersey_number": member.TeamMember.jersey_number,
                "joined_at": member.TeamMember.joined_at,
                "user": {
                    "id": member.TeamMember.user_id,
                    "username": member.username,
                    "email": member.email,
                    "profilePicture": member.profile_picture
                }
            }
            for member in members
        ]
        
        return ListResponse(
            items=formatted_members,
            pagination={
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": (total + per_page - 1) // per_page
            }
        )
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to fetch team members",
            details={"error": str(e)}
        )

@router.post(
    "/teams",
    response_model=SingleResponse[TeamOut],
    summary="Create a new team",
    description="""
    Create a new team with the specified details.
    
    Returns:
    - Team details including name, description, and logo
    - Team member count
    - Captain information
    
    Triggers webhook events:
    - team_update
    """,
    responses={
        200: {
            "description": "Team created successfully",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Team created",
                        "team": {
                            "id": 1,
                            "name": "Team Name",
                            "season_id": 1,
                            "description": "Team description",
                            "logo_url": "https://example.com/logo.png",
                            "created_at": "2022-01-01T12:00:00",
                            "updated_at": "2022-01-01T12:00:00",
                            "member_count": 0,
                            "captain_id": None
                        }
                    }
                }
            }
        }
    }
)
async def create_team(
    team_data: TeamCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        # Create team
        team = Team(**team_data.dict())
        db.add(team)
        await db.commit()
        await db.refresh(team)
        
        # Trigger webhook event
        from app.api.v2.webhooks import handle_team_update
        await handle_team_update(team.id, db)
        
        return SingleResponse(item=team)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to create team",
            details={"error": str(e)}
        )

@router.put(
    "/teams/{team_id}",
    response_model=SingleResponse[TeamOut],
    summary="Update team information",
    description="""
    Update team information with the specified details.
    
    Returns:
    - Team details including name, description, and logo
    - Team member count
    - Captain information
    
    Triggers webhook events:
    - team_update
    """,
    responses={
        200: {
            "description": "Team updated successfully",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Team updated",
                        "team": {
                            "id": 1,
                            "name": "Team Name",
                            "season_id": 1,
                            "description": "Team description",
                            "logo_url": "https://example.com/logo.png",
                            "created_at": "2022-01-01T12:00:00",
                            "updated_at": "2022-01-01T12:00:00",
                            "member_count": 0,
                            "captain_id": None
                        }
                    }
                }
            }
        }
    }
)
async def update_team(
    team_id: int = Path(
        ..., 
        description="The ID of the team to update",
        example=1
    ),
    team_data: TeamUpdate = Body(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get team
        team = await db.get(Team, team_id)
        if not team:
            raise not_found_error("Team", team_id)
            
        # Update team
        for field, value in team_data.dict(exclude_unset=True).items():
            setattr(team, field, value)
            
        await db.commit()
        await db.refresh(team)
        
        # Trigger webhook event
        from app.api.v2.webhooks import handle_team_update
        await handle_team_update(team_id, db)
        
        return SingleResponse(item=team)
        
    except Exception as e:
        raise_error(
            code="INTERNAL_ERROR",
            message="Failed to update team",
            details={"error": str(e)}
        )

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
    """,
    responses={
        200: {
            "description": "Member added successfully",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Member added",
                        "member": {
                            "id": 1,
                            "user_id": "user123",
                            "role": "player",
                            "position": "Guard",
                            "jersey_number": 23
                        }
                    }
                }
            }
        }
    }
)
async def add_team_member(
    team_id: int = Path(...,
        description="The ID of the team to add member to",
        example=1
    ),
    member_data: TeamMemberCreate = Body(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Check if team exists
        team = await db.get(Team, team_id)
        if not team:
            raise not_found_error("Team", team_id)
            
        # Check if user exists
        user = await db.get(Profile, data.email)
        if not user:
            # Create invitation
            token = uuid.uuid4()
            invitation = TeamInvitation(
                team_id=team_id,
                email=data.email,
                role=data.role,
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
                    "email": data.email,
                    "role": data.role
                }
            })
        
        # Check if user is already in team
        existing = await db.execute(
            select(TeamMember)
            .where(
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
            role=data.role,
            position=data.position,
            jersey_number=data.jersey_number,
            joined_at=datetime.utcnow()
        )
        db.add(member)
        await db.commit()
        
        # Create invitation record
        token = uuid.uuid4()
        invitation = TeamInvitation(
            team_id=team_id,
            email=data.email,
            role=data.role,
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
