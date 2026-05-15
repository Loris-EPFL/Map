"use client";

import dynamic from "next/dynamic";
import type { Trip } from "@/lib/mock/types";

const MapCanvas = dynamic(() => import("./MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_center,#0a1230_0%,#000_70%)] text-zinc-500 text-sm">
      Loading globe…
    </div>
  ),
});

type GlobeProps = {
  mode: "globe";
  trips: Trip[];
  /** Set by the search bar to fly the globe to a trip (nonce retriggers it). */
  focus?: { tripId: string; nonce: number } | null;
};

type ItineraryProps = {
  mode: "itinerary";
  trip: Trip;
  bookedStepIds?: string[];
  onStepClick?: (stepId: string) => void;
  openStepId?: string;
  onCloseStep?: () => void;
  addingStep?: boolean;
  onMapPick?: (lng: number, lat: number) => void;
  onEditStep?: (stepId: string, patch: Partial<TripStepEditable>) => void;
};

export type TripStepEditable = {
  name: string;
  kind: import("@/lib/mock/types").StepKind;
  time: string;
  notes: string;
};

export type MapClientProps = GlobeProps | ItineraryProps;

export default function MapClient(props: MapClientProps) {
  return <MapCanvas {...props} />;
}
