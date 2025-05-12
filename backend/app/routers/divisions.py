from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.models import Division

router = APIRouter(prefix="/api/divisions", tags=["Divisions"])

@router.get("/")
async def get_all_divisions(db: AsyncSession = Depends(get_db)):
    stmt = select(Division)
    result = await db.execute(stmt)
    divisions = result.scalars().all()
    return [{"id": div.id, "name": div.name} for div in divisions]
