from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.models import Team

router = APIRouter()


@router.get("/api/teams")
async def get_teams(db: AsyncSession = Depends(get_db)):
    """Fetch all teams."""
    result = await db.execute(select(Team))
    teams = result.scalars().all()
    return [
        {
            "id": team.id,
            "name": team.name,
            "league_id": team.league_id,
        }
        for team in teams
    ]

