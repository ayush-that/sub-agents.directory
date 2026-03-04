import { rules } from "@/data/rules";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sub-agents.directory";
const VALID_SLUG_PATTERN = /^[a-z0-9-]+$/;

function sanitizeForBash(str: string): string {
  return `'${str.replace(/'/g, "'\\''")}'`;
}

export async function generateStaticParams() {
  return rules.map((rule) => ({
    slug: rule.slug,
  }));
}

type Params = Promise<{ slug: string }>;

export async function GET(_request: Request, segmentData: { params: Params }) {
  const { slug } = await segmentData.params;

  if (!slug) {
    return new Response("No slug provided", { status: 400 });
  }

  if (!VALID_SLUG_PATTERN.test(slug)) {
    return new Response("Invalid slug format", { status: 400 });
  }

  const rule = rules.find((r) => r.slug === slug);

  if (!rule) {
    return new Response("Rule not found", { status: 404 });
  }

  const script = `#!/bin/bash
set -e

AGENT_DIR="$HOME/.claude/agents"
AGENT_NAME="${slug}"
AGENT_URL="${BASE_URL}/api/download/${slug}"
TEMP_FILE=""

# Cleanup function to remove temp file on failure
cleanup() {
  if [ -n "$TEMP_FILE" ] && [ -f "$TEMP_FILE" ]; then
    rm -f "$TEMP_FILE"
  fi
}
trap cleanup EXIT

echo "Installing ${sanitizeForBash(rule.title)} agent..."

mkdir -p "$AGENT_DIR"

# Download to temp file first for atomic operation
TEMP_FILE=$(mktemp)
if curl -fsSL "$AGENT_URL" -o "$TEMP_FILE"; then
  # Move temp file to final destination (atomic on same filesystem)
  mv "$TEMP_FILE" "$AGENT_DIR/$AGENT_NAME.md"
  TEMP_FILE=""  # Clear so cleanup doesn't try to delete
  echo "✓ Installed $AGENT_NAME to $AGENT_DIR/$AGENT_NAME.md"
  echo "  Restart Claude Code to use this agent."
else
  echo "✗ Failed to install $AGENT_NAME"
  exit 1
fi
`;

  return new Response(script, {
    status: 200,
    headers: {
      "Content-Type": "text/x-shellscript; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400",
      "CDN-Cache-Control": "public, s-maxage=86400",
    },
  });
}
