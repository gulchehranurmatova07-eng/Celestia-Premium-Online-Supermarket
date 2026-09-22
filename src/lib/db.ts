import { PrismaClient } from "@/generated/prisma/client";
import path from "node:path";

// SQLite `file:` URLs in DATABASE_URL are relative to prisma/schema.prisma
// when resolved by the Prisma CLI, but relative to process.cwd() at runtime.
// Re-anchor relative paths to the prisma/ directory so both agree.
function resolveDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (raw?.startsWith("file:")) {
    const rel = raw.slice("file:".length);
    if (!path.isAbsolute(rel)) {
      return `file:${path.join(process.cwd(), "prisma", rel)}`;
    }
  }
  return raw;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: resolveDatabaseUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
