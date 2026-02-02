/**
 * Comprehensive Sitemap Generation
 * Includes all programmatic pages with proper priorities and frequencies
 * Designed to scale to 100K+ pages
 */

import type { MetadataRoute } from "next";
import slugify from "slugify";

import {
  rules,
  getCategories,
  getTools,
  getComparisons,
} from "@/data/rules";
import {
  BASE_URL,
  USE_CASES,
  SITEMAP_PRIORITIES,
  CHANGE_FREQUENCIES,
} from "@/lib/seo/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const categories = getCategories();
  const tools = getTools();
  const comparisons = getComparisons();
  const useCases = Object.keys(USE_CASES);

  const routes: MetadataRoute.Sitemap = [];

  // ============================================================================
  // Static Pages
  // ============================================================================
  routes.push(
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.home,
      priority: SITEMAP_PRIORITIES.home,
    },
    {
      url: `${BASE_URL}/agents`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.category,
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/learn`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.learn,
      priority: SITEMAP_PRIORITIES.learn,
    },
    {
      url: `${BASE_URL}/mcp`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.mcp,
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.about,
      priority: SITEMAP_PRIORITIES.about,
    },
    {
      url: `${BASE_URL}/advertise`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/generate`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }
  );

  // ============================================================================
  // Hub Pages (Tools, Use Cases indexes)
  // ============================================================================
  routes.push(
    {
      url: `${BASE_URL}/agents/tools`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.tool,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/agents/for`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES["use-case"],
      priority: 0.8,
    }
  );

  // ============================================================================
  // Category Pages
  // ============================================================================
  for (const category of categories) {
    routes.push({
      url: `${BASE_URL}/agents/${category.slug}`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.category,
      priority: SITEMAP_PRIORITIES.category,
    });
  }

  // ============================================================================
  // Individual Rule Pages
  // ============================================================================
  for (const rule of rules) {
    routes.push({
      url: `${BASE_URL}/${rule.slug}`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.rule,
      priority: SITEMAP_PRIORITIES.rule,
    });
  }

  // ============================================================================
  // Tool Pages
  // ============================================================================
  for (const tool of tools) {
    routes.push({
      url: `${BASE_URL}/agents/tools/${tool.slug}`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.tool,
      priority: SITEMAP_PRIORITIES.tool,
    });
  }

  // ============================================================================
  // Use Case Pages
  // ============================================================================
  for (const useCaseSlug of useCases) {
    routes.push({
      url: `${BASE_URL}/agents/for/${useCaseSlug}`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES["use-case"],
      priority: SITEMAP_PRIORITIES["use-case"],
    });
  }

  // ============================================================================
  // Comparison Pages (limit to top 100 to avoid thin content)
  // ============================================================================
  const topComparisons = comparisons.slice(0, 100);
  for (const comparison of topComparisons) {
    routes.push({
      url: `${BASE_URL}/agents/compare/${comparison.slug}`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.comparison,
      priority: SITEMAP_PRIORITIES.comparison,
    });
  }

  // ============================================================================
  // MCP Server Pages
  // ============================================================================
  const mcpData = (await import("@/data/mcp")).default;
  for (const mcp of mcpData) {
    routes.push({
      url: `${BASE_URL}/mcp/${slugify(mcp.name, { lower: true })}`,
      lastModified: now,
      changeFrequency: CHANGE_FREQUENCIES.mcp,
      priority: SITEMAP_PRIORITIES.mcp,
    });
  }

  return routes;
}

// Export for potential sitemap index generation in future
export const dynamic = "force-static";
export const revalidate = 86400; // Regenerate sitemap every 24 hours
