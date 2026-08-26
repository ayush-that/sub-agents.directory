/**
 * Home Page
 * Enhanced with new SEO infrastructure
 */

import { GlobalSearch } from "@/components/global-search";
import { getSections, getCounts } from "@/data/rules";
import { createMetadata } from "@/lib/seo/metadata-factory";
import {
  createWebSiteSchema,
  createOrganizationSchema,
  createSchemaGraph,
} from "@/lib/seo/schema-factory";
import { JsonLdScript } from "@/components/seo";
import type { Metadata } from "next";

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
  const sections = getSections();
  const counts = getCounts();

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
          <GlobalSearch sections={sections} />
        </div>
      </main>
    </>
  );
}

export const revalidate = 3600; // REVALIDATION_TIMES.home
