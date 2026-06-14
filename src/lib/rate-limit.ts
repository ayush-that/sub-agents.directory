import { supabaseAdmin } from "@/lib/supabase-rest";

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
  const windowStart = new Date(now - RATE_LIMIT_WINDOW_MS).toISOString();

  const db = supabaseAdmin();

  const { data: requests, error: selectError } = await db
    .from("generate_rate_limits")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", windowStart)
    .order("created_at", { ascending: false });

  // Fail closed: a DB read error must not be treated as "no requests yet",
  // which would let the caller bypass the limit.
  if (selectError) {
    throw selectError;
  }

  const rows = requests ?? [];
  const requestCount = rows.length;
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - requestCount);

  if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
    const oldestRequest = rows[rows.length - 1];
    const resetTime = oldestRequest
      ? new Date(oldestRequest.created_at as string).getTime() + RATE_LIMIT_WINDOW_MS
      : now + RATE_LIMIT_WINDOW_MS;

    return { success: false, reset: resetTime, remaining: 0 };
  }

  // The Supabase JS client returns { error } instead of throwing. If the
  // attempt cannot be recorded, fail closed rather than silently granting it,
  // otherwise a flaky write lets the user exceed MAX_REQUESTS_PER_WINDOW.
  const { error: insertError } = await db.from("generate_rate_limits").insert({
    user_id: userId,
    created_at: new Date(now).toISOString(),
  });

  if (insertError) {
    throw insertError;
  }

  return { success: true, reset: now + RATE_LIMIT_WINDOW_MS, remaining: remaining - 1 };
}
