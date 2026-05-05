"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Map,
  Marker,
  Popup,
  Source,
  Layer,
  type MapRef,
  type LayerProps,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Trip, TripStep } from "@/lib/mock/types";
import type { MapClientProps } from "./MapClient";
import TripPin from "./TripPin";
import ItineraryStep from "./ItineraryStep";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const MAP_STYLE_DARK = "https://tiles.openfreemap.org/styles/dark";

const DAY_COLORS = ["#22d3ee", "#fbbf24", "#f472b6", "#34d399", "#a78bfa", "#fb7185"];

const lineLayer: LayerProps = {
  id: "trip-lines",
  type: "line",
  paint: {
    "line-color": [
      "match",
      ["get", "day"],
      1, DAY_COLORS[0],
      2, DAY_COLORS[1],
      3, DAY_COLORS[2],
      4, DAY_COLORS[3],
      5, DAY_COLORS[4],
      DAY_COLORS[5],
    ],
    "line-width": 3,
    "line-opacity": 0.9,
    "line-dasharray": [0, 2.5, 1.2],
  } as never,
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
};

const stopLayer: LayerProps = {
  id: "trip-stops",
  type: "circle",
  paint: {
    "circle-radius": 4,
    "circle-color": "#0f172a",
    "circle-stroke-color": "#fff",
    "circle-stroke-width": 1.5,
  },
};

function tripBounds(trip: Trip): [[number, number], [number, number]] {
  const lngs = trip.days.flatMap((d) => d.steps.map((s) => s.lng));
  const lats = trip.days.flatMap((d) => d.steps.map((s) => s.lat));
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

function tripGeoJSON(trip: Trip): GeoJSON.FeatureCollection {
  const lines: GeoJSON.Feature[] = trip.days.map((day) => ({
    type: "Feature",
    properties: { day: day.dayNumber },
    geometry: {
      type: "LineString",
      coordinates: day.steps.map((s) => [s.lng, s.lat]),
    },
  }));
  const stops: GeoJSON.Feature[] = trip.days.flatMap((day) =>
    day.steps.map((s) => ({
      type: "Feature",
      properties: { day: day.dayNumber },
      geometry: { type: "Point", coordinates: [s.lng, s.lat] },
    }))
  );
  return { type: "FeatureCollection", features: [...lines, ...stops] };
}

export default function MapCanvas(props: MapClientProps) {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<TripStep | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  const isGlobe = props.mode === "globe";
  const trip = !isGlobe ? props.trip : null;

  const initialView = useMemo(() => {
    if (isGlobe) return { longitude: 10, latitude: 25, zoom: 1.4 };
    const [[w, s], [e, n]] = tripBounds(props.trip);
    return {
      longitude: (w + e) / 2,
      latitude: (s + n) / 2,
      zoom: 11,
    };
  }, [isGlobe, props]);

  const tripData = useMemo(() => (trip ? tripGeoJSON(trip) : null), [trip]);

  useEffect(() => {
    if (!isGlobe || !mapRef.current) return;
    const id = setTimeout(() => {
      mapRef.current?.easeTo({ bearing: 25, duration: 8000 });
    }, 600);
    return () => clearTimeout(id);
  }, [isGlobe]);

  useEffect(() => {
    if (isGlobe || !mapRef.current || !trip) return;
    const [sw, ne] = tripBounds(trip);
    mapRef.current.fitBounds([sw, ne], {
      padding: { top: 80, bottom: 80, left: 80, right: 80 },
      duration: 1400,
      pitch: 35,
    });
  }, [isGlobe, trip]);

  const handlePinClick = (tripId: string, lng: number, lat: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 4,
        duration: 1200,
        essential: true,
      });
    }
    setTimeout(() => router.push(`/explore/${tripId}`), 700);
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={initialView}
      mapStyle={isGlobe ? MAP_STYLE_DARK : MAP_STYLE}
      projection="globe"
      maxPitch={70}
      style={{ position: "absolute", inset: 0 }}
      attributionControl={{ compact: true }}
    >
      {isGlobe &&
        props.trips.map((t) => (
          <Marker
            key={t.id}
            longitude={t.startLng}
            latitude={t.startLat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveTrip(t);
            }}
          >
            <TripPin
              trip={t}
              hovered={hovered === t.id}
              onHover={(h) => setHovered(h ? t.id : null)}
            />
          </Marker>
        ))}

      {isGlobe && activeTrip && (
        <Popup
          longitude={activeTrip.startLng}
          latitude={activeTrip.startLat}
          anchor="bottom"
          offset={56}
          closeButton={false}
          maxWidth="280px"
          onClose={() => setActiveTrip(null)}
          className="trip-popup"
        >
          <div className="w-64 p-1">
            <div className="overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeTrip.coverImageUrl}
                alt={activeTrip.title}
                className="h-32 w-full object-cover"
              />
            </div>
            <div className="px-1 pt-2">
              <div className="text-sm font-semibold text-zinc-900">
                {activeTrip.title}
              </div>
              <div className="text-xs text-zinc-500">
                {activeTrip.durationDays} days · by {activeTrip.author.name}
              </div>
              <button
                onClick={() =>
                  handlePinClick(
                    activeTrip.id,
                    activeTrip.startLng,
                    activeTrip.startLat
                  )
                }
                className="mt-3 w-full rounded-full bg-zinc-900 py-2 text-xs font-medium text-white transition hover:bg-zinc-700"
              >
                Open itinerary →
              </button>
            </div>
          </div>
        </Popup>
      )}

      {!isGlobe && tripData && (
        <Source id="trip" type="geojson" data={tripData}>
          <Layer {...lineLayer} />
          <Layer {...stopLayer} />
        </Source>
      )}

      {!isGlobe &&
        trip &&
        trip.days.flatMap((day) =>
          day.steps.map((step, i) => (
            <Marker
              key={step.id}
              longitude={step.lng}
              latitude={step.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setActiveStep(step);
              }}
            >
              <ItineraryStep
                step={step}
                dayNumber={day.dayNumber}
                stepIndex={i + 1}
                color={DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length]}
              />
            </Marker>
          ))
        )}

      {!isGlobe && activeStep && (
        <Popup
          longitude={activeStep.lng}
          latitude={activeStep.lat}
          anchor="bottom"
          offset={32}
          closeButton={false}
          maxWidth="240px"
          onClose={() => setActiveStep(null)}
          className="step-popup"
        >
          <div className="w-56 p-1">
            <div className="overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeStep.imageUrl}
                alt={activeStep.name}
                className="h-28 w-full object-cover"
              />
            </div>
            <div className="px-1 pt-2 pb-1">
              <div className="text-[11px] uppercase tracking-wide text-zinc-500">
                {activeStep.kind}
                {activeStep.time ? ` · ${activeStep.time}` : ""}
              </div>
              <div className="text-sm font-semibold text-zinc-900">
                {activeStep.name}
              </div>
              {activeStep.notes && (
                <div className="mt-1 text-xs text-zinc-600">{activeStep.notes}</div>
              )}
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
