import { rules } from "@/data/rules";
import contentMap from "@/data/rules/generated-content.json";

export const dynamic = "force-static";

const VALID_SLUG_PATTERN = /^[a-z0-9-]+$/;

export async function generateStaticParams() {
  return rules.map((rule) => ({
    slug: rule.slug,
  }));
}

type Params = Promise<{ slug: string }>;

export async function GET(_: Request, segmentData: { params: Params }) {
  const { slug } = await segmentData.params;

  if (!slug) {
    return new Response("No slug provided", { status: 400 });
  }

  if (!VALID_SLUG_PATTERN.test(slug)) {
    return new Response("Invalid slug format", { status: 400 });
  }

  const markdown = (contentMap as Record<string, string>)[slug];

  if (!markdown) {
    return new Response("Rule not found", { status: 404 });
  }

  return new Response(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.md"`,
      "Cache-Control": "public, s-maxage=86400",
      "CDN-Cache-Control": "public, s-maxage=86400",
    },
  });
}
