"use client";

import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CopyButton({
  content,
  slug,
  small,
}: {
  content?: string;
  slug?: string;
  small?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      let text = content;
      if (!text && slug) {
        const res = await fetch(`/api/${slug}`);
        const json = await res.json();
        text = json.data?.content;
      }
      if (!text) return;

      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Copied to clipboard. Add to your CLAUDE.md file or sub-agent configuration.");

      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "text-xs bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center",
        small ? "p-1.5 size-7" : "p-2 size-9",
      )}
      type="button"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className={small ? "w-3 h-3" : "w-4 h-4"} />
      ) : (
        <Copy className={small ? "w-3 h-3" : "w-4 h-4"} />
      )}
    </button>
  );
}
