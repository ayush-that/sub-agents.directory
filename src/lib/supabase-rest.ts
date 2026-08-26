import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const options = {
  auth: { persistSession: false, autoRefreshToken: false },
} as const;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

// Anon-key client for reading public data (members, profiles, generations).
// Runs over HTTP fetch, so it works on the Cloudflare Workers runtime where
// Prisma's wasm query engine cannot (Workers disallow runtime wasm compilation).
export function supabaseRead(): SupabaseClient {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    options,
  );
}

// Service-role client for privileged server-side writes (user/generation
// creation, rate limiting). Bypasses RLS, matching the old direct-Postgres
// access. Never import this into client components.
export function supabaseAdmin(): SupabaseClient {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    options,
  );
}
