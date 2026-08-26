/**
 * Comparisons Index Page
 * Hub page listing all agent comparisons
 * /agents/compare
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GitCompare } from "lucide-react";

import { createMetadata } from "@/lib/seo/metadata-factory";
import { createCollectionPageSchema } from "@/lib/seo/schema-factory";
import { BASE_URL } from "@/lib/seo/constants";

import { getComparisons } from "@/data/rules";
import { JsonLdScript, DynamicBreadcrumbs } from "@/components/seo";

export const metadata: Metadata = createMetadata({
  type: "generic",
  title: "Compare Claude Code Agents",
  description:
    "Compare Claude Code sub-agents side by side. See tool overlap and differences to pick the right prompt for your project.",
  path: "/agents/compare",
  keywords: ["Claude Code comparison", "sub-agent comparison", "AI coding agents"],
});

export default function ComparisonsIndexPage() {
  const comparisons = getComparisons();

  const breadcrumbs = [
    { name: "Home", url: BASE_URL },
    { name: "Agents", url: `${BASE_URL}/agents` },
    { name: "Compare", url: `${BASE_URL}/agents/compare` },
  ];

  const collectionSchema = createCollectionPageSchema({
    name: "Claude Code Agent Comparisons",
    description:
      "Compare Claude Code sub-agents side by side to find the best fit for your project.",
    url: "/agents/compare",
    numberOfItems: comparisons.length,
    items: comparisons.slice(0, 20).map((c) => ({
      name: `${c.rule1.title} vs ${c.rule2.title}`,
      url: `/agents/compare/${c.slug}`,
      description: `Compare ${c.rule1.title} and ${c.rule2.title} in the ${c.category} category.`,
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
                <GitCompare className="h-6 w-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Compare Sub-Agents</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              See {comparisons.length} side-by-side comparisons of Claude Code sub-agents to find
              the best fit for your project.
            </p>
          </header>

          {/* Comparisons Grid */}
          <section className="mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisons.map((c) => (
                <Link
                  key={c.slug}
                  href={`/agents/compare/${c.slug}`}
                  className="group p-4 border border-border/40 rounded-lg hover:border-border hover:bg-accent/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-medium group-hover:text-primary transition-colors">
                      {c.rule1.title} vs {c.rule2.title}
                    </h2>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">{c.category}</p>
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

export const revalidate = 604800; // REVALIDATION_TIMES.comparison
