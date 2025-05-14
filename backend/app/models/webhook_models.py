from app.api.v2.types import Column, String, JSON, Integer, DateTime, ForeignKey, Boolean
from app.api.v2.types import relationship
from app.models.base import Base
from app.api.v2.types import datetime
from app.api.v2.types import UUID, uuid4
from app.api.v2.types import List, Optional
from app.api.v2.types import Enum

from app.models import Team, Player

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

    id: UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    url: str = Column(String, nullable=False)
    secret: str = Column(String, nullable=False)
    events: List[str] = Column(JSON, nullable=False)
    team_id: Optional[int] = Column(Integer, ForeignKey('teams.id'), nullable=True)
    player_id: Optional[int] = Column(Integer, ForeignKey('players.id'), nullable=True)
    active: bool = Column(Boolean, default=True)
    retry_count: int = Column(Integer, default=3)
    retry_delay: int = Column(Integer, default=60)
    rate_limit: int = Column(Integer, default=100)
    last_retry: Optional[datetime] = Column(DateTime, nullable=True)
    last_error: Optional[str] = Column(String, nullable=True)
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    updated_at: datetime = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    team: Optional[Team] = relationship(
        "Team",
        back_populates="webhooks",
        lazy="selectin"
    )
    player: Optional[Player] = relationship(
        "Player",
        back_populates="webhooks",
        lazy="selectin"
    )

    # Back references
    events = relationship("WebhookEvent", back_populates="webhook", lazy="selectin")

class WebhookEvent(Base):
    __tablename__ = 'webhook_events'

    id: UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    webhook_id: UUID = Column(UUID(as_uuid=True), ForeignKey('webhooks.id'), nullable=False)
    event_type: str = Column(String, nullable=False)
    payload: Dict[str, Any] = Column(JSON, nullable=False)
    attempt: int = Column(Integer, default=1)
    max_attempts: int = Column(Integer, default=3)
    status: str = Column(String, default="pending")
    error: Optional[str] = Column(String, nullable=True)
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    last_attempt: Optional[datetime] = Column(DateTime, nullable=True)

    # Relationships
    webhook: Webhook = relationship(
        "Webhook",
        back_populates="events",
        lazy="selectin"
    )
    player = relationship(
        "Player",
        back_populates="webhooks",
        foreign_keys=[player_id],
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
