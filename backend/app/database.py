from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Load environment
load_dotenv()

# Ensure the async driver is used
DATABASE_URL = os.getenv("DATABASE_URL")

# Async engine setup
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True,
)

# Async session factory
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

# Import Base from your models
from app.models.base import Base  # keep your existing Base

# Analytics DB setup (optional)
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
else:
    analytics_engine = None
    AnalyticsSessionLocal = None
    print("Warning: DATABASE_URL not set. Analytics DB will not be available.")

# Dependency for FastAPI
async def get_db():
    async with SessionLocal() as session:
        yield session

async def get_analytics_db():
    if AnalyticsSessionLocal is None:
        raise RuntimeError("Analytics database is not configured.")
    async with AnalyticsSessionLocal() as session:
        yield session

# Supabase client setup
from supabase import create_client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
if SUPABASE_URL and SUPABASE_KEY:
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase_client = None
