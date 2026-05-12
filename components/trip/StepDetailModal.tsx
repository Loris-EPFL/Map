"use client";

import { useEffect } from "react";
import type { TripStep } from "@/lib/mock/types";
import { getStepDetails } from "@/lib/mock/stepDetails";

const KIND_LABEL: Record<TripStep["kind"], string> = {
  airport: "Airport",
  hotel: "Hotel",
  activity: "Activity",
  restaurant: "Restaurant",
  transport: "Transport",
  viewpoint: "Viewpoint",
};

const PRICE_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};

export default function StepDetailModal({
  step,
  dayNumber,
  stepIndex,
  isBooked,
  onClose,
}: {
  step: TripStep;
  dayNumber: number;
  stepIndex: number;
  isBooked: boolean;
  onClose: () => void;
}) {
  const d = getStepDetails(step);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white text-zinc-900 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div className="relative h-48 w-full shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={step.imageUrl}
            alt={step.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-lg transition hover:bg-white"
            aria-label="Close"
          >
            ✕
          </button>
          {isBooked && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              ✓ Booked
            </span>
          )}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="text-[10px] uppercase tracking-[0.15em] opacity-80">
              Day {dayNumber}.{stepIndex} · {KIND_LABEL[step.kind]}
              {step.time ? ` · ${step.time}` : ""}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-tight">{step.name}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {/* Quick stats */}
          <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
            <span className="inline-flex items-center gap-1 font-medium text-amber-600">
              <span aria-hidden>★</span>
              {d.rating.toFixed(1)}
              <span className="font-normal text-zinc-500">
                ({d.reviewCount.toLocaleString()} reviews)
              </span>
            </span>
            <span className="text-zinc-300">·</span>
            <span className="font-medium text-zinc-700">
              {PRICE_LABEL[d.priceLevel]}
            </span>
            {d.reservationRequired && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                Reservation recommended
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            <InfoRow icon="🕐" label="Open hours" value={d.openHours} />
            <InfoRow icon="⏱" label="Typical visit" value={d.duration} />
            {d.bestTime !== "—" && (
              <InfoRow icon="✨" label="Best time" value={d.bestTime} />
            )}
            <InfoRow icon="📍" label="Location" value={d.location} mono />
            <InfoRow icon="📞" label="Phone" value={d.phone} mono />
            <InfoRow
              icon="🌐"
              label="Website"
              value={d.website.replace(/^https?:\/\//, "")}
              mono
            />
          </div>

          <section className="mt-5">
            <h3 className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-500">
              About
            </h3>
            <p className="text-sm leading-relaxed text-zinc-700">
              {d.description}
            </p>
          </section>

          {d.amenities.length > 0 && (
            <section className="mt-5">
              <h3 className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-500">
                Good to know
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {d.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </section>
          )}

          {d.tips.length > 0 && (
            <section className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <h3 className="mb-1.5 text-xs uppercase tracking-[0.15em] text-amber-800">
                Tips from travelers
              </h3>
              <ul className="space-y-1 text-xs leading-relaxed text-amber-900">
                {d.tips.map((t, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span aria-hidden>•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="shrink-0 border-t border-zinc-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-zinc-900 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: string;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-base"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
          {label}
        </div>
        <div
          className={`break-words text-sm text-zinc-800 ${
            mono ? "font-mono text-[13px]" : ""
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
