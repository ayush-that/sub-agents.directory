import { Menu } from "@/components/menu";
import { RuleList } from "@/components/rule-list";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Browse All Sub-Agents",
  description:
    "Browse all Claude Code sub-agent prompts organized by category. Find agents for frontend, backend, DevOps, testing, and more.",
  alternates: {
    canonical: "/agents",
  },
  openGraph: {
    title: "Browse All Sub-Agents",
    description:
      "Browse all Claude Code sub-agent prompts organized by category. Find agents for frontend, backend, DevOps, testing, and more.",
    url: "/agents",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse All Sub-Agents",
    description:
      "Browse all Claude Code sub-agent prompts organized by category. Find agents for frontend, backend, DevOps, testing, and more.",
  },
};

export default function Page() {
  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)] z-40">
        <Menu />
      </div>

      <main className="flex-1 p-6 pt-4 md:pt-16 space-y-8">
        <h1 className="sr-only">Browse All Claude Code Sub-Agents</h1>
        <Suspense fallback={null}>
          <RuleList />
        </Suspense>
      </main>
    </div>
  );
}
