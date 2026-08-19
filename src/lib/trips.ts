import type { Trip } from "@/data/trips";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type DatabaseTrip = {
  driver_id: string;
  id: string; direction: Trip["direction"]; departure_at: string; flexibility_type: Trip["flexibilityType"]; date_flexibility: Trip["dateFlexibility"] | null; time_flexibility: Trip["timeFlexibility"] | null; car_model: string; price: string; pet_friendly: boolean; starting_city: "Berlin" | "Zagreb"; destination_city: "Berlin" | "Zagreb"; zagreb_side_endpoint: string | null; notes: string;
  profiles: { first_name: string; avatar_path: string | null; bio: string; languages: string[] } | null;
  trip_stops: { city: string; position: number }[];
};

function mapTrip(row: DatabaseTrip, avatarUrl?: string): Trip {
  const name = row.profiles?.first_name || "Driver";
  const endpoint = row.zagreb_side_endpoint || undefined;
  return { id: row.id, direction: row.direction, departure: row.departure_at, flexibilityType: row.flexibility_type || "fixed", dateFlexibility: row.date_flexibility || undefined, timeFlexibility: row.time_flexibility || undefined, car: row.car_model, price: row.price, petFriendly: row.pet_friendly, startCity: row.starting_city, destinationCity: row.destination_city, zagrebSideEndpoint: endpoint, pickup: row.direction === "zagreb-berlin" && endpoint ? endpoint : row.starting_city, dropoff: row.direction === "berlin-zagreb" && endpoint ? endpoint : row.destination_city, stops: [...(row.trip_stops || [])].sort((a, b) => a.position - b.position).map((stop) => stop.city), notes: row.notes, driver: { id: row.driver_id, name, initials: name.slice(0, 2).toUpperCase(), photo: "from-blue-500 to-indigo-700", avatarUrl, bio: row.profiles?.bio || "Driver travelling between Berlin and Zagreb.", languages: row.profiles?.languages || [] } };
}

export async function getUpcomingTrips() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("trips").select("id, driver_id, direction, departure_at, flexibility_type, date_flexibility, time_flexibility, car_model, price, pet_friendly, starting_city, destination_city, zagreb_side_endpoint, notes, profiles(first_name, avatar_path, bio, languages), trip_stops(city, position)").gte("departure_at", new Date().toISOString()).order("departure_at");
  return ((data ?? []) as unknown as DatabaseTrip[]).map((row) => {
    const path = row.profiles?.avatar_path; const avatarUrl = path ? supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl : undefined;
    return mapTrip(row, avatarUrl);
  });
}

export async function getPublishedTrip(id: string) {
  if (!isSupabaseConfigured()) return undefined;
  const supabase = await createClient();
  const { data } = await supabase.from("trips").select("id, driver_id, direction, departure_at, flexibility_type, date_flexibility, time_flexibility, car_model, price, pet_friendly, starting_city, destination_city, zagreb_side_endpoint, notes, profiles(first_name, avatar_path, bio, languages), trip_stops(city, position)").eq("id", id).single();
  if (!data) return undefined; const row = data as unknown as DatabaseTrip; const path = row.profiles?.avatar_path;
  return mapTrip(row, path ? supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl : undefined);
}
