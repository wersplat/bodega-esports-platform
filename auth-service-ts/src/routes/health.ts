import { FastifyInstance } from 'fastify';

export default async function healthRoutes(server: FastifyInstance) {
  server.get('/', async (_, reply) => {
    reply.send({ status: 'ok' });
  });
}
