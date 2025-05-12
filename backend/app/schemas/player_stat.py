from pydantic import BaseModel


class PlayerStatBase(BaseModel):
    match_id: int
    profile_id: int
    team_id: int
    season_id: int
    points: int
    assists: int
    rebounds: int
    steals: int
    blocks: int
    turnovers: int
    fouls: int


class PlayerStatCreate(PlayerStatBase):
    pass


class PlayerStatRead(PlayerStatBase):
    id: int

    class Config:
        from_attributes = True
