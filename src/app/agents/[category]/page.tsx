/**
 * Category Landing Page
 * Programmatic SEO page for each category
 * /agents/[category-slug]
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { createCategoryMetadata } from "@/lib/seo/metadata-factory";
import { createCollectionPageSchema } from "@/lib/seo/schema-factory";
import { REVALIDATION_TIMES } from "@/lib/seo/constants";

import {
  getCategories,
  getCategory,
  getRulesForCategory,
} from "@/data/rules";

import {
  JsonLdScript,
  DynamicBreadcrumbs,
  getCategoryBreadcrumbs,
  ContextualLinks,
  CategoryQuickLinks,
  FAQSection,
  generateCategoryFAQs,
} from "@/components/seo";
import { RuleCard } from "@/components/rule-card";

type Params = Promise<{ category: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return createCategoryMetadata(category);
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const rules = getRulesForCategory(categorySlug);
  const allCategories = getCategories();
  const breadcrumbs = getCategoryBreadcrumbs(category);

  // Get top tools for this category
  const toolCounts = new Map<string, number>();
  for (const rule of rules) {
    for (const lib of rule.libs) {
      toolCounts.set(lib, (toolCounts.get(lib) || 0) + 1);
    }
  }
  const topTools = Array.from(toolCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tool]) => tool);

  // Generate FAQs
  const faqs = generateCategoryFAQs({
    name: category.name,
    count: category.count,
    topTools,
  });

  // Generate schemas
  const collectionSchema = createCollectionPageSchema({
    name: `${category.name} Claude Code Sub-Agents`,
    description: category.seoDescription,
    url: `/agents/${category.slug}`,
    numberOfItems: rules.length,
    items: rules.slice(0, 10).map((rule) => ({
      name: rule.title,
      url: `/${rule.slug}`,
      description: rule.description,
    })),
  });

  // Related categories (exclude current)
  const relatedCategories = allCategories
    .filter((c) => c.slug !== categorySlug)
    .slice(0, 6)
    .map((c) => ({
      url: `/agents/${c.slug}`,
      anchor: c.name,
      title: `${c.name} Sub-Agents`,
      description: c.description,
      relevanceScore: c.count,
      linkType: "category" as const,
    }));

  return (
    <>
      <JsonLdScript data={collectionSchema} />

      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <DynamicBreadcrumbs items={breadcrumbs} className="mb-6" />

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {category.count} {category.name} Claude Code Sub-Agents
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {category.seoDescription}
            </p>
          </header>

          {/* Category Quick Links */}
          <nav className="mb-8">
            <h2 className="sr-only">Browse Categories</h2>
            <CategoryQuickLinks
              categories={allCategories}
              currentSlug={categorySlug}
            />
          </nav>

          {/* Top Tools */}
          {topTools.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground mb-3">
                Popular Tools in {category.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                {topTools.map((tool) => (
                  <Link
                    key={tool}
                    href={`/agents/tools/${tool.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="px-3 py-1 text-sm bg-accent/50 hover:bg-accent rounded-full transition-colors"
                  >
                    {tool}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Rules Grid */}
          <section className="mb-12">
            <h2 className="sr-only">{category.name} Sub-Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rules.map((rule) => (
                <RuleCard key={rule.slug} rule={rule} />
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <FAQSection faqs={faqs} className="mb-12 max-w-3xl" />

          {/* Related Categories */}
          <ContextualLinks
            categories={relatedCategories}
            className="border-t pt-8"
          />

          {/* Back to All Agents */}
          <div className="mt-8 pt-8 border-t">
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

export const revalidate = REVALIDATION_TIMES.category;
