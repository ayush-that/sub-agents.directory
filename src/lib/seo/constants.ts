/**
 * SEO Constants and Configuration
 * Centralized constants for consistent SEO across 100K+ pages
 */

export const SEO_CONFIG = {
  siteName: "Sub-Agents Directory",
  siteUrl: "https://sub-agents.directory",
  defaultDescription:
    "Browse 200+ Claude Code sub-agent prompts and MCP servers. Copy-paste ready prompts for React, Python, TypeScript, and more.",
  defaultImage: "/cover-image.png",
  twitterHandle: "@subagents",
  locale: "en_US",
  themeColor: "#000000",
} as const;

export const BASE_URL = SEO_CONFIG.siteUrl;

/**
 * Page type definitions for metadata generation
 */
export type PageType =
  | "home"
  | "rule"
  | "category"
  | "mcp"
  | "mcp-category"
  | "tool"
  | "framework"
  | "comparison"
  | "use-case"
  | "tutorial"
  | "guide"
  | "user-profile"
  | "generation"
  | "learn"
  | "about"
  | "generic";

/**
 * Revalidation times by page type (in seconds)
 * Optimized for content freshness vs build performance
 */
export const REVALIDATION_TIMES: Record<PageType, number | false> = {
  home: 3600, // 1 hour - frequently updated
  rule: 604800, // 7 days - content rarely changes
  category: 86400, // 24 hours
  mcp: 86400, // 24 hours
  "mcp-category": 86400, // 24 hours
  tool: 86400, // 24 hours
  framework: 86400, // 24 hours
  comparison: 604800, // 7 days - generated content
  "use-case": 86400, // 24 hours
  tutorial: 604800, // 7 days
  guide: 604800, // 7 days
  "user-profile": 3600, // 1 hour - user activity
  generation: false, // On-demand only
  learn: 86400, // 24 hours
  about: 2592000, // 30 days - static content
  generic: 86400, // 24 hours default
} as const;

/**
 * Priority settings for sitemap generation
 */
export const SITEMAP_PRIORITIES: Record<PageType, number> = {
  home: 1.0,
  rule: 0.8,
  category: 0.9,
  mcp: 0.7,
  "mcp-category": 0.8,
  tool: 0.7,
  framework: 0.7,
  comparison: 0.6,
  "use-case": 0.8,
  tutorial: 0.7,
  guide: 0.7,
  "user-profile": 0.4,
  generation: 0.5,
  learn: 0.8,
  about: 0.3,
  generic: 0.5,
} as const;

/**
 * Change frequency for sitemap
 */
export const CHANGE_FREQUENCIES: Record<
  PageType,
  "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
> = {
  home: "daily",
  rule: "weekly",
  category: "daily",
  mcp: "weekly",
  "mcp-category": "weekly",
  tool: "weekly",
  framework: "weekly",
  comparison: "monthly",
  "use-case": "weekly",
  tutorial: "monthly",
  guide: "monthly",
  "user-profile": "weekly",
  generation: "monthly",
  learn: "weekly",
  about: "monthly",
  generic: "weekly",
} as const;

/**
 * Category metadata for programmatic pages
 */
export const CATEGORY_META: Record<
  string,
  {
    name: string;
    slug: string;
    description: string;
    keywords: string[];
    icon: string;
  }
> = {
  "core-development": {
    name: "Core Development",
    slug: "core-development",
    description:
      "Essential Claude Code sub-agents for frontend, backend, and full-stack development. Build web applications, APIs, and services with expert AI assistance.",
    keywords: [
      "frontend development",
      "backend development",
      "full-stack",
      "web development",
      "API development",
    ],
    icon: "code",
  },
  "language-specialists": {
    name: "Language Specialists",
    slug: "language-specialists",
    description:
      "Expert Claude Code sub-agents specialized in Python, TypeScript, Rust, Go, Java, and 20+ programming languages. Get language-specific best practices and idiomatic code.",
    keywords: ["Python", "TypeScript", "Rust", "Go", "Java", "programming languages"],
    icon: "languages",
  },
  infrastructure: {
    name: "Infrastructure",
    slug: "infrastructure",
    description:
      "DevOps, cloud infrastructure, and deployment sub-agents for Claude Code. Manage AWS, Docker, Kubernetes, CI/CD pipelines, and infrastructure as code.",
    keywords: ["DevOps", "AWS", "Docker", "Kubernetes", "CI/CD", "infrastructure"],
    icon: "server",
  },
  "quality-security": {
    name: "Quality & Security",
    slug: "quality-security",
    description:
      "Testing, code review, and security-focused Claude Code sub-agents. Ensure code quality, find vulnerabilities, and implement security best practices.",
    keywords: ["testing", "code review", "security", "code quality", "vulnerability scanning"],
    icon: "shield",
  },
  "data-ai": {
    name: "Data & AI",
    slug: "data-ai",
    description:
      "Machine learning, data science, and AI-focused Claude Code sub-agents. Build ML pipelines, analyze data, and integrate AI capabilities.",
    keywords: ["machine learning", "data science", "AI", "data analysis", "ML pipelines"],
    icon: "brain",
  },
  "developer-experience": {
    name: "Developer Experience",
    slug: "developer-experience",
    description:
      "Developer tooling and productivity sub-agents for Claude Code. Improve documentation, manage dependencies, and enhance your development workflow.",
    keywords: ["developer tools", "documentation", "productivity", "DX", "workflow"],
    icon: "tool",
  },
  "specialized-domains": {
    name: "Specialized Domains",
    slug: "specialized-domains",
    description:
      "Domain-specific Claude Code sub-agents for gaming, blockchain, embedded systems, and other specialized areas. Get expert assistance in niche technologies.",
    keywords: ["gaming", "blockchain", "embedded systems", "IoT", "specialized development"],
    icon: "puzzle",
  },
  "business-product": {
    name: "Business & Product",
    slug: "business-product",
    description:
      "Product management, business logic, and analytics sub-agents for Claude Code. Build business applications, implement product features, and analyze metrics.",
    keywords: [
      "product management",
      "business logic",
      "analytics",
      "metrics",
      "business applications",
    ],
    icon: "briefcase",
  },
  "meta-orchestration": {
    name: "Meta Orchestration",
    slug: "meta-orchestration",
    description:
      "Workflow orchestration and multi-agent coordination sub-agents for Claude Code. Manage complex workflows, coordinate multiple agents, and automate processes.",
    keywords: ["orchestration", "workflow", "multi-agent", "automation", "coordination"],
    icon: "workflow",
  },
  "research-analysis": {
    name: "Research & Analysis",
    slug: "research-analysis",
    description:
      "Research, analysis, and investigation sub-agents for Claude Code. Conduct code research, analyze patterns, and generate insights from codebases.",
    keywords: ["code research", "analysis", "investigation", "patterns", "insights"],
    icon: "search",
  },
} as const;

/**
 * Use case definitions for programmatic pages
 */
export const USE_CASES: Record<
  string,
  {
    name: string;
    slug: string;
    title: string;
    description: string;
    keywords: string[];
    relatedCategories: string[];
  }
> = {
  "api-development": {
    name: "API Development",
    slug: "api-development",
    title: "Claude Code Agents for API Development",
    description:
      "Build robust REST and GraphQL APIs with Claude Code sub-agents. Get expert help with endpoint design, authentication, validation, and documentation.",
    keywords: ["REST API", "GraphQL", "API design", "authentication", "endpoints"],
    relatedCategories: ["core-development", "infrastructure"],
  },
  "testing-automation": {
    name: "Testing Automation",
    slug: "testing-automation",
    title: "Claude Code Agents for Test Automation",
    description:
      "Automate testing with Claude Code sub-agents. Write unit tests, integration tests, E2E tests, and implement comprehensive test coverage.",
    keywords: ["unit testing", "integration testing", "E2E testing", "test automation", "coverage"],
    relatedCategories: ["quality-security"],
  },
  "security-audit": {
    name: "Security Audit",
    slug: "security-audit",
    title: "Claude Code Agents for Security Auditing",
    description:
      "Perform security audits with Claude Code sub-agents. Find vulnerabilities, implement security best practices, and ensure compliance.",
    keywords: [
      "security audit",
      "vulnerability scanning",
      "OWASP",
      "compliance",
      "security review",
    ],
    relatedCategories: ["quality-security"],
  },
  "code-review": {
    name: "Code Review",
    slug: "code-review",
    title: "Claude Code Agents for Code Review",
    description:
      "Get thorough code reviews with Claude Code sub-agents. Improve code quality, catch bugs, and enforce best practices.",
    keywords: ["code review", "code quality", "best practices", "bug detection", "code standards"],
    relatedCategories: ["quality-security", "developer-experience"],
  },
  "data-pipeline": {
    name: "Data Pipeline",
    slug: "data-pipeline",
    title: "Claude Code Agents for Data Pipelines",
    description:
      "Build data pipelines with Claude Code sub-agents. ETL processes, data transformation, and data warehouse management.",
    keywords: ["ETL", "data pipeline", "data transformation", "data warehouse", "data engineering"],
    relatedCategories: ["data-ai", "infrastructure"],
  },
  "frontend-development": {
    name: "Frontend Development",
    slug: "frontend-development",
    title: "Claude Code Agents for Frontend Development",
    description:
      "Build modern frontends with Claude Code sub-agents. React, Vue, Angular, and other frameworks with best practices.",
    keywords: ["React", "Vue", "Angular", "frontend", "UI development"],
    relatedCategories: ["core-development", "language-specialists"],
  },
  "mobile-development": {
    name: "Mobile Development",
    slug: "mobile-development",
    title: "Claude Code Agents for Mobile Development",
    description:
      "Develop mobile apps with Claude Code sub-agents. React Native, Flutter, iOS, and Android development assistance.",
    keywords: ["React Native", "Flutter", "iOS", "Android", "mobile development"],
    relatedCategories: ["core-development", "specialized-domains"],
  },
  "database-design": {
    name: "Database Design",
    slug: "database-design",
    title: "Claude Code Agents for Database Design",
    description:
      "Design databases with Claude Code sub-agents. Schema design, query optimization, and database administration.",
    keywords: ["database design", "SQL", "schema", "query optimization", "database admin"],
    relatedCategories: ["data-ai", "infrastructure"],
  },
  "performance-optimization": {
    name: "Performance Optimization",
    slug: "performance-optimization",
    title: "Claude Code Agents for Performance Optimization",
    description:
      "Optimize performance with Claude Code sub-agents. Profiling, caching, load optimization, and Core Web Vitals.",
    keywords: ["performance", "optimization", "profiling", "caching", "Core Web Vitals"],
    relatedCategories: ["quality-security", "infrastructure"],
  },
  documentation: {
    name: "Documentation",
    slug: "documentation",
    title: "Claude Code Agents for Documentation",
    description:
      "Create documentation with Claude Code sub-agents. API docs, README files, technical writing, and code comments.",
    keywords: ["documentation", "API docs", "technical writing", "README", "code comments"],
    relatedCategories: ["developer-experience"],
  },
} as const;
