import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// In production on Cloudflare Workers, the HYPERDRIVE_URL env var is injected
// by the Hyperdrive binding for optimized connection pooling.
// In local development, it falls back to DATABASE_URL for direct Neon access.

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.HYPERDRIVE_URL || process.env.DATABASE_URL!;

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
