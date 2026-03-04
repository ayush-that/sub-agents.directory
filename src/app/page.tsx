import { GlobalSearch } from "@/components/global-search";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub-Agents Directory - Claude Code Sub-Agents & MCP Servers",
  description:
    "Browse 200+ Claude Code sub-agent prompts and MCP servers. Copy-paste ready prompts for React, Python, TypeScript, Go, and more frameworks.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return (
    <>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <div className="min-h-screen w-full px-4 pt-[10%]">
        <div className="w-full max-w-6xl mx-auto">
          <h1 className="sr-only">Sub-Agents Directory - Find Claude Code Sub-Agent Prompts</h1>
          <div className="flex justify-center mb-6">
            <a
              href="https://peerlist.io/shydev69/project/subagentsdirectory"
              target="_blank"
              rel="noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://peerlist.io/api/v1/projects/embed/PRJHOK89D8AEPQBK9IGAPBA8BEMPDO?showUpvote=false&theme=dark"
                alt="sub-agents.directory"
                className="h-[72px] w-auto"
              />
            </a>
          </div>
          <GlobalSearch />
        </div>
      </div>
    </>
  );
}
