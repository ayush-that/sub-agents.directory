import { ensureUserExists } from "@/actions/user";
import { getSafeRedirectPath } from "@/lib/auth-redirect";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Best-effort: a failed user-record upsert must not block authentication.
      try {
        await ensureUserExists();
      } catch (e) {
        console.error("ensureUserExists failed during auth callback", e);
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      const redirectOrigin = isLocalEnv || !forwardedHost ? origin : `https://${forwardedHost}`;

      return NextResponse.redirect(new URL(next, redirectOrigin));
    }

    const msg = error?.message || "unknown_exchange_error";
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(msg)}`);
  }

  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=${encodeURIComponent("no_code_in_url")}`,
  );
}
