import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Resources",
  description: "Public data endpoints and machine-readable discovery resources for Sub-Agents Directory.",
  alternates: { canonical: "/developers" },
};

export default function DevelopersPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-24">
      <h1 className="font-fraunces text-4xl">Developer resources</h1>
      <p className="mt-5 leading-7 text-muted-foreground">
        Sub-Agents Directory publishes its curated rules through a read-only public API. These
        endpoints require no account or API key and are intended for browsing, importing, and
        building developer tooling.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-medium">API</h2>
        <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
          <li>
            <code>GET /api</code> returns the complete rule index.
          </li>
          <li>
            <code>GET /api/&lt;slug&gt;</code> returns one rule, including its full prompt content.
          </li>
          <li>
            <code>GET /api/download/&lt;slug&gt;</code> returns a Markdown prompt attachment.
          </li>
          <li>
            <code>GET /api/install/&lt;slug&gt;</code> returns an install script for Claude Code.
          </li>
        </ul>
        <p className="mt-4 text-sm">
          <Link className="underline underline-offset-4" href="/openapi.json">
            View the OpenAPI specification
          </Link>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium">Agent and crawler discovery</h2>
        <ul className="mt-3 space-y-3 text-sm">
          <li>
            <Link className="underline underline-offset-4" href="/llms.txt">
              llms.txt
            </Link>{" "}
            describes the directory and its machine-readable surfaces.
          </li>
          <li>
            <Link className="underline underline-offset-4" href="/sitemap.xml">
              sitemap.xml
            </Link>{" "}
            lists browsable pages and individual prompts.
          </li>
          <li>
            <Link className="underline underline-offset-4" href="/agents">
              Browse the directory
            </Link>{" "}
            or browse the{" "}
            <Link className="underline underline-offset-4" href="/mcp">
              curated MCP server catalog
            </Link>
            .
          </li>
        </ul>
      </section>
    </main>
  );
}
