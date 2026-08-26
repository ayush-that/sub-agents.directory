/**
 * Individual Rule Page
 * Enhanced with new SEO infrastructure
 * /[rule-slug]
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Menu } from "@/components/menu";
import { RelatedRules } from "@/components/related-rules";
import { RuleCard } from "@/components/rule-card";
import { getRelatedRules, getRuleBySlug, getSections, rules } from "@/data/rules";

import { createRuleMetadata } from "@/lib/seo/metadata-factory";
import { createArticleSchema } from "@/lib/seo/schema-factory";
import { createLinkEngine } from "@/lib/seo/internal-links";
import {
  JsonLdScript,
  DynamicBreadcrumbs,
  getRuleBreadcrumbs,
  ContextualLinks,
} from "@/components/seo";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const rule = getRuleBySlug(slug);

  if (!rule) {
    return { title: "Rule Not Found" };
  }

  return createRuleMetadata(rule);
}

export async function generateStaticParams() {
  return rules.map((rule) => ({
    slug: rule.slug,
  }));
}

export default async function RulePage({ params }: { params: Params }) {
  const { slug } = await params;
  const rule = getRuleBySlug(slug);

  if (!rule) {
    notFound();
  }

  const sections = getSections();
  const relatedRules = getRelatedRules(slug, 4);

  // Generate breadcrumbs
  const breadcrumbs = getRuleBreadcrumbs(rule);

  // Generate Article schema
  const articleSchema = createArticleSchema({
    headline: rule.title,
    description: rule.description || rule.content?.slice(0, 160) || "",
    url: `/${rule.slug}`,
    keywords: [...rule.tags, ...rule.libs].join(", "),
    articleSection: rule.tags[0] || "Claude Code",
  });

  // Get contextual links using the link engine
  const linkEngine = createLinkEngine(rules);
  const contextualLinks = linkEngine.getContextualLinks({
    slug: rule.slug,
    category: rule.tags[0]?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    tools: rule.libs,
    pageType: "rule",
  });

  return (
    <>
      <JsonLdScript data={articleSchema} />

      <div className="flex w-full h-full">
        <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)] z-40">
          <Menu sections={sections} />
        </div>

        <main className="flex-1 min-w-0 px-4 py-6 pt-16 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full overflow-x-hidden">
          {/* Breadcrumbs */}
          <DynamicBreadcrumbs items={breadcrumbs} className="mb-4" />

          {/* Page Title (sr-only for SEO) */}
          <h1 className="sr-only">{rule.title} - Claude Code Sub-Agent</h1>

          {/* Main Content */}
          <RuleCard rule={rule} isPage={true} />

          {/* Related Rules */}
          <RelatedRules rules={relatedRules} />

          {/* Contextual Links */}
          <ContextualLinks
            categories={contextualLinks.categories.slice(0, 4)}
            tools={contextualLinks.tools.slice(0, 4)}
            comparisons={contextualLinks.comparisons.slice(0, 2)}
            useCases={contextualLinks.useCases.slice(0, 3)}
            className="mt-8"
          />
        </main>
      </div>
    </>
  );
}

export const revalidate = 604800; // REVALIDATION_TIMES.rule
