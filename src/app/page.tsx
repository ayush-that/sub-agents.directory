import { GlobalSearch } from "@/components/global-search";
import { getSections } from "@/data/rules";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub-Agents Directory - Claude Code Sub-Agents & MCP Servers",
  description: "Discover Claude Code sub-agent prompts, find MCP servers, and join the community.",
};

export default function Page() {
  const sections = getSections();

  return (
    <div className="flex justify-center min-h-screen w-full px-2 mt-[10%]">
      <div className="w-full max-w-6xl">
        <GlobalSearch sections={sections} />
      </div>
    </div>
  );
}
