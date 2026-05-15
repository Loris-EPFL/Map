import type { StepKind } from "./types";
import { inWindow } from "@/lib/time";

export type DisruptionKind = "rain" | "storm" | "closure" | "heat";

export type DisruptionSuggestion = {
  name: string;
  imageSeed: string;
  kind: StepKind;
  lng: number;
  lat: number;
};

export type Disruption = {
  id: string;
  tripId: string;
  dayNumber: number;
  kind: DisruptionKind;
  title: string;
  message: string;
  window: { start: string; end: string };
  affectedKinds?: StepKind[];
  affectedStepIds?: string[];
  dependentStepId?: string;
  shiftMinutes: number;
  suggestions: DisruptionSuggestion[];
};

export const DISRUPTIONS: Disruption[] = [
  {
    id: "lisbon-rain-d3",
    tripId: "lisbon-fado",
    dayNumber: 3,
    kind: "rain",
    title: "Weather Alert",
    message: "Heavy rain expected 2–6pm. We've found alternatives.",
    window: { start: "14:00", end: "18:00" },
    affectedStepIds: ["li-3-3"],
    dependentStepId: "li-3-4",
    shiftMinutes: 30,
    suggestions: [
      { name: "National Tile Museum", imageSeed: "azulejo-museum", kind: "activity", lng: -9.1136, lat: 38.7253 },
      { name: "Lisbon Oceanarium", imageSeed: "oceanario-lisboa", kind: "activity", lng: -9.0939, lat: 38.7633 },
      { name: "Time Out Market food tour", imageSeed: "timeout-market", kind: "restaurant", lng: -9.1462, lat: 38.7067 },
    ],
  },
  {
    id: "nyc-storm-d2",
    tripId: "nyc-three-days",
    dayNumber: 2,
    kind: "storm",
    title: "Storm Warning",
    message: "Thunderstorms rolling in this afternoon. Indoor options nearby.",
    window: { start: "15:00", end: "19:00" },
    affectedStepIds: ["n-2-3"],
    dependentStepId: "n-2-4",
    shiftMinutes: 30,
    suggestions: [
      { name: "The Met Museum", imageSeed: "the-met", kind: "activity", lng: -73.9632, lat: 40.7794 },
      { name: "Brooklyn Museum", imageSeed: "brooklyn-museum", kind: "activity", lng: -73.9636, lat: 40.6712 },
      { name: "Chelsea Market food hall", imageSeed: "chelsea-market", kind: "restaurant", lng: -74.0061, lat: 40.7424 },
    ],
  },
  {
    id: "rome-closure-d3",
    tripId: "rome-eternal",
    dayNumber: 3,
    kind: "closure",
    title: "Venue Closed",
    message: "Castel Sant'Angelo is closed today — alternatives nearby.",
    window: { start: "00:00", end: "23:59" },
    affectedStepIds: ["r-3-3"],
    shiftMinutes: 0,
    suggestions: [
      { name: "Galleria Doria Pamphilj", imageSeed: "doria-pamphilj", kind: "activity", lng: 12.4817, lat: 41.8983 },
      { name: "Castel Sant'Angelo gardens", imageSeed: "castel-gardens", kind: "viewpoint", lng: 12.4669, lat: 41.9036 },
      { name: "Lunch in Borgo Pio", imageSeed: "borgo-pio", kind: "restaurant", lng: 12.4585, lat: 41.9030 },
    ],
  },
  {
    id: "tokyo-heat-d3",
    tripId: "tokyo-spring",
    dayNumber: 3,
    kind: "heat",
    title: "Heat Advisory",
    message: "Extreme heat 11am–4pm. Cooler indoor picks nearby.",
    window: { start: "11:00", end: "16:00" },
    affectedStepIds: ["t-3-2"],
    dependentStepId: "t-3-3",
    shiftMinutes: 30,
    suggestions: [
      { name: "teamLab Planets", imageSeed: "teamlab-planets", kind: "activity", lng: 139.7901, lat: 35.6486 },
      { name: "Sumida Aquarium", imageSeed: "sumida-aquarium", kind: "activity", lng: 139.8107, lat: 35.7100 },
      { name: "Edo-Tokyo Museum", imageSeed: "edo-tokyo-museum", kind: "activity", lng: 139.7956, lat: 35.6963 },
    ],
  },
  {
    id: "capetown-storm-d2",
    tripId: "cape-town-summit",
    dayNumber: 2,
    kind: "storm",
    title: "High-Wind Closure",
    message: "Gale-force wind — Table Mountain cableway is shut. Alternatives below.",
    window: { start: "00:00", end: "23:59" },
    affectedStepIds: ["c-2-1"],
    shiftMinutes: 0,
    suggestions: [
      { name: "Kirstenbosch Botanical Garden", imageSeed: "kirstenbosch", kind: "activity", lng: 18.4326, lat: -33.9881 },
      { name: "Zeitz MOCAA museum", imageSeed: "zeitz-mocaa", kind: "activity", lng: 18.4232, lat: -33.9075 },
      { name: "District Six Museum", imageSeed: "district-six", kind: "activity", lng: 18.4255, lat: -33.9281 },
    ],
  },
  {
    id: "bali-storm-d2",
    tripId: "bali-ubud",
    dayNumber: 2,
    kind: "storm",
    title: "Storm Warning",
    message: "Lightning over Mt. Batur — the trek is suspended this afternoon.",
    window: { start: "11:00", end: "18:00" },
    affectedStepIds: ["b-2-2"],
    dependentStepId: "b-2-3",
    shiftMinutes: 30,
    suggestions: [
      { name: "ARMA Museum, Ubud", imageSeed: "arma-museum", kind: "activity", lng: 115.2620, lat: -8.5230 },
      { name: "Goa Gajah Elephant Cave", imageSeed: "goa-gajah", kind: "activity", lng: 115.2872, lat: -8.5236 },
      { name: "Ubud cooking class", imageSeed: "ubud-cooking", kind: "restaurant", lng: 115.2640, lat: -8.5060 },
    ],
  },
  {
    id: "iceland-storm-d2",
    tripId: "iceland-golden-circle",
    dayNumber: 2,
    kind: "storm",
    title: "Wind Storm",
    message: "Severe wind on the Golden Circle road this afternoon.",
    window: { start: "12:00", end: "18:00" },
    affectedStepIds: ["i-2-3"],
    shiftMinutes: 0,
    suggestions: [
      { name: "Friðheimar tomato farm", imageSeed: "fridheimar", kind: "restaurant", lng: -20.5378, lat: 64.1647 },
      { name: "Secret Lagoon, Flúðir", imageSeed: "secret-lagoon", kind: "activity", lng: -20.3104, lat: 64.1383 },
      { name: "Geysir Center exhibition", imageSeed: "geysir-center", kind: "activity", lng: -20.3010, lat: 64.3097 },
    ],
  },
  {
    id: "sydney-closure-d3",
    tripId: "sydney-harbour",
    dayNumber: 3,
    kind: "closure",
    title: "Activity Closed",
    message: "BridgeClimb is closed for high wind. Other harbour views nearby.",
    window: { start: "00:00", end: "23:59" },
    affectedStepIds: ["s-3-2"],
    shiftMinutes: 0,
    suggestions: [
      { name: "Sydney Tower Eye", imageSeed: "sydney-tower-eye", kind: "viewpoint", lng: 151.2089, lat: -33.8709 },
      { name: "Museum of Contemporary Art", imageSeed: "mca-sydney", kind: "activity", lng: 151.2089, lat: -33.8599 },
      { name: "Pylon Lookout", imageSeed: "pylon-lookout", kind: "viewpoint", lng: 151.2110, lat: -33.8523 },
    ],
  },
  {
    id: "patagonia-storm-d4",
    tripId: "patagonia-w-trek",
    dayNumber: 4,
    kind: "storm",
    title: "Trail Closed",
    message: "100 km/h gusts — the Base Torres climb is closed. Lower options below.",
    window: { start: "05:00", end: "12:00" },
    affectedStepIds: ["pw-4-2"],
    shiftMinutes: 0,
    suggestions: [
      { name: "Lower Ascencio viewpoint", imageSeed: "lower-ascencio", kind: "viewpoint", lng: -72.9550, lat: -50.9620 },
      { name: "Refugio Chileno rest stop", imageSeed: "refugio-chileno", kind: "hotel", lng: -72.9610, lat: -50.9590 },
      { name: "Guided nature walk, valley floor", imageSeed: "patagonia-nature-walk", kind: "activity", lng: -72.9700, lat: -50.9750 },
    ],
  },
];

export function getDisruptionForTripDay(
  tripId: string,
  dayNumber: number
): Disruption | undefined {
  return DISRUPTIONS.find(
    (d) => d.tripId === tripId && d.dayNumber === dayNumber
  );
}

export function affectedStepIds(
  d: Disruption,
  daySteps: { id: string; kind: StepKind; time?: string }[]
): string[] {
  const explicit = new Set(d.affectedStepIds ?? []);
  const ids = new Set<string>(explicit);
  if (d.affectedKinds && d.affectedKinds.length > 0) {
    for (const s of daySteps) {
      if (!d.affectedKinds.includes(s.kind)) continue;
      if (s.time && !inWindow(s.time, d.window.start, d.window.end)) continue;
      ids.add(s.id);
    }
  }
  return [...ids];
}

export function haversineKm(
  a: { lng: number; lat: number },
  b: { lng: number; lat: number }
): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
