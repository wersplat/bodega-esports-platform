from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.models import Season

router = APIRouter()

@router.get("/api/seasons")
async def get_seasons(db: AsyncSession = Depends(get_db)):
    """Fetch all seasons."""
    try:
        result = await db.execute(select(Season))
        seasons = result.scalars().all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return [
        {
            "id": season.id if season.id else None,
            "name": season.name if season.name else "Unnamed Season",
            "league_id": season.league_id if season.league_id else None,
        }
        for season in seasons
    ]
