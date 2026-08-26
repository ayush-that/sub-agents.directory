"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { sections as staticSections } from "@/data/rules/client";
import type { Section } from "@/data/rules/types";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function Menu({ sections = staticSections }: { sections?: Section[] }) {
  const router = useRouter();

  const handleClick = (section: Section) => {
    if (window.location.pathname === "/agents") {
      const element = document.getElementById(section.slug);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 56,
          behavior: "smooth",
        });
      }
    } else {
      router.push(`/agents#${section.slug}`);
    }
  };

  return (
    <aside className="w-64 p-4 flex flex-col">
      <ScrollArea className="flex-grow">
        <div className="space-y-1">
          {sections.map((section) => (
            <Button
              onClick={() => handleClick(section)}
              key={section.tag}
              variant="ghost"
              className="w-full justify-start"
            >
              {section.tag}
              <span className="ml-auto text-[#878787]">{section.rules.length}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <Separator className="my-4" />
      <a href="https://github.com/ayush-that/sub-agents.directory" target="_blank" rel="noreferrer">
        <Button
          className="w-full bg-[#F5F5F3]/30 text-black border border-black rounded-full items-center justify-center gap-2 font-medium hidden md:flex dark:text-white dark:border-white"
          variant="outline"
        >
          <span>Submit</span> <PlusIcon className="w-4 h-4" />
        </Button>
      </a>
    </aside>
  );
}
