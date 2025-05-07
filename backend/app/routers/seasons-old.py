from fastapi import APIRouter, Depends

router = APIRouter(
    prefix="/seasons",
    tags=["Seasons"],
)

@router.post("/create")
async def create_season():
    """
    Create a new season.
    """
    pass

@router.get("/{season_id}")
async def get_season(season_id: str):
    """
    Fetch season details.
    """
    pass

@router.put("/{season_id}/update")
async def update_season(season_id: str):
    """
    Update season info.
    """
    pass

@router.delete("/{season_id}/delete")
async def delete_season(season_id: str):
    """
    Delete a season.
    """
    pass