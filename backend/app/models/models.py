# backend/app/models/models.py

from sqlalchemy import (
    Column, String, Boolean, Date, DateTime, ForeignKey, func, Text, Integer
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base
import uuid


class League(Base):
    __tablename__ = 'leagues'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)

    settings = relationship("LeagueSettings", uselist=False, back_populates="league")
    seasons = relationship("Season", back_populates="league")


class Profile(Base):  # = users
    __tablename__ = 'profiles'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, nullable=True)
    display_name = Column(String, nullable=True)
    platform = Column(String, nullable=True)
    gamer_tag = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_admin = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    email = Column(String, unique=True, nullable=True)
    discord_id = Column(String, nullable=True)

    # relationships
    rosters = relationship("Roster", back_populates="profile")
    roles = relationship("UserRole", back_populates="profile")
    player_stats = relationship("PlayerStat", back_populates="profile")


class Role(Base):
    __tablename__ = 'roles'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)  # e.g., player, captain, staff
    description = Column(Text)

    users = relationship("UserRole", back_populates="role")


class UserRole(Base):
    __tablename__ = 'user_roles'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey('roles.id', ondelete='CASCADE'), nullable=False)
    context = Column(String, nullable=True)  # optional: season, team, etc.

    profile = relationship("Profile", back_populates="roles")
    role = relationship("Role", back_populates="users")


class Season(Base):
    __tablename__ = 'seasons'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    league_id = Column(Integer, ForeignKey('leagues.id'), nullable=True)

    # relationships
    league = relationship("League", back_populates="seasons")
    teams = relationship("Team", back_populates="season")
    rosters = relationship("Roster", back_populates="season")


class Team(Base):
    __tablename__ = 'teams'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    season_id = Column(UUID(as_uuid=True), ForeignKey('seasons.id', ondelete='CASCADE'), nullable=False)
    logo_url = Column(String, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey('profiles.id', ondelete='SET NULL'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationships
    season = relationship("Season", back_populates="teams")
    rosters = relationship("Roster", back_populates="team")
    match_submissions = relationship("MatchSubmission", back_populates="team")


class Roster(Base):
    __tablename__ = 'rosters'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    season_id = Column(UUID(as_uuid=True), ForeignKey('seasons.id', ondelete='CASCADE'), nullable=False)
    is_captain = Column(Boolean, nullable=False, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("Profile", back_populates="rosters")
    team = relationship("Team", back_populates="rosters")
    season = relationship("Season", back_populates="rosters")


class Match(Base):
    __tablename__ = 'matches'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # TODO: add team1_id, team2_id, season_id, etc.

    submissions = relationship("MatchSubmission", back_populates="match")
    player_stats = relationship("PlayerStat", back_populates="match")


class MatchSubmission(Base):
    __tablename__ = 'match_submissions'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    match_id = Column(UUID(as_uuid=True), ForeignKey('matches.id', ondelete='CASCADE'), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)

    match = relationship("Match", back_populates="submissions")
    team = relationship("Team", back_populates="match_submissions")


class PlayerStat(Base):
    __tablename__ = 'player_stats'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False)
    match_id = Column(UUID(as_uuid=True), ForeignKey('matches.id', ondelete='CASCADE'), nullable=False)
    stat_type = Column(String, nullable=False)
    value = Column(Integer, nullable=False)

    profile = relationship("Profile", back_populates="player_stats")
    match = relationship("Match", back_populates="player_stats")


class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


class Webhook(Base):
    __tablename__ = 'webhooks'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)

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
class LeagueSettings(Base):
    __tablename__ = 'league_settings'
    id = Column(Integer, primary_key=True)
    league_id = Column(Integer, ForeignKey('leagues.id'), nullable=False)
    settings_json = Column(Text, nullable=True)

    league = relationship("League", back_populates="settings")