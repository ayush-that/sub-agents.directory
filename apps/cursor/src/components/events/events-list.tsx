import { getEvents } from "@/lib/luma";
import { EventCard } from "./event-card";
import { Host } from "./host";

export async function EventsList() {
  const { entries: events } = await getEvents();

  return (
    <div className="flex gap-8 justify-between mt-6">
      <div className="flex flex-col gap-8 mt-10 max-w-screen-sm xl:max-w-screen-md border-t border-border pt-10">
        {events
          ?.filter((event) => event.event.visibility === "public")
          .map((event) => (
            <EventCard key={event.event.api_id} data={event} />
          ))}
      </div>

      <div className="hidden lg:block">
        <Host />
      </div>
    </div>
  );
}
