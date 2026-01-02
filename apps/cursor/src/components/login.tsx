"use client";

import { GithubSignin } from "./github-signin";
import { GoogleSignin } from "./google-signin";

export function Login({ redirectTo }: { redirectTo?: string }) {
  return (
    <div>
      <p className="text-md mt-4">
        Join the growing Cursor <br />
        community and learn together.
      </p>

      <div className="mt-10 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <GithubSignin redirectTo={redirectTo} />
          <GoogleSignin redirectTo={redirectTo} />
        </div>
      </div>
    </div>
  );
}
