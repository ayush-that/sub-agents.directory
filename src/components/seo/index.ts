/**
 * SEO Components
 * Reusable components for structured data and internal linking
 */

export { JsonLdScript, JsonLdScripts } from "./json-ld-script";

export {
  DynamicBreadcrumbs,
  getRuleBreadcrumbs,
  getCategoryBreadcrumbs,
  getToolBreadcrumbs,
  getComparisonBreadcrumbs,
  getUseCaseBreadcrumbs,
  getMcpBreadcrumbs,
} from "./dynamic-breadcrumbs";

export {
  ContextualLinks,
  CompactLinks,
  HubNavigation,
  CategoryQuickLinks,
} from "./contextual-links";

export {
  FAQSection,
  generateCategoryFAQs,
  generateToolFAQs,
  generateComparisonFAQs,
  generateUseCaseFAQs,
  generateMcpFAQs,
} from "./faq-section";
