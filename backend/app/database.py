print("IMPORTING DATABASE.PY")
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import AsyncContextManager
from contextlib import asynccontextmanager
import logging

logger = logging.getLogger(__name__)

# Load environment
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    logger.error("DATABASE_URL environment variable is not set")
    raise ValueError("DATABASE_URL environment variable is not set")

try:
    # Async engine setup
    engine = create_async_engine(
        DATABASE_URL,
        echo=True,
        future=True,
    )
    logger.info("Database engine created successfully")
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    raise

# Async session factory
class SessionFactory:
    def __init__(self, engine):
        self.engine = engine
        self.SessionLocal = sessionmaker(
            bind=self.engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
        )

    @asynccontextmanager
    async def get_session(self) -> AsyncContextManager[AsyncSession]:
        session = self.SessionLocal()
        try:
            yield session
        except Exception as e:
            logger.error(f"Session error: {e}")
            raise
        finally:
            await session.close()

# Import Base from your models

# Analytics DB setup (optional)
analytics_engine = None
AnalyticsSessionLocal = None

try:
    if DATABASE_URL:
        analytics_engine = create_async_engine(
            DATABASE_URL,
            echo=True,
            future=True,
        )
        AnalyticsSessionLocal = sessionmaker(
            bind=analytics_engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
        )
        logger.info("Analytics database setup completed")
except Exception as e:
    logger.error(f"Failed to setup analytics database: {e}")

# Database connection context manager
@asynccontextmanager
async def get_db_session() -> AsyncContextManager[AsyncSession]:
    session = SessionLocal()
    try:
        yield session
    except Exception as e:
        await session.rollback()
        raise
    finally:
        await session.close()

# Test database connection
async def test_connection():
    try:
        async with engine.begin() as conn:
            await conn.execute("SELECT 1")
        print("Database connection successful")
    except Exception as e:
        print(f"Database connection failed: {e}")
        raise

# Dependency for FastAPI
async def get_db():
    async with SessionLocal() as session:
        yield session

async def get_analytics_db():
    if AnalyticsSessionLocal is None:
        raise RuntimeError("Analytics database is not configured.")
    async with AnalyticsSessionLocal() as session:
        yield session

