/**
 * Rule and Section Type Definitions
 * Shared types for the rules data system
 */

/**
 * Individual rule/sub-agent prompt
 */
export interface Rule {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  libs: string[];
  content: string;
}

/**
 * Section grouping rules by category
 */
export interface Section {
  tag: string;
  rules: Rule[];
  slug: string;
}

/**
 * Lightweight rule index for fast lookups
 * Used during static generation to avoid loading full content
 */
export interface RuleIndex {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  tools: string[];
  description?: string;
}

/**
 * Category data for programmatic pages
 */
export interface Category {
  slug: string;
  name: string;
  description: string;
  seoDescription: string;
  count: number;
  keywords: string[];
  icon?: string;
}

/**
 * Tool data for tool landing pages
 */
export interface Tool {
  slug: string;
  name: string;
  normalizedName: string;
  count: number;
  rules: RuleIndex[];
}

/**
 * Comparison pair for comparison pages
 */
export interface ComparisonPair {
  slug: string;
  rule1: RuleIndex;
  rule2: RuleIndex;
  category: string;
}

/**
 * Aggregated data for programmatic page generation
 */
export interface AggregatedData {
  rules: RuleIndex[];
  categories: Category[];
  tools: Tool[];
  comparisons: ComparisonPair[];
  totalRules: number;
  totalCategories: number;
  totalTools: number;
  totalComparisons: number;
}

/**
 * Category folder mappings from filesystem
 */
export const CATEGORY_FOLDER_MAPPINGS: Record<string, string> = {
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
} as const;

/**
 * Reverse mapping: category name to folder
 */
export const CATEGORY_NAME_TO_FOLDER: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_FOLDER_MAPPINGS).map(([folder, name]) => [name, folder]),
);
