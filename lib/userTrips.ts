export type UserTripStatus = "planning" | "completed";

export type UserTrip = {
  id: string;
  name: string;
  baseTripId: string;
  status: UserTripStatus;
  savedAt: string;
  completedAt?: string;
};

const KEY = "atlas.userTrips";

const SEED: UserTrip[] = [
  {
    id: "u_tokyo_seed",
    name: "Tokyo April trip",
    baseTripId: "tokyo-spring",
    status: "planning",
    savedAt: "2026-03-15T10:00:00.000Z",
  },
  {
    id: "u_iceland_seed",
    name: "Iceland honeymoon",
    baseTripId: "iceland-golden-circle",
    status: "completed",
    savedAt: "2025-12-10T10:00:00.000Z",
    completedAt: "2026-02-28T10:00:00.000Z",
  },
  {
    id: "u_bali_seed",
    name: "Bali yoga retreat",
    baseTripId: "bali-ubud",
    status: "planning",
    savedAt: "2026-04-01T10:00:00.000Z",
  },
];

export function loadUserTrips(): UserTrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return [...SEED];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...SEED];
    return parsed as UserTrip[];
  } catch {
    return [...SEED];
  }
}

export function saveUserTrips(trips: UserTrip[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(trips));
}

export function newUserTripId(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function addUserTrip(baseTripId: string, name: string): UserTrip {
  const trip: UserTrip = {
    id: newUserTripId(),
    name,
    baseTripId,
    status: "planning",
    savedAt: new Date().toISOString(),
  };
  const list = loadUserTrips();
  saveUserTrips([trip, ...list]);
  return trip;
}

export function updateUserTrip(id: string, patch: Partial<UserTrip>): UserTrip[] {
  const list = loadUserTrips().map((t) =>
    t.id === id ? { ...t, ...patch } : t
  );
  saveUserTrips(list);
  return list;
}

export function deleteUserTrip(id: string): UserTrip[] {
  const list = loadUserTrips().filter((t) => t.id !== id);
  saveUserTrips(list);
  return list;
}

export function toggleUserTripStatus(id: string): UserTrip[] {
  const list = loadUserTrips().map((t) => {
    if (t.id !== id) return t;
    if (t.status === "completed") {
      const { completedAt: _drop, ...rest } = t;
      return { ...rest, status: "planning" as const };
    }
    return { ...t, status: "completed" as const, completedAt: new Date().toISOString() };
  });
  saveUserTrips(list);
  return list;
}
