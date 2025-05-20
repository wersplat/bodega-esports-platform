import { PrismaClient } from '@prisma/client';

// PrismaClient singleton pattern
let prisma: PrismaClient;

declare global {
  // allow global var across reloads in dev
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global._prisma) {
    global._prisma = new PrismaClient();
  }
  prisma = global._prisma;
}

export { prisma };

export async function connectDb() {
  try {
    await prisma.$connect();
    console.log('Connected to database');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}
