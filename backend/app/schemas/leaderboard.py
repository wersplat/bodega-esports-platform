from pydantic import BaseModel
from typing import Optional

class PlayerLeaderboardEntry(BaseModel):
    player_id: int
    player_name: str
    team_id: int
    team_name: str
    ppg: float
    apg: float
    rpg: float
    eff: float
    mvp: Optional[bool] = False
