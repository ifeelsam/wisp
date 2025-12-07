import { PrismaClient } from "@/.prisma/client/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Create pg pool
const pool = globalForPrisma.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pool = pool;
}

// Prisma 7 requires adapter for direct connections
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter: new PrismaPg(pool),
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

