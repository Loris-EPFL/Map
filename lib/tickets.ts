// Persists transit tickets the user has bought in-app, keyed by base trip id,
// so a purchased leg stays purchased across navigation and reloads. A leg id
// is the pair of stop ids it connects.

const KEY = "atlas.tickets";

// Fired on `window` after a ticket is bought so other components on the same
// screen (e.g. the trip list alongside the map) can refresh without a reload.
export const TICKETS_EVENT = "atlas:tickets";

type TicketMap = Record<string, string[]>;

export function legId(fromStepId: string, toStepId: string): string {
  return `${fromStepId}__${toStepId}`;
}

function loadMap(): TicketMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === null) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as TicketMap;
    }
    return {};
  } catch {
    return {};
  }
}

function saveMap(map: TicketMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

export function loadPurchasedLegIds(tripId: string): string[] {
  return loadMap()[tripId] ?? [];
}

export function addPurchasedLegId(tripId: string, id: string): void {
  const map = loadMap();
  const next = new Set([...(map[tripId] ?? []), id]);
  map[tripId] = Array.from(next);
  saveMap(map);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TICKETS_EVENT, { detail: { tripId } }));
  }
}
