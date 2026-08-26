"use client";

import { createAuthCallbackUrl } from "@/lib/auth-redirect";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";

export function GoogleSignin() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  return (
    <Button
      variant="outline"
      className="border border-border rounded-full"
      onClick={() => {
        supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: createAuthCallbackUrl(window.location.origin, next),
          },
        });
      }}
    >
      <span className="flex items-center gap-2">
        <FcGoogle className="w-4 h-4" />
        Sign in with Google
      </span>
    </Button>
  );
}
