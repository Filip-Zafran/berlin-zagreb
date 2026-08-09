import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type TransportRequest = {
  id: string;
  direction: "to-berlin" | "from-berlin";
  travelDate: string;
  pickup: string;
  dropoff: string;
  notes: string;
  passenger: { name: string; initials: string; avatarUrl?: string };
};

type DatabaseRequest = {
  id: string;
  direction: TransportRequest["direction"];
  travel_date: string;
  pickup: string;
  dropoff: string;
  notes: string;
  profiles: { first_name: string; avatar_path: string | null } | null;
};

export async function getUpcomingTransportRequests(): Promise<TransportRequest[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("transport_requests")
    .select("id, direction, travel_date, pickup, dropoff, notes, profiles(first_name, avatar_path)")
    .gte("travel_date", today)
    .order("travel_date");

  return ((data ?? []) as unknown as DatabaseRequest[]).map((row) => {
    const name = row.profiles?.first_name || "Traveller";
    const path = row.profiles?.avatar_path;
    return {
      id: row.id,
      direction: row.direction,
      travelDate: row.travel_date,
      pickup: row.pickup,
      dropoff: row.dropoff,
      notes: row.notes,
      passenger: {
        name,
        initials: name.slice(0, 2).toUpperCase(),
        avatarUrl: path ? supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl : undefined,
      },
    };
  });
}
