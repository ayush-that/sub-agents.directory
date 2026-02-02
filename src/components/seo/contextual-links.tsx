/**
 * ContextualLinks Component
 * Intelligent internal linking for hub-and-spoke SEO architecture
 */

import Link from "next/link";
import { ArrowRight, Layers, Wrench, GitCompare, Target } from "lucide-react";
import type { LinkSuggestion } from "@/lib/seo/internal-links";
import { cn } from "@/lib/utils";

interface ContextualLinksProps {
  related?: LinkSuggestion[];
  categories?: LinkSuggestion[];
  tools?: LinkSuggestion[];
  useCases?: LinkSuggestion[];
  comparisons?: LinkSuggestion[];
  className?: string;
}

export function ContextualLinks({
  related = [],
  categories = [],
  tools = [],
  useCases = [],
  comparisons = [],
  className,
}: ContextualLinksProps) {
  const hasLinks =
    related.length > 0 ||
    categories.length > 0 ||
    tools.length > 0 ||
    useCases.length > 0 ||
    comparisons.length > 0;

  if (!hasLinks) return null;

  return (
    <aside className={cn("space-y-8 py-8 border-t border-border/40", className)}>
      {related.length > 0 && (
        <LinkSection
          title="Related Sub-Agents"
          icon={<Layers className="h-4 w-4" />}
          links={related}
        />
      )}

      {categories.length > 0 && (
        <LinkSection
          title="Explore Categories"
          icon={<Layers className="h-4 w-4" />}
          links={categories}
        />
      )}

      {tools.length > 0 && (
        <LinkSection
          title="Browse by Tool"
          icon={<Wrench className="h-4 w-4" />}
          links={tools}
        />
      )}

      {useCases.length > 0 && (
        <LinkSection
          title="Use Cases"
          icon={<Target className="h-4 w-4" />}
          links={useCases}
        />
      )}

      {comparisons.length > 0 && (
        <LinkSection
          title="Compare Agents"
          icon={<GitCompare className="h-4 w-4" />}
          links={comparisons}
        />
      )}
    </aside>
  );
}

interface LinkSectionProps {
  title: string;
  icon: React.ReactNode;
  links: LinkSuggestion[];
}

function LinkSection({ title, icon, links }: LinkSectionProps) {
  return (
    <section>
      <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
        {icon}
        {title}
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map((link) => (
          <li key={link.url}>
            <Link
              href={link.url}
              className="group flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors"
            >
              <span className="flex-1 text-sm truncate">{link.anchor}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Compact link list for sidebar/footer
 */
interface CompactLinksProps {
  title: string;
  links: LinkSuggestion[];
  className?: string;
}

export function CompactLinks({ title, links, className }: CompactLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </h4>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.url}>
            <Link
              href={link.url}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.anchor}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Hub navigation for main pages
 */
interface HubNavigationProps {
  currentPath?: string;
  className?: string;
}

export function HubNavigation({ currentPath, className }: HubNavigationProps) {
  const hubs = [
    { name: "All Agents", url: "/agents", description: "Browse all sub-agents" },
    { name: "Categories", url: "/agents", description: "By category" },
    { name: "MCP Servers", url: "/mcp", description: "Protocol servers" },
    { name: "Learn", url: "/learn", description: "Tutorials & guides" },
  ];

  return (
    <nav className={cn("flex flex-wrap gap-2", className)}>
      {hubs.map((hub) => (
        <Link
          key={hub.url}
          href={hub.url}
          className={cn(
            "px-3 py-1.5 text-sm rounded-full border transition-colors",
            currentPath === hub.url
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border hover:bg-accent"
          )}
        >
          {hub.name}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Category quick links for landing pages
 */
interface CategoryQuickLinksProps {
  categories: Array<{ name: string; slug: string; count: number }>;
  currentSlug?: string;
  className?: string;
}

export function CategoryQuickLinks({
  categories,
  currentSlug,
  className,
}: CategoryQuickLinksProps) {
  return (
    <nav className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/agents/${cat.slug}`}
          className={cn(
            "px-3 py-1.5 text-sm rounded-full border transition-colors",
            currentSlug === cat.slug
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border hover:bg-accent"
          )}
        >
          {cat.name}
          <span className="ml-1.5 text-xs text-muted-foreground">({cat.count})</span>
        </Link>
      ))}
    </nav>
  );
}
