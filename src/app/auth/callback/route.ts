import { ensureUserExists } from "@/actions/user";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      await ensureUserExists();

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    const msg = error?.message || "unknown_exchange_error";
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(msg)}`);
  }

  return NextResponse.redirect(
    `${origin}/auth/auth-code-error?error=${encodeURIComponent("no_code_in_url")}`,
  );
}
