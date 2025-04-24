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
