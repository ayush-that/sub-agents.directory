/**
 * SEO Library
 * Centralized SEO infrastructure for scalable programmatic pages
 */

// Constants and configuration
export {
  SEO_CONFIG,
  BASE_URL,
  REVALIDATION_TIMES,
  SITEMAP_PRIORITIES,
  CHANGE_FREQUENCIES,
  CATEGORY_META,
  USE_CASES,
  type PageType,
} from "./constants";

// Metadata factory
export {
  createMetadata,
  createRuleMetadata,
  createCategoryMetadata,
  createMcpMetadata,
  createComparisonMetadata,
  createUseCaseMetadata,
  createToolMetadata,
  createUserProfileMetadata,
  createGenerationMetadata,
  getCanonicalUrl,
  getOgImageUrl,
  type MetadataConfig,
} from "./metadata-factory";

// Schema factory
export {
  createWebSiteSchema,
  createOrganizationSchema,
  createBreadcrumbSchema,
  createArticleSchema,
  createFAQSchema,
  createHowToSchema,
  createCollectionPageSchema,
  createItemListSchema,
  createSoftwareAppSchema,
  createVideoSchema,
  createVideoListSchema,
  createProfilePageSchema,
  createCreativeWorkSchema,
  createComparisonSchema,
  createSchemaGraph,
  type SchemaType,
  type BreadcrumbItem,
  type FAQItem,
  type HowToStep,
  type VideoData,
} from "./schema-factory";

// Internal linking engine
export {
  InternalLinkEngine,
  createLinkEngine,
  generateBreadcrumbs,
  type LinkSuggestion,
  type RuleData,
  type CategoryData,
} from "./internal-links";
