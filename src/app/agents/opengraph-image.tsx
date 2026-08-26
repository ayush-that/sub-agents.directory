import { ImageResponse } from "next/og";

export const alt = "Browse All Claude Code Sub-Agents";
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
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          {["Frontend", "Backend", "DevOps", "Testing"].map((tag) => (
            <span
              key={tag}
              style={{
                padding: "8px 20px",
                backgroundColor: "rgba(217, 119, 87, 0.2)",
                border: "1px solid rgba(217, 119, 87, 0.4)",
                borderRadius: "20px",
                color: "#D97757",
                fontSize: "18px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <span
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          Browse All Sub-Agents
        </span>
        <span
          style={{
            fontSize: "28px",
            color: "#878787",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Explore Claude Code sub-agents organized by category
        </span>
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
