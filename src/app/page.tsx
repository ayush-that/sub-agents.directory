/**
 * Home Page
 * Enhanced with new SEO infrastructure
 */

import { GlobalSearch } from "@/components/global-search";
import { getCategories, getCounts } from "@/data/rules";
import { createMetadata } from "@/lib/seo/metadata-factory";
import {
  createWebSiteSchema,
  createOrganizationSchema,
  createSchemaGraph,
} from "@/lib/seo/schema-factory";
import { JsonLdScript } from "@/components/seo";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createMetadata({
  type: "home",
  title: "Sub-Agents Directory",
  description:
    "Browse 200+ Claude Code sub-agent prompts and MCP servers. Copy-paste ready prompts for React, Python, TypeScript, Go, and more frameworks.",
  path: "/",
  keywords: [
    "Claude Code",
    "sub-agents",
    "MCP servers",
    "AI prompts",
    "React",
    "Python",
    "TypeScript",
  ],
});

export default function HomePage() {
  const counts = getCounts();
  const categories = getCategories();

  // Combined schema graph for home page
  const schemaGraph = createSchemaGraph(
    createWebSiteSchema({
      description: `Browse ${counts.rules}+ Claude Code sub-agent prompts and MCP servers. Copy-paste ready prompts for React, Python, TypeScript, and more.`,
    }),
    createOrganizationSchema(),
  );

  return (
    <>
      <JsonLdScript data={schemaGraph} />

      <main className="min-h-screen w-full px-4 pt-[10%]">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="sr-only">Sub-Agents Directory - Find Claude Code Sub-Agent Prompts</h1>
          <div className="flex justify-center mb-6">
            <a
              href="https://peerlist.io/shydev69/project/subagentsdirectory"
              target="_blank"
              rel="noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://peerlist.io/api/v1/projects/embed/PRJHOK89D8AEPQBK9IGAPBA8BEMPDO?showUpvote=false&theme=dark"
                alt="sub-agents.directory"
                className="h-[72px] w-auto"
              />
            </a>
          </div>
          <GlobalSearch />

          <section className="mx-auto mt-16 max-w-4xl border-t border-border/60 pt-10">
            <h2 className="font-fraunces text-2xl">Find a prompt for your next task</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Sub-Agents Directory is a browsable collection of {counts.rules} Claude Code prompts
              across {counts.categories} development categories, plus MCP server integrations. Start
              with a category, browse by tool or use case, or search the full directory.
            </p>
            <nav aria-label="Browse the directory" className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link className="underline underline-offset-4" href="/agents">
                Browse all agents
              </Link>
              <Link className="underline underline-offset-4" href="/agents/tools">
                Browse by tool
              </Link>
              <Link className="underline underline-offset-4" href="/agents/for">
                Browse by use case
              </Link>
              <Link className="underline underline-offset-4" href="/mcp">
                Browse MCP servers
              </Link>
            </nav>
            <h3 className="mt-8 text-sm font-medium">Popular categories</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    href={`/agents/${category.slug}`}
                  >
                    {category.name} ({category.count})
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}

export const revalidate = 3600; // REVALIDATION_TIMES.home
