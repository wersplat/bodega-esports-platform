from sqlalchemy import create_engine, MetaData, Table, select
from supabase import create_client, Client
import os

# --- CONFIG ---
WP_DB_URL = "mysql+pymysql://wp_user:wp_pass@localhost:3306/wordpress"
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE")

# --- Init ---
engine = create_engine(WP_DB_URL)
metadata = MetaData()
metadata.reflect(bind=engine)
wp_posts = Table("wp_posts", metadata, autoload_with=engine)


supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Fetch sp_teams ---
with engine.connect() as conn:
    teams = conn.execute(
        select(wp_posts)
        .where(wp_posts.c.post_type == 'sp_team')
        .where(wp_posts.c.post_status == 'publish')
    ).fetchall()

    for team in teams:
        supabase.table("teams").upsert({
            "wp_id": team.id,
            "name": team.post_title,
        }, on_conflict=["wp_id"]).execute()

print("✅ Team sync complete.")
