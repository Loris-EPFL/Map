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

import type { Trip } from "@/lib/mock/types";
import type { MapClientProps } from "./MapClient";
import TripPin from "./TripPin";
import ItineraryStep from "./ItineraryStep";
import StepDetailCard from "@/components/trip/StepDetailCard";
import { fetchRoute, type Coord } from "@/lib/mock/routing";

const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const MAP_STYLE_GLOBE = "https://tiles.openfreemap.org/styles/positron";

const DAY_COLORS = ["#22d3ee", "#f97316", "#f472b6", "#34d399", "#a78bfa", "#fb7185"];

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

function tripBounds(
  trip: Trip
): [[number, number], [number, number]] | null {
  const lngs = trip.days.flatMap((d) => d.steps.map((s) => s.lng));
  const lats = trip.days.flatMap((d) => d.steps.map((s) => s.lat));
  if (lngs.length === 0) return null;
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

function tripGeoJSON(
  trip: Trip,
  routes: Record<number, Coord[]> = {}
): GeoJSON.FeatureCollection {
  const lines: GeoJSON.Feature[] = trip.days.map((day) => ({
    type: "Feature",
    properties: { day: day.dayNumber },
    geometry: {
      type: "LineString",
      coordinates:
        routes[day.dayNumber] ?? day.steps.map((s): Coord => [s.lng, s.lat]),
    },
  }));
  return { type: "FeatureCollection", features: lines };
}

// On a globe projection, markers on the far hemisphere are still rendered and
// clickable (they "bleed through" the transparent sphere). A point is on the
// visible front only if its great-circle angle from the point facing the
// camera (the map center) is under ~90°. A small positive margin keeps
// near-the-limb pins from being clicked.
const FRONT_THRESHOLD = 0.05;

function isFrontFacing(
  lng: number,
  lat: number,
  center: { lng: number; lat: number }
): boolean {
  const toRad = Math.PI / 180;
  const lat1 = center.lat * toRad;
  const lat2 = lat * toRad;
  const dLng = (lng - center.lng) * toRad;
  const cosAngle =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return cosAngle > FRONT_THRESHOLD;
}

function getTripPhotos(trip: Trip): string[] {
  const stepPhotos = trip.days
    .flatMap((d) => d.steps)
    .filter((s) => ["viewpoint", "activity", "restaurant"].includes(s.kind))
    .slice(0, 3)
    .map((s) => s.imageUrl);
  return [trip.coverImageUrl, ...stepPhotos].slice(0, 4);
}

export default function MapCanvas(props: MapClientProps) {
  const router = useRouter();
  const mapRef = useRef<MapRef>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [center, setCenter] = useState({ lng: 10, lat: 25 });
  const onStepClick = props.mode === "itinerary" ? props.onStepClick : undefined;
  const openStepId =
    props.mode === "itinerary" ? props.openStepId : undefined;
  const onCloseStep =
    props.mode === "itinerary" ? props.onCloseStep : undefined;
  const addingStep =
    props.mode === "itinerary" ? props.addingStep === true : false;
  const onMapPick =
    props.mode === "itinerary" ? props.onMapPick : undefined;
  const onEditStep =
    props.mode === "itinerary" ? props.onEditStep : undefined;

  const isGlobe = props.mode === "globe";
  const trip = !isGlobe ? props.trip : null;
  const bookedSet = useMemo(
    () => new Set(!isGlobe ? props.bookedStepIds ?? [] : []),
    [isGlobe, props]
  );

  const detailStep = useMemo(() => {
    if (!openStepId || !trip) return null;
    for (const day of trip.days) {
      const i = day.steps.findIndex((s) => s.id === openStepId);
      if (i >= 0) {
        return {
          step: day.steps[i],
          dayNumber: day.dayNumber,
          stepIndex: i + 1,
        };
      }
    }
    return null;
  }, [openStepId, trip]);

  const initialView = useMemo(() => {
    if (isGlobe) return { longitude: 10, latitude: 25, zoom: 1.4 };
    const b = tripBounds(props.trip);
    if (!b) return { longitude: 0, latitude: 20, zoom: 2 };
    const [[w, s], [e, n]] = b;
    return {
      longitude: (w + e) / 2,
      latitude: (s + n) / 2,
      zoom: 11,
    };
  }, [isGlobe, props]);

  const [dayRoutes, setDayRoutes] = useState<Record<number, Coord[]>>({});

  useEffect(() => {
    if (isGlobe || !trip) return;
    let cancelled = false;
    setDayRoutes({});
    (async () => {
      const results = await Promise.all(
        trip.days.map(async (day) => {
          const coords = day.steps.map(
            (s): Coord => [s.lng, s.lat]
          );
          const route = await fetchRoute(coords);
          return { dayNumber: day.dayNumber, route };
        })
      );
      if (cancelled) return;
      const next: Record<number, Coord[]> = {};
      for (const r of results) if (r.route) next[r.dayNumber] = r.route;
      setDayRoutes(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [isGlobe, trip]);

  const tripData = useMemo(
    () => (trip ? tripGeoJSON(trip, dayRoutes) : null),
    [trip, dayRoutes]
  );

  useEffect(() => {
    if (!isGlobe || !mapRef.current) return;
    const id = setTimeout(() => {
      mapRef.current?.easeTo({ bearing: 25, duration: 8000 });
    }, 600);
    return () => clearTimeout(id);
  }, [isGlobe]);

  const tripIdentity = useMemo(
    () =>
      trip ? `${trip.id}:${trip.days.map((d) => d.dayNumber).join(",")}` : "",
    [trip]
  );

  useEffect(() => {
    if (isGlobe || !mapRef.current || !trip) return;
    const b = tripBounds(trip);
    if (!b) return;
    mapRef.current.fitBounds(b, {
      padding: { top: 80, bottom: 80, left: 80, right: 80 },
      duration: 1400,
      pitch: 35,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGlobe, tripIdentity]);

  useEffect(() => {
    if (!detailStep || !mapRef.current) return;
    const map = mapRef.current;
    const targetZoom = Math.max(map.getZoom(), 13);
    map.easeTo({
      center: [detailStep.step.lng, detailStep.step.lat],
      zoom: targetZoom,
      duration: 700,
      offset: [0, 140],
    });
  }, [detailStep]);

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
      mapStyle={isGlobe ? MAP_STYLE_GLOBE : MAP_STYLE}
      projection="globe"
      maxPitch={70}
      cursor={addingStep ? "crosshair" : undefined}
      onMove={
        isGlobe
          ? (e) =>
              setCenter({
                lng: e.viewState.longitude,
                lat: e.viewState.latitude,
              })
          : undefined
      }
      onClick={
        addingStep && onMapPick
          ? (e) => onMapPick(e.lngLat.lng, e.lngLat.lat)
          : undefined
      }
      onError={(evt) => {
        // The public OpenFreeMap tile CDN intermittently fails or rate-limits
        // individual tile requests ("AJAXError: Load failed"). MapLibre retries
        // these on its own, so swallow them instead of letting the error bubble
        // up as a fatal app/overlay error. Real (non-tile) errors still log.
        const err = (evt as { error?: Error }).error;
        const msg = err?.message ?? "";
        if (
          err?.name === "AJAXError" ||
          /AJAXError|Load failed|Failed to fetch/i.test(msg)
        ) {
          console.warn("Map tile failed to load (will retry):", msg);
          return;
        }
        console.error("Map error:", err ?? evt);
      }}
      style={{ position: "absolute", inset: 0 }}
      attributionControl={{ compact: true }}
    >
      {isGlobe &&
        props.trips.map((t) => {
          // Skip pins on the back of the globe so they can't be clicked
          // through the transparent sphere.
          if (!isFrontFacing(t.startLng, t.startLat, center)) return null;
          return (
          <Marker
            key={t.id}
            longitude={t.startLng}
            latitude={t.startLat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveTrip(t);
              setPhotoIdx(0);
            }}
          >
            <TripPin
              trip={t}
              hovered={hovered === t.id}
              onHover={(h) => setHovered(h ? t.id : null)}
            />
          </Marker>
          );
        })}

      {isGlobe &&
        activeTrip &&
        isFrontFacing(activeTrip.startLng, activeTrip.startLat, center) &&
        (() => {
        const photos = getTripPhotos(activeTrip);
        const total = photos.length;
        return (
          <Popup
            longitude={activeTrip.startLng}
            latitude={activeTrip.startLat}
            anchor="bottom"
            offset={56}
            closeButton={false}
            maxWidth="300px"
            onClose={() => setActiveTrip(null)}
            className="trip-popup"
          >
            <div className="w-72 overflow-hidden rounded-xl">
              {/* Photo gallery */}
              <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={photos[photoIdx]}
                  src={photos[photoIdx]}
                  alt={activeTrip.title}
                  className="h-full w-full object-cover"
                />
                {/* Prev / Next */}
                {total > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPhotoIdx((i) => (i - 1 + total) % total); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                      aria-label="Previous photo"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden><path d="M10.5 3L5.5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPhotoIdx((i) => (i + 1) % total); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                      aria-label="Next photo"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden><path d="M5.5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    </button>
                  </>
                )}
                {/* Dot indicators */}
                {total > 1 && (
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPhotoIdx(i); }}
                        className={`h-1.5 rounded-full transition-all ${i === photoIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                        aria-label={`Photo ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="px-3 pb-3 pt-2.5">
                <div className="text-sm font-semibold text-zinc-900 leading-snug">
                  {activeTrip.title}
                </div>
                <div className="mt-0.5 text-[11px] text-zinc-400">
                  {activeTrip.durationDays} days · by {activeTrip.author.name}
                </div>
                {activeTrip.guideNote && (
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 italic">
                    "{activeTrip.guideNote}"
                  </p>
                )}
                <button
                  onClick={() => handlePinClick(activeTrip.id, activeTrip.startLng, activeTrip.startLat)}
                  className="mt-3 w-full rounded-full bg-zinc-900 py-2 text-xs font-medium text-white transition hover:bg-zinc-700"
                >
                  Open itinerary →
                </button>
              </div>
            </div>
          </Popup>
        );
      })()}

      {!isGlobe && tripData && (
        <Source id="trip" type="geojson" data={tripData}>
          <Layer {...lineLayer} />
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
                onStepClick?.(step.id);
              }}
            >
              <ItineraryStep
                step={step}
                dayNumber={day.dayNumber}
                stepIndex={i + 1}
                color={DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length]}
                booked={bookedSet.has(step.id)}
              />
            </Marker>
          ))
        )}

      {!isGlobe && detailStep && (
        <Popup
          longitude={detailStep.step.lng}
          latitude={detailStep.step.lat}
          anchor="bottom"
          offset={32}
          closeButton={true}
          closeOnClick={true}
          maxWidth="320px"
          onClose={() => onCloseStep?.()}
          className="step-detail-popup"
        >
          <StepDetailCard
            step={detailStep.step}
            dayNumber={detailStep.dayNumber}
            stepIndex={detailStep.stepIndex}
            isBooked={bookedSet.has(detailStep.step.id)}
            onEdit={
              onEditStep
                ? (patch) => onEditStep(detailStep.step.id, patch)
                : undefined
            }
          />
        </Popup>
      )}
    </Map>
  );
}
