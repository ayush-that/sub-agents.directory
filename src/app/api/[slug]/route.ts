import { rules } from "@/data/rules";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return rules.map((rule) => ({
    slug: rule.slug,
  }));
}

async function loadFullRule(slug: string) {
  const fs = await import("fs");
  const path = await import("path");
  const matter = (await import("gray-matter")).default;

  const contentDir = path.join(process.cwd(), "content");
  if (!fs.existsSync(contentDir)) return null;

  const categoryFolders = fs.readdirSync(contentDir);
  for (const folder of categoryFolders) {
    const folderPath = path.join(contentDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const filePath = path.join(folderPath, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { content } = matter(fileContent);
      return content.trim();
    }
  }
  return null;
}

type Params = Promise<{ slug: string }>;

export async function GET(_: Request, segmentData: { params: Params }) {
  const { slug } = await segmentData.params;

  if (!slug) {
    return new Response(JSON.stringify({ error: "No slug provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const rule = rules.find((r) => r.slug === slug);

  if (!rule) {
    return new Response(JSON.stringify({ error: "Rule not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  const content = (await loadFullRule(slug)) || rule.content;

  return new Response(JSON.stringify({ data: { ...rule, content } }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=86400",
      "CDN-Cache-Control": "public, s-maxage=86400",
    },
  });
}
