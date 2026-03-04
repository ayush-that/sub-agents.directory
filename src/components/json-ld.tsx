import { cleanDescription } from "@/lib/utils";
import type { Rule } from "@/data/rules/types";

const BASE_URL = "https://sub-agents.directory";

interface WebSiteSchemaProps {
  name?: string;
  description?: string;
}

export function WebSiteJsonLd({ name = "Sub-Agents Directory", description }: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description:
      description ||
      "Browse 200+ Claude Code sub-agent prompts and MCP servers. Copy-paste ready prompts for React, Python, TypeScript, and more.",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sub-Agents Directory",
    description:
      "Browse 200+ Claude Code sub-agent prompts and MCP servers for React, Python, TypeScript, and more.",
    url: BASE_URL,
    logo: `${BASE_URL}/claude-logo.png`,
    sameAs: ["https://github.com/VoltAgent/awesome-claude-code-subagents"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface RuleJsonLdProps {
  rule: Rule;
  datePublished?: string;
  dateModified?: string;
}

export function RuleJsonLd({ rule, datePublished, dateModified }: RuleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: rule.title,
    description: rule.description || cleanDescription(rule.content || "", 160),
    url: `${BASE_URL}/${rule.slug}`,
    image: `${BASE_URL}/cover-image.png`,
    datePublished: datePublished || "2024-01-01T00:00:00Z",
    dateModified: dateModified || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "Sub-Agents Directory",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Sub-Agents Directory",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/claude-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/${rule.slug}`,
    },
    keywords: rule.libs?.join(", ") || rule.tags?.join(", "),
    articleSection: rule.tags?.[0] || "Claude Code",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface McpServerJsonLdProps {
  name: string;
  description: string;
  url: string;
  logo?: string;
}

export function McpServerJsonLd({ name, description, url, logo }: McpServerJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${BASE_URL}/mcp/${url}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    image: logo || `${BASE_URL}/cover-image.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Sub-Agents Directory",
      url: BASE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface Video {
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    image: string;
  };
}

interface VideoListJsonLdProps {
  videos: Video[];
}

export function VideoListJsonLd({ videos }: VideoListJsonLdProps) {
  const extractVideoId = (embedUrl: string): string | null => {
    const match = embedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const videoObjects = videos.map((video, index) => {
    const videoId = extractVideoId(video.url);
    return {
      "@type": "VideoObject",
      position: index + 1,
      name: video.title,
      description: video.description,
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : undefined,
      contentUrl: video.url.replace("/embed/", "/watch?v="),
      embedUrl: video.url,
      uploadDate: "2024-01-01T00:00:00Z",
      publisher: {
        "@type": "Person",
        name: video.author.name,
        image: video.author.image,
      },
    };
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Claude Code Tutorial Videos",
    description: "Learn how to use Claude Code from videos and tutorials",
    itemListElement: videoObjects,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
