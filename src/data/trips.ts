export type TripDirection = "berlin-zagreb" | "zagreb-berlin";

export type Driver = {
  name: string;
  initials: string;
  photo: string;
  avatarUrl?: string;
  bio: string;
  languages: string[];
};

export type Trip = {
  id: string;
  direction: TripDirection;
  departure: string;
  driver: Driver;
  car: string;
  startCity: "Berlin" | "Zagreb";
  destinationCity: "Berlin" | "Zagreb";
  pickup: string;
  dropoff: string;
  stops: string[];
  notes: string;
};

const drivers = {
  marko: { name: "Marko P.", initials: "MP", photo: "from-blue-500 to-indigo-700", bio: "Frequent Berlin–Zagreb driver who enjoys relaxed, well-planned journeys.", languages: ["Croatian", "German", "English"] },
  anna: { name: "Anna K.", initials: "AK", photo: "from-orange-400 to-rose-600", bio: "Living between two cities and happy to share the drive.", languages: ["German", "English", "Croatian"] },
  lena: { name: "Lena S.", initials: "LS", photo: "from-cyan-500 to-blue-700", bio: "Calm driver, podcast fan, and regular visitor to Zagreb.", languages: ["German", "English"] },
  ivan: { name: "Ivan M.", initials: "IM", photo: "from-amber-400 to-orange-700", bio: "Based in Zagreb and travelling north several times each month.", languages: ["Croatian", "German"] },
  sara: { name: "Sara B.", initials: "SB", photo: "from-violet-500 to-fuchsia-700", bio: "Designer, careful driver, and always ready with a good playlist.", languages: ["Croatian", "English"] },
  tomas: { name: "Tomas R.", initials: "TR", photo: "from-sky-400 to-cyan-700", bio: "Weekend traveller who prefers an early start and scenic breaks.", languages: ["German", "Czech", "English"] },
  petra: { name: "Petra V.", initials: "PV", photo: "from-red-400 to-orange-600", bio: "Friendly Zagreb local with plenty of long-distance driving experience.", languages: ["Croatian", "English", "German"] },
  emir: { name: "Emir H.", initials: "EH", photo: "from-emerald-400 to-teal-700", bio: "Easy-going driver who values punctuality and good conversation.", languages: ["Bosnian", "German", "English"] },
  mia: { name: "Mia J.", initials: "MJ", photo: "from-pink-400 to-rose-700", bio: "Musician travelling regularly between family and work.", languages: ["Croatian", "German", "English"] },
  nikola: { name: "Nikola D.", initials: "ND", photo: "from-slate-500 to-slate-800", bio: "Experienced motorway driver who keeps every trip straightforward.", languages: ["Croatian", "German"] },
} satisfies Record<string, Driver>;

export const trips: Trip[] = [
  { id: "berlin-zagreb-marko", direction: "berlin-zagreb", departure: "2026-08-08T07:30:00+02:00", driver: drivers.marko, car: "Volkswagen Passat", startCity: "Berlin", destinationCity: "Zagreb", pickup: "Berlin Hauptbahnhof", dropoff: "Zagreb Autobusni kolodvor", stops: ["Dresden", "Prague", "Vienna", "Graz"], notes: "One longer lunch break near Vienna. Medium luggage is welcome." },
  { id: "zagreb-berlin-anna", direction: "zagreb-berlin", departure: "2026-08-09T06:45:00+02:00", driver: drivers.anna, car: "Škoda Octavia", startCity: "Zagreb", destinationCity: "Berlin", pickup: "Zagreb, Bundek", dropoff: "Berlin Südkreuz", stops: ["Graz", "Vienna", "Prague", "Dresden"], notes: "Early departure to avoid traffic. Coffee stops along the way." },
  { id: "berlin-zagreb-lena", direction: "berlin-zagreb", departure: "2026-08-12T16:00:00+02:00", driver: drivers.lena, car: "Toyota Corolla Touring Sports", startCity: "Berlin", destinationCity: "Zagreb", pickup: "Berlin Ostbahnhof", dropoff: "Zagreb, Novi Zagreb", stops: ["Dresden", "Prague", "Vienna", "Maribor"], notes: "Overnight ride with regular breaks. Quiet music after midnight." },
  { id: "zagreb-berlin-ivan", direction: "zagreb-berlin", departure: "2026-08-15T08:00:00+02:00", driver: drivers.ivan, car: "Audi A4 Avant", startCity: "Zagreb", destinationCity: "Berlin", pickup: "Zagreb Glavni kolodvor", dropoff: "Berlin Alexanderplatz", stops: ["Graz", "Vienna", "Brno", "Dresden"], notes: "Flexible pickup in central Zagreb if arranged beforehand." },
  { id: "berlin-zagreb-sara", direction: "berlin-zagreb", departure: "2026-08-21T09:15:00+02:00", driver: drivers.sara, car: "Volvo V60", startCity: "Berlin", destinationCity: "Zagreb", pickup: "Berlin Südkreuz", dropoff: "Zagreb Centar", stops: ["Leipzig", "Prague", "Vienna", "Graz"], notes: "A relaxed daytime trip. Small pets are welcome in a carrier." },
  { id: "zagreb-berlin-petra", direction: "zagreb-berlin", departure: "2026-08-23T07:00:00+02:00", driver: drivers.petra, car: "Renault Mégane", startCity: "Zagreb", destinationCity: "Berlin", pickup: "Zagreb, Trešnjevka", dropoff: "Berlin Hauptbahnhof", stops: ["Maribor", "Vienna", "Prague", "Dresden"], notes: "Please travel with one reasonably sized bag. Non-smoking car." },
  { id: "berlin-zagreb-tomas", direction: "berlin-zagreb", departure: "2026-08-27T06:30:00+02:00", driver: drivers.tomas, car: "Ford Mondeo", startCity: "Berlin", destinationCity: "Zagreb", pickup: "Berlin Alexanderplatz", dropoff: "Zagreb Glavni kolodvor", stops: ["Dresden", "Prague", "Brno", "Vienna", "Graz"], notes: "Scenic route with a breakfast stop outside Prague." },
  { id: "zagreb-berlin-emir", direction: "zagreb-berlin", departure: "2026-09-02T14:30:00+02:00", driver: drivers.emir, car: "BMW 3 Series Touring", startCity: "Zagreb", destinationCity: "Berlin", pickup: "Zagreb Autobusni kolodvor", dropoff: "Berlin Neukölln", stops: ["Graz", "Vienna", "Prague"], notes: "Afternoon departure. We will arrive in Berlin early the next morning." },
  { id: "berlin-zagreb-mia", direction: "berlin-zagreb", departure: "2026-09-05T08:45:00+02:00", driver: drivers.mia, car: "Peugeot 508", startCity: "Berlin", destinationCity: "Zagreb", pickup: "Berlin Charlottenburg", dropoff: "Zagreb, Maksimir", stops: ["Dresden", "Prague", "Vienna", "Maribor"], notes: "There is room for a small suitcase and backpack per person." },
  { id: "zagreb-berlin-nikola", direction: "zagreb-berlin", departure: "2026-09-11T05:45:00+02:00", driver: drivers.nikola, car: "Mercedes-Benz C-Class", startCity: "Zagreb", destinationCity: "Berlin", pickup: "Zagreb, Maksimir", dropoff: "Berlin Ostbahnhof", stops: ["Graz", "Vienna", "Prague", "Dresden"], notes: "Prompt departure. Two planned meal breaks and short fuel stops." },
];

export function getTrip(id: string) {
  return trips.find((trip) => trip.id === id);
}
