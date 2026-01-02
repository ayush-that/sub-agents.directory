import { Button } from "@/components/ui/button";
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

export type Job = {
  id: string;
  title: string;
  description: string;
  company: {
    name: string;
    slug: string;
    image: string;
  };
  workplace: string;
  link: string;
};

export function JobsFeatured({
  data,
  hidePagination,
}: {
  data?: Job[] | null;
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
          <Link href="/jobs/new">
            <Button
              variant="outline"
              className="rounded-full h-8 flex items-center gap-2 border-border"
            >
              Add job listing
              <Plus className="size-4" />
            </Button>
          </Link>
          <CarouselPrevious />
          <CarouselNext />
        </div>
      )}
      <CarouselContent>
        {data?.map((job) => (
          <CarouselItem key={job.id} className="md:basis-1/2 lg:basis-1/4">
            <Card className="bg-transparent">
              <CardContent className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-3">
                  <Link href={`/c/${job.company.slug}`}>
                    <Avatar className="size-12 rounded-none">
                      {job.company.image ? (
                        <AvatarImage
                          src={job.company.image}
                          alt={job.company.name}
                        />
                      ) : (
                        <AvatarFallback className="bg-[#1c1c1c] rounded-none">
                          {job.company.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Link>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#878787] font-mono line-clamp-1">
                      <Link href={`/c/${job.company.slug}`}>
                        <span className="line-clamp-1">{job.company.name}</span>
                      </Link>
                      {job.workplace && (
                        <>
                          <span>•</span>
                          <span className="line-clamp-1">{job.workplace}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-md line-clamp-1">{job.title}</h3>
                  </div>
                </div>
                <p className="text-[#878787] text-sm line-clamp-2">
                  {job.description}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-fit bg-[#1c1c1c] text-[#878787] hover:bg-[#2c2c2c] rounded-full font-mono text-xs"
                  asChild
                >
                  <a
                    href={`${job.link}?utm_source=cursor.directory&utm_medium=referral&utm_campaign=jobs-featured`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </Button>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
