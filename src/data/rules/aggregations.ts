/**
 * Aggregations Module
 * Pre-computed aggregations for programmatic SEO pages
 * Generates categories, tools, and comparison data efficiently
 */

import slugify from "slugify";
import { CATEGORY_META } from "@/lib/seo/constants";
import type { Rule, RuleIndex, Category, Tool, ComparisonPair, AggregatedData } from "./types";

/**
 * Create a URL-safe slug
 */
function createSlug(str: string): string {
  return slugify(str, { lower: true, strict: true });
}

/**
 * Convert rules to lightweight index format
 */
export function createRuleIndex(rules: Rule[]): RuleIndex[] {
  return rules.map((rule) => ({
    slug: rule.slug,
    title: rule.title,
    category: rule.tags[0] || "Uncategorized",
    categorySlug: createSlug(rule.tags[0] || "uncategorized"),
    tools: rule.libs,
    description: rule.description,
  }));
}

/**
 * Generate category aggregations from rules
 */
export function generateCategories(rules: Rule[]): Category[] {
  const categoryMap = new Map<string, Rule[]>();

  // Group rules by category
  for (const rule of rules) {
    const category = rule.tags[0] || "Uncategorized";
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(rule);
  }

  // Convert to Category objects with SEO metadata
  const categories: Category[] = [];

  for (const [name, categoryRules] of categoryMap) {
    const slug = createSlug(name);
    const meta = Object.values(CATEGORY_META).find((c) => c.slug === slug);

    categories.push({
      slug,
      name,
      description: getShortDescription(name, categoryRules.length),
      seoDescription: meta?.description || generateCategoryDescription(name, categoryRules),
      count: categoryRules.length,
      keywords: meta?.keywords || generateCategoryKeywords(name, categoryRules),
      icon: meta?.icon,
    });
  }

  // Sort by count descending
  return categories.sort((a, b) => b.count - a.count);
}

/**
 * Generate short category description
 */
function getShortDescription(name: string, count: number): string {
  return `Browse ${count} ${name} Claude Code sub-agents.`;
}

/**
 * Generate SEO description for category
 */
function generateCategoryDescription(name: string, rules: Rule[]): string {
  const topTools = getTopTools(rules, 3);
  const toolList = topTools.length > 0 ? ` Tools include ${topTools.join(", ")}.` : "";

  return `Discover ${rules.length} expert Claude Code sub-agents for ${name}. Copy-paste ready prompts with best practices.${toolList}`;
}

/**
 * Generate keywords for category
 */
function generateCategoryKeywords(name: string, rules: Rule[]): string[] {
  const keywords = new Set<string>([name, "Claude Code", "sub-agents"]);

  // Add top tools as keywords
  const topTools = getTopTools(rules, 5);
  for (const tool of topTools) {
    keywords.add(tool);
  }

  return Array.from(keywords);
}

/**
 * Get top N most common tools in rules
 */
function getTopTools(rules: Rule[], limit: number): string[] {
  const toolCounts = new Map<string, number>();

  for (const rule of rules) {
    for (const lib of rule.libs) {
      toolCounts.set(lib, (toolCounts.get(lib) || 0) + 1);
    }
  }

  return Array.from(toolCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tool]) => tool);
}

/**
 * Generate tool aggregations from rules
 * Only includes tools with 2+ rules to avoid thin content
 */
export function generateTools(rules: Rule[]): Tool[] {
  const toolMap = new Map<string, { originalName: string; rules: Rule[] }>();

  // Group rules by tool (normalized)
  for (const rule of rules) {
    for (const lib of rule.libs) {
      const normalized = lib.toLowerCase();
      if (!toolMap.has(normalized)) {
        toolMap.set(normalized, { originalName: lib, rules: [] });
      }
      toolMap.get(normalized)!.rules.push(rule);
    }
  }

  // Convert to Tool objects, filtering thin content
  const tools: Tool[] = [];

  for (const [normalized, data] of toolMap) {
    // Skip tools with only 1 rule
    if (data.rules.length < 2) continue;

    const ruleIndex = data.rules.map((rule) => ({
      slug: rule.slug,
      title: rule.title,
      category: rule.tags[0] || "Uncategorized",
      categorySlug: createSlug(rule.tags[0] || "uncategorized"),
      tools: rule.libs,
      description: rule.description,
    }));

    tools.push({
      slug: createSlug(normalized),
      name: data.originalName,
      normalizedName: normalized,
      count: data.rules.length,
      rules: ruleIndex,
    });
  }

  // Sort by count descending
  return tools.sort((a, b) => b.count - a.count);
}

/**
 * Generate comparison pairs from rules
 * Only creates comparisons between similar rules in the same category
 */
export function generateComparisons(rules: Rule[]): ComparisonPair[] {
  const comparisons: ComparisonPair[] = [];
  const seenPairs = new Set<string>();

  // Group rules by category
  const categoryRules = new Map<string, Rule[]>();
  for (const rule of rules) {
    const category = rule.tags[0] || "Uncategorized";
    if (!categoryRules.has(category)) {
      categoryRules.set(category, []);
    }
    categoryRules.get(category)!.push(rule);
  }

  // Generate comparisons within each category
  for (const [category, catRules] of categoryRules) {
    // Skip categories with less than 2 rules
    if (catRules.length < 2) continue;

    for (let i = 0; i < catRules.length; i++) {
      for (let j = i + 1; j < catRules.length; j++) {
        const rule1 = catRules[i];
        const rule2 = catRules[j];

        // Check if rules are comparable
        if (!areSimilarRules(rule1, rule2)) continue;

        // Ensure consistent ordering (alphabetical by slug)
        const [first, second] = [rule1, rule2].sort((a, b) =>
          a.slug.localeCompare(b.slug)
        );

        // Skip if already seen
        const pairKey = `${first.slug}-vs-${second.slug}`;
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        comparisons.push({
          slug: pairKey,
          rule1: {
            slug: first.slug,
            title: first.title,
            category,
            categorySlug: createSlug(category),
            tools: first.libs,
            description: first.description,
          },
          rule2: {
            slug: second.slug,
            title: second.title,
            category,
            categorySlug: createSlug(category),
            tools: second.libs,
            description: second.description,
          },
          category,
        });
      }
    }
  }

  return comparisons;
}

/**
 * Check if two rules are similar enough for comparison
 */
function areSimilarRules(rule1: Rule, rule2: Rule): boolean {
  // Must share at least one tool
  const tools1 = new Set(rule1.libs.map((l) => l.toLowerCase()));
  const sharedTools = rule2.libs.filter((l) => tools1.has(l.toLowerCase())).length;

  if (sharedTools === 0) return false;

  // Check title similarity patterns
  const patterns = [
    /\bpro\b/i,
    /\bspecialist\b/i,
    /\bexpert\b/i,
    /\bdeveloper\b/i,
    /\bengineer\b/i,
    /\barchitect\b/i,
    /\bdesigner\b/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(rule1.title) && pattern.test(rule2.title)) {
      return true;
    }
  }

  // Check for shared significant words in title
  const words1 = new Set(
    rule1.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
  );
  const words2 = rule2.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);

  let sharedWords = 0;
  for (const word of words2) {
    if (words1.has(word)) sharedWords++;
  }

  return sharedWords >= 1;
}

/**
 * Generate all aggregated data at once
 */
export function generateAggregatedData(rules: Rule[]): AggregatedData {
  const ruleIndex = createRuleIndex(rules);
  const categories = generateCategories(rules);
  const tools = generateTools(rules);
  const comparisons = generateComparisons(rules);

  return {
    rules: ruleIndex,
    categories,
    tools,
    comparisons,
    totalRules: rules.length,
    totalCategories: categories.length,
    totalTools: tools.length,
    totalComparisons: comparisons.length,
  };
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(categories: Category[], slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/**
 * Get tool by slug
 */
export function getToolBySlug(tools: Tool[], slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

/**
 * Get comparison by slug
 */
export function getComparisonBySlug(
  comparisons: ComparisonPair[],
  slug: string
): ComparisonPair | undefined {
  return comparisons.find((c) => c.slug === slug);
}
