"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ad } from "@/data/ads";
import { cn } from "@/lib/utils";
import { useOpenPanel } from "@openpanel/nextjs";
import Image from "next/image";
import { useEffect } from "react";

export function AdCardSmall({ ad, small }: { ad: Ad; small?: boolean }) {
  const op = useOpenPanel();

  useEffect(() => {
    op.track("ad_grid_viewed", {
      ad_id: ad.title,
      ad_url: ad.link,
      type: "ad_card_small",
    });
  }, [ad]);

  return (
    <Card
      className={cn(
        "bg-background max-h-[calc(100vh-8rem)] flex flex-col",
        small ? "p-2" : "p-4",
      )}
    >
      <CardContent
        className={cn(
          "bg-card h-full mb-2 font-mono pr-1 text-sm opacity-50 hover:opacity-100 transition-opacity group relative flex-grow",
          small ? "p-2 pt-4" : "p-4",
        )}
      >
        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="h-full"
          onClick={() => {
            op.track("ad_card_clicked", {
              ad_id: ad.id,
              ad_url: ad.link,
              type: "ad_card_small",
            });
          }}
        >
          <div className="h-full overflow-y-auto">
            <code className={cn("block pr-3", small ? "text-xs" : "text-sm")}>
              {ad.description}
            </code>
          </div>
        </a>
      </CardContent>

      <CardHeader className="p-0 space-y-1">
        <div className="flex items-center gap-2">
          <div className={cn("relative", small ? "w-4 h-4" : "w-6 h-6")}>
            <Image
              quality={100}
              src={ad.logoUrl}
              alt={`${ad.title} logo`}
              fill
              className="object-contain"
            />
          </div>
          <CardTitle className={cn("truncate", small ? "text-xs" : "text-sm")}>
            {ad.title}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
}
