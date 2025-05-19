import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

async def check_schema():
    # Database URL - replace with your actual database URL
    DATABASE_URL = "postgresql://postgres:qlDXulNVuVOHHxcKYHIYGtCPUWSJLMkz@switchback.proxy.rlwy.net:30173/railway"
    
    # Convert to asyncpg URL
    ASYNC_DB_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    
    # Create async engine
    engine = create_async_engine(ASYNC_DB_URL, echo=True)
    
    async with engine.connect() as conn:
        # Check if users table exists
        result = await conn.execute(
            text("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            )
            """)
        )
        users_table_exists = result.scalar()
        print(f"Users table exists: {users_table_exists}")
        
        # Check if profiles table still exists
        result = await conn.execute(
            text("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles'
            )
            """)
        )
        profiles_table_exists = result.scalar()
        print(f"Profiles table exists: {profiles_table_exists}")
        
        # Check foreign key constraints
        result = await conn.execute(
            text("""
            SELECT
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND (ccu.table_name = 'users' OR ccu.column_name LIKE '%user_id%')
            ORDER BY tc.table_name, kcu.column_name;
            """)
        )
        
        print("\nForeign key constraints:")
        for row in result:
            print(f"- {row.table_name}.{row.column_name} -> {row.foreign_table_name}.{row.foreign_column_name}")

if __name__ == "__main__":
    asyncio.run(check_schema())
