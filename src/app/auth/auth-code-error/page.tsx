import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error",
  robots: { index: false },
};

export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">
          There was a problem signing you in. This could be due to an expired or invalid
          authentication link.
        </p>
        {error && (
          <p className="text-xs text-muted-foreground/60 mb-4 font-mono break-all">{error}</p>
        )}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
