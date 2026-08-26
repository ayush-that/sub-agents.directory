import { rules } from "@/data/rules";
import contentMap from "@/data/rules/generated-content.json";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return rules.map((rule) => ({
    slug: rule.slug,
  }));
}

type Params = Promise<{ slug: string }>;

export async function GET(_: Request, segmentData: { params: Params }) {
  const { slug } = await segmentData.params;

  if (!slug) {
    return new Response(JSON.stringify({ error: "No slug provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rule = rules.find((r) => r.slug === slug);

  if (!rule) {
    return new Response(JSON.stringify({ error: "Rule not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const content = (contentMap as Record<string, string>)[slug] || rule.content;

  return new Response(JSON.stringify({ data: { ...rule, content } }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=86400",
      "CDN-Cache-Control": "public, s-maxage=86400",
    },
  });
}
