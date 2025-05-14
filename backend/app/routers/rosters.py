from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Roster

router = APIRouter()

class RosterCreate(BaseModel):
    profile_id: str
    team_id: int
    season_id: int
    is_captain: bool = False

class RosterOut(RosterCreate):
    id: int
    joined_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=list[RosterOut])
async def list_rosters(db: AsyncSession = Depends(get_db)):
    stmt = select(Roster)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=RosterOut)
async def create_roster(entry: RosterCreate, db: AsyncSession = Depends(get_db)):
    stmt = select(Roster).where(
        Roster.profile_id == entry.profile_id,
        Roster.team_id == entry.team_id,
        Roster.season_id == entry.season_id
    )
    result = await db.execute(stmt)
    exists = result.scalars().first()
    if exists:
        raise HTTPException(400, "Already on that roster")
    new = Roster(
        profile_id=entry.profile_id,
        team_id=entry.team_id,
        season_id=entry.season_id,
        is_captain=entry.is_captain,
        joined_at=datetime.utcnow()
    )
    db.add(new)
    await db.commit()
    await db.refresh(new)
    return new

@router.get("/{roster_id}", response_model=RosterOut)
async def get_roster(roster_id: int, db: AsyncSession = Depends(get_db)):
    r = await db.get(Roster, roster_id)
    if not r:
        raise HTTPException(404, "Roster entry not found")
    return r
