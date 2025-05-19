# backend/app/models/models.py

# SQLAlchemy imports
from sqlalchemy import Column, String, Boolean, Date, DateTime, ForeignKey, func, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, Mapped
from app.models.base import Base
from typing import List, Optional, TypeVar
from datetime import datetime
from enum import Enum
import uuid

# Define UUIDType for type hinting
UUIDType = uuid.UUID

T = TypeVar('T')

class ProfileStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    DELETED = "deleted"

class LeagueStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"
    DELETED = "deleted"

class SeasonStatus(str, Enum):
    UPCOMING = "upcoming"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TeamStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ARCHIVED = "archived"
    DELETED = "deleted"

class RosterStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    REMOVED = "removed"
    PENDING = "pending"

class League(Base):
    __tablename__ = 'leagues'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    status = Column(String, default=LeagueStatus.ACTIVE.value, nullable=False)

    # Relationships
    settings: Mapped[Optional['LeagueSettings']] = relationship(
        "LeagueSettings", 
        uselist=False, 
        back_populates="league",
        lazy="selectin"
    )
    seasons: Mapped[List['Season']] = relationship(
        "Season", 
        back_populates="league",
        lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<League id={self.id} name={self.name} status={self.status}>"

class User(Base):
    __tablename__ = 'users'  # Changed from 'profiles'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    auth_service_id = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True, nullable=True)
    email = Column(String, unique=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    display_name = Column(String, nullable=True)
    platform = Column(String, nullable=True)
    gamer_tag = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_admin = Column(Boolean, nullable=False, default=False)
    status = Column(String, default=ProfileStatus.ACTIVE.value, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    discord_id = Column(String, nullable=True)

    # relationships
    rosters: Mapped[List['Roster']] = relationship("Roster", back_populates="user", lazy="selectin")
    roles: Mapped[List['UserRole']] = relationship("UserRole", back_populates="user", lazy="selectin")
    player_stats: Mapped[List['PlayerStat']] = relationship("PlayerStat", back_populates="user", lazy="selectin")

    def __repr__(self) -> str:
        return f"<User id={self.id} username={self.username} status={self.status}>"

class Role(Base):
    __tablename__ = 'roles'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)  # e.g., player, captain, staff
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    users: Mapped[List['UserRole']] = relationship("UserRole", back_populates="role", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Role id={self.id} name={self.name}>"

class UserRole(Base):
    __tablename__ = 'user_roles'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey('roles.id', ondelete='CASCADE'), nullable=False)
    context = Column(String, nullable=True)  # optional: season, team, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped['User'] = relationship("User", back_populates="roles", lazy="selectin")
    role: Mapped['Role'] = relationship("Role", back_populates="users", lazy="selectin")

    def __repr__(self) -> str:
        return f"<UserRole id={self.id} user_id={self.user_id} role_id={self.role_id}>"

class Season(Base):
    __tablename__ = 'seasons'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    status = Column(String, default=SeasonStatus.UPCOMING.value, nullable=False)
    league_id = Column(Integer, ForeignKey('leagues.id'), nullable=True)

    # relationships
    league: Mapped[Optional['League']] = relationship("League", back_populates="seasons", lazy="selectin")
    teams: Mapped[List['Team']] = relationship("Team", back_populates="season", lazy="selectin")
    rosters: Mapped[List['Roster']] = relationship("Roster", back_populates="season", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Season id={self.id} name={self.name} status={self.status}>"

class Team(Base):
    __tablename__ = 'teams'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    season_id = Column(UUID(as_uuid=True), ForeignKey('seasons.id', ondelete='CASCADE'), nullable=False)
    logo_url = Column(String, nullable=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    status = Column(String, default=TeamStatus.ACTIVE.value, nullable=False)

    # relationships
    season: Mapped['Season'] = relationship("Season", back_populates="teams", lazy="selectin")
    members: Mapped[List['Roster']] = relationship("Roster", back_populates="team", lazy="selectin")
    created_by_user: Mapped[Optional['User']] = relationship("User", foreign_keys=[created_by], lazy="selectin")
    match_submissions: Mapped[List['MatchSubmission']] = relationship("MatchSubmission", back_populates="team", lazy="selectin")
    home_matches: Mapped[List['Match']] = relationship("Match", foreign_keys=['Match.team1_id'], back_populates="team1", lazy="selectin")
    away_matches: Mapped[List['Match']] = relationship("Match", foreign_keys=['Match.team2_id'], back_populates="team2", lazy="selectin")
    webhooks = relationship("Webhook", back_populates="team", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Team id={self.id} name={self.name} status={self.status}>"

class Roster(Base):
    __tablename__ = 'rosters'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    season_id = Column(UUID(as_uuid=True), ForeignKey('seasons.id', ondelete='CASCADE'), nullable=False)
    is_captain = Column(Boolean, nullable=False, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default=RosterStatus.ACTIVE.value, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped['User'] = relationship("User", back_populates="rosters", lazy="selectin")
    team: Mapped['Team'] = relationship("Team", back_populates="members", lazy="selectin")
    season: Mapped['Season'] = relationship("Season", back_populates="rosters", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Roster id={self.id} profile_id={self.profile_id} team_id={self.team_id} status={self.status}>"

class MatchStatus(str, Enum):
    SCHEDULED = "scheduled"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Match(Base):
    __tablename__ = 'matches'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team1_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    team2_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    season_id = Column(UUID(as_uuid=True), ForeignKey('seasons.id', ondelete='CASCADE'), nullable=False)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default=MatchStatus.SCHEDULED.value, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    team1: Mapped['Team'] = relationship("Team", foreign_keys=[team1_id], back_populates="home_matches", lazy="selectin")
    team2: Mapped['Team'] = relationship("Team", foreign_keys=[team2_id], back_populates="away_matches", lazy="selectin")
    season: Mapped['Season'] = relationship("Season", back_populates="matches", lazy="selectin")
    submissions: Mapped[List['MatchSubmission']] = relationship("MatchSubmission", back_populates="match", lazy="selectin")
    player_stats: Mapped[List['PlayerStat']] = relationship("PlayerStat", back_populates="match", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Match id={self.id} team1_id={self.team1_id} team2_id={self.team2_id} status={self.status}>"

class MatchSubmissionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class MatchSubmission(Base):
    __tablename__ = 'match_submissions'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    match_id = Column(UUID(as_uuid=True), ForeignKey('matches.id', ondelete='CASCADE'), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    score = Column(Integer, nullable=True)
    status = Column(String, default=MatchSubmissionStatus.PENDING.value, nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    match: Mapped['Match'] = relationship("Match", back_populates="submissions", lazy="selectin")
    team: Mapped['Team'] = relationship("Team", back_populates="match_submissions", lazy="selectin")
    reviewer: Mapped[Optional['User']] = relationship("User", foreign_keys=[reviewed_by], lazy="selectin")

    def __repr__(self) -> str:
        return f"<MatchSubmission id={self.id} match_id={self.match_id} team_id={self.team_id} status={self.status}>"

class PlayerStat(Base):
    __tablename__ = 'player_stats'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    match_id = Column(UUID(as_uuid=True), ForeignKey('matches.id', ondelete='CASCADE'), nullable=False)
    stat_type = Column(String, nullable=False)
    value = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped['User'] = relationship("User", back_populates="player_stats", lazy="selectin")
    match: Mapped['Match'] = relationship("Match", back_populates="player_stats", lazy="selectin")

    def __repr__(self) -> str:
        return f"<PlayerStat id={self.id} profile_id={self.profile_id} stat_type={self.stat_type} value={self.value}>"

class NotificationType(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    SUCCESS = "success"


class Notification(Base):
    __tablename__ = 'notifications'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, nullable=False, default=NotificationType.INFO.value)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self) -> str:
        return f"<Notification id={self.id} title={self.title} type={self.type} read={self.read}>"

class Division(Base):
    __tablename__ = 'divisions'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    season_id = Column(UUID(as_uuid=True), ForeignKey('seasons.id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # relationships
    season: Mapped['Season'] = relationship("Season", back_populates="divisions", lazy="selectin")
    teams: Mapped[List['Team']] = relationship("Team", back_populates="division", lazy="selectin")
    
    def __repr__(self) -> str:
        return f"<Division id={self.id} name={self.name} season_id={self.season_id}>"

class Conference(Base):
    __tablename__ = 'conferences'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    league_id = Column(Integer, ForeignKey('leagues.id', ondelete='CASCADE'), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    league: Mapped['League'] = relationship("League", back_populates="conferences", lazy="selectin")
    divisions: Mapped[List['Division']] = relationship("Division", back_populates="conference", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Conference id={self.id} name={self.name} league_id={self.league_id}>"

class LeagueSettings(Base):
    __tablename__ = 'league_settings'
    id = Column(Integer, primary_key=True)
    league_id = Column(Integer, ForeignKey('leagues.id', ondelete='CASCADE'), nullable=False)
    settings_json = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    league: Mapped['League'] = relationship("League", back_populates="settings", lazy="selectin")

    def __repr__(self) -> str:
        return f"<LeagueSettings id={self.id} league_id={self.league_id}>"

class TeamMember(Base):
    __tablename__ = 'team_members'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    season_id = Column(UUID(as_uuid=True), ForeignKey('seasons.id', ondelete='CASCADE'), nullable=False)
    is_captain = Column(Boolean, nullable=False, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default=RosterStatus.ACTIVE.value, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped['User'] = relationship("User", lazy="selectin")
    team: Mapped['Team'] = relationship("Team", lazy="selectin")
    season: Mapped['Season'] = relationship("Season", lazy="selectin")

    def __repr__(self) -> str:
        return f"<TeamMember id={self.id} profile_id={self.profile_id} team_id={self.team_id} status={self.status}>"
    
    # Add to models.py

class TeamInvitation(Base):
    __tablename__ = 'team_invitations'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    email = Column(String, nullable=False)
    role = Column(String, nullable=False)
    token = Column(String, nullable=False, unique=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='SET NULL'), nullable=True)

    def __repr__(self) -> str:
        return f"<TeamInvitation id={self.id} email={self.email} role={self.role} status={self.status}>"
    
class Player(Base):
    __tablename__ = "players"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    position = Column(String)
    jersey_number = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        return f"<Player id={self.id} name={self.name} position={self.position} jersey_number={self.jersey_number}>"
