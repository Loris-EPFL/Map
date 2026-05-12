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
  booked?: boolean;
};

export default function ItineraryStep({
  step,
  dayNumber,
  stepIndex,
  color,
  booked,
}: Props) {
  return (
    <div className="group relative -translate-y-2 cursor-pointer">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-white shadow-md transition group-hover:scale-110 ${
          booked ? "border-emerald-400" : "border-white"
        }`}
        style={{ backgroundColor: color }}
      >
        <span className="text-[12px] font-bold leading-none tracking-tight">
          #{stepIndex}
        </span>
      </div>
      <div
        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-[9px] leading-none text-white"
        title={`Day ${dayNumber} · ${step.kind}`}
      >
        {KIND_ICON[step.kind]}
      </div>
      {booked && (
        <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[8px] font-bold text-white">
          ✓
        </div>
      )}
    </div>
  );
}
