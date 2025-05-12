from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.models import Division

router = APIRouter()


@router.get("/api/divisions")
async def get_divisions(db: AsyncSession = Depends(get_db)):
    """Fetch all divisions."""
    result = await db.execute(select(Division))
    divisions = result.scalars().all()
    return [
        {
            "id": division.id,
            "name": division.name,
            "season_id": division.season_id,
        }
        for division in divisions
    ]

