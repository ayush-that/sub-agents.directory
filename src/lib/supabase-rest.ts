import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const options = {
  auth: { persistSession: false, autoRefreshToken: false },
} as const;

// Anon-key client for reading public data (members, profiles, generations).
// Runs over HTTP fetch, so it works on the Cloudflare Workers runtime where
// Prisma's wasm query engine cannot (Workers disallow runtime wasm compilation).
export function supabaseRead(): SupabaseClient {
  return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, options);
}

// Service-role client for privileged server-side writes (user/generation
// creation, rate limiting). Bypasses RLS, matching the old direct-Postgres
// access. Never import this into client components.
export function supabaseAdmin(): SupabaseClient {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, key, options);
}
