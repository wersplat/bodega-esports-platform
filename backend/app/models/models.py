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
    player_stats = relationship("PlayerStat", back_populates="profile")


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


# Define the Division model
class Division(Base):
    __tablename__ = 'divisions'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    season_id = Column(Integer, ForeignKey('seasons.id'))
    season = relationship("Season", back_populates="divisions")


# Add relationship to Season
Season.divisions = relationship("Division", back_populates="season")


# Define the Conference model
class Conference(Base):
    __tablename__ = 'conferences'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    divisions = relationship("Division", back_populates="conference")


# Add relationship to Division
Division.conference_id = Column(Integer, ForeignKey('conferences.id'))
Division.conference = relationship("Conference", back_populates="divisions")


# Define the Webhook model
class Webhook(Base):
    __tablename__ = 'webhooks'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)


# Ensure proper spacing before and after the MatchSubmission model

class MatchSubmission(Base):
    __tablename__ = 'match_submissions'
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey('matches.id'))
    match = relationship("Match", back_populates="submissions")


# Add relationship to Match
Match.submissions = relationship("MatchSubmission", back_populates="match")


# Define the PlayerStat model
class PlayerStat(Base):
    __tablename__ = 'player_stats'
    id = Column(Integer, primary_key=True)
    player_id = Column(Integer, ForeignKey('players.id'))
    # Foreign key to profiles
    profile_id = Column(Integer, ForeignKey('profiles.id'))
    player = relationship("Player", back_populates="player_stats")
    profile = relationship("Profile", back_populates="player_stats")
    stat_type = Column(String, nullable=False)
    value = Column(Integer, nullable=False)


# Add relationship to Player
Player.player_stats = relationship("PlayerStat", back_populates="player")


class LeagueSettings(Base):
    __tablename__ = 'league_settings'
    id = Column(Integer, primary_key=True)
    league_id = Column(Integer, ForeignKey('leagues.id'), nullable=False)
    settings_json = Column(Text, nullable=True)  # Example field for settings

    league = relationship("League", back_populates="settings")
