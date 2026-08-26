const SAFE_ORIGIN = "https://local.invalid";

// Only allow same-origin, path-relative redirects. Anything else (absolute
// URLs, protocol-relative "//host", "\host", or "@host" that would parse as
// userinfo when appended to our own origin) is an open-redirect vector.
export function getSafeRedirectPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/")) {
    return "/";
  }

  try {
    const parsed = new URL(value, SAFE_ORIGIN);
    if (parsed.origin !== SAFE_ORIGIN) {
      return "/";
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}

export function createAuthCallbackUrl(origin: string, next: string | null | undefined): string {
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", getSafeRedirectPath(next));
  return callbackUrl.toString();
}
