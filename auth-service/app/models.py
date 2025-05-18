from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    discord_id = Column(String, unique=True, index=True)
    email = Column(String, nullable=True)
    role = Column(String, default="player")
    created_at = Column(DateTime, default=datetime.utcnow)