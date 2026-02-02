/**
 * Internal Linking Engine
 * Intelligent internal linking for hub-and-spoke SEO architecture
 * Ensures proper PageRank distribution and topic clustering
 */

import { BASE_URL, CATEGORY_META, USE_CASES } from "./constants";
import type { BreadcrumbItem } from "./schema-factory";

/**
 * Link suggestion with relevance scoring
 */
export interface LinkSuggestion {
  url: string;
  anchor: string;
  title: string;
  description?: string;
  relevanceScore: number;
  linkType: "related" | "category" | "tool" | "comparison" | "use-case" | "hub";
}

/**
 * Rule data structure for linking calculations
 */
export interface RuleData {
  slug: string;
  title: string;
  description?: string;
  tags: string[];
  libs: string[];
  content?: string;
}

/**
 * Category data for linking
 */
export interface CategoryData {
  slug: string;
  name: string;
  description: string;
  count: number;
}

/**
 * Internal Linking Engine Class
 * Provides intelligent link suggestions based on content relationships
 */
export class InternalLinkEngine {
  private rules: RuleData[];
  private categories: CategoryData[];
  private toolIndex: Map<string, RuleData[]>;
  private categoryIndex: Map<string, RuleData[]>;

  constructor(rules: RuleData[], categories?: CategoryData[]) {
    this.rules = rules;
    this.categories = categories || this.buildCategories();
    this.toolIndex = this.buildToolIndex();
    this.categoryIndex = this.buildCategoryIndex();
  }

  /**
   * Build category data from rules
   */
  private buildCategories(): CategoryData[] {
    const categoryMap = new Map<string, RuleData[]>();

    for (const rule of this.rules) {
      const category = rule.tags[0];
      if (!category) continue;

      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(rule);
    }

    return Array.from(categoryMap.entries()).map(([name, rules]) => {
      const slug = this.slugify(name);
      const meta = Object.values(CATEGORY_META).find((c) => c.slug === slug);

      return {
        slug,
        name,
        description: meta?.description || `Browse ${rules.length} ${name} Claude Code sub-agents.`,
        count: rules.length,
      };
    });
  }

  /**
   * Build tool index for efficient lookup
   */
  private buildToolIndex(): Map<string, RuleData[]> {
    const index = new Map<string, RuleData[]>();

    for (const rule of this.rules) {
      for (const lib of rule.libs) {
        const normalizedLib = lib.toLowerCase();
        if (!index.has(normalizedLib)) {
          index.set(normalizedLib, []);
        }
        index.get(normalizedLib)!.push(rule);
      }
    }

    return index;
  }

  /**
   * Build category index for efficient lookup
   */
  private buildCategoryIndex(): Map<string, RuleData[]> {
    const index = new Map<string, RuleData[]>();

    for (const rule of this.rules) {
      const category = rule.tags[0];
      if (!category) continue;

      const slug = this.slugify(category);
      if (!index.has(slug)) {
        index.set(slug, []);
      }
      index.get(slug)!.push(rule);
    }

    return index;
  }

  /**
   * Get related rules for a given rule
   */
  getRelatedRules(currentSlug: string, limit = 4): LinkSuggestion[] {
    const currentRule = this.rules.find((r) => r.slug === currentSlug);
    if (!currentRule) return [];

    const currentTags = new Set(currentRule.tags);
    const currentLibs = new Set(currentRule.libs.map((l) => l.toLowerCase()));

    const scored = this.rules
      .filter((rule) => rule.slug !== currentSlug)
      .map((rule) => {
        let score = 0;

        // Same category: +10 points
        if (rule.tags.some((tag) => currentTags.has(tag))) {
          score += 10;
        }

        // Shared tools: +3 points per tool
        const sharedLibs = rule.libs.filter((lib) =>
          currentLibs.has(lib.toLowerCase())
        ).length;
        score += sharedLibs * 3;

        // Title similarity bonus
        if (this.hasSimilarTitle(currentRule.title, rule.title)) {
          score += 5;
        }

        return { rule, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map(({ rule, score }) => ({
      url: `/${rule.slug}`,
      anchor: rule.title,
      title: rule.title,
      description: rule.description,
      relevanceScore: score,
      linkType: "related" as const,
    }));
  }

  /**
   * Get category links for hub navigation
   */
  getCategoryLinks(currentCategory?: string, limit = 6): LinkSuggestion[] {
    return this.categories
      .filter((cat) => cat.slug !== currentCategory)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map((cat) => ({
        url: `/agents/${cat.slug}`,
        anchor: cat.name,
        title: `${cat.name} Claude Code Sub-Agents`,
        description: cat.description,
        relevanceScore: cat.count,
        linkType: "category" as const,
      }));
  }

  /**
   * Get tool-based links for a rule
   */
  getToolLinks(currentSlug: string, limit = 4): LinkSuggestion[] {
    const currentRule = this.rules.find((r) => r.slug === currentSlug);
    if (!currentRule) return [];

    const links: LinkSuggestion[] = [];

    for (const lib of currentRule.libs) {
      const normalizedLib = lib.toLowerCase();
      const toolRules = this.toolIndex.get(normalizedLib) || [];

      if (toolRules.length >= 2) {
        links.push({
          url: `/agents/tools/${this.slugify(lib)}`,
          anchor: `All ${lib} Agents`,
          title: `Claude Code Agents Using ${lib}`,
          description: `Discover ${toolRules.length} Claude Code sub-agents that use ${lib}.`,
          relevanceScore: toolRules.length,
          linkType: "tool" as const,
        });
      }
    }

    return links
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  /**
   * Get cross-category links (spoke-to-spoke via hubs)
   */
  getCrossLinks(currentCategory: string, limit = 4): LinkSuggestion[] {
    const currentRules = this.categoryIndex.get(currentCategory) || [];
    if (currentRules.length === 0) return [];

    // Find categories with overlapping tools
    const currentTools = new Set(
      currentRules.flatMap((r) => r.libs.map((l) => l.toLowerCase()))
    );

    const crossCategories = this.categories
      .filter((cat) => cat.slug !== currentCategory)
      .map((cat) => {
        const catRules = this.categoryIndex.get(cat.slug) || [];
        const catTools = new Set(
          catRules.flatMap((r) => r.libs.map((l) => l.toLowerCase()))
        );

        // Count overlapping tools
        let overlap = 0;
        for (const tool of currentTools) {
          if (catTools.has(tool)) overlap++;
        }

        return { category: cat, overlap };
      })
      .filter(({ overlap }) => overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, limit);

    return crossCategories.map(({ category, overlap }) => ({
      url: `/agents/${category.slug}`,
      anchor: category.name,
      title: `${category.name} Claude Code Sub-Agents`,
      description: category.description,
      relevanceScore: overlap,
      linkType: "category" as const,
    }));
  }

  /**
   * Get use case links relevant to a rule or category
   */
  getUseCaseLinks(context: {
    category?: string;
    tools?: string[];
  }, limit = 3): LinkSuggestion[] {
    const links: LinkSuggestion[] = [];

    for (const [slug, useCase] of Object.entries(USE_CASES)) {
      let relevance = 0;

      // Check category match
      if (
        context.category &&
        useCase.relatedCategories.some(
          (rc) => rc === context.category || this.slugify(rc) === context.category
        )
      ) {
        relevance += 5;
      }

      // Check tool/keyword match
      if (context.tools) {
        for (const tool of context.tools) {
          if (
            useCase.keywords.some((kw) =>
              kw.toLowerCase().includes(tool.toLowerCase())
            )
          ) {
            relevance += 2;
          }
        }
      }

      if (relevance > 0) {
        links.push({
          url: `/agents/for/${slug}`,
          anchor: useCase.name,
          title: useCase.title,
          description: useCase.description,
          relevanceScore: relevance,
          linkType: "use-case" as const,
        });
      }
    }

    return links
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  /**
   * Get comparison suggestions for a rule
   */
  getComparisonLinks(currentSlug: string, limit = 2): LinkSuggestion[] {
    const currentRule = this.rules.find((r) => r.slug === currentSlug);
    if (!currentRule) return [];

    // Find similar rules for comparison
    const similar = this.rules
      .filter((rule) => rule.slug !== currentSlug)
      .filter((rule) => {
        // Same category
        const sameCategory = rule.tags.some((t) => currentRule.tags.includes(t));
        // Similar name pattern (e.g., both "Pro" variants or both "Specialist" variants)
        const similarName = this.hasSimilarTitle(currentRule.title, rule.title);
        return sameCategory && similarName;
      })
      .slice(0, limit);

    return similar.map((rule) => {
      const [slug1, slug2] = [currentSlug, rule.slug].sort();
      return {
        url: `/agents/compare/${slug1}-vs-${slug2}`,
        anchor: `Compare with ${rule.title}`,
        title: `${currentRule.title} vs ${rule.title}`,
        description: `Compare ${currentRule.title} and ${rule.title} to find the best Claude Code agent for your needs.`,
        relevanceScore: 1,
        linkType: "comparison" as const,
      };
    });
  }

  /**
   * Get hub links (always include main hubs)
   */
  getHubLinks(): LinkSuggestion[] {
    return [
      {
        url: "/agents",
        anchor: "All Sub-Agents",
        title: "Browse All Claude Code Sub-Agents",
        description: "Explore our complete collection of Claude Code sub-agent prompts.",
        relevanceScore: 100,
        linkType: "hub" as const,
      },
      {
        url: "/mcp",
        anchor: "MCP Servers",
        title: "MCP Servers for Claude Code",
        description: "Extend Claude Code with Model Context Protocol servers.",
        relevanceScore: 90,
        linkType: "hub" as const,
      },
      {
        url: "/learn",
        anchor: "Learn Claude Code",
        title: "Claude Code Tutorials & Guides",
        description: "Learn how to use Claude Code effectively.",
        relevanceScore: 80,
        linkType: "hub" as const,
      },
    ];
  }

  /**
   * Generate breadcrumb trail for any path
   */
  getBreadcrumbs(path: string): BreadcrumbItem[] {
    const segments = path.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", url: BASE_URL }];

    let currentPath = "";

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      const name = this.getBreadcrumbName(segment, segments, i);
      breadcrumbs.push({
        name,
        url: `${BASE_URL}${currentPath}`,
      });
    }

    return breadcrumbs;
  }

  /**
   * Get human-readable name for breadcrumb segment
   */
  private getBreadcrumbName(
    segment: string,
    _allSegments: string[],
    _index: number
  ): string {
    // Hub pages
    if (segment === "agents") return "Sub-Agents";
    if (segment === "mcp") return "MCP Servers";
    if (segment === "learn") return "Learn";
    if (segment === "about") return "About";

    // Programmatic pages
    if (segment === "tools") return "Tools";
    if (segment === "compare") return "Compare";
    if (segment === "for") return "Use Cases";

    // Look up from categories
    const categoryMeta = Object.values(CATEGORY_META).find(
      (c) => c.slug === segment
    );
    if (categoryMeta) return categoryMeta.name;

    // Look up from use cases
    const useCaseMeta = Object.values(USE_CASES).find((u) => u.slug === segment);
    if (useCaseMeta) return useCaseMeta.name;

    // Look up from rules
    const rule = this.rules.find((r) => r.slug === segment);
    if (rule) return rule.title;

    // Default: titleize the segment
    return this.titleize(segment);
  }

  /**
   * Get all contextual links for a page
   */
  getContextualLinks(context: {
    slug?: string;
    category?: string;
    tools?: string[];
    pageType: "rule" | "category" | "tool" | "use-case" | "mcp" | "home";
  }): {
    related: LinkSuggestion[];
    categories: LinkSuggestion[];
    tools: LinkSuggestion[];
    useCases: LinkSuggestion[];
    comparisons: LinkSuggestion[];
    hubs: LinkSuggestion[];
  } {
    const { slug, category, tools, pageType } = context;

    return {
      related: slug ? this.getRelatedRules(slug, 4) : [],
      categories: this.getCategoryLinks(category, 6),
      tools: slug ? this.getToolLinks(slug, 4) : [],
      useCases: this.getUseCaseLinks({ category, tools }, 3),
      comparisons: slug ? this.getComparisonLinks(slug, 2) : [],
      hubs: pageType !== "home" ? this.getHubLinks() : [],
    };
  }

  /**
   * Get all tools with their rule counts
   */
  getAllTools(): Array<{ name: string; slug: string; count: number }> {
    const tools: Array<{ name: string; slug: string; count: number }> = [];

    for (const [normalizedName, rules] of this.toolIndex.entries()) {
      // Skip tools with only 1 rule (thin content)
      if (rules.length < 2) continue;

      // Get the original casing from the first rule
      const originalName = rules[0].libs.find(
        (l) => l.toLowerCase() === normalizedName
      );

      tools.push({
        name: originalName || normalizedName,
        slug: this.slugify(normalizedName),
        count: rules.length,
      });
    }

    return tools.sort((a, b) => b.count - a.count);
  }

  /**
   * Get rules for a specific tool
   */
  getRulesForTool(toolSlug: string): RuleData[] {
    // Find matching tool by slug
    for (const [normalizedName, rules] of this.toolIndex.entries()) {
      if (this.slugify(normalizedName) === toolSlug) {
        return rules;
      }
    }
    return [];
  }

  /**
   * Get rules for a specific category
   */
  getRulesForCategory(categorySlug: string): RuleData[] {
    return this.categoryIndex.get(categorySlug) || [];
  }

  /**
   * Check if two titles are similar (for comparison suggestions)
   */
  private hasSimilarTitle(title1: string, title2: string): boolean {
    const patterns = [
      /\bpro\b/i,
      /\bspecialist\b/i,
      /\bexpert\b/i,
      /\bdeveloper\b/i,
      /\bengineer\b/i,
      /\barchitect\b/i,
    ];

    for (const pattern of patterns) {
      if (pattern.test(title1) && pattern.test(title2)) {
        return true;
      }
    }

    // Check for shared significant words
    const words1 = new Set(
      title1.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
    );
    const words2 = title2.toLowerCase().split(/\s+/).filter((w) => w.length > 3);

    let shared = 0;
    for (const word of words2) {
      if (words1.has(word)) shared++;
    }

    return shared >= 2;
  }

  /**
   * Convert string to URL slug
   */
  private slugify(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  /**
   * Convert slug to title case
   */
  private titleize(str: string): string {
    return str
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

/**
 * Create an InternalLinkEngine instance from rules data
 */
export function createLinkEngine(rules: RuleData[]): InternalLinkEngine {
  return new InternalLinkEngine(rules);
}

/**
 * Generate breadcrumbs without full engine
 */
export function generateBreadcrumbs(path: string, rules: RuleData[] = []): BreadcrumbItem[] {
  const engine = new InternalLinkEngine(rules);
  return engine.getBreadcrumbs(path);
}
