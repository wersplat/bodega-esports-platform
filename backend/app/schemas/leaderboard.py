from pydantic import BaseModel

class PlayerLeaderboardEntry(BaseModel):
    player_id: int
    player_name: str
    team_id: int
    team_name: str
    ppg: float
    apg: float
    rpg: float
    eff: float
    win_pct: float
    mvp: bool
