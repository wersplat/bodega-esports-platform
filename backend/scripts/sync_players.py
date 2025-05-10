from sqlalchemy import create_engine, MetaData, Table, select
from supabase import create_client, Client
import json
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

# --- Helper to get all meta for a post ---
def get_post_meta(conn, post_id):
    result = conn.execute(
        select(wp_postmeta.c.meta_key, wp_postmeta.c.meta_value)
        .where(wp_postmeta.c.post_id == post_id)
    ).fetchall()
    return {row[0]: row[1] for row in result}

# --- Fetch sp_players ---
with engine.connect() as conn:
    players = conn.execute(
        select(wp_posts)
        .where(wp_posts.c.post_type == 'sp_player')
        .where(wp_posts.c.post_status == 'publish')
    ).fetchall()

    for player in players:
        meta = get_post_meta(conn, player.id)
        stats = {k: meta[k] for k in meta if k.isupper()}  # grab stat keys like 'PTS', 'AST', etc.
        team_wp_id = int(meta['sp_team'][0]) if 'sp_team' in meta and meta['sp_team'] else None

        # Find team UUID from Supabase via wp_id
        team_id = None
        if team_wp_id:
            res = supabase.table("teams").select("id").eq("wp_id", team_wp_id).execute()
            if res.data:
                team_id = res.data[0]['id']

        # Upsert player into Supabase
        supabase.table("players").upsert({
            "wp_id": player.id,
            "name": player.post_title,
            "team_wp_id": team_wp_id,
            "team_id": team_id,
            "stats": stats,
        }, on_conflict=["wp_id"]).execute()

print("✅ Player sync complete.")
