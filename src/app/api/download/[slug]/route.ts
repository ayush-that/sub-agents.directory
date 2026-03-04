import fs from "fs";
import path from "path";
import { rules } from "@/data/rules";

export const dynamic = "force-static";
export const revalidate = 86400;

const VALID_SLUG_PATTERN = /^[a-z0-9-]+$/;

export async function generateStaticParams() {
  return rules.map((rule) => ({
    slug: rule.slug,
  }));
}

function findMarkdownFile(slug: string): string | null {
  const categoriesDir = path.join(process.cwd(), "content");

  if (!fs.existsSync(categoriesDir)) return null;

  const categoryFolders = fs.readdirSync(categoriesDir);

  for (const folder of categoryFolders) {
    const folderPath = path.join(categoriesDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const filePath = path.join(folderPath, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
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

  const filePath = findMarkdownFile(slug);

  if (!filePath) {
    return new Response("Rule not found", { status: 404 });
  }

  const markdown = fs.readFileSync(filePath, "utf-8");

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
