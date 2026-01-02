import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return null;
        },
        setAll() {},
      },
    },
  );
}
