import { ImageResponse } from "next/og";
import mcpData from "@/data/mcp";
import slugify from "slugify";

export const alt = "MCP Server";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mcp = mcpData.find((item) => slugify(item.name, { lower: true }) === slug);

  const name =
    mcp?.name ||
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const description = mcp?.description || "Model Context Protocol Server for Claude Code";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "24px",
            color: "#D97757",
            marginBottom: "16px",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          MCP Server
        </span>
        <span
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "white",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: "28px",
            color: "#878787",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          {description.length > 120 ? `${description.slice(0, 120)}...` : description}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 256 256" fill="none">
            <rect width="256" height="256" rx="60" fill="#D97757" />
            <path
              d="M165.912 96.744C161.088 83.448 151.344 73.656 135.912 73.656C114.768 73.656 100.128 92.976 100.128 128.136C100.128 163.296 114.768 182.376 135.912 182.376C151.344 182.376 161.088 172.584 165.912 159.288H178.008C172.08 179.568 156.84 192.696 135.912 192.696C106.872 192.696 87.576 168.12 87.576 128.136C87.576 88.152 106.872 63.336 135.912 63.336C156.84 63.336 172.08 76.464 178.008 96.744H165.912Z"
              fill="white"
            />
          </svg>
          <span style={{ color: "#666", fontSize: "24px" }}>Sub-Agents Directory</span>
        </div>
        <span style={{ color: "#444", fontSize: "20px" }}>sub-agents.directory/mcp/{slug}</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
