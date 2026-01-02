export type MCP = {
  name: string;
  url: string;
  description: string;
  logo?: string;
};

export default [
  {
    name: "Upstash",
    url: "https://github.com/upstash/mcp-server",
    description:
      "Model Context Protocol (MCP) is a new, standardized protocol for managing context between large language models (LLMs) and external systems. In this repository, we provide an installer as well as an MCP Server for Upstash Developer API's.",
    logo: "https://avatars.githubusercontent.com/u/74989412?s=200&v=4",
  },
  {
    name: "SettleMint",
    url: "https://console.settlemint.com/documentation/building-with-settlemint/dev-tools/mcp",
    description:
      "Leverage SettleMint's Model Context Protocol server to seamlessly interact with enterprise blockchain infrastructure. Build, deploy, and manage smart contracts through AI-powered assistants, streamlining your blockchain development workflow for maximum efficiency.",
    logo: "https://console.settlemint.com/android-chrome-512x512.png",
  },
  {
    name: "PostgreSQL",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    description:
      "A Model Context Protocol server that provides read-only access to PostgreSQL databases. This server enables LLMs to inspect database schemas and execute read-only queries.",
    logo: "https://cdn.brandfetch.io/idjSeCeMle/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Supabase",
    url: "https://github.com/supabase-community/mcp-supabase/tree/main/packages/mcp-server-postgrest",
    description:
      "This is an MCP server for PostgREST. It allows LLMs perform database queries and operations on Postgres databases via PostgREST.",
    logo: "https://cdn.brandfetch.io/idsSceG8fK/w/436/h/449/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Prisma",
    url: "https://github.com/prisma/mcp",
    description:
      "Gives LLMs the ability to manage Prisma Postgres databases (e.g. spin up new databases and run migrations or queries)",
    logo: "https://cdn.brandfetch.io/idBBE3_R9e/idI_xi9A1U.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Figma",
    url: "https://github.com/GLips/Figma-Context-MCP",
    description:
      "Proivde coding agents with design data direct from Figma for far more accurate design implementations in one-shot.",
    logo: "https://cdn.brandfetch.io/idZHcZ_i7F/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Convex",
    url: "https://docs.convex.dev/ai/using-cursor#setup-the-convex-mcp-server",
    description:
      "Cursor, the AI code editor, makes it easy to write and maintain apps built with Convex. Let's walk through how to setup Cursor for the best possible results with Convex.",
    logo: "https://pbs.twimg.com/profile_images/1886599096636694528/0Y8VYt94_400x400.png",
  },
  {
    name: "Vercel",
    url: "https://github.com/nganiet/mcp-vercel",
    description:
      "Integrates with Vercel's serverless infrastructure to provide a lightweight endpoint for AI model interactions and tasks like chatbots, content generation, and data analysis.",
    logo: "https://cdn.brandfetch.io/idDpCfN4VD/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Sentry",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sentry",
    description:
      "A Model Context Protocol server for retrieving and analyzing issues from Sentry.io. This server provides tools to inspect error reports, stacktraces, and other debugging information from your Sentry account.",
    logo: "https://cdn.brandfetch.io/idag_928SW/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Axiom",
    url: "https://github.com/axiomhq/mcp-server-axiom",
    description: "Query and analyze logs, traces, and event data using natural language",
    logo: "https://cdn.brandfetch.io/ids3R5NX-p/theme/light/logo.svg",
  },
  {
    name: "Slack",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
    description: "MCP Server for the Slack API, enabling Claude to interact with Slack workspaces.",
    logo: "https://cdn.brandfetch.io/idJ_HhtG0Z/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Cloudflare",
    url: "https://github.com/cloudflare/mcp-server-cloudflare",
    description: "Deploy and manage resources on the Cloudflare developer platform",
    logo: "https://cdn.brandfetch.io/idJ3Cg8ymG/idASSo3XVu.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "E2B",
    url: "https://github.com/e2b-dev/mcp-server",
    description: "Execute code in secure cloud sandboxes",
    logo: "https://cdn.brandfetch.io/id8E4Bu5Zl/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Obsidian Markdown Notes",
    url: "https://github.com/calclavia/mcp-obsidian",
    description: "Read and search through Markdown notes in Obsidian vaults",
    logo: "https://cdn.brandfetch.io/idGpyxH_Fa/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Raygun",
    url: "https://github.com/MindscapeHQ/mcp-server-raygun",
    description: "Access crash reporting and monitoring data",
    logo: "https://cdn.brandfetch.io/idXlCTTXd-/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    name: "Github",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
    description:
      "This server provides integration with Github's issue tracking system through MCP, allowing LLMs to interact with Github issues.",
    logo: "https://cdn.brandfetch.io/idZAyF9rlg/theme/light/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
];
