import { createClient } from "@/utils/supabase/server";
import { getPrisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debug - Auth Info",
  robots: { index: false },
};

export default async function DebugPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  let dbUser = null;
  if (user) {
    dbUser = await getPrisma().user.findUnique({
      where: { id: user.id },
      include: { _count: { select: { generations: true, rateLimits: true } } },
    });
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold mb-6">Auth Debug</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Supabase User</h2>
        {userError ? (
          <pre className="bg-red-950/30 text-red-400 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(userError, null, 2)}
          </pre>
        ) : user ? (
          <pre className="bg-muted p-4 rounded text-xs overflow-auto">
            {JSON.stringify(
              {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                aud: user.aud,
                confirmed_at: user.confirmed_at,
                email_confirmed_at: user.email_confirmed_at,
                last_sign_in_at: user.last_sign_in_at,
                created_at: user.created_at,
                updated_at: user.updated_at,
                app_metadata: user.app_metadata,
                user_metadata: user.user_metadata,
                identities: user.identities?.map((i) => ({
                  id: i.id,
                  provider: i.provider,
                  identity_id: i.identity_id,
                  email: i.identity_data?.email,
                  last_sign_in_at: i.last_sign_in_at,
                  created_at: i.created_at,
                  updated_at: i.updated_at,
                })),
              },
              null,
              2,
            )}
          </pre>
        ) : (
          <p className="text-muted-foreground">Not signed in</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Session</h2>
        {sessionError ? (
          <pre className="bg-red-950/30 text-red-400 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(sessionError, null, 2)}
          </pre>
        ) : session ? (
          <pre className="bg-muted p-4 rounded text-xs overflow-auto">
            {JSON.stringify(
              {
                access_token: `${session.access_token.slice(0, 20)}...`,
                refresh_token: `${session.refresh_token.slice(0, 10)}...`,
                expires_at: session.expires_at,
                expires_in: session.expires_in,
                token_type: session.token_type,
              },
              null,
              2,
            )}
          </pre>
        ) : (
          <p className="text-muted-foreground">No session</p>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Database User (Prisma)</h2>
        {dbUser ? (
          <pre className="bg-muted p-4 rounded text-xs overflow-auto">
            {JSON.stringify(dbUser, null, 2)}
          </pre>
        ) : (
          <p className="text-muted-foreground">{user ? "User not found in DB" : "N/A"}</p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Environment</h2>
        <pre className="bg-muted p-4 rounded text-xs overflow-auto">
          {JSON.stringify(
            {
              NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
              NODE_ENV: process.env.NODE_ENV,
            },
            null,
            2,
          )}
        </pre>
      </section>
    </div>
  );
}
