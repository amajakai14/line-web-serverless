import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

import { env } from "../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export const redis = global.redis || new Redis(env.REDIS_URL);

if (env.NODE_ENV !== "production") {
  global.redis = redis;
}
