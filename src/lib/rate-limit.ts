import { getPrisma } from "@/lib/prisma";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly resetTime: number,
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

interface RateLimitResult {
  success: boolean;
  reset: number;
  remaining: number;
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = new Date(now - RATE_LIMIT_WINDOW_MS);

  const requests = await getPrisma().generateRateLimit.findMany({
    where: {
      userId,
      createdAt: { gte: windowStart },
    },
    orderBy: { createdAt: "desc" },
  });

  const requestCount = requests.length;
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - requestCount);

  if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
    const oldestRequest = requests[requests.length - 1];
    const resetTime = oldestRequest
      ? oldestRequest.createdAt.getTime() + RATE_LIMIT_WINDOW_MS
      : now + RATE_LIMIT_WINDOW_MS;

    return { success: false, reset: resetTime, remaining: 0 };
  }

  await getPrisma().generateRateLimit.create({
    data: {
      userId,
      createdAt: new Date(now),
    },
  });

  return { success: true, reset: now + RATE_LIMIT_WINDOW_MS, remaining: remaining - 1 };
}
