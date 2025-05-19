import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

async def check_alembic_version():
    # Database URL - replace with your actual database URL
    DATABASE_URL = "postgresql://postgres:qlDXulNVuVOHHxcKYHIYGtCPUWSJLMkz@switchback.proxy.rlwy.net:30173/railway"
    
    # Convert to asyncpg URL
    ASYNC_DB_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    
    # Create async engine
    engine = create_async_engine(ASYNC_DB_URL, echo=True)
    
    async with engine.connect() as conn:
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
        exists = result.scalar()
        print(f"Alembic version table exists: {exists}")
        
        if exists:
            # Get current version
            try:
                result = await conn.execute(text("SELECT version_num FROM alembic_version"))
                version = result.scalar()
                print(f"Current version in database: {version}")
            except Exception as e:
                print(f"Error getting version: {e}")
        
        # List all tables for reference
        result = await conn.execute(
            text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
            """)
        )
        print("\nTables in database:")
        for row in result:
            print(f"- {row[0]}")

if __name__ == "__main__":
    asyncio.run(check_alembic_version())
