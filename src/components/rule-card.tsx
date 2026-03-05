"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Rule } from "@/data/rules/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { CopyButton } from "./copy-button";
import { DownloadButton } from "./download-button";
import { InstallButton } from "./install-button";
import { OpenInDropdown } from "./open-in-dropdown";
import { ShareButton } from "./share-button";

export const RuleCard = memo(function RuleCard({ rule, isPage }: { rule: Rule; isPage?: boolean }) {
  const [fullContent, setFullContent] = useState<string | undefined>(rule.content);

  useEffect(() => {
    if (isPage && !rule.content) {
      fetch(`/api/${rule.slug}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.data?.content) setFullContent(json.data.content);
        })
        .catch(() => {});
    }
  }, [isPage, rule.slug, rule.content]);

  const displayContent = fullContent || rule.description;

  return (
    <Card className="bg-background p-3 sm:p-4 flex flex-col w-full max-w-full overflow-hidden">
      <CardContent
        className={cn(
          "bg-card h-full mb-2 font-mono p-3 sm:p-4 pr-1 text-xs sm:text-sm opacity-50 hover:opacity-100 transition-opacity group relative flex-grow overflow-hidden",
          isPage && "opacity-100",
        )}
      >
        <div
          className={cn(
            "right-4 bottom-4 absolute z-10 space-x-2",
            isPage ? "flex" : "group-hover:flex hidden",
          )}
        >
          <InstallButton slug={rule.slug} />
          <OpenInDropdown content={fullContent} slug={rule.slug} />
          <ShareButton slug={rule.slug} />
          <CopyButton content={fullContent} slug={rule.slug} />
          <DownloadButton content={fullContent} slug={rule.slug} filename={rule.slug} />
        </div>

        <Link
          href={isPage ? "#" : `/${rule.slug}`}
          onClick={isPage ? (e) => e.preventDefault() : undefined}
        >
          <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
            <code className="text-xs sm:text-sm block pr-3 pb-12 whitespace-pre-wrap break-words">
              {displayContent}
            </code>
          </div>
        </Link>
      </CardContent>

      <CardHeader className="p-0 space-y-1">
        <CardTitle className="text-sm">{rule.title}</CardTitle>
        {rule.libs && rule.libs.length > 0 && (
          <Popover>
            <PopoverTrigger className="flex gap-2 items-center overflow-x-auto whitespace-nowrap h-5 cursor-pointer hover:bg-secondary">
              {rule.libs.slice(0, 2).map((lib) => (
                <span key={lib} className="text-xs text-[#878787] font-mono flex-shrink-0">
                  {lib}
                </span>
              ))}
              {rule.libs.length > 2 && (
                <span className="text-xs text-[#878787] font-mono flex gap-1 items-center">
                  <span>+{rule.libs.length - 2} more</span>
                  <ChevronDown className="w-3 h-3" />
                </span>
              )}
            </PopoverTrigger>
            <PopoverContent>
              {rule.libs.map((lib) => (
                <div key={lib} className="flex flex-col justify-center gap-2">
                  <span className="text-xs text-[#878787] font-mono flex-shrink-0">{lib}</span>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        )}
      </CardHeader>
    </Card>
  );
});
