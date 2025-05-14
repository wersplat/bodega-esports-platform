from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from app.database import get_db
from app.models import Team, Roster, PlayerStat

router = APIRouter(prefix="/api/v2")

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[dict] = None

class TeamCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    season_id: int
    description: Optional[str] = Field(max_length=500)
    logo_url: Optional[str]
    
class TeamOut(BaseModel):
    id: int
    name: str
    season_id: int
    description: Optional[str]
    logo_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    member_count: int = Field(alias="memberCount")
    average_points: Optional[float] = Field(alias="averagePoints")
    
    class Config:
        from_attributes = True
        validate_by_name = True

class TeamListResponse(BaseModel):
    items: List[TeamOut]
    total: int
    page: int
    per_page: int

@router.get("/teams", response_model=TeamListResponse)
async def list_teams(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    season_id: Optional[int] = None,
    include_stats: bool = Query(False),
    fields: Optional[str] = Query(None, description="Comma-separated list of fields to include")
):
    try:
        # Base query
        stmt = select(Team)
        
        # Apply filters
        if search:
            stmt = stmt.where(Team.name.ilike(f"%{search}%"))
        if season_id:
            stmt = stmt.where(Team.season_id == season_id)
            
        # Count total items
        total_stmt = select(func.count()).select_from(stmt.subquery())
        total = await db.execute(total_stmt)
        total = total.scalar()
        
        # Apply pagination
        offset = (page - 1) * per_page
        stmt = stmt.offset(offset).limit(per_page)
        
        # Get teams
        result = await db.execute(stmt)
        teams = result.scalars().all()
        
        # Get additional stats if requested
        if include_stats:
            team_ids = [team.id for team in teams]
            if team_ids:
                stats_stmt = select(
                    Roster.team_id,
                    func.count(Roster.id).label("member_count"),
                    func.avg(PlayerStat.points).label("average_points")
                ).join(PlayerStat, PlayerStat.profile_id == Roster.profile_id)
                stats_stmt = stats_stmt.where(Roster.team_id.in_(team_ids))
                stats_stmt = stats_stmt.group_by(Roster.team_id)
                stats_result = await db.execute(stats_stmt)
                stats_data = {r.team_id: r for r in stats_result}
                
                for team in teams:
                    stats = stats_data.get(team.id)
                    if stats:
                        team.member_count = stats.member_count
                        team.average_points = round(stats.average_points, 2)
                    else:
                        team.member_count = 0
                        team.average_points = None
        
        return TeamListResponse(
            items=teams,
            total=total,
            page=page,
            per_page=per_page
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=ErrorDetail(
                code="INTERNAL_ERROR",
                message="Failed to fetch teams",
                details={"error": str(e)}
            ).dict()
        )

@router.post("/teams", response_model=TeamOut)
async def create_team(
    data: TeamCreate,
    db: AsyncSession = Depends(get_db)
):
    try:
        # Check if team name already exists in season
        existing = await db.execute(
            select(Team).where(
                Team.name == data.name,
                Team.season_id == data.season_id
            )
        )
        if existing.scalar():
            raise HTTPException(
                status_code=400,
                detail=ErrorDetail(
                    code="TEAM_EXISTS",
                    message="Team name already exists in this season",
                    details={"team_name": data.name, "season_id": data.season_id}
                ).dict()
            )
            
        new = Team(**data.dict())
        db.add(new)
        await db.commit()
        await db.refresh(new)
        
        return new
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=ErrorDetail(
                code="CREATE_FAILED",
                message="Failed to create team",
                details={"error": str(e)}
            ).dict()
        )
