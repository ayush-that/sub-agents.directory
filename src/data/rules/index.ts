import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import slugify from "slugify";

// Re-export types
export type {
  Rule,
  Section,
  RuleIndex,
  Category,
  Tool,
  ComparisonPair,
  AggregatedData,
} from "./types";
export { CATEGORY_FOLDER_MAPPINGS, CATEGORY_NAME_TO_FOLDER } from "./types";

// Re-export aggregation functions
export {
  generateCategories,
  generateTools,
  generateComparisons,
  generateAggregatedData,
  getCategoryBySlug,
  getToolBySlug,
  getComparisonBySlug,
  createRuleIndex,
} from "./aggregations";

import type { Rule, Section, Category, Tool, ComparisonPair } from "./types";
import { CATEGORY_FOLDER_MAPPINGS } from "./types";
import { generateCategories, generateTools, generateComparisons } from "./aggregations";

// Use the types from types.ts
const categoryMappings = CATEGORY_FOLDER_MAPPINGS;

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function loadRules(): Rule[] {
  const contentDir = path.join(process.cwd(), "content");

  if (!fs.existsSync(contentDir)) {
    return [];
  }

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
      const { data, content } = matter(fileContent);

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
        content: content.trim(),
      });
    }
  }

  return rules;
}

export const rules: Rule[] = loadRules();

export function getSections(): Section[] {
  const categories = Array.from(new Set(rules.flatMap((rule) => rule.tags)));

  return categories
    .map((tag) => ({
      tag,
      rules: rules.filter((rule) => rule.tags.includes(tag)),
      slug: slugify(tag, { lower: true }),
    }))
    .sort((a, b) => b.rules.length - a.rules.length);
}

export function getSectionBySlug(slug: string) {
  return getSections().find((section) => section.slug === slug);
}

export function getRuleBySlug(slug: string) {
  return rules.find((rule) => rule.slug === slug);
}

export function getRelatedRules(slug: string, limit = 4): Rule[] {
  const currentRule = getRuleBySlug(slug);
  if (!currentRule) return [];

  const currentTags = currentRule.tags;
  const currentLibs = new Set(currentRule.libs);

  return rules
    .filter((rule) => rule.slug !== slug)
    .map((rule) => {
      let score = 0;
      if (rule.tags.some((tag) => currentTags.includes(tag))) {
        score += 10;
      }
      const sharedLibs = rule.libs.filter((lib) => currentLibs.has(lib)).length;
      score += sharedLibs * 2;
      return { rule, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ rule }) => rule);
}

// ============================================================================
// Programmatic Page Helpers
// Functions for generating category, tool, and comparison pages at scale
// ============================================================================

// Lazy-loaded cache for aggregated data
let _categories: Category[] | null = null;
let _tools: Tool[] | null = null;
let _comparisons: ComparisonPair[] | null = null;

/**
 * Get all categories (lazy-loaded and cached)
 */
export function getCategories(): Category[] {
  if (!_categories) {
    _categories = generateCategories(rules);
  }
  return _categories;
}

/**
 * Get all tools with 2+ rules (lazy-loaded and cached)
 */
export function getTools(): Tool[] {
  if (!_tools) {
    _tools = generateTools(rules);
  }
  return _tools;
}

/**
 * Get all comparison pairs (lazy-loaded and cached)
 */
export function getComparisons(): ComparisonPair[] {
  if (!_comparisons) {
    _comparisons = generateComparisons(rules);
  }
  return _comparisons;
}

/**
 * Get a category by slug
 */
export function getCategory(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

/**
 * Get a tool by slug
 */
export function getTool(slug: string): Tool | undefined {
  return getTools().find((t) => t.slug === slug);
}

/**
 * Get a comparison by slug
 */
export function getComparison(slug: string): ComparisonPair | undefined {
  return getComparisons().find((c) => c.slug === slug);
}

/**
 * Get rules for a specific category
 */
export function getRulesForCategory(categorySlug: string): Rule[] {
  const category = getCategory(categorySlug);
  if (!category) return [];

  return rules.filter((rule) => {
    const ruleCategory = rule.tags[0];
    return ruleCategory && slugify(ruleCategory, { lower: true }) === categorySlug;
  });
}

/**
 * Get rules for a specific tool
 */
export function getRulesForTool(toolSlug: string): Rule[] {
  const tool = getTool(toolSlug);
  if (!tool) return [];

  return rules.filter((rule) => rule.libs.some((lib) => lib.toLowerCase() === tool.normalizedName));
}

/**
 * Get total counts for sitemap and stats
 */
export function getCounts(): {
  rules: number;
  categories: number;
  tools: number;
  comparisons: number;
} {
  return {
    rules: rules.length,
    categories: getCategories().length,
    tools: getTools().length,
    comparisons: getComparisons().length,
  };
}
