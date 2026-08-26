"use client";

import { getSections } from "@/data/rules/client";
import { motion } from "motion/react";
import { Suspense } from "react";
import { GlobalSearchInput } from "./global-search-input";
import { HeroTitle } from "./hero-title";
import MCPList from "./mcp-list";
import { RuleList } from "./rule-list";

const sections = getSections();

export function GlobalSearch() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full relative mx-auto">
        <div className="transition-all duration-1000">
          <HeroTitle />

          <div className="max-w-[620px] mx-auto w-full mb-14">
            <Suspense fallback={null}>
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
