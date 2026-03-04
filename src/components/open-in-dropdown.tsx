"use client";

import { ChatGPTIcon, ClaudeIcon, MarkdownIcon } from "@/components/ui/ai-icons";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { useRef, useState } from "react";

async function resolveContent(content?: string, slug?: string): Promise<string | undefined> {
  if (content) return content;
  if (!slug) return undefined;
  const res = await fetch(`/api/${slug}`);
  const json = await res.json();
  return json.data?.content;
}

export function OpenInDropdown({
  content,
  slug,
  small,
}: {
  content?: string;
  slug?: string;
  small?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleOpenIn = async (platform: "claude" | "chatgpt") => {
    const text = await resolveContent(content, slug);
    if (!text) return;
    const encoded = encodeURIComponent(text);
    const url =
      platform === "claude"
        ? `https://claude.ai/new?q=${encoded}`
        : `https://chatgpt.com/?q=${encoded}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  const handleViewMarkdown = async () => {
    const text = await resolveContent(content, slug);
    if (!text) return;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget)) {
            setIsOpen(false);
          }
        }}
        className={cn(
          "text-xs bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center",
          small ? "p-1.5 size-7" : "p-2 size-9",
        )}
      >
        <ExternalLink className={small ? "w-3 h-3" : "w-4 h-4"} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 p-2 rounded-md border bg-popover text-popover-foreground shadow-md z-50 font-sans">
          <button
            type="button"
            onClick={handleViewMarkdown}
            className="w-full flex flex-col items-start px-3 py-3 rounded-md hover:bg-secondary transition-colors border-b border-border mb-1"
          >
            <div className="flex items-center gap-2">
              <MarkdownIcon className="w-4 h-4" />
              <span className="text-sm font-medium">View as Markdown</span>
            </div>
            <span className="text-xs text-muted-foreground text-left">
              Open raw markdown in new tab
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenIn("claude")}
            className="w-full flex flex-col items-start px-3 py-3 rounded-md hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-2">
              <ClaudeIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Open in Claude</span>
            </div>
            <span className="text-xs text-muted-foreground text-left">
              Use this agent with Claude
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenIn("chatgpt")}
            className="w-full flex flex-col items-start px-3 py-3 rounded-md hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-2">
              <ChatGPTIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Open in ChatGPT</span>
            </div>
            <span className="text-xs text-muted-foreground text-left">
              Use this agent with ChatGPT
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
