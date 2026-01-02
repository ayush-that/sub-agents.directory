import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/luma";
import Link from "next/link";

export function EventCard({
  data: {
    event,
    // tags, // Assuming tags might be used later, commented out for now
  },
}: {
  data: Event;
}) {
  // Assuming event.url exists, replace if the actual property name is different
  const eventUrl = event.url || "#"; // Fallback URL

  return (
    <Card className="p-0 border-none bg-transparent">
      <CardHeader className="p-0 space-y-2">
        <div className="flex items-center gap-2 relative">
          <Link href={eventUrl} passHref legacyBehavior>
            <a target="_blank" rel="noopener noreferrer" href={eventUrl}>
              <Avatar className="size-4 rounded-none">
                {event.cover_url ? (
                  <AvatarImage src={event.cover_url} alt={event.name} />
                ) : (
                  <AvatarFallback className="bg-accent text-[9px]">
                    {event.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
            </a>
          </Link>
          <div className="flex flex-row space-x-1 items-center">
            <CardTitle className="text-xs text-[#878787] font-mono">
              <Link href={eventUrl} passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  href={eventUrl}
                >
                  {event.name}
                </a>
              </Link>
            </CardTitle>
            <span className="text-xs text-[#878787] font-mono">•</span>
            <span className="line-clamp-1 text-xs text-[#878787] font-mono">
              {/* Format date/time as needed */}
              {new Date(event.start_at).toLocaleString()}
            </span>
            {/* Remove conditional blocks for experience, location, workplace */}
          </div>

          <div className="absolute right-0 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-fit bg-[#1c1c1c] text-[#878787] hover:bg-[#2c2c2c] rounded-full font-mono text-xs"
              asChild
            >
              <a
                href={`${eventUrl}?utm_source=cursor.directory&utm_medium=referral&utm_campaign=events-featured`} // Updated campaign name
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </Button>
          </div>
        </div>

        {/* Removed the second CardTitle section which seemed redundant or leftover */}
      </CardHeader>

      <CardContent className="p-0 mt-2 pr-24">
        <p className="text-sm line-clamp-2 text-[#878787]">
          {event.description}
        </p>
      </CardContent>
    </Card>
  );
}
