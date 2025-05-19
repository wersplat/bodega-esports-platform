import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Create async engine
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:qlDXulNVuVOHHxcKYHIYGtCPUWSJLMkz@switchback.proxy.rlwy.net:30173/railway")
# Convert to asyncpg URL
ASYNC_DB_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
engine = create_async_engine(ASYNC_DB_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def check_tables():
    async with engine.connect() as conn:
        # List all tables
        result = await conn.execute(
            text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            """)
        )
        tables = [row[0] for row in result]
        print("\nTables in database:")
        for table in tables:
            print(f"- {table}")
        
        # Check if alembic_version table exists
        result = await conn.execute(
            text("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'alembic_version'
            )
            """)
        )
        has_alembic_version = result.scalar()
        print(f"\nHas alembic_version table: {has_alembic_version}")
        
        if has_alembic_version:
            # Check current version
            result = await conn.execute(text("SELECT version_num FROM alembic_version"))
            version = result.scalar()
            print(f"Current migration version: {version}")

if __name__ == "__main__":
    asyncio.run(check_tables())
