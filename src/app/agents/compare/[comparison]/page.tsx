/**
 * Comparison Page
 * Programmatic SEO page comparing two sub-agents
 * /agents/compare/[rule1-vs-rule2]
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, GitCompare } from "lucide-react";

import { createComparisonMetadata } from "@/lib/seo/metadata-factory";
import { createComparisonSchema } from "@/lib/seo/schema-factory";
import { REVALIDATION_TIMES } from "@/lib/seo/constants";

import {
  getComparisons,
  getComparison,
  getRuleBySlug,
  getCategories,
} from "@/data/rules";

import {
  JsonLdScript,
  DynamicBreadcrumbs,
  getComparisonBreadcrumbs,
  ContextualLinks,
  FAQSection,
  generateComparisonFAQs,
} from "@/components/seo";
import { Badge } from "@/components/ui/badge";

type Params = Promise<{ comparison: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { comparison: comparisonSlug } = await params;
  const comparison = getComparison(comparisonSlug);

  if (!comparison) {
    return { title: "Comparison Not Found" };
  }

  return createComparisonMetadata({
    rule1: comparison.rule1,
    rule2: comparison.rule2,
  });
}

export async function generateStaticParams() {
  const comparisons = getComparisons();
  return comparisons.map((c) => ({ comparison: c.slug }));
}

export default async function ComparisonPage({ params }: { params: Params }) {
  const { comparison: comparisonSlug } = await params;
  const comparison = getComparison(comparisonSlug);

  if (!comparison) {
    notFound();
  }

  // Get full rule data
  const rule1 = getRuleBySlug(comparison.rule1.slug);
  const rule2 = getRuleBySlug(comparison.rule2.slug);

  if (!rule1 || !rule2) {
    notFound();
  }

  const allCategories = getCategories();
  const breadcrumbs = getComparisonBreadcrumbs(rule1.title, rule2.title);

  // Generate FAQs
  const faqs = generateComparisonFAQs(rule1, rule2);

  // Generate schema
  const comparisonSchema = createComparisonSchema({
    title: `${rule1.title} vs ${rule2.title}: Which Claude Code Agent to Use?`,
    description: `Compare ${rule1.title} and ${rule2.title} Claude Code sub-agents. Find out which is best for your project.`,
    url: `/agents/compare/${comparisonSlug}`,
    item1: { name: rule1.title, url: `/${rule1.slug}` },
    item2: { name: rule2.title, url: `/${rule2.slug}` },
  });

  // Find shared and unique tools
  const tools1 = new Set(rule1.libs);
  const tools2 = new Set(rule2.libs);
  const sharedTools = rule1.libs.filter((t) => tools2.has(t));
  const uniqueTools1 = rule1.libs.filter((t) => !tools2.has(t));
  const uniqueTools2 = rule2.libs.filter((t) => !tools1.has(t));

  // Related categories
  const categoryLinks = allCategories
    .filter((c) => c.name === comparison.category || c.slug === comparison.rule1.categorySlug)
    .slice(0, 3)
    .map((cat) => ({
      url: `/agents/${cat.slug}`,
      anchor: cat.name,
      title: `${cat.name} Sub-Agents`,
      description: cat.description,
      relevanceScore: cat.count,
      linkType: "category" as const,
    }));

  return (
    <>
      <JsonLdScript data={comparisonSchema} />

      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <DynamicBreadcrumbs items={breadcrumbs} className="mb-6" />

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent rounded-lg">
                <GitCompare className="h-6 w-6" />
              </div>
              <Badge variant="secondary">{comparison.category}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {rule1.title} vs {rule2.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              Compare these two Claude Code sub-agents to find the best fit for
              your project. Both are in the {comparison.category} category.
            </p>
          </header>

          {/* Comparison Table */}
          <section className="mb-12">
            <h2 className="sr-only">Comparison Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rule 1 */}
              <div className="border border-border/40 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{rule1.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {rule1.description || "A specialized Claude Code sub-agent."}
                </p>
                <Link
                  href={`/${rule1.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  View Full Prompt
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Rule 2 */}
              <div className="border border-border/40 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">{rule2.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {rule2.description || "A specialized Claude Code sub-agent."}
                </p>
                <Link
                  href={`/${rule2.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  View Full Prompt
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Tools Comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Tool Comparison</h2>

            <div className="space-y-6">
              {/* Shared Tools */}
              {sharedTools.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Shared Tools ({sharedTools.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sharedTools.map((tool) => (
                      <Badge key={tool} variant="outline" className="gap-1">
                        <Check className="h-3 w-3 text-green-500" />
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Unique to Rule 1 */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Only in {rule1.title} ({uniqueTools1.length})
                  </h3>
                  {uniqueTools1.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {uniqueTools1.map((tool) => (
                        <Badge key={tool} variant="secondary">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No unique tools
                    </p>
                  )}
                </div>

                {/* Unique to Rule 2 */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Only in {rule2.title} ({uniqueTools2.length})
                  </h3>
                  {uniqueTools2.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {uniqueTools2.map((tool) => (
                        <Badge key={tool} variant="secondary">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No unique tools
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* When to Use Each */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">When to Use Each</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Use {rule1.title} when:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • You need expertise in{" "}
                    {rule1.libs.slice(0, 3).join(", ") || "its specific domain"}
                  </li>
                  <li>• Your project aligns with {comparison.category}</li>
                  <li>
                    • You prefer{" "}
                    {rule1.libs.length > rule2.libs.length
                      ? "more comprehensive"
                      : "focused"}{" "}
                    tool coverage
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-secondary pl-4">
                <h3 className="font-semibold mb-2">Use {rule2.title} when:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • You need expertise in{" "}
                    {rule2.libs.slice(0, 3).join(", ") || "its specific domain"}
                  </li>
                  <li>• Your project aligns with {comparison.category}</li>
                  <li>
                    • You prefer{" "}
                    {rule2.libs.length > rule1.libs.length
                      ? "more comprehensive"
                      : "focused"}{" "}
                    tool coverage
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <FAQSection faqs={faqs} className="mb-12" />

          {/* Related Links */}
          <ContextualLinks categories={categoryLinks} className="border-t pt-8" />

          {/* Back Links */}
          <div className="mt-8 pt-8 border-t flex flex-wrap gap-6">
            <Link
              href={`/${rule1.slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View {rule1.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${rule2.slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View {rule2.title}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/agents"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              All Sub-Agents
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export const revalidate = REVALIDATION_TIMES.comparison;
