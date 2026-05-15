import { haversineKm } from "./disruptions";

export type TransportMode = "foot" | "metro" | "bus" | "car" | "train";

export type LegInfo = {
  mode: TransportMode;
  label: string;
  /** Estimated door-to-door minutes (incl. a little waiting/overhead). */
  minutes: number;
  km: number;
  /** One short, practical line of extra info. */
  tip: string;
  /** True for transit legs where a ticket can be bought in-app. */
  needsTicket: boolean;
  /** Ticket price in USD (0 when no ticket is needed). */
  price: number;
};

const NEEDS_TICKET: Record<TransportMode, boolean> = {
  foot: false,
  metro: true,
  bus: true,
  train: true,
  car: false,
};

function priceFor(mode: TransportMode, km: number): number {
  switch (mode) {
    case "metro":
      return 3;
    case "bus":
      return 2.5;
    case "train":
      return Math.round((5 + km * 0.12) * 100) / 100;
    default:
      return 0;
  }
}

const LABELS: Record<TransportMode, string> = {
  foot: "On foot",
  metro: "By metro",
  bus: "By bus",
  car: "By car",
  train: "By train",
};

// km/h including stops/traffic, plus a fixed overhead (min) for waiting.
const SPEED: Record<TransportMode, number> = {
  foot: 4.8,
  metro: 32,
  bus: 22,
  car: 40,
  train: 90,
};
const OVERHEAD: Record<TransportMode, number> = {
  foot: 0,
  metro: 5,
  bus: 6,
  car: 3,
  train: 12,
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0x7fffffff;
  return h;
}

function pickMode(km: number, seed: number): TransportMode {
  if (km < 1.0) return "foot";
  if (km < 4) return seed % 2 === 0 ? "metro" : "bus";
  if (km < 20) return seed % 2 === 0 ? "bus" : "car";
  if (km < 120) return seed % 2 === 0 ? "car" : "train";
  return "train";
}

function tipFor(mode: TransportMode, km: number): string {
  switch (mode) {
    case "foot":
      return "Easy walk — comfy shoes recommended.";
    case "metro": {
      const stops = Math.max(1, Math.round(km / 0.8));
      return `≈ ${stops} ${stops === 1 ? "stop" : "stops"} · buy your ticket below.`;
    }
    case "bus":
      return "Hop on once you've got your ticket below.";
    case "car":
      return "Taxi or rideshare — time varies with traffic.";
    case "train":
      return "Reserve your seat by buying the ticket below.";
  }
}

/**
 * Deterministic transport estimate for the leg between two consecutive
 * itinerary stops. Stable across renders for the same pair of coordinates.
 */
export function legInfo(
  a: { lng: number; lat: number },
  b: { lng: number; lat: number }
): LegInfo {
  const km = haversineKm(a, b);
  const seed = hash(
    `${a.lng.toFixed(4)},${a.lat.toFixed(4)}|${b.lng.toFixed(4)},${b.lat.toFixed(4)}`
  );
  const mode = pickMode(km, seed);
  const minutes = Math.max(
    1,
    Math.round((km / SPEED[mode]) * 60) + OVERHEAD[mode]
  );
  return {
    mode,
    label: LABELS[mode],
    minutes,
    km: Math.round(km * 10) / 10,
    tip: tipFor(mode, km),
    needsTicket: NEEDS_TICKET[mode],
    price: priceFor(mode, km),
  };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
