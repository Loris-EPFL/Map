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
};

type ItineraryProps = {
  mode: "itinerary";
  trip: Trip;
};

export type MapClientProps = GlobeProps | ItineraryProps;

export default function MapClient(props: MapClientProps) {
  return <MapCanvas {...props} />;
}
