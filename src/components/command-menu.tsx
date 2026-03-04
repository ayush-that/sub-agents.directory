"use client";

import { rules as staticRules } from "@/data/rules/client";
import type { Rule } from "@/data/rules/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CommandEmpty, CommandInput } from "./ui/command";
import { CommandDialog, CommandItem, CommandList } from "./ui/command";

export function CommandMenu({
  open,
  setOpen,
  rules = staticRules,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rules?: Rule[];
}) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search for a rule..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {rules.map((rule) => (
          <CommandItem
            key={rule.slug}
            onSelect={() => {
              router.push(`/${rule.slug}`);
              setOpen(false);
            }}
          >
            {rule.title}
          </CommandItem>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
