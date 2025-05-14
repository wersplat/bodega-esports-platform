from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Season

router = APIRouter()

class SeasonCreate(BaseModel):
    name: str
    league_id: int

class SeasonOut(SeasonCreate):
    id: int

    class Config:
        from_attributes = True



@router.get("/", response_model=list[SeasonOut])
async def list_seasons(db: AsyncSession = Depends(get_db)):
    stmt = select(Season)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=SeasonOut)
async def create_season(data: SeasonCreate, db: AsyncSession = Depends(get_db)):
    new = Season(name=data.name, league_id=data.league_id)
    db.add(new)
    await db.commit()
    await db.refresh(new)
    return new

@router.get("/{season_id}", response_model=SeasonOut)
async def get_season(season_id: int, db: AsyncSession = Depends(get_db)):
    season = await db.get(Season, season_id)
    if not season:
        raise HTTPException(404, "Season not found")
    return season
