import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { JobsEditButton } from "./jobs-edit-button";

export interface JobsCardProps {
  id: string;
  title: string;
  location: string;
  description: string;
  created_at: string;
  link: string;
  workplace: string;
  experience: string;
  owner_id: string;
  company: {
    name: string;
    image: string;
    slug: string;
  };
}

export function JobsCard({
  data: {
    id,
    title,
    company,
    location,
    description,
    link,
    workplace,
    experience,
    owner_id,
  },
}: {
  data: JobsCardProps;
}) {
  return (
    <Card className="p-0 border-none bg-transparent">
      <CardHeader className="p-0 space-y-2">
        <div className="flex items-center gap-2 relative">
          <Link href={`/c/${company.slug}`}>
            <Avatar className="size-4 rounded-none">
              {company.image ? (
                <AvatarImage src={company.image} alt={company.name} />
              ) : (
                <AvatarFallback className="bg-accent text-[9px]">
                  {company.name.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
          </Link>
          <div className="flex flex-row space-x-1 ">
            <CardTitle className="text-xs text-[#878787] font-mono">
              <Link href={`/c/${company.slug}`}>{company.name}</Link>
            </CardTitle>

            {experience && (
              <>
                <span className="text-xs text-[#878787] font-mono">•</span>
                <span className="line-clamp-1 text-xs text-[#878787] font-mono">
                  {experience}
                </span>
              </>
            )}

            {location && (
              <>
                <span className="text-xs text-[#878787] font-mono">•</span>
                <span className="line-clamp-1 text-xs text-[#878787] font-mono">
                  {location}
                </span>
              </>
            )}

            {workplace && (
              <>
                <span className="text-xs text-[#878787] font-mono">•</span>
                <span className="line-clamp-1 text-xs text-[#878787] font-mono">
                  {workplace}
                </span>
              </>
            )}
          </div>

          <div className="absolute right-0 flex gap-2">
            <JobsEditButton ownerId={owner_id} id={id} />

            <Button
              variant="secondary"
              size="sm"
              className="w-fit bg-[#1c1c1c] text-[#878787] hover:bg-[#2c2c2c] rounded-full font-mono text-xs"
              asChild
            >
              <a
                href={`${link}?utm_source=cursor.directory&utm_medium=referral&utm_campaign=jobs-featured`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <CardTitle className="text-md font-normal flex items-center gap-2">
            <span>
              <a
                href={`${link}?utm_source=cursor.directory&utm_medium=jobs`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            </span>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 mt-2 pr-24">
        <p className="text-sm line-clamp-2 text-[#878787]">{description}</p>
      </CardContent>
    </Card>
  );
}
