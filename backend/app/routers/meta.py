from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.models import Season, Team, Division
from typing import Optional

router = APIRouter(prefix="/api/meta", tags=["Meta"])


# Utility function for pagination
def paginate_query(stmt, skip: int, limit: int):
    return stmt.offset(skip).limit(limit)


from sqlalchemy.future import select

@router.get("/seasons")
async def get_seasons(
    db: AsyncSession = Depends(get_db),
    league_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1)
):
    stmt = select(Season).order_by(Season.id.desc())
    if league_id:
        stmt = stmt.where(Season.league_id == league_id)
    stmt = paginate_query(stmt, skip, limit)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/teams")
async def get_teams(
    db: AsyncSession = Depends(get_db),
    division_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1)
):
    stmt = select(Team).order_by(Team.name)
    if division_id:
        stmt = stmt.where(Team.division_id == division_id)
    stmt = paginate_query(stmt, skip, limit)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/divisions")
async def get_divisions(
    db: AsyncSession = Depends(get_db),
    season_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1)
):
    stmt = select(Division).order_by(Division.name)
    if season_id:
        stmt = stmt.where(Division.season_id == season_id)
    stmt = paginate_query(stmt, skip, limit)
    result = await db.execute(stmt)
    return result.scalars().all()
