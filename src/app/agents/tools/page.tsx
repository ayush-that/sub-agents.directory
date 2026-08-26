/**
 * Tools Index Page
 * Hub page listing all tools with sub-agents
 * /agents/tools
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";

import { createMetadata } from "@/lib/seo/metadata-factory";
import { createCollectionPageSchema } from "@/lib/seo/schema-factory";
import { BASE_URL } from "@/lib/seo/constants";

import { getTools, getCounts } from "@/data/rules";
import { JsonLdScript, DynamicBreadcrumbs } from "@/components/seo";

export const metadata: Metadata = createMetadata({
  type: "generic",
  title: "Browse Claude Code Agents by Tool",
  description:
    "Explore Claude Code sub-agents organized by the tools they use. Find agents for Read, Write, Edit, Bash, and more.",
  path: "/agents/tools",
  keywords: ["Claude Code tools", "sub-agent tools", "development tools"],
});

export default function ToolsIndexPage() {
  const tools = getTools();
  const counts = getCounts();

  const breadcrumbs = [
    { name: "Home", url: BASE_URL },
    { name: "Agents", url: `${BASE_URL}/agents` },
    { name: "Tools", url: `${BASE_URL}/agents/tools` },
  ];

  const collectionSchema = createCollectionPageSchema({
    name: "Claude Code Agent Tools",
    description:
      "Browse Claude Code sub-agents by the tools they use. Find the right prompt for your development workflow.",
    url: "/agents/tools",
    numberOfItems: tools.length,
    items: tools.slice(0, 20).map((tool) => ({
      name: tool.name,
      url: `/agents/tools/${tool.slug}`,
      description: `${tool.count} sub-agents use ${tool.name}`,
    })),
  });

  return (
    <>
      <JsonLdScript data={collectionSchema} />

      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <DynamicBreadcrumbs items={breadcrumbs} className="mb-6" />

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent rounded-lg">
                <Wrench className="h-6 w-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Browse Agents by Tool</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Explore {tools.length} tools used across {counts.rules} Claude Code sub-agents. Find
              agents that use your preferred tools.
            </p>
          </header>

          {/* Tools Grid */}
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/agents/tools/${tool.slug}`}
                  className="group p-4 border border-border/40 rounded-lg hover:border-border hover:bg-accent/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-medium group-hover:text-primary transition-colors">
                      {tool.name}
                    </h2>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tool.count} agent{tool.count !== 1 ? "s" : ""}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Back Link */}
          <div className="pt-8 border-t">
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to All Sub-Agents
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export const revalidate = 86400; // REVALIDATION_TIMES.tool
