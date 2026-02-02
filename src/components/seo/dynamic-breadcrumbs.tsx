/**
 * DynamicBreadcrumbs Component
 * Renders breadcrumb navigation with JSON-LD schema
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { createBreadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/schema-factory";
import { JsonLdScript } from "./json-ld-script";
import { cn } from "@/lib/utils";

interface DynamicBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function DynamicBreadcrumbs({ items, className }: DynamicBreadcrumbsProps) {
  const schema = createBreadcrumbSchema(items);

  return (
    <>
      <JsonLdScript data={schema} />
      <nav
        aria-label="Breadcrumb"
        className={cn("flex items-center text-sm text-muted-foreground mb-4", className)}
      >
        <ol className="flex items-center gap-1 flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <li key={item.url} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-foreground font-medium truncate max-w-[200px]"
                  >
                    {isFirst ? <Home className="h-3.5 w-3.5" /> : item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-foreground transition-colors truncate max-w-[150px]"
                  >
                    {isFirst ? <Home className="h-3.5 w-3.5" /> : item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Generate breadcrumbs for rule pages
 */
export function getRuleBreadcrumbs(rule: {
  title: string;
  slug: string;
  tags?: string[];
}): BreadcrumbItem[] {
  const category = rule.tags?.[0] || "Agents";
  const categorySlug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return [
    { name: "Home", url: "https://sub-agents.directory" },
    { name: "Agents", url: "https://sub-agents.directory/agents" },
    { name: category, url: `https://sub-agents.directory/agents/${categorySlug}` },
    { name: rule.title, url: `https://sub-agents.directory/${rule.slug}` },
  ];
}

/**
 * Generate breadcrumbs for category pages
 */
export function getCategoryBreadcrumbs(category: { name: string; slug: string }): BreadcrumbItem[] {
  return [
    { name: "Home", url: "https://sub-agents.directory" },
    { name: "Agents", url: "https://sub-agents.directory/agents" },
    { name: category.name, url: `https://sub-agents.directory/agents/${category.slug}` },
  ];
}

/**
 * Generate breadcrumbs for tool pages
 */
export function getToolBreadcrumbs(tool: { name: string; slug: string }): BreadcrumbItem[] {
  return [
    { name: "Home", url: "https://sub-agents.directory" },
    { name: "Agents", url: "https://sub-agents.directory/agents" },
    { name: "Tools", url: "https://sub-agents.directory/agents/tools" },
    { name: tool.name, url: `https://sub-agents.directory/agents/tools/${tool.slug}` },
  ];
}

/**
 * Generate breadcrumbs for comparison pages
 */
export function getComparisonBreadcrumbs(rule1: string, rule2: string): BreadcrumbItem[] {
  return [
    { name: "Home", url: "https://sub-agents.directory" },
    { name: "Agents", url: "https://sub-agents.directory/agents" },
    { name: "Compare", url: "https://sub-agents.directory/agents/compare" },
    {
      name: `${rule1} vs ${rule2}`,
      url: `https://sub-agents.directory/agents/compare/${rule1.toLowerCase().replace(/\s+/g, "-")}-vs-${rule2.toLowerCase().replace(/\s+/g, "-")}`,
    },
  ];
}

/**
 * Generate breadcrumbs for use case pages
 */
export function getUseCaseBreadcrumbs(useCase: { name: string; slug: string }): BreadcrumbItem[] {
  return [
    { name: "Home", url: "https://sub-agents.directory" },
    { name: "Agents", url: "https://sub-agents.directory/agents" },
    { name: "Use Cases", url: "https://sub-agents.directory/agents/for" },
    { name: useCase.name, url: `https://sub-agents.directory/agents/for/${useCase.slug}` },
  ];
}

/**
 * Generate breadcrumbs for MCP pages
 */
export function getMcpBreadcrumbs(mcp: { name: string; slug: string }): BreadcrumbItem[] {
  return [
    { name: "Home", url: "https://sub-agents.directory" },
    { name: "MCP Servers", url: "https://sub-agents.directory/mcp" },
    { name: mcp.name, url: `https://sub-agents.directory/mcp/${mcp.slug}` },
  ];
}
