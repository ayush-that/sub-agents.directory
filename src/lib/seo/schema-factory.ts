/**
 * Schema Factory
 * Centralized JSON-LD schema generation for rich snippets
 * Supports Article, FAQ, Breadcrumb, HowTo, CollectionPage, and more
 */

import { SEO_CONFIG, BASE_URL } from "./constants";

/**
 * Schema types supported by this factory
 */
export type SchemaType =
  | "WebSite"
  | "Organization"
  | "BreadcrumbList"
  | "Article"
  | "FAQPage"
  | "HowTo"
  | "CollectionPage"
  | "ItemList"
  | "SoftwareApplication"
  | "VideoObject"
  | "ProfilePage"
  | "CreativeWork"
  | "Product";

/**
 * Base schema structure
 */
interface BaseSchema {
  "@context": "https://schema.org";
  "@type": SchemaType;
}

/**
 * Breadcrumb item structure
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * FAQ item structure
 */
export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * HowTo step structure
 */
export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

/**
 * Video structure
 */
export interface VideoData {
  title: string;
  description: string;
  url: string;
  embedUrl: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  author?: {
    name: string;
    url?: string;
    image?: string;
  };
}

/**
 * Generate WebSite schema
 */
export function createWebSiteSchema(config?: {
  name?: string;
  description?: string;
  searchUrl?: string;
}): BaseSchema & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config?.name || SEO_CONFIG.siteName,
    description: config?.description || SEO_CONFIG.defaultDescription,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: config?.searchUrl || `${BASE_URL}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Organization schema
 */
export function createOrganizationSchema(config?: {
  name?: string;
  description?: string;
  logo?: string;
  sameAs?: string[];
}): BaseSchema & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config?.name || SEO_CONFIG.siteName,
    description: config?.description || SEO_CONFIG.defaultDescription,
    url: BASE_URL,
    logo: config?.logo || `${BASE_URL}/claude-logo.png`,
    sameAs: config?.sameAs || [
      "https://github.com/VoltAgent/awesome-claude-code-subagents",
    ],
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function createBreadcrumbSchema(
  items: BreadcrumbItem[]
): BaseSchema & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate Article schema for rule pages
 */
export function createArticleSchema(config: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string;
  articleSection?: string;
  author?: {
    name: string;
    url?: string;
  };
}): BaseSchema & Record<string, unknown> {
  const fullUrl = config.url.startsWith("http")
    ? config.url
    : `${BASE_URL}${config.url}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: config.headline,
    description: config.description,
    url: fullUrl,
    image: config.image || `${BASE_URL}/cover-image.png`,
    datePublished: config.datePublished || "2024-01-01T00:00:00Z",
    dateModified: config.dateModified || new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: config.author?.name || SEO_CONFIG.siteName,
      url: config.author?.url || BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/claude-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    ...(config.keywords && { keywords: config.keywords }),
    ...(config.articleSection && { articleSection: config.articleSection }),
  };
}

/**
 * Generate FAQPage schema for FAQ sections
 */
export function createFAQSchema(
  faqs: FAQItem[]
): BaseSchema & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate HowTo schema for tutorials
 */
export function createHowToSchema(config: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format
  image?: string;
}): BaseSchema & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: config.name,
    description: config.description,
    ...(config.totalTime && { totalTime: config.totalTime }),
    ...(config.image && { image: config.image }),
    step: config.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
      ...(step.image && { image: step.image }),
    })),
  };
}

/**
 * Generate CollectionPage schema for category pages
 */
export function createCollectionPageSchema(config: {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
  items?: Array<{
    name: string;
    url: string;
    description?: string;
  }>;
}): BaseSchema & Record<string, unknown> {
  const fullUrl = config.url.startsWith("http")
    ? config.url
    : `${BASE_URL}${config.url}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.name,
    description: config.description,
    url: fullUrl,
    numberOfItems: config.numberOfItems,
    ...(config.items && {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: config.items.length,
        itemListElement: config.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          url: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
          ...(item.description && { description: item.description }),
        })),
      },
    }),
  };
}

/**
 * Generate ItemList schema for lists
 */
export function createItemListSchema(config: {
  name: string;
  description?: string;
  items: Array<{
    name: string;
    url: string;
    image?: string;
    description?: string;
  }>;
}): BaseSchema & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.name,
    ...(config.description && { description: config.description }),
    numberOfItems: config.items.length,
    itemListElement: config.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
      ...(item.image && { image: item.image }),
      ...(item.description && { description: item.description }),
    })),
  };
}

/**
 * Generate SoftwareApplication schema for MCP servers
 */
export function createSoftwareAppSchema(config: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  applicationCategory?: string;
  operatingSystem?: string;
}): BaseSchema & Record<string, unknown> {
  const fullUrl = config.url.startsWith("http")
    ? config.url
    : `${BASE_URL}${config.url}`;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.name,
    description: config.description,
    url: fullUrl,
    applicationCategory: config.applicationCategory || "DeveloperApplication",
    operatingSystem: config.operatingSystem || "Cross-platform",
    image: config.logo || `${BASE_URL}/cover-image.png`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: BASE_URL,
    },
  };
}

/**
 * Generate VideoObject schema
 */
export function createVideoSchema(
  video: VideoData
): BaseSchema & Record<string, unknown> {
  const videoId = extractYouTubeId(video.embedUrl);

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl:
      video.thumbnailUrl ||
      (videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : undefined),
    contentUrl: video.url,
    embedUrl: video.embedUrl,
    uploadDate: video.uploadDate || "2024-01-01T00:00:00Z",
    ...(video.author && {
      publisher: {
        "@type": "Person",
        name: video.author.name,
        ...(video.author.url && { url: video.author.url }),
        ...(video.author.image && { image: video.author.image }),
      },
    }),
  };
}

/**
 * Generate VideoObject list schema
 */
export function createVideoListSchema(config: {
  name: string;
  description: string;
  videos: VideoData[];
}): BaseSchema & Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.name,
    description: config.description,
    itemListElement: config.videos.map((video, index) => {
      const videoId = extractYouTubeId(video.embedUrl);
      return {
        "@type": "VideoObject",
        position: index + 1,
        name: video.title,
        description: video.description,
        thumbnailUrl:
          video.thumbnailUrl ||
          (videoId
            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            : undefined),
        contentUrl: video.url.replace("/embed/", "/watch?v="),
        embedUrl: video.embedUrl,
        uploadDate: video.uploadDate || "2024-01-01T00:00:00Z",
        ...(video.author && {
          publisher: {
            "@type": "Person",
            name: video.author.name,
            ...(video.author.image && { image: video.author.image }),
          },
        }),
      };
    }),
  };
}

/**
 * Generate ProfilePage schema for user profiles
 */
export function createProfilePageSchema(config: {
  name: string;
  url: string;
  description?: string;
  image?: string;
}): BaseSchema & Record<string, unknown> {
  const fullUrl = config.url.startsWith("http")
    ? config.url
    : `${BASE_URL}${config.url}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: config.name,
      url: fullUrl,
      ...(config.description && { description: config.description }),
      ...(config.image && { image: config.image }),
    },
  };
}

/**
 * Generate CreativeWork schema for user-generated content
 */
export function createCreativeWorkSchema(config: {
  name: string;
  description: string;
  url: string;
  author?: {
    name: string;
    url?: string;
  };
  dateCreated?: string;
  dateModified?: string;
}): BaseSchema & Record<string, unknown> {
  const fullUrl = config.url.startsWith("http")
    ? config.url
    : `${BASE_URL}${config.url}`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: config.name,
    description: config.description,
    url: fullUrl,
    ...(config.author && {
      author: {
        "@type": "Person",
        name: config.author.name,
        ...(config.author.url && { url: config.author.url }),
      },
    }),
    ...(config.dateCreated && { dateCreated: config.dateCreated }),
    ...(config.dateModified && { dateModified: config.dateModified }),
  };
}

/**
 * Generate comparison schema (uses Article with additional context)
 */
export function createComparisonSchema(config: {
  title: string;
  description: string;
  url: string;
  item1: { name: string; url: string };
  item2: { name: string; url: string };
}): BaseSchema & Record<string, unknown> {
  const fullUrl = config.url.startsWith("http")
    ? config.url
    : `${BASE_URL}${config.url}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: config.title,
    description: config.description,
    url: fullUrl,
    articleSection: "Comparison",
    about: [
      {
        "@type": "SoftwareApplication",
        name: config.item1.name,
        url: config.item1.url.startsWith("http")
          ? config.item1.url
          : `${BASE_URL}${config.item1.url}`,
      },
      {
        "@type": "SoftwareApplication",
        name: config.item2.name,
        url: config.item2.url.startsWith("http")
          ? config.item2.url
          : `${BASE_URL}${config.item2.url}`,
      },
    ],
    author: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/claude-logo.png`,
      },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };
}

/**
 * Helper to extract YouTube video ID
 */
function extractYouTubeId(embedUrl: string): string | null {
  const match = embedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Combine multiple schemas into a graph
 */
export function createSchemaGraph(
  ...schemas: Array<BaseSchema & Record<string, unknown>>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": schemas.map(({ "@context": _ctx, ...rest }) => rest),
  };
}
