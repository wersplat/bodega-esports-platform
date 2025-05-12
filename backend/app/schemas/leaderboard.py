from pydantic import BaseModel

class PlayerLeaderboardEntry(BaseModel):
    profile_id: int
    profile_name: str
    team_id: int
    team_name: str
    ppg: float
    apg: float
    rpg: float
    eff: float
    win_pct: float
    mvp: bool

    class Config:
        from_attributes = True
