import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Rule } from "@/data/rules";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { CopyButton } from "./copy-button";
import { ShareButton } from "./share-button";

export function RuleCard({ rule, isPage }: { rule: Rule; isPage?: boolean }) {
  return (
    <Card className="bg-background p-4 max-h-[calc(100vh-8rem)] aspect-square flex flex-col">
      <CardContent
        className={cn(
          "bg-card h-full mb-2 font-mono p-4 pr-1 text-sm opacity-50 hover:opacity-100 transition-opacity group relative flex-grow",
          isPage && "opacity-100",
        )}
      >
        <div className="group-hover:flex hidden right-4 bottom-4 absolute z-10 space-x-2">
          <ShareButton slug={rule.slug} />
          <CopyButton content={rule.content} />
        </div>

        <Link href={`/${rule.slug}`}>
          <div className="h-full overflow-y-auto">
            <code className="text-sm block pr-3">{rule.content}</code>
          </div>
        </Link>
      </CardContent>

      <CardHeader className="p-0 space-y-1">
        <CardTitle className="text-sm">{rule.title}</CardTitle>
        {rule.libs && rule.libs.length > 0 && (
          <Popover>
            <PopoverTrigger className="flex gap-2 items-center overflow-x-auto whitespace-nowrap h-5 cursor-pointer hover:bg-accent">
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
}
