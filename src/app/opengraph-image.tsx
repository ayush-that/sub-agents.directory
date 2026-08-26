import { ImageResponse } from "next/og";

export const alt = "Sub-Agents Directory - Claude Code Sub-Agents & MCP Servers";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        <svg width="80" height="80" viewBox="0 0 256 256" fill="none">
          <rect width="256" height="256" rx="60" fill="#D97757" />
          <path
            d="M165.912 96.744C161.088 83.448 151.344 73.656 135.912 73.656C114.768 73.656 100.128 92.976 100.128 128.136C100.128 163.296 114.768 182.376 135.912 182.376C151.344 182.376 161.088 172.584 165.912 159.288H178.008C172.08 179.568 156.84 192.696 135.912 192.696C106.872 192.696 87.576 168.12 87.576 128.136C87.576 88.152 106.872 63.336 135.912 63.336C156.84 63.336 172.08 76.464 178.008 96.744H165.912Z"
            fill="white"
          />
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
            }}
          >
            Sub-Agents Directory
          </span>
          <span
            style={{
              fontSize: "28px",
              color: "#878787",
              textAlign: "center",
            }}
          >
            Find Claude Code sub-agent prompts for your framework and language
          </span>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#666",
          fontSize: "20px",
        }}
      >
        sub-agents.directory
      </div>
    </div>,
    {
      ...size,
    },
  );
}
