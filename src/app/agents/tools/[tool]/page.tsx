/**
 * Tool Landing Page
 * Programmatic SEO page for each tool
 * /agents/tools/[tool-slug]
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Wrench } from "lucide-react";

import { createToolMetadata } from "@/lib/seo/metadata-factory";
import { createCollectionPageSchema } from "@/lib/seo/schema-factory";
import { REVALIDATION_TIMES } from "@/lib/seo/constants";

import {
  getTools,
  getTool,
  getRulesForTool,
  getCategories,
} from "@/data/rules";

import {
  JsonLdScript,
  DynamicBreadcrumbs,
  getToolBreadcrumbs,
  ContextualLinks,
  FAQSection,
  generateToolFAQs,
} from "@/components/seo";
import { RuleCard } from "@/components/rule-card";

type Params = Promise<{ tool: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tool: toolSlug } = await params;
  const tool = getTool(toolSlug);

  if (!tool) {
    return { title: "Tool Not Found" };
  }

  return createToolMetadata(tool);
}

export async function generateStaticParams() {
  const tools = getTools();
  return tools.map((tool) => ({ tool: tool.slug }));
}

export default async function ToolPage({ params }: { params: Params }) {
  const { tool: toolSlug } = await params;
  const tool = getTool(toolSlug);

  if (!tool) {
    notFound();
  }

  const rules = getRulesForTool(toolSlug);
  const allTools = getTools();
  const allCategories = getCategories();
  const breadcrumbs = getToolBreadcrumbs(tool);

  // Group rules by category
  const rulesByCategory = new Map<string, typeof rules>();
  for (const rule of rules) {
    const category = rule.tags[0] || "Other";
    if (!rulesByCategory.has(category)) {
      rulesByCategory.set(category, []);
    }
    rulesByCategory.get(category)!.push(rule);
  }

  // Generate FAQs
  const faqs = generateToolFAQs({
    name: tool.name,
    count: tool.count,
  });

  // Generate schema
  const collectionSchema = createCollectionPageSchema({
    name: `Claude Code Agents Using ${tool.name}`,
    description: `Discover ${tool.count} Claude Code sub-agents that use ${tool.name}. Find the right prompt for your ${tool.name} project.`,
    url: `/agents/tools/${tool.slug}`,
    numberOfItems: rules.length,
    items: rules.slice(0, 10).map((rule) => ({
      name: rule.title,
      url: `/${rule.slug}`,
      description: rule.description,
    })),
  });

  // Related tools (other tools used with these rules)
  const relatedToolCounts = new Map<string, number>();
  for (const rule of rules) {
    for (const lib of rule.libs) {
      if (lib.toLowerCase() !== tool.normalizedName) {
        relatedToolCounts.set(lib, (relatedToolCounts.get(lib) || 0) + 1);
      }
    }
  }
  const relatedTools = Array.from(relatedToolCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => {
      const toolData = allTools.find(
        (t) => t.normalizedName === name.toLowerCase()
      );
      return toolData
        ? {
            url: `/agents/tools/${toolData.slug}`,
            anchor: toolData.name,
            title: `Agents Using ${toolData.name}`,
            description: `${toolData.count} sub-agents use ${toolData.name}`,
            relevanceScore: count,
            linkType: "tool" as const,
          }
        : null;
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  // Related categories
  const categoryLinks = Array.from(rulesByCategory.keys())
    .slice(0, 4)
    .map((catName) => {
      const cat = allCategories.find((c) => c.name === catName);
      return cat
        ? {
            url: `/agents/${cat.slug}`,
            anchor: cat.name,
            title: `${cat.name} Sub-Agents`,
            description: cat.description,
            relevanceScore: cat.count,
            linkType: "category" as const,
          }
        : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

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
              <h1 className="text-3xl md:text-4xl font-bold">
                Claude Code Agents Using {tool.name}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Discover {tool.count} Claude Code sub-agents that use {tool.name}.
              Find the perfect prompt for your {tool.name} project.
            </p>
          </header>

          {/* Stats */}
          <div className="flex gap-6 mb-8 text-sm">
            <div>
              <span className="text-2xl font-bold">{tool.count}</span>
              <span className="text-muted-foreground ml-2">Sub-Agents</span>
            </div>
            <div>
              <span className="text-2xl font-bold">{rulesByCategory.size}</span>
              <span className="text-muted-foreground ml-2">Categories</span>
            </div>
          </div>

          {/* Rules by Category */}
          <section className="mb-12 space-y-8">
            {Array.from(rulesByCategory.entries()).map(([category, catRules]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {catRules.length} agent{catRules.length !== 1 ? "s" : ""}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catRules.map((rule) => (
                    <RuleCard key={rule.slug} rule={rule} />
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* FAQ Section */}
          <FAQSection faqs={faqs} className="mb-12 max-w-3xl" />

          {/* Related Links */}
          <ContextualLinks
            tools={relatedTools}
            categories={categoryLinks}
            className="border-t pt-8"
          />

          {/* All Tools Link */}
          <div className="mt-8 pt-8 border-t flex flex-wrap gap-4">
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

export const revalidate = REVALIDATION_TIMES.tool;
