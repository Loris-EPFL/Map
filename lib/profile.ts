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
  startDate: string;
  endDate: string;
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
  startDate: "",
  endDate: "",
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
    // Backfill fields added after a profile was first saved (e.g. the trip
    // date range) so profiles created before this release still work.
    const store = parsed as ProfileStore;
    return {
      ...store,
      profiles: store.profiles.map((p) => ({ ...emptyProfileFields, ...p })),
    };
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

// Parse an ISO yyyy-mm-dd as a local date (avoids the UTC off-by-one that
// `new Date("2026-04-02")` causes in negative-offset timezones).
function parseISODate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function formatDateRange(startISO: string, endISO: string): string {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  if (!start || !end) return "";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const sameYear = start.getFullYear() === end.getFullYear();
  const startStr = start.toLocaleDateString(undefined, opts);
  const endStr = end.toLocaleDateString(undefined, {
    ...opts,
    year: "numeric",
  });
  const days =
    Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
  const range = sameYear
    ? `${startStr} – ${endStr}`
    : `${start.toLocaleDateString(undefined, { ...opts, year: "numeric" })} – ${endStr}`;
  return days > 0 ? `${range} · ${days} ${days === 1 ? "day" : "days"}` : range;
}

export function getActiveProfile(store: ProfileStore | null): Profile | null {
  if (!store || store.profiles.length === 0) return null;
  const byId = store.profiles.find((p) => p.id === store.activeProfileId);
  return byId ?? store.profiles[0];
}
