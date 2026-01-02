import { EventsList } from "@/components/events/events-list";

export const metadata = {
  title: "Events | Cursor Directory",
  description: "Find your next Cursor Community event with Cursor Directory",
};

export const revalidate = 3600;

export default async function Page() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 md:mt-24 pb-32">
      <h1 className="text-xl mb-2">Cursor Community Events</h1>
      <p className="text-sm text-[#878787] mb-8">
        Join your local Cursor Community meetups and events.
      </p>

      <EventsList />
    </div>
  );
}
