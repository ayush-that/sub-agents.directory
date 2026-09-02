import { BASE_URL } from "@/lib/seo/constants";

export function openApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: "Sub-Agents Directory API",
      version: "1.0.0",
      description:
        "Read-only public data endpoints for the Sub-Agents Directory. No authentication is required.",
    },
    servers: [{ url: BASE_URL }],
    paths: {
      "/api": {
        get: {
          summary: "List all directory rules",
          responses: {
            "200": {
              description: "Rule collection",
              content: { "application/json": { schema: { $ref: "#/components/schemas/RuleList" } } },
            },
          },
        },
      },
      "/api/{slug}": {
        get: {
          summary: "Get one rule and its prompt content",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Rule",
              content: { "application/json": { schema: { $ref: "#/components/schemas/RuleResponse" } } },
            },
            "404": { description: "No rule exists for the supplied slug" },
          },
        },
      },
      "/api/download/{slug}": {
        get: {
          summary: "Download a rule as Markdown",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Markdown prompt attachment",
              content: { "text/markdown": { schema: { type: "string" } } },
            },
            "400": {
              description: "The supplied slug has an invalid format",
              content: { "text/plain": { schema: { type: "string" } } },
            },
            "404": { description: "No rule exists for the supplied slug" },
          },
        },
      },
      "/api/install/{slug}": {
        get: {
          summary: "Get an install script for a Claude Code sub-agent",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Shell script that installs the Markdown prompt into ~/.claude/agents",
              content: { "text/x-shellscript": { schema: { type: "string" } } },
            },
            "400": {
              description: "The supplied slug has an invalid format",
              content: { "text/plain": { schema: { type: "string" } } },
            },
            "404": { description: "No rule exists for the supplied slug" },
          },
        },
      },
    },
    components: {
      schemas: {
        Rule: {
          type: "object",
          required: ["title", "slug", "description", "tags", "libs"],
          properties: {
            title: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            libs: { type: "array", items: { type: "string" } },
            content: { type: "string" },
          },
        },
        RuleList: {
          type: "object",
          required: ["data"],
          properties: { data: { type: "array", items: { $ref: "#/components/schemas/Rule" } } },
        },
        RuleResponse: {
          type: "object",
          required: ["data"],
          properties: { data: { $ref: "#/components/schemas/Rule" } },
        },
      },
    },
  };
}
