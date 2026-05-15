"use client";

import { useEffect, useState } from "react";
import type { StepKind, TripStep } from "@/lib/mock/types";
import { getStepDetails } from "@/lib/mock/stepDetails";
import { grossStepPrice, formatPrice } from "@/lib/mock/pricing";
import type { TripStepEditable } from "@/components/map/MapClient";

const KIND_LABEL: Record<TripStep["kind"], string> = {
  airport: "Airport",
  hotel: "Hotel",
  activity: "Activity",
  restaurant: "Restaurant",
  transport: "Transport",
  viewpoint: "Viewpoint",
};

const KIND_OPTIONS: StepKind[] = [
  "airport",
  "hotel",
  "activity",
  "restaurant",
  "transport",
  "viewpoint",
];

const PRICE_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$",
};

export default function StepDetailCard({
  step,
  dayNumber,
  stepIndex,
  isBooked,
  onEdit,
}: {
  step: TripStep;
  dayNumber: number;
  stepIndex: number;
  isBooked: boolean;
  onEdit?: (patch: Partial<TripStepEditable>) => void;
}) {
  const d = getStepDetails(step);
  const price = grossStepPrice(step);
  const photos = [step.imageUrl, ...d.extraImages];
  const [photoIdx, setPhotoIdx] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<TripStepEditable>({
    name: step.name,
    kind: step.kind,
    time: step.time ?? "",
    notes: step.notes ?? "",
  });

  useEffect(() => {
    setDraft({
      name: step.name,
      kind: step.kind,
      time: step.time ?? "",
      notes: step.notes ?? "",
    });
    setIsEditing(false);
    setPhotoIdx(0);
  }, [step.id, step.name, step.kind, step.time, step.notes]);

  function saveEdit() {
    onEdit?.({
      name: draft.name.trim() || "Untitled stop",
      kind: draft.kind,
      time: draft.time.trim(),
      notes: draft.notes,
    });
    setIsEditing(false);
  }

  return (
    <div className="step-card flex max-h-[44vh] w-[300px] flex-col">
      {/* Photo slideshow */}
      <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-md bg-zinc-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photos[photoIdx]}
          src={photos[photoIdx]}
          alt={step.name}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
        {/* Prev / Next */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPhotoIdx((i) => (i - 1 + photos.length) % photos.length); }}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3 w-3"><path d="M10 4L6 8l4 4"/></svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPhotoIdx((i) => (i + 1) % photos.length); }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
              aria-label="Next photo"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3 w-3"><path d="M6 4l4 4-4 4"/></svg>
            </button>
          </>
        )}
        {/* Dot indicators */}
        <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.stopPropagation(); setPhotoIdx(i); }}
              className={`rounded-full transition-all ${i === photoIdx ? "h-1.5 w-3.5 bg-white" : "h-1.5 w-1.5 bg-white/50"}`}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
        {/* Badges */}
        {isBooked && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
            ✓ Booked
          </span>
        )}
        {onEdit && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-medium text-zinc-700 shadow transition hover:bg-white"
            aria-label="Edit stop"
          >
            ✎ Edit
          </button>
        )}
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-1 pt-2">
        {isEditing ? (
          <EditForm
            draft={draft}
            onChange={setDraft}
            onSave={saveEdit}
            onCancel={() => {
              setDraft({
                name: step.name,
                kind: step.kind,
                time: step.time ?? "",
                notes: step.notes ?? "",
              });
              setIsEditing(false);
            }}
            dayNumber={dayNumber}
            stepIndex={stepIndex}
          />
        ) : (
          <>
        <div className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-500">
          Day {dayNumber}.{stepIndex} · {KIND_LABEL[step.kind]}
          {step.time ? ` · ${step.time}` : ""}
        </div>
        <div className="mt-0.5 text-[15px] font-semibold leading-tight text-zinc-900">
          {step.name}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
          <span className="inline-flex items-center gap-0.5 font-medium text-amber-600">
            <span aria-hidden>★</span>
            {d.rating.toFixed(1)}
            <span className="font-normal text-zinc-500">
              ({d.reviewCount.toLocaleString()})
            </span>
          </span>
          <span className="text-zinc-300">·</span>
          <span className="font-medium text-zinc-700">
            {PRICE_LABEL[d.priceLevel]}
          </span>
          <span className="text-zinc-300">·</span>
          <span className="font-semibold text-zinc-900">
            {price === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              <>
                {formatPrice(price)}{" "}
                <span className="font-normal text-zinc-400">incl. fees</span>
              </>
            )}
          </span>
          {d.reservationRequired && (
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
              Reservation
            </span>
          )}
        </div>

        <section className="mt-3 rounded-md border border-zinc-100 bg-zinc-50 px-2.5 py-2">
          <p className="text-[11px] italic leading-relaxed text-zinc-500">
            "{d.guideNote}"
          </p>
        </section>

        <div className="mt-3 space-y-1.5">
          <InfoRow icon="🕐" label="Open hours" value={d.openHours} />
          <InfoRow icon="⏱" label="Typical visit" value={d.duration} />
          {d.bestTime !== "—" && (
            <InfoRow icon="✨" label="Best time" value={d.bestTime} />
          )}
          <InfoRow icon="📍" label="Location" value={d.location} mono />
          <InfoRow icon="📞" label="Phone" value={d.phone} mono />
        </div>

        <section className="mt-3">
          <h3 className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            About
          </h3>
          <p className="text-[12px] leading-snug text-zinc-700">
            {d.description}
          </p>
        </section>

        {d.amenities.length > 0 && (
          <section className="mt-3">
            <h3 className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
              Good to know
            </h3>
            <div className="flex flex-wrap gap-1">
              {d.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-700"
                >
                  {a}
                </span>
              ))}
            </div>
          </section>
        )}

        {d.tips.length > 0 && (
          <section className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2">
            <h3 className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-amber-800">
              Tips
            </h3>
            <ul className="space-y-0.5 text-[11px] leading-snug text-amber-900">
              {d.tips.map((t, i) => (
                <li key={i} className="flex gap-1">
                  <span aria-hidden>•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
          </>
        )}
      </div>
    </div>
  );
}

function EditForm({
  draft,
  onChange,
  onSave,
  onCancel,
  dayNumber,
  stepIndex,
}: {
  draft: TripStepEditable;
  onChange: (next: TripStepEditable) => void;
  onSave: () => void;
  onCancel: () => void;
  dayNumber: number;
  stepIndex: number;
}) {
  function set<K extends keyof TripStepEditable>(key: K, value: TripStepEditable[K]) {
    onChange({ ...draft, [key]: value });
  }
  return (
    <div className="space-y-2">
      <div className="text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-500">
        Editing · Day {dayNumber}.{stepIndex}
      </div>
      <input
        type="text"
        value={draft.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder="Name"
        className="step-card-input text-[15px] font-semibold"
        autoFocus
      />
      <div className="grid grid-cols-2 gap-1.5">
        <label className="flex flex-col gap-0.5">
          <span className="text-[8.5px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Kind
          </span>
          <select
            value={draft.kind}
            onChange={(e) => set("kind", e.target.value as StepKind)}
            className="step-card-input"
          >
            {KIND_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-0.5">
          <span className="text-[8.5px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Time
          </span>
          <input
            type="text"
            value={draft.time}
            onChange={(e) => set("time", e.target.value)}
            placeholder="09:30"
            className="step-card-input"
          />
        </label>
      </div>
      <label className="flex flex-col gap-0.5">
        <span className="text-[8.5px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          Notes
        </span>
        <textarea
          rows={3}
          value={draft.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="What's special about this stop?"
          className="step-card-input resize-none"
        />
      </label>
      <div className="flex items-center justify-end gap-1.5 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] font-medium text-zinc-700 transition hover:border-zinc-400"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-medium text-white transition hover:bg-zinc-700"
        >
          Save
        </button>
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
    <div className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px]"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[8.5px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          {label}
        </div>
        <div
          className={`break-words text-[12px] leading-snug text-zinc-800 ${
            mono ? "font-mono text-[11px]" : ""
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
