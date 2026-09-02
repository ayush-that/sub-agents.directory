import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center -mt-32">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-xl mb-4">Page Not Found</h2>
        <p className="text-[#878787] mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <nav aria-label="Suggested destinations" className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md text-sm"
          >
            Go Home
          </Link>
          <Link
            href="/agents"
            className="px-4 py-2 border border-border rounded-md text-sm hover:bg-secondary"
          >
            Browse Agents
          </Link>
          <Link
            href="/mcp"
            className="px-4 py-2 border border-border rounded-md text-sm hover:bg-secondary"
          >
            Browse MCP servers
          </Link>
          <a
            href="/llms.txt"
            className="px-4 py-2 border border-border rounded-md text-sm hover:bg-secondary"
          >
            Agent index
          </a>
        </nav>
      </div>
    </main>
  );
}
