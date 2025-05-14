from fastapi import APIRouter

router = APIRouter(
    prefix="/standings",
    tags=["Standings"],
)

@router.get("/{season_id}")
async def get_standings(season_id: str):
    """
    Fetch standings for a season.
    """
    pass

@router.get("/leaderboards/{season_id}")
async def get_leaderboards(season_id: str):
    """
    Fetch player leaderboards for a season.
    """
    pass