from pydantic import BaseModel

class TeamStanding(BaseModel):
    team_id: int
    team_name: str
    wins: int
    losses: int
    point_diff: int
    win_pct: float

    class Config:
        from_attributes = True
