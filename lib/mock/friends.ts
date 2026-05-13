import type { StepKind, Trip } from "./types";

export type Friend = {
  id: string;
  name: string;
  avatarUrl: string;
  tagline: string;
};

const avatar = (seed: string) =>
  `https://i.pravatar.cc/120?u=${encodeURIComponent(seed)}`;

export const FRIENDS: Friend[] = [
  {
    id: "sara",
    name: "Sara Lopez",
    avatarUrl: avatar("friend-sara"),
    tagline: "Books hotels first",
  },
  {
    id: "ben",
    name: "Ben Park",
    avatarUrl: avatar("friend-ben"),
    tagline: "Always finds the best food",
  },
  {
    id: "amelia",
    name: "Amelia Walsh",
    avatarUrl: avatar("friend-amelia"),
    tagline: "Plans every detail in advance",
  },
  {
    id: "lucas",
    name: "Lucas Schmitt",
    avatarUrl: avatar("friend-lucas"),
    tagline: "Loves slow, relaxed days",
  },
];

export const ME: Friend = {
  id: "me",
  name: "You",
  avatarUrl: avatar("me-you"),
  tagline: "",
};

export type SwapChoice = { name: string; imageSeed: string };

export type UserTripState = {
  checked: Set<string>;
  booked: Set<string>;
  confirmed: Set<string>;
  swaps: Record<string, SwapChoice>;
};

type Preset = {
  bookKinds: StepKind[];
  hotelSwap?: SwapChoice;
  restaurantSwap?: SwapChoice;
};

const PRESETS: Record<string, Preset> = {
  me: { bookKinds: [] },
  sara: { bookKinds: ["hotel", "airport"] },
  ben: {
    bookKinds: ["restaurant"],
    restaurantSwap: { name: "Local family-run bistro", imageSeed: "alt-bistro" },
  },
  amelia: {
    bookKinds: [
      "airport",
      "hotel",
      "restaurant",
      "activity",
      "transport",
      "viewpoint",
    ],
    hotelSwap: { name: "The Ritz-Carlton (luxury)", imageSeed: "alt-ritz" },
    restaurantSwap: {
      name: "Michelin-starred tasting menu",
      imageSeed: "alt-tasting",
    },
  },
  lucas: { bookKinds: ["airport"] },
};

export function emptyUserState(): UserTripState {
  return { checked: new Set(), booked: new Set(), confirmed: new Set(), swaps: {} };
}

export function makeUserInitialState(userId: string, trip: Trip): UserTripState {
  const preset = PRESETS[userId];
  if (!preset) return emptyUserState();
  const booked = new Set<string>();
  const swaps: Record<string, SwapChoice> = {};
  trip.days.forEach((day) =>
    day.steps.forEach((step) => {
      if (preset.bookKinds.includes(step.kind)) booked.add(step.id);
      if (preset.hotelSwap && step.kind === "hotel") {
        swaps[step.id] = preset.hotelSwap;
      }
      if (preset.restaurantSwap && step.kind === "restaurant") {
        swaps[step.id] = preset.restaurantSwap;
      }
    })
  );
  return { checked: new Set(), booked, confirmed: new Set(), swaps };
}
