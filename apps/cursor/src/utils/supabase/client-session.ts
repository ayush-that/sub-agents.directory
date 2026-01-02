/**
 * Checks if the user is authenticated by looking for Supabase cookies
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof document === "undefined") return false; // Check if we're in browser environment

  const cookies = document.cookie.split(";");
  return cookies.some((cookie) => cookie.trim().startsWith("sb-"));
};

/**
 * Gets all Supabase-related cookies
 * @returns Object containing Supabase cookies
 */
export const getSupabaseCookies = (): Record<string, string> => {
  if (typeof document === "undefined") return {}; // Check if we're in browser environment

  const cookies: Record<string, string> = {};
  for (const cookie of document.cookie.split(";")) {
    const [name, value] = cookie.trim().split("=");
    if (name.startsWith("sb-")) {
      cookies[name] = decodeURIComponent(value);
    }
  }

  return cookies;
};
