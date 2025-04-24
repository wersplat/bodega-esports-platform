import sys
from pathlib import Path
from sqlalchemy.sql import text

# Dynamically add the backend directory to the Python path
backend_path = Path(__file__).resolve().parents[1]
sys.path.append(str(backend_path))

from app.database import engine

# Test the database connection

def test_supabase_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Supabase database connection successful:", result.scalar())
    except Exception as e:
        print("Supabase database connection failed:", e)


if __name__ == "__main__":
    test_supabase_connection()