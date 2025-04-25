import sys
from pathlib import Path

# Ensure the backend directory is in the Python path
backend_path = Path(__file__).resolve().parent
sys.path.append(str(backend_path))

from app.database import engine


# Test the database connection

def test_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute("SELECT 1")
            print("Database connection successful:", result.scalar())
    except Exception as e:
        print("Database connection failed:", e)


if __name__ == "__main__":
    test_connection()