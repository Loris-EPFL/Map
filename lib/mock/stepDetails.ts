import type { StepKind, TripStep } from "./types";

export type StepDetails = {
  openHours: string;
  duration: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  description: string;
  tips: string[];
  amenities: string[];
  reservationRequired: boolean;
  bestTime: string;
  phone: string;
  website: string;
};

function seedFrom(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function mulberry32(seedRef: { v: number }) {
  return () => {
    seedRef.v = (seedRef.v + 0x6d2b79f5) | 0;
    let t = Math.imul(seedRef.v ^ (seedRef.v >>> 15), 1 | seedRef.v);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HOURS: Record<StepKind, string[]> = {
  airport: ["Open 24 hours", "Open 24 hours · Terminal 1-3"],
  hotel: [
    "Check-in 15:00 · Check-out 11:00",
    "Reception open 24 hours · Check-in 14:00",
  ],
  activity: [
    "Daily 09:00 – 18:00",
    "Tue – Sun 10:00 – 17:00 · Closed Mondays",
    "Daily 08:30 – 17:30",
    "Daily 09:30 – 19:00 · Last entry 18:00",
  ],
  restaurant: [
    "Lunch 12:00 – 14:30 · Dinner 19:00 – 23:00",
    "Daily 11:00 – 22:30",
    "Tue – Sun 18:00 – 24:00 · Closed Mondays",
  ],
  transport: [
    "Service 05:30 – 00:30 · Every 5-10 min",
    "Departures every 15 minutes",
  ],
  viewpoint: [
    "Open at all times",
    "Open 06:00 – 22:00",
    "Sunset access until 30 min after sunset",
  ],
};

const DURATIONS: Record<StepKind, string[]> = {
  airport: ["Allow 2–3 hours for check-in + security"],
  hotel: ["Overnight stay"],
  activity: ["~1 hour", "~2 hours", "~3 hours", "Half day"],
  restaurant: ["~1 hour", "~1.5 hours", "~2 hours"],
  transport: ["15 min", "30 min", "1 hour"],
  viewpoint: ["~30 min", "~1 hour"],
};

const BEST_TIME: Record<StepKind, string[]> = {
  airport: ["Avoid 17:00 – 20:00 peak hours"],
  hotel: ["—"],
  activity: [
    "Mornings are quietest",
    "Weekdays after 14:00 are calmest",
    "Avoid weekends and holidays",
  ],
  restaurant: ["Book at least 48h ahead", "Lunch is calmer than dinner"],
  transport: ["Off-peak: 10:00 – 16:00"],
  viewpoint: [
    "30 minutes before sunset",
    "Sunrise (arrive 20 min early)",
    "Clear-sky mornings",
  ],
};

const AMENITIES: Record<StepKind, string[][]> = {
  airport: [
    ["Free Wi-Fi", "Lounges", "Currency exchange", "Duty-free", "Showers"],
  ],
  hotel: [
    ["Free Wi-Fi", "Breakfast included", "24h gym", "Rooftop bar"],
    ["Free Wi-Fi", "Pool", "Spa", "Concierge", "Pet-friendly"],
    ["Free Wi-Fi", "Bar", "Restaurant", "Room service", "Laundry"],
  ],
  activity: [
    ["Guided tours", "Audio guide", "Photography allowed"],
    ["Wheelchair access", "Cloakroom", "Gift shop"],
  ],
  restaurant: [
    ["Outdoor seating", "Vegetarian options", "Wine list"],
    ["Vegan options", "Gluten-free menu", "Wheelchair access"],
    ["Reservations recommended", "Private dining", "Live music weekends"],
  ],
  transport: [["Wheelchair accessible", "Bike racks", "Contactless payment"]],
  viewpoint: [["Photo spot", "Benches", "Free to enter"]],
};

const TIPS: Record<StepKind, string[][]> = {
  airport: [
    [
      "Arrive at least 2h early for international flights.",
      "Priority lanes available with frequent-flyer status.",
      "Terminal map kiosks near every gate cluster.",
    ],
  ],
  hotel: [
    [
      "Request a high-floor room for the best views.",
      "Concierge can secure last-minute restaurant reservations.",
      "Late check-out is often free if asked the day before.",
    ],
    [
      "Book the spa session in advance — slots fill fast.",
      "Breakfast is best before 9:00.",
    ],
  ],
  activity: [
    [
      "Buy tickets online to skip the queue.",
      "Wear comfortable shoes — lots of walking.",
      "Photography is allowed but no flash inside.",
    ],
    [
      "Free entry on the first Sunday of each month.",
      "An audio guide is included with the ticket.",
    ],
  ],
  restaurant: [
    [
      "Book 48 hours ahead — it sells out.",
      "Ask for the chef's tasting menu if you have 2 hours.",
    ],
    [
      "Window tables are first-come first-served.",
      "Cash only for parties under 4.",
    ],
  ],
  transport: [
    ["A multi-day pass pays back after 3 rides.", "Tap on AND tap off."],
  ],
  viewpoint: [
    [
      "Sunset on the horizon is 20 min before the official time.",
      "Bring a light jacket — it gets cool quickly.",
      "Tripods are allowed outside the safety rail.",
    ],
  ],
};

const PRICES: Record<StepKind, (1 | 2 | 3 | 4)[]> = {
  airport: [1],
  hotel: [3, 4],
  activity: [2, 3],
  restaurant: [2, 3, 4],
  transport: [1, 2],
  viewpoint: [1],
};

function fmtCoord(v: number, posLabel: string, negLabel: string) {
  return `${Math.abs(v).toFixed(3)}° ${v >= 0 ? posLabel : negLabel}`;
}

export function getStepDetails(step: TripStep): StepDetails {
  const seedRef = { v: seedFrom(step.id) };
  const rand = mulberry32(seedRef);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)] ?? arr[0];

  const openHours = pick(HOURS[step.kind]);
  const duration = pick(DURATIONS[step.kind]);
  const bestTime = pick(BEST_TIME[step.kind]);
  const amenities = pick(AMENITIES[step.kind]);
  const tips = pick(TIPS[step.kind]);
  const priceLevel = pick(PRICES[step.kind]);
  const rating = Math.round((3.6 + rand() * 1.3) * 10) / 10;
  const reviewCount = 80 + Math.floor(rand() * 6200);

  const lng = fmtCoord(step.lng, "E", "W");
  const lat = fmtCoord(step.lat, "N", "S");
  const location = `${lat}, ${lng}`;

  const kindBlurb: Record<StepKind, string> = {
    airport:
      "A modern hub with clear signage and quick connections into the city.",
    hotel:
      "Known for warm service, comfortable rooms, and a great location for exploring the neighborhood on foot.",
    activity:
      "A long-time favorite among travelers who want to feel the character of the place rather than just tick it off a list.",
    restaurant:
      "A standout for its atmosphere, fresh ingredients, and a menu that's evolved over the years without losing its identity.",
    transport:
      "Reliable, easy to figure out, and the fastest way to cover the distance without the hassle of driving.",
    viewpoint:
      "One of those spots that completely reframes the city — most people end up staying longer than they planned.",
  };

  const phoneArea = 100 + Math.floor(rand() * 900);
  const phoneRest = 1000 + Math.floor(rand() * 9000);
  const phone = `+1 555 ${phoneArea} ${phoneRest}`;

  const slug = step.id.replace(/[^a-z0-9-]/gi, "");

  return {
    openHours,
    duration,
    location,
    rating,
    reviewCount,
    priceLevel,
    description:
      (step.notes ? step.notes + " " : "") + kindBlurb[step.kind],
    tips,
    amenities,
    reservationRequired: step.kind === "restaurant" || step.kind === "hotel",
    bestTime,
    phone,
    website: `https://atlas.example/${slug}`,
  };
}
