import { trips as demoTrips, type Trip } from "@/data/trips";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type DatabaseTrip = {
  id: string; direction: Trip["direction"]; departure_at: string; car_model: string; starting_city: "Berlin" | "Zagreb"; destination_city: "Berlin" | "Zagreb"; notes: string;
  profiles: { first_name: string; avatar_path: string | null; bio: string; languages: string[] } | null;
  trip_stops: { city: string; position: number }[];
};

function mapTrip(row: DatabaseTrip, avatarUrl?: string): Trip {
  const name = row.profiles?.first_name || "Driver";
  return { id: row.id, direction: row.direction, departure: row.departure_at, car: row.car_model, startCity: row.starting_city, destinationCity: row.destination_city, pickup: row.starting_city, dropoff: row.destination_city, stops: [...(row.trip_stops || [])].sort((a, b) => a.position - b.position).map((stop) => stop.city), notes: row.notes, driver: { name, initials: name.slice(0, 2).toUpperCase(), photo: "from-blue-500 to-indigo-700", avatarUrl, bio: row.profiles?.bio || "Driver travelling between Berlin and Zagreb.", languages: row.profiles?.languages || [] } };
}

export async function getUpcomingTrips() {
  if (!isSupabaseConfigured()) return demoTrips;
  const supabase = await createClient();
  const { data } = await supabase.from("trips").select("id, direction, departure_at, car_model, starting_city, destination_city, notes, profiles(first_name, avatar_path, bio, languages), trip_stops(city, position)").gte("departure_at", new Date().toISOString()).order("departure_at");
  return ((data ?? []) as unknown as DatabaseTrip[]).map((row) => {
    const path = row.profiles?.avatar_path; const avatarUrl = path ? supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl : undefined;
    return mapTrip(row, avatarUrl);
  });
}

export async function getPublishedTrip(id: string) {
  const demo = demoTrips.find((trip) => trip.id === id); if (demo) return demo;
  if (!isSupabaseConfigured()) return undefined;
  const supabase = await createClient();
  const { data } = await supabase.from("trips").select("id, direction, departure_at, car_model, starting_city, destination_city, notes, profiles(first_name, avatar_path, bio, languages), trip_stops(city, position)").eq("id", id).single();
  if (!data) return undefined; const row = data as unknown as DatabaseTrip; const path = row.profiles?.avatar_path;
  return mapTrip(row, path ? supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl : undefined);
}
