import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# --- Analytics DB ---
import logging

from dotenv import load_dotenv

load_dotenv()

# DATABASE CONNECTION (Postgres for SQLAlchemy)
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, future=True, echo=True)
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)

# Import Base from models instead of creating it here
from app.models.base import Base

# ANALYTICS DATABASE CONNECTION
ANALYTICS_DB_URL = os.getenv("ANALYTICS_DB_URL")
if not ANALYTICS_DB_URL:
    logging.warning("ANALYTICS_DB_URL not set. Analytics DB will not be available.")

analytics_engine = create_async_engine(ANALYTICS_DB_URL, future=True, echo=True) if ANALYTICS_DB_URL else None
AnalyticsSessionLocal = sessionmaker(
    bind=analytics_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
) if analytics_engine else None

async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_analytics_db():
    if AnalyticsSessionLocal is None:
        raise RuntimeError("Analytics database is not configured.")
    async with AnalyticsSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# SUPABASE CLIENT (Auth / Storage / Functions)
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase_client = None
