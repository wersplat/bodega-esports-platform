import hashlib

def hash_statline(stat: dict) -> str:
    """
    Generate a unique hash from key player stat fields to prevent duplicate entries.
    """
    key = f"{stat['match_id']}-{stat['player_id']}-{stat['points']}-{stat['assists']}-{stat['rebounds']}-{stat['steals']}-{stat['blocks']}-{stat['turnovers']}-{stat['fouls']}"
    return hashlib.sha256(key.encode()).hexdigest()

def hash_submission(data: dict) -> str:
    key = f"{data['match_id']}-{data['submitted_by']}-{data.get('comment', '')}"
    return hashlib.sha256(key.encode()).hexdigest()
