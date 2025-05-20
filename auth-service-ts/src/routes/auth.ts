import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../database';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import * as discordOAuth from '../oauth/discord';

// Example: POST /auth/register
async function registerHandler(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string; password: string };
  if (!email || !password) {
    return reply.status(400).send({ error: 'Email and password required' });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return reply.status(409).send({ error: 'User already exists' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  return reply.send({ id: user.id, email: user.email });
}

// Example: POST /auth/login
async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string; password: string };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }
  const token = (reply as any).jwtSign({ userId: user.id, email: user.email });
  return reply.send({ token });
}

export default async function authRoutes(server: FastifyInstance) {
  server.post('/register', registerHandler);
  server.post('/login', loginHandler);
  server.get('/me', {
    preValidation: [(server as any).authenticate]
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    if (!user) return reply.status(401).send({ error: 'Unauthorized' });
    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser) return reply.status(404).send({ error: 'User not found' });
    reply.send({ id: dbUser.id, email: dbUser.email, discordId: dbUser.discordId });
  });

  // Discord OAuth login: redirects to Discord
  server.get('/discord/login', async (request, reply) => {
    const url = discordOAuth.getDiscordOAuthUrl();
    reply.redirect(url);
  });

  // Discord OAuth callback
  server.get('/discord/callback', async (request, reply) => {
    const { code } = request.query as { code?: string };
    if (!code) return reply.status(400).send({ error: 'No code provided' });
    try {
      const token = await discordOAuth.exchangeDiscordCodeForToken(code);
      const discordUser = await discordOAuth.fetchDiscordUser(token.access_token);
      // Upsert user with discordId
      let user = await prisma.user.findUnique({ where: { discordId: discordUser.id } });
      if (!user) {
        user = await prisma.user.create({ data: { email: discordUser.email, password: '', discordId: discordUser.id } });
      }
      const jwt = (reply as any).jwtSign({ userId: user.id, email: user.email, discordId: user.discordId });
      // Optionally set cookie here
      reply.send({ token: jwt, user: { id: user.id, email: user.email, discordId: user.discordId } });
    } catch (err) {
      reply.status(500).send({ error: 'Discord OAuth failed', details: err });
    }
  });

  // Logout (client should remove token)
  server.post('/logout', async (request, reply) => {
    // For JWT, logout is client-side (remove token)
    reply.send({ ok: true });
  });
}
