import { Menu } from "@/components/menu";
import { RuleList } from "@/components/rule-list";
import { getSections } from "@/data/rules";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

const AGENT_HUBS = [
  { href: "/agents/tools", label: "By Tool" },
  { href: "/agents/for", label: "By Use Case" },
  { href: "/agents/compare", label: "Compare Agents" },
];

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
  const sections = getSections();

  return (
    <div className="flex w-full h-full">
      <div className="hidden md:flex mt-12 sticky top-12 h-[calc(100vh-3rem)] z-40">
        <Menu sections={sections} />
      </div>

      <main className="flex-1 p-6 pt-4 md:pt-16 space-y-8">
        <h1 className="sr-only">Browse All Claude Code Sub-Agents</h1>
        <nav aria-label="Browse agents by" className="flex flex-wrap gap-2">
          {AGENT_HUBS.map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="text-xs px-3 py-1.5 rounded-full border border-border/40 hover:border-border hover:bg-accent/30 transition-all"
            >
              {hub.label}
            </Link>
          ))}
        </nav>
        <Suspense fallback={null}>
          <RuleList sections={sections} />
        </Suspense>
      </main>
    </div>
  );
}
