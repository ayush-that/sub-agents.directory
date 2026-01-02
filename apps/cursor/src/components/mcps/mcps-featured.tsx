import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export type MCP = {
  id: string;
  name: string;
  logo: string;
  description: string;
  slug: string;
  user: {
    name: string;
    slug: string;
    image: string;
  };
};

export function MCPsFeatured({
  data,
  hidePagination,
}: {
  data?: MCP[] | null;
  hidePagination?: boolean;
}) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full relative"
    >
      {!hidePagination && (
        <div className="absolute -top-16 right-0 gap-2 hidden md:flex">
          <Link href="/mcp/new">
            <Button
              variant="outline"
              className="rounded-full h-8 flex items-center gap-2 border-border"
            >
              Add new
              <Plus className="size-4" />
            </Button>
          </Link>
          <CarouselPrevious />
          <CarouselNext />
        </div>
      )}
      <CarouselContent>
        {data?.map((mcp) => (
          <CarouselItem
            key={mcp.id}
            className="md:basis-1/2 lg:basis-1/4 h-full"
          >
            <Link href={`/mcp/${mcp.slug}`}>
              <Card className="bg-transparent h-[130px]">
                <CardContent className="flex flex-col gap-4 p-4 h-full">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8 rounded-none">
                      {mcp.logo ? (
                        <AvatarImage src={mcp.logo} alt={mcp.name} />
                      ) : (
                        <AvatarFallback className="bg-[#1c1c1c] rounded-none">
                          {mcp.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <h3 className="text-sm font-medium">{mcp.name}</h3>
                  </div>

                  <p className="text-[#878787] text-xs line-clamp-3 font-mono">
                    {mcp.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
