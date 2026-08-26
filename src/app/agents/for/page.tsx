/**
 * Use Cases Index Page
 * Hub page listing all use cases
 * /agents/for
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";

import { createMetadata } from "@/lib/seo/metadata-factory";
import { createCollectionPageSchema } from "@/lib/seo/schema-factory";
import { USE_CASES, BASE_URL } from "@/lib/seo/constants";

import { JsonLdScript, DynamicBreadcrumbs } from "@/components/seo";

export const metadata: Metadata = createMetadata({
  type: "generic",
  title: "Claude Code Agents by Use Case",
  description:
    "Find the perfect Claude Code sub-agent for your specific use case. Browse agents for API development, testing, security, and more.",
  path: "/agents/for",
  keywords: ["Claude Code use cases", "development use cases", "AI coding"],
});

export default function UseCasesIndexPage() {
  const useCases = Object.entries(USE_CASES);

  const breadcrumbs = [
    { name: "Home", url: BASE_URL },
    { name: "Agents", url: `${BASE_URL}/agents` },
    { name: "Use Cases", url: `${BASE_URL}/agents/for` },
  ];

  const collectionSchema = createCollectionPageSchema({
    name: "Claude Code Agent Use Cases",
    description:
      "Browse Claude Code sub-agents by use case. Find the perfect prompt for API development, testing, security, and more.",
    url: "/agents/for",
    numberOfItems: useCases.length,
    items: useCases.map(([slug, uc]) => ({
      name: uc.name,
      url: `/agents/for/${slug}`,
      description: uc.description,
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
                <Target className="h-6 w-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Find Agents by Use Case</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Not sure which sub-agent to use? Browse by use case to find the perfect Claude Code
              prompt for your specific development needs.
            </p>
          </header>

          {/* Use Cases Grid */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {useCases.map(([slug, useCase]) => (
                <Link
                  key={slug}
                  href={`/agents/for/${slug}`}
                  className="group p-6 border border-border/40 rounded-lg hover:border-border hover:bg-accent/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {useCase.name}
                    </h2>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{useCase.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {useCase.keywords.slice(0, 4).map((keyword) => (
                      <span key={keyword} className="px-2 py-0.5 text-xs bg-accent/50 rounded-full">
                        {keyword}
                      </span>
                    ))}
                    {useCase.keywords.length > 4 && (
                      <span className="px-2 py-0.5 text-xs text-muted-foreground">
                        +{useCase.keywords.length - 4} more
                      </span>
                    )}
                  </div>
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

export const revalidate = 86400; // REVALIDATION_TIMES["use-case"]
