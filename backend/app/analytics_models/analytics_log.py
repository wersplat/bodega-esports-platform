from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.analytics_models.base import AnalyticsBase

class AnalyticsLog(AnalyticsBase):
    __tablename__ = "analytics_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
