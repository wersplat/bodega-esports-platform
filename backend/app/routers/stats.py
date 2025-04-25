from fastapi import APIRouter

router = APIRouter(prefix="/api/stats", tags=["Stats"])

@router.get("/stat-types")
def get_stat_types():
    return [
        {"key": "points_per_game", "label": "Points"},
        {"key": "assists_per_game", "label": "Assists"},
        {"key": "rebounds_per_game", "label": "Rebounds"},
        {"key": "steals_per_game", "label": "Steals"},
        {"key": "blocks_per_game", "label": "Blocks"},
    ]
