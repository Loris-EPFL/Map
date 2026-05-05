"use client";

import type { Trip } from "@/lib/mock/types";

type Props = {
  trip: Trip;
  hovered: boolean;
  onHover: (hovered: boolean) => void;
};

export default function TripPin({ trip, hovered, onHover }: Props) {
  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className="group relative -translate-y-1 cursor-pointer"
    >
      <div
        className={[
          "h-11 w-11 overflow-hidden rounded-full border-2 transition",
          hovered
            ? "border-white shadow-[0_0_24px_rgba(255,255,255,0.8)] scale-110"
            : "border-white/80 shadow-[0_0_12px_rgba(255,255,255,0.4)]",
        ].join(" ")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={trip.coverImageUrl}
          alt={trip.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div
        className={[
          "absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[11px] font-medium text-white backdrop-blur transition",
          hovered ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {trip.title}
      </div>
    </div>
  );
}
