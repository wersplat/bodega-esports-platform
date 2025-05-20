import { config } from '../config';

const DISCORD_OAUTH_URL = 'https://discord.com/api/oauth2/authorize';
const DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token';
const DISCORD_USER_URL = 'https://discord.com/api/users/@me';

export function getDiscordOAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: config.discord.clientId,
    redirect_uri: config.discord.redirectUri,
    response_type: 'code',
    scope: 'identify email',
    prompt: 'consent',
  });
  return `${DISCORD_OAUTH_URL}?${params.toString()}`;
}

export async function exchangeDiscordCodeForToken(code: string) {
  const params = new URLSearchParams({
    client_id: config.discord.clientId,
    client_secret: config.discord.clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.discord.redirectUri,
  });
  const resp = await fetch(DISCORD_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  if (!resp.ok) throw new Error('Failed to exchange code for token');
  return await resp.json(); // { access_token, token_type, ... }
}

export async function fetchDiscordUser(accessToken: string) {
  const resp = await fetch(DISCORD_USER_URL, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!resp.ok) throw new Error('Failed to fetch Discord user');
  return await resp.json(); // { id, username, email, ... }
}
