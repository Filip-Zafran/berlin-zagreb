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
