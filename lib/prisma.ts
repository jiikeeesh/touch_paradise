import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function getClient(): PrismaClient {
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  let connectionString = process.env.DATABASE_URL!;
  try {
    // Attempt to load the Cloudflare context specifically during runtime
    const { env } = getCloudflareContext() as any;
    if (env && env.HYPERDRIVE && env.HYPERDRIVE.connectionString) {
      connectionString = env.HYPERDRIVE.connectionString;
    }
  } catch (e) {
    // Falls back to DATABASE_URL in standard Node environment or SSG build
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

// Proxies the client calls so the connection binding is fetched ONLY during the request lifecycle.
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return (getClient() as any)[prop];
  },
});

