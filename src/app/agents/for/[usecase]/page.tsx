/**
 * Use Case Landing Page
 * Programmatic SEO page for each use case
 * /agents/for/[use-case-slug]
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Target } from "lucide-react";

import { createUseCaseMetadata } from "@/lib/seo/metadata-factory";
import { createCollectionPageSchema } from "@/lib/seo/schema-factory";
import { REVALIDATION_TIMES, USE_CASES } from "@/lib/seo/constants";

import {
  rules,
  getCategories,
} from "@/data/rules";

import {
  JsonLdScript,
  DynamicBreadcrumbs,
  getUseCaseBreadcrumbs,
  ContextualLinks,
  FAQSection,
  generateUseCaseFAQs,
} from "@/components/seo";
import { RuleCard } from "@/components/rule-card";

type Params = Promise<{ usecase: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { usecase: usecaseSlug } = await params;
  const useCase = USE_CASES[usecaseSlug];

  if (!useCase) {
    return { title: "Use Case Not Found" };
  }

  return createUseCaseMetadata(useCase);
}

export async function generateStaticParams() {
  return Object.keys(USE_CASES).map((slug) => ({ usecase: slug }));
}

export default async function UseCasePage({ params }: { params: Params }) {
  const { usecase: usecaseSlug } = await params;
  const useCase = USE_CASES[usecaseSlug];

  if (!useCase) {
    notFound();
  }

  const allCategories = getCategories();
  const breadcrumbs = getUseCaseBreadcrumbs(useCase);

  // Find relevant rules based on use case keywords and related categories
  const keywordSet = new Set(useCase.keywords.map((k) => k.toLowerCase()));
  const relatedCategorySlugs = new Set(
    useCase.relatedCategories.map((c) =>
      c.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    )
  );

  // Score rules by relevance to this use case
  const scoredRules = rules
    .map((rule) => {
      let score = 0;

      // Category match
      const ruleCategorySlug = rule.tags[0]
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      if (relatedCategorySlugs.has(ruleCategorySlug)) {
        score += 10;
      }

      // Keyword match in title, description, or tools
      const ruleText = `${rule.title} ${rule.description} ${rule.libs.join(" ")}`.toLowerCase();
      for (const keyword of keywordSet) {
        if (ruleText.includes(keyword)) {
          score += 5;
        }
      }

      // Tool/keyword match
      for (const lib of rule.libs) {
        if (keywordSet.has(lib.toLowerCase())) {
          score += 3;
        }
      }

      return { rule, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  const relevantRules = scoredRules.map(({ rule }) => rule);

  // Generate FAQs
  const faqs = generateUseCaseFAQs({
    name: useCase.name,
    description: useCase.description,
    agentCount: relevantRules.length,
  });

  // Generate schema
  const collectionSchema = createCollectionPageSchema({
    name: useCase.title,
    description: useCase.description,
    url: `/agents/for/${useCase.slug}`,
    numberOfItems: relevantRules.length,
    items: relevantRules.slice(0, 10).map((rule) => ({
      name: rule.title,
      url: `/${rule.slug}`,
      description: rule.description,
    })),
  });

  // Related categories
  const categoryLinks = allCategories
    .filter((c) => relatedCategorySlugs.has(c.slug))
    .map((cat) => ({
      url: `/agents/${cat.slug}`,
      anchor: cat.name,
      title: `${cat.name} Sub-Agents`,
      description: cat.description,
      relevanceScore: cat.count,
      linkType: "category" as const,
    }));

  // Related use cases
  const relatedUseCases = Object.entries(USE_CASES)
    .filter(([slug]) => slug !== usecaseSlug)
    .filter(([, uc]) => {
      // Find use cases with overlapping categories
      const overlap = uc.relatedCategories.some((c) =>
        useCase.relatedCategories.some(
          (rc) => rc.toLowerCase() === c.toLowerCase()
        )
      );
      return overlap;
    })
    .slice(0, 4)
    .map(([slug, uc]) => ({
      url: `/agents/for/${slug}`,
      anchor: uc.name,
      title: uc.title,
      description: uc.description,
      relevanceScore: 1,
      linkType: "use-case" as const,
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent rounded-lg">
                <Target className="h-6 w-6" />
              </div>
              <span className="text-sm text-muted-foreground">Use Case</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {useCase.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {useCase.description}
            </p>
          </header>

          {/* Keywords */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">
              Related Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {useCase.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 text-sm bg-accent/50 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          {/* Relevant Rules */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">
              Recommended Sub-Agents for {useCase.name}
            </h2>
            {relevantRules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relevantRules.map((rule) => (
                  <RuleCard key={rule.slug} rule={rule} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No specific agents found for this use case. Browse our{" "}
                <Link href="/agents" className="text-primary hover:underline">
                  full collection
                </Link>{" "}
                to find suitable agents.
              </p>
            )}
          </section>

          {/* FAQ Section */}
          <FAQSection faqs={faqs} className="mb-12 max-w-3xl" />

          {/* Related Links */}
          <ContextualLinks
            categories={categoryLinks}
            useCases={relatedUseCases}
            className="border-t pt-8"
          />

          {/* All Use Cases Link */}
          <div className="mt-8 pt-8 border-t flex flex-wrap gap-4">
            <Link
              href="/agents/for"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              All Use Cases
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

export const revalidate = REVALIDATION_TIMES["use-case"];
