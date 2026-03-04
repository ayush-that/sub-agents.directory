"use client";

import { cn } from "@/lib/utils";
import { Check, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DownloadButton({
  content,
  slug,
  filename,
  small,
}: {
  content?: string;
  slug?: string;
  filename: string;
  small?: boolean;
}) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    try {
      let text = content;
      if (!text && slug) {
        const res = await fetch(`/api/${slug}`);
        const json = await res.json();
        text = json.data?.content;
      }
      if (!text) return;

      const blob = new Blob([text], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.md`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloaded(true);
      toast("Rule downloaded. Add to your .claude/ directory or CLAUDE.md file.");

      setTimeout(() => {
        setDownloaded(false);
      }, 1000);
    } catch {
      toast.error("Failed to download file");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={cn(
        "text-xs bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center",
        small ? "p-1.5 size-7" : "p-2 size-9",
      )}
      type="button"
      aria-label={downloaded ? "Downloaded" : "Download file"}
    >
      {downloaded ? (
        <Check className={small ? "w-3 h-3" : "w-4 h-4"} />
      ) : (
        <Download className={small ? "w-3 h-3" : "w-4 h-4"} />
      )}
    </button>
  );
}
