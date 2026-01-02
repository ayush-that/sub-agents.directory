import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { MCP } from "./mcps-featured";

export function MCPsCard({ data }: { data: MCP }) {
  return (
    <div key={data.name}>
      <Link
        href={`/mcp/${data.slug}`}
        className="flex h-full items-center p-4 transition-colors border border-border hover:bg-accent"
      >
        <div className="flex items-start gap-4 w-full">
          {data.logo && (
            <Avatar className="size-8 rounded-none">
              {data.logo ? (
                <AvatarImage src={data.logo} alt={data.name} />
              ) : (
                <AvatarFallback className="bg-[#1c1c1c] rounded-none">
                  {data.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          )}
          <div className="flex flex-col flex-1">
            <h3 className="font-medium text-primary text-sm mb-1">
              {data.name}
            </h3>
            {data.description && (
              <p className="text-xs text-[#878787] line-clamp-3 font-mono">
                {data.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
