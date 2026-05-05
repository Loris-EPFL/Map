"use client";

import type { TripStep } from "@/lib/mock/types";

const KIND_ICON: Record<TripStep["kind"], string> = {
  airport: "✈",
  hotel: "🛏",
  activity: "★",
  restaurant: "◍",
  transport: "↬",
  viewpoint: "▲",
};

type Props = {
  step: TripStep;
  dayNumber: number;
  stepIndex: number;
  color: string;
};

export default function ItineraryStep({ step, dayNumber, stepIndex, color }: Props) {
  return (
    <div className="group relative -translate-y-2 cursor-pointer">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-sm font-semibold text-white shadow-md transition group-hover:scale-110"
        style={{ backgroundColor: color }}
      >
        <span className="leading-none">{KIND_ICON[step.kind]}</span>
      </div>
      <div className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[9px] font-bold text-white">
        {dayNumber}.{stepIndex}
      </div>
    </div>
  );
}
