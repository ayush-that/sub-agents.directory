const API_ENDPOINT = "https://api.lu.ma/public/v1";

export interface Event {
  api_id: string;
  event: {
    api_id: string;
    calendar_api_id: string;
    created_at: string;
    cover_url: string;
    name: string;
    description: string;
    description_md: string;
    start_at: string;
    duration_interval: string;
    end_at: string;
    geo_address_json: any;
    geo_latitude: string;
    geo_longitude: string;
    url: string;
    timezone: string;
    user_api_id: string;
    visibility: string;
    meeting_url: string | null;
    zoom_meeting_url: string | null;
  };
  tags: string[];
}

export async function getEvents(): Promise<{ entries: Event[] }> {
  const response = await fetch(
    `${API_ENDPOINT}/calendar/list-events?pagination_limit=100`,
    {
      method: "GET",
      headers: {
        "X-Luma-API-Key": process.env.LUMA_API_KEY || "",
      },
    },
  );

  return response.json();
}
