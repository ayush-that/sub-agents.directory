import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { rules } from "@/data/rules";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return rules.map((rule) => ({
    slug: rule.slug,
  }));
}

function loadFullRule(slug: string) {
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
    return NextResponse.json({ error: "No slug provided" }, { status: 400 });
  }

  const rule = rules.find((r) => r.slug === slug);

  if (!rule) {
    return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  }

  const content = loadFullRule(slug) || rule.content;

  return new Response(JSON.stringify({ data: { ...rule, content } }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=86400",
      "CDN-Cache-Control": "public, s-maxage=86400",
    },
  });
}
