"use client";

import type { Section } from "@/data/rules";
import { motion } from "motion/react";
import { Suspense } from "react";
import { GlobalSearchInput } from "./global-search-input";
import { HeroTitle } from "./hero-title";
import MCPList from "./mcp-list";
import { RuleList } from "./rule-list";
import { ClaudeLogo } from "./ui/claude-logo";

export function GlobalSearch({ sections }: { sections: Section[] }) {
  return (
    <div>
      <div className="flex flex-col gap-4 w-full relative mx-auto h-screen">
        <div className="transition-all duration-1000">
          <div
            className="flex justify-center items-center mb-8"
            style={{
              opacity: 0,
              animation: "fadeIn 0.05s ease forwards",
            }}
          >
            <ClaudeLogo />
          </div>

          <HeroTitle />

          <div className="max-w-[620px] mx-auto w-full mb-14">
            <Suspense fallback={<div className="h-[60px] bg-[#121212] border border-[#2C2C2C]" />}>
              <GlobalSearchInput />
            </Suspense>
          </div>

          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <MCPList />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.45 }}
          >
            <Suspense fallback={null}>
              <RuleList sections={sections} small />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
