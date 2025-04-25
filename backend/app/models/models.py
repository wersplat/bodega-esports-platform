from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Index  # noqa
from sqlalchemy.orm import relationship
from app.database import Base


class League(Base):
    __tablename__ = 'leagues'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    settings = relationship(
        "LeagueSettings", uselist=False, back_populates="league"
    )


class Team(Base):
    __tablename__ = 'teams'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)


class Profile(Base):
    __tablename__ = 'profiles'
    id = Column(Integer, primary_key=True)
    player_stats = relationship("PlayerStat", backref="profile")


class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(Integer, primary_key=True)


class Match(Base):
    __tablename__ = 'matches'
    id = Column(Integer, primary_key=True)


class Registration(Base):
    __tablename__ = 'registrations'
    id = Column(Integer, primary_key=True)


# Define the Player model
class Player(Base):
    __tablename__ = 'players'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id'))
    team = relationship("Team", back_populates="players")


# Add relationship to Team
Team.players = relationship("Player", back_populates="team")


# Ensure proper spacing before the Season model

class Season(Base):
    __tablename__ = 'seasons'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    league_id = Column(Integer, ForeignKey('leagues.id'))
    league = relationship("League", back_populates="seasons")


# Add relationship to League
League.seasons = relationship("Season", back_populates="league")
