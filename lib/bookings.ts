// Persists which steps a user has booked, keyed by base trip id, so that the
// booked state survives the round-trip through the standalone /book page and
// is visible from the trips list. In-memory friend presets are not persisted
// here — only the current ("me") user's real bookings.

const KEY = "atlas.booked";

type BookedMap = Record<string, string[]>;

function loadMap(): BookedMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as BookedMap;
    }
    return {};
  } catch {
    return {};
  }
}

function saveMap(map: BookedMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

export function loadBookedStepIds(tripId: string): string[] {
  return loadMap()[tripId] ?? [];
}

export function addBookedStepIds(tripId: string, ids: string[]): void {
  if (ids.length === 0) return;
  const map = loadMap();
  const next = new Set([...(map[tripId] ?? []), ...ids]);
  map[tripId] = Array.from(next);
  saveMap(map);
}

export function removeBookedStepIds(tripId: string, ids: string[]): void {
  if (ids.length === 0) return;
  const map = loadMap();
  const current = map[tripId];
  if (!current) return;
  const drop = new Set(ids);
  map[tripId] = current.filter((id) => !drop.has(id));
  saveMap(map);
}
