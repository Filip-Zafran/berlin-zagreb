export type TripDirection = "berlin-zagreb" | "zagreb-berlin";

export type Driver = {
  id?: string;
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
  flexibilityType: import("@/lib/travel-flexibility").FlexibilityType;
  dateFlexibility?: import("@/lib/travel-flexibility").DateFlexibility;
  timeFlexibility?: import("@/lib/travel-flexibility").TimeFlexibility;
  driver: Driver;
  car: string;
  price: string;
  petFriendly: boolean;
  startCity: "Berlin" | "Zagreb";
  destinationCity: "Berlin" | "Zagreb";
  zagrebSideEndpoint?: string;
  pickup: string;
  dropoff: string;
  stops: string[];
  notes: string;
};
