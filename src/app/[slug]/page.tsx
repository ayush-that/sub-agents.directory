import { BreadcrumbJsonLd, RuleJsonLd } from "@/components/json-ld";
import { Menu } from "@/components/menu";
import { RelatedRules } from "@/components/related-rules";
import { RuleCard } from "@/components/rule-card";
import { getRelatedRules, getRuleBySlug, getSections, rules } from "@/data/rules";
import { cleanDescription } from "@/lib/utils";
import type { Metadata } from "next";

const BASE_URL = "https://sub-agents.directory";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const rule = getRuleBySlug(slug);

  const description = rule ? cleanDescription(rule.content) : "";

  return {
    title: `${rule?.title} - Claude Code Rules`,
    description,
    alternates: {
      canonical: `${BASE_URL}/${slug}`,
    },
    openGraph: {
      title: `${rule?.title} - Claude Code Rules`,
      description,
      url: `${BASE_URL}/${slug}`,
      type: "article",
      publishedTime: "2024-01-01T00:00:00Z",
      modifiedTime: new Date().toISOString(),
      authors: ["Sub-Agents Directory"],
      images: [
        {
          url: `${BASE_URL}/cover-image.png`,
          width: 1200,
          height: 630,
          alt: rule?.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${rule?.title} - Claude Code Rules`,
      description,
      images: [`${BASE_URL}/cover-image.png`],
    },
  };
}

export async function generateStaticParams() {
  return rules.map((rule) => ({
    slug: rule.slug,
  }));
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const rule = getRuleBySlug(slug);
  const sections = getSections();
  const relatedRules = getRelatedRules(slug, 4);

  if (!rule) {
    return <div>Rule not found</div>;
  }

  const breadcrumbs = [
    { name: "Home", url: BASE_URL },
    { name: rule.tags?.[0] || "Rules", url: `${BASE_URL}/agents` },
    { name: rule.title, url: `${BASE_URL}/${rule.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <RuleJsonLd rule={rule} />
      <div className="flex w-full h-full">
        <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)] z-40">
          <Menu sections={sections} />
        </div>

        <main className="flex-1 min-w-0 px-4 py-6 pt-16 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full overflow-x-hidden">
          <h1 className="sr-only">{rule.title} - Claude Code Sub-Agent</h1>
          <RuleCard rule={rule} isPage={true} />
          <RelatedRules rules={relatedRules} />
        </main>
      </div>
    </>
  );
}
