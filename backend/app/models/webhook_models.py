# SQLAlchemy imports
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

# Standard library imports
from datetime import datetime
from typing import TypeVar
from enum import Enum
import uuid

# Forward reference for avoiding circular imports
Team = 'Team'
Player = 'Player'

T = TypeVar('T')

class WebhookEventType(str, Enum):
    TEAM_UPDATE = "team_update"
    TEAM_MEMBER_UPDATE = "team_member_update"
    ROSTER_UPDATE = "roster_update"
    TEAM_RANKING = "team_ranking"
    PLAYER_UPDATE = "player_update"
    PLAYER_STATS = "player_stats"
    PLAYER_RANKING = "player_ranking"
    GAME_SCHEDULE = "game_schedule"
    GAME_RESULT = "game_result"
    GAME_STATS = "game_stats"
    LEAGUE_UPDATE = "league_update"
    SEASON_UPDATE = "season_update"
    ADMIN_NOTIFICATION = "admin_notification"
    SYSTEM_ALERT = "system_alert"

class Webhook(Base):
    __tablename__ = 'webhooks'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = Column(String, nullable=False)
    secret = Column(String, nullable=False)
    event_types = Column(JSON, nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id'), nullable=True)
    # player_id = Column(Integer, ForeignKey('players.id'), nullable=True)  # Commented out if Player model does not exist
    active = Column(Boolean, default=True)
    retry_count = Column(Integer, default=3)
    retry_delay = Column(Integer, default=60)
    rate_limit = Column(Integer, default=100)
    last_retry = Column(DateTime, nullable=True)
    last_error = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team = relationship(
        "Team",
        back_populates="webhooks",
        lazy="selectin"
    )
    # player = relationship(
    #     "Player",
    #     back_populates="webhooks",
    #     lazy="selectin"
    # )
    # Back references
    events = relationship("WebhookEvent", back_populates="webhook", lazy="selectin")

class WebhookEvent(Base):
    __tablename__ = 'webhook_events'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    webhook_id = Column(UUID(as_uuid=True), ForeignKey('webhooks.id'), nullable=False)
    event_type = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    attempt = Column(Integer, default=1)
    max_attempts = Column(Integer, default=3)
    status = Column(String, default="pending")
    error = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_attempt = Column(DateTime, nullable=True)

    # Relationships
    webhook = relationship(
        "Webhook",
        back_populates="events",
        lazy="selectin"
    )
    retries = relationship("WebhookRetry", back_populates="webhook", cascade="all, delete-orphan")
    health = relationship("WebhookHealth", back_populates="webhook", uselist=False, cascade="all, delete-orphan")
    analytics = relationship("WebhookAnalytics", back_populates="webhook", uselist=False, cascade="all, delete-orphan")

class WebhookRetry(Base):
    __tablename__ = 'webhook_retries'

    id = Column(Integer, primary_key=True, autoincrement=True)
    webhook_id = Column(UUID(as_uuid=True), ForeignKey('webhooks.id'), nullable=False)
    event = Column(JSON, nullable=False)
    attempt = Column(Integer, nullable=False)
    last_attempt = Column(DateTime, nullable=False)
    next_attempt = Column(DateTime, nullable=False)
    error = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    webhook = relationship("Webhook", back_populates="retries")

class WebhookHealth(Base):
    __tablename__ = 'webhook_health'

    webhook_id = Column(UUID(as_uuid=True), ForeignKey('webhooks.id'), primary_key=True)
    last_check = Column(DateTime, nullable=True)
    average_response_time = Column(Float, nullable=True)
    error_count = Column(Integer, default=0)
    success_count = Column(Integer, default=0)
    success_rate = Column(Float, nullable=True)
    status = Column(String, nullable=True)
    last_error = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    webhook = relationship("Webhook", back_populates="health", uselist=False)

class WebhookAnalytics(Base):
    __tablename__ = 'webhook_analytics'

    webhook_id = Column(UUID(as_uuid=True), ForeignKey('webhooks.id'), primary_key=True)
    total_events = Column(Integer, default=0)
    average_latency = Column(Float, nullable=True)
    max_latency = Column(Float, nullable=True)
    min_latency = Column(Float, nullable=True)
    error_rate = Column(Float, nullable=True)
    rate_limit_hits = Column(Integer, default=0)
    event_distribution = Column(JSON, nullable=True)
    retry_distribution = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    webhook = relationship("Webhook", back_populates="analytics", uselist=False)
