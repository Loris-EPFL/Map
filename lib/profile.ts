export type TravelStyle = "solo" | "couple" | "family" | "friends";
export type Vibe =
  | "beach"
  | "mountains"
  | "cities"
  | "countryside"
  | "deserts"
  | "islands"
  | "forests"
  | "tropical";
export type Pace = "relaxed" | "balanced" | "packed";
export type Budget = "budget" | "midrange" | "luxury";
export type Interest =
  | "food"
  | "museums"
  | "hiking"
  | "nightlife"
  | "architecture"
  | "photography"
  | "wildlife"
  | "wellness";

export type Profile = {
  id: string;
  label: string;
  tripTypes: string[];
  name: string;
  age: number | "";
  homeCity: string;
  travelStyle: TravelStyle | "";
  vibes: Vibe[];
  pace: Pace | "";
  budget: Budget | "";
  interests: Interest[];
  bio: string;
  updatedAt?: string;
};

export type ProfileStore = {
  profiles: Profile[];
  activeProfileId: string | null;
};

export const PROFILE_KEY = "atlas.profile";

export const emptyProfileFields: Omit<Profile, "id" | "label"> = {
  tripTypes: [],
  name: "",
  age: "",
  homeCity: "",
  travelStyle: "",
  vibes: [],
  pace: "",
  budget: "",
  interests: [],
  bio: "",
};

export function newProfileId(): string {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createProfile(label = "New trip"): Profile {
  return {
    id: newProfileId(),
    label,
    ...emptyProfileFields,
  };
}

export function createEmptyStore(): ProfileStore {
  const first = createProfile("My trip");
  return { profiles: [first], activeProfileId: first.id };
}

export function loadStore(): ProfileStore | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Migrate from legacy single-profile shape
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed.profiles)) {
      const migrated: Profile = {
        ...emptyProfileFields,
        ...parsed,
        id: newProfileId(),
        label: parsed.label || "My trip",
      };
      return { profiles: [migrated], activeProfileId: migrated.id };
    }
    return parsed as ProfileStore;
  } catch {
    return null;
  }
}

export function saveStore(store: ProfileStore): void {
  if (typeof window === "undefined") return;
  const stamp = new Date().toISOString();
  const stamped: ProfileStore = {
    ...store,
    profiles: store.profiles.map((p) => ({ ...p, updatedAt: stamp })),
  };
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(stamped));
}

export function clearStore(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
}

export function getActiveProfile(store: ProfileStore | null): Profile | null {
  if (!store || store.profiles.length === 0) return null;
  const byId = store.profiles.find((p) => p.id === store.activeProfileId);
  return byId ?? store.profiles[0];
}
