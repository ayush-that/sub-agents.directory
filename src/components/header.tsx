"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Github, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CommandMenu } from "./command-menu";
import { MobileMenu } from "./mobile-menu";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { UserMenu } from "./user-menu";

const primaryLinks = [
  { href: "/agents", label: "Agents" },
  { href: "/mcp", label: "MCPs" },
  { href: "/generate", label: "Generate" },
] as const;

const moreLinks = [
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
  { href: "/advertise", label: "Advertise" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center">
      <div className="md:fixed z-50 flex justify-between items-center top-0 px-6 py-2 w-full bg-background/95 backdrop-blur-md">
        <Link href="/" className="font-medium font-fraunces text-base">
          sub-agents.directory
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                pathname.includes(link.href) ? "text-primary" : "text-[#878787] hover:text-primary",
              )}
            >
              {link.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1.5 px-0 text-sm font-medium hover:bg-transparent",
                  moreLinks.some((link) => pathname.includes(link.href))
                    ? "text-primary"
                    : "text-[#878787] hover:text-primary",
                )}
              >
                More
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "w-full cursor-pointer",
                      pathname.includes(link.href) && "text-primary",
                    )}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="https://github.com/ayush-that/sub-agents.directory"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#878787] hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" />
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 hover:bg-transparent text-[#878787] px-0"
            onClick={() => setOpen(true)}
          >
            <SearchIcon className="h-4 w-4" />
            <span className="hidden sm:inline-flex">Search</span>
          </Button>

          <UserMenu />
        </div>
      </div>
      <MobileMenu />
      <CommandMenu open={open} setOpen={setOpen} />
    </div>
  );
}
