import httpx
from app.config import settings

async def get_discord_token(code: str):
    async with httpx.AsyncClient() as client:
        response = await client.post("https://discord.com/api/oauth2/token", data={
            "client_id": settings.DISCORD_CLIENT_ID,
            "client_secret": settings.DISCORD_CLIENT_SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": settings.DISCORD_REDIRECT_URI
        }, headers={"Content-Type": "application/x-www-form-urlencoded"})
        return response.json()

async def get_discord_user(token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get("https://discord.com/api/users/@me",
                                    headers={"Authorization": f"Bearer {token}"})
        return response.json()