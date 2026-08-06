export type TripDirection = "berlin-zagreb" | "zagreb-berlin";

export type Trip = {
  id: string;
  direction: TripDirection;
  departure: string;
  arrival: string;
  driver: {
    name: string;
    initials: string;
    rating: number;
    rides: number;
  };
  seats: number;
  price: number;
  pickup: string;
  dropoff: string;
};

export const trips: Trip[] = [
  {
    id: "bz-aug-08-marko",
    direction: "berlin-zagreb",
    departure: "2026-08-08T07:30:00+02:00",
    arrival: "2026-08-08T18:15:00+02:00",
    driver: { name: "Marko P.", initials: "MP", rating: 4.9, rides: 28 },
    seats: 3,
    price: 58,
    pickup: "Berlin Hauptbahnhof",
    dropoff: "Zagreb Autobusni kolodvor",
  },
  {
    id: "zb-aug-09-anna",
    direction: "zagreb-berlin",
    departure: "2026-08-09T06:45:00+02:00",
    arrival: "2026-08-09T17:40:00+02:00",
    driver: { name: "Anna K.", initials: "AK", rating: 5, rides: 17 },
    seats: 2,
    price: 62,
    pickup: "Zagreb, Bundek",
    dropoff: "Berlin Südkreuz",
  },
  {
    id: "bz-aug-12-lena",
    direction: "berlin-zagreb",
    departure: "2026-08-12T16:00:00+02:00",
    arrival: "2026-08-13T02:30:00+02:00",
    driver: { name: "Lena S.", initials: "LS", rating: 4.8, rides: 41 },
    seats: 1,
    price: 55,
    pickup: "Berlin Ostbahnhof",
    dropoff: "Zagreb, Novi Zagreb",
  },
  {
    id: "zb-aug-15-ivan",
    direction: "zagreb-berlin",
    departure: "2026-08-15T08:00:00+02:00",
    arrival: "2026-08-15T19:10:00+02:00",
    driver: { name: "Ivan M.", initials: "IM", rating: 4.9, rides: 63 },
    seats: 3,
    price: 60,
    pickup: "Zagreb Glavni kolodvor",
    dropoff: "Berlin Alexanderplatz",
  },
  {
    id: "bz-aug-21-sara",
    direction: "berlin-zagreb",
    departure: "2026-08-21T09:15:00+02:00",
    arrival: "2026-08-21T20:00:00+02:00",
    driver: { name: "Sara B.", initials: "SB", rating: 5, rides: 12 },
    seats: 2,
    price: 65,
    pickup: "Berlin Südkreuz",
    dropoff: "Zagreb Centar",
  },
];
