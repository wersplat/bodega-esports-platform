from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Team

router = APIRouter(prefix="/api/v1")

class TeamCreate(BaseModel):
    name: str
    season_id: int

class TeamOut(TeamCreate):
    id: int

    class Config:
        from_attributes = True

@router.get("/", response_model=list[TeamOut])
async def list_teams(db: AsyncSession = Depends(get_db)):
    stmt = select(Team)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=TeamOut)
async def create_team(data: TeamCreate, db: AsyncSession = Depends(get_db)):
    new = Team(name=data.name, season_id=data.season_id)
    db.add(new)
    await db.commit()
    await db.refresh(new)
    return new

@router.get("/{team_id}", response_model=TeamOut)
async def get_team(team_id: int, db: AsyncSession = Depends(get_db)):
    team = await db.get(Team, team_id)
    if not team:
        raise HTTPException(404, "Team not found")
    return team
