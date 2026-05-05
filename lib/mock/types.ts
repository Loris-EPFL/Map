export type StepKind =
  | "airport"
  | "hotel"
  | "activity"
  | "restaurant"
  | "transport"
  | "viewpoint";

export type TripStep = {
  id: string;
  kind: StepKind;
  name: string;
  lng: number;
  lat: number;
  time?: string;
  imageUrl: string;
  notes?: string;
};

export type TripDay = {
  dayNumber: number;
  date: string;
  title: string;
  steps: TripStep[];
};

export type TripAuthor = {
  name: string;
  avatarUrl: string;
};

export type Trip = {
  id: string;
  title: string;
  subtitle: string;
  author: TripAuthor;
  coverImageUrl: string;
  startLng: number;
  startLat: number;
  durationDays: number;
  days: TripDay[];
};
