# test_db.py
from sqlalchemy import text
from app.database import engine

with engine.connect() as conn:
    result = conn.execute(text("SELECT NOW()"))
    print(result.fetchone())
