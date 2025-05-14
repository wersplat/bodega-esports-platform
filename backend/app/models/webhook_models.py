from sqlalchemy import Column, String, JSON, Integer, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from uuid import UUID

from app.models.base import Base

Base = declarative_base()

class Webhook(Base):
    __tablename__ = 'webhooks'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    url = Column(String, nullable=False)
    secret = Column(String, nullable=False)
    events = Column(JSON, nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id'), nullable=True)
    player_id = Column(Integer, ForeignKey('players.id'), nullable=True)
    active = Column(Boolean, default=True)
    retry_count = Column(Integer, default=3)
    retry_delay = Column(Integer, default=60)
    rate_limit = Column(Integer, default=100)
    last_retry = Column(DateTime, nullable=True)
    last_error = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team = relationship("Team", back_populates="webhooks")
    player = relationship("Player", back_populates="webhooks")
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
