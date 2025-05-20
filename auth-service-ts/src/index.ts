import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import { config } from './config';
import { connectDb } from './database';
import authRoutes from './routes/auth';
import healthRoutes from './routes/health';

const server = Fastify({ logger: true });

server.register(fastifyCors, { 
  origin: true, // Adjust to your frontend origin in production
  credentials: true,
});

server.register(fastifyJwt, {
  secret: config.jwtSecret,
});

// JWT auth decorator
server.decorate('authenticate', async function(request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized', details: err });
  }
});

server.register(authRoutes, { prefix: '/auth' });
server.register(healthRoutes, { prefix: '/health' });

// Error handler
server.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    reply.status(400).send({ error: 'Validation error', details: error.validation });
  } else {
    reply.status(error.statusCode || 500).send({ error: error.message || 'Internal server error' });
  }
});

const start = async () => {
  await connectDb();
  try {
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Auth service running on http://localhost:3001');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
