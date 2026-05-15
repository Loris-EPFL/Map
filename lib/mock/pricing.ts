import type { StepKind, TripStep } from "./types";

// Indicative price band (USD) per stop kind. Shared by the itinerary view and
// the booking checkout so a stop shows the same price in both places.
export const PRICE_RANGES: Record<StepKind, [number, number]> = {
  airport: [20, 40],
  hotel: [89, 299],
  activity: [25, 120],
  restaurant: [18, 75],
  transport: [5, 28],
  viewpoint: [0, 18],
};

// Single source of truth for the fees the checkout adds on top of the base
// price. Displayed prices use these so what the user sees up front matches
// what they pay at booking.
export const SERVICE_FEE_RATE = 0.08;
export const TAX_RATE = 0.1;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Deterministic base price for a stop, derived from its id (excludes fees). */
export function stepPrice(step: TripStep): number {
  const [min, max] = PRICE_RANGES[step.kind];
  let h = 0;
  for (const c of step.id) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff;
  const t = h / 0x7fffffff;
  return round2(min + t * (max - min));
}

/** All-in price for a stop: base + service fee + taxes. */
export function grossStepPrice(step: TripStep): number {
  return round2(stepPrice(step) * (1 + SERVICE_FEE_RATE + TAX_RATE));
}

/** All-in total for a set of stops, matching the booking checkout total. */
export function grossTotal(steps: TripStep[]): number {
  const subtotal = steps.reduce((acc, s) => acc + stepPrice(s), 0);
  const serviceFee = round2(subtotal * SERVICE_FEE_RATE);
  const taxes = round2(subtotal * TAX_RATE);
  return round2(subtotal + serviceFee + taxes);
}

export function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
