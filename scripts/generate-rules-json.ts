import fs from "fs";
import path from "path";
import matter from "gray-matter";
import slugify from "slugify";

const categoryMappings: Record<string, string> = {
  "01-core-development": "Core Development",
  "02-language-specialists": "Language Specialists",
  "03-infrastructure": "Infrastructure",
  "04-quality-security": "Quality & Security",
  "05-data-ai": "Data & AI",
  "06-developer-experience": "Developer Experience",
  "07-specialized-domains": "Specialized Domains",
  "08-business-product": "Business & Product",
  "09-meta-orchestration": "Meta Orchestration",
  "10-research-analysis": "Research & Analysis",
};

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface Rule {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  libs: string[];
}

interface Section {
  tag: string;
  rules: Rule[];
  slug: string;
}

const contentDir = path.join(process.cwd(), "content");
const rules: Rule[] = [];
const categoryFolders = fs.readdirSync(contentDir);

for (const folder of categoryFolders) {
  const folderPath = path.join(contentDir, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;

  const categoryName = categoryMappings[folder] || folder;
  const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".md") && f !== "README.md");

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    let libs: string[] = [];
    if (typeof data.tools === "string") {
      libs = data.tools.split(",").map((t: string) => t.trim());
    } else if (Array.isArray(data.tools)) {
      libs = data.tools;
    }

    const slug = data.name || file.replace(".md", "");

    rules.push({
      title: slugToTitle(slug),
      slug,
      description: data.description || "",
      tags: [categoryName],
      libs,
    });
  }
}

const categories = Array.from(new Set(rules.flatMap((rule) => rule.tags)));
const sections: Section[] = categories
  .map((tag) => ({
    tag,
    rules: rules.filter((rule) => rule.tags.includes(tag)),
    slug: slugify(tag, { lower: true }),
  }))
  .sort((a, b) => b.rules.length - a.rules.length);

const outPath = path.join(process.cwd(), "src", "data", "rules", "generated.json");
fs.writeFileSync(outPath, JSON.stringify({ rules, sections }));
console.log(`Generated ${rules.length} rules, ${sections.length} sections → ${outPath}`);

// Generate full-content map for API routes (slug -> content)
const contentMap: Record<string, string> = {};
for (const folder of categoryFolders) {
  const folderPath = path.join(contentDir, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;

  const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".md") && f !== "README.md");
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const slug = data.name || file.replace(".md", "");
    contentMap[slug] = content.trim();
  }
}

const contentOutPath = path.join(process.cwd(), "src", "data", "rules", "generated-content.json");
fs.writeFileSync(contentOutPath, JSON.stringify(contentMap));
console.log(`Generated content map (${Object.keys(contentMap).length} entries) → ${contentOutPath}`);
