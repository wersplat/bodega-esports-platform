from sqlalchemy import (
    Column, Integer, String, ForeignKey, DateTime, Text,
    Boolean, Float, ARRAY
)
from sqlalchemy.orm import relationship
from app.database import Base


class League(Base):
    __tablename__ = 'leagues'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    settings = relationship("LeagueSettings", uselist=False, back_populates="league")
    seasons = relationship("Season", back_populates="league")


class Season(Base):
    __tablename__ = 'seasons'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    league_id = Column(Integer, ForeignKey('leagues.id'))

    league = relationship("League", back_populates="seasons")
    divisions = relationship("Division", back_populates="season")
    rosters = relationship("Roster", back_populates="season")


class Division(Base):
    __tablename__ = 'divisions'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    season_id = Column(Integer, ForeignKey('seasons.id'))
    conference_id = Column(Integer, ForeignKey('conferences.id'))

    season = relationship("Season", back_populates="divisions")
    conference = relationship("Conference", back_populates="divisions")


class Conference(Base):
    __tablename__ = 'conferences'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    divisions = relationship("Division", back_populates="conference")


class Team(Base):
    __tablename__ = 'teams'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    rosters = relationship("Roster", back_populates="team")
    match_submissions = relationship("MatchSubmission", back_populates="team")


class Profile(Base):  # = users
    __tablename__ = 'profiles'
    id = Column(String, primary_key=True)  # UUID as string
    username = Column(String, nullable=True)
    display_name = Column(String, nullable=True)
    platform = Column(String, nullable=True)
    gamer_tag = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_admin = Column(Boolean, nullable=True, default=False)
    created_at = Column(DateTime(timezone=True), nullable=False)
    positions = Column(String, nullable=True)
    career_ppg = Column(Float, nullable=True)
    career_apg = Column(Float, nullable=True)
    career_rpg = Column(Float, nullable=True)
    email = Column(String, unique=True, nullable=True)
    role = Column(String, nullable=True, default='player')
    preferred_positions = Column(ARRAY(String), nullable=True)
    photo_url = Column(String, nullable=True)
    discord_id = Column(String, nullable=True)

    player_stats = relationship("PlayerStat", back_populates="profile")
    rosters = relationship("Roster", back_populates="profile")
    roles = relationship("UserRole", back_populates="profile")


class Roster(Base):
    __tablename__ = 'rosters'
    id = Column(Integer, primary_key=True)
    profile_id = Column(String, ForeignKey('profiles.id'))
    team_id = Column(Integer, ForeignKey('teams.id'))
    season_id = Column(Integer, ForeignKey('seasons.id'))
    is_captain = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True))

    profile = relationship("Profile", back_populates="rosters")
    team = relationship("Team", back_populates="rosters")
    season = relationship("Season", back_populates="rosters")


class Role(Base):
    __tablename__ = 'roles'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)  # e.g., player, captain, staff
    description = Column(Text)


class UserRole(Base):
    __tablename__ = 'user_roles'
    id = Column(Integer, primary_key=True)
    profile_id = Column(String, ForeignKey('profiles.id'))
    role_id = Column(Integer, ForeignKey('roles.id'))
    context = Column(String, nullable=True)  # optional: league/season/etc.

    profile = relationship("Profile", back_populates="roles")
    role = relationship("Role", back_populates="users")


Role.users = relationship("UserRole", back_populates="role")


class Match(Base):
    __tablename__ = 'matches'
    id = Column(Integer, primary_key=True)
    # You can add team1_id, team2_id, season_id, etc.


class MatchSubmission(Base):
    __tablename__ = 'match_submissions'
    id = Column(Integer, primary_key=True)
    match_id = Column(Integer, ForeignKey('matches.id'))
    team_id = Column(Integer, ForeignKey('teams.id'))

    match = relationship("Match", back_populates="submissions")
    team = relationship("Team", back_populates="match_submissions")


Match.submissions = relationship("MatchSubmission", back_populates="match")


class PlayerStat(Base):
    __tablename__ = 'player_stats'
    id = Column(Integer, primary_key=True)
    profile_id = Column(String, ForeignKey('profiles.id'))
    match_id = Column(Integer, ForeignKey('matches.id'))
    stat_type = Column(String, nullable=False)
    value = Column(Integer, nullable=False)

    profile = relationship("Profile", back_populates="player_stats")
    match = relationship("Match", backref="player_stats")


class LeagueSettings(Base):
    __tablename__ = 'league_settings'
    id = Column(Integer, primary_key=True)
    league_id = Column(Integer, ForeignKey('leagues.id'), nullable=False)
    settings_json = Column(Text, nullable=True)

    league = relationship("League", back_populates="settings")


class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(Integer, primary_key=True)
class Webhook(Base):
    __tablename__ = 'webhooks'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)