"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createEmptyStore,

  loadStore,
  saveStore,
  clearStore,
  type Budget,
  type Interest,
  type Pace,
  type Profile,
  type ProfileStore,
  type TravelStyle,
  type Vibe,
} from "@/lib/profile";

const TRAVEL_STYLES: { value: TravelStyle; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
  { value: "friends", label: "With friends" },
];

const VIBES: { value: Vibe; label: string }[] = [
  { value: "beach", label: "Beach" },
  { value: "mountains", label: "Mountains" },
  { value: "cities", label: "Cities" },
  { value: "countryside", label: "Countryside" },
  { value: "deserts", label: "Deserts" },
  { value: "islands", label: "Islands" },
  { value: "forests", label: "Forests" },
  { value: "tropical", label: "Tropical" },
];

const PACES: { value: Pace; label: string; hint: string }[] = [
  { value: "relaxed", label: "Relaxed", hint: "1–2 things per day" },
  { value: "balanced", label: "Balanced", hint: "3–4 things per day" },
  { value: "packed", label: "Packed", hint: "5+ things per day" },
];

const BUDGETS: { value: Budget; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "midrange", label: "Mid-range" },
  { value: "luxury", label: "Luxury" },
];

const INTERESTS: { value: Interest; label: string }[] = [
  { value: "food", label: "Food" },
  { value: "museums", label: "Museums" },
  { value: "hiking", label: "Hiking" },
  { value: "nightlife", label: "Nightlife" },
  { value: "architecture", label: "Architecture" },
  { value: "photography", label: "Photography" },
  { value: "wildlife", label: "Wildlife" },
  { value: "wellness", label: "Wellness" },
];

const PRESET_LABELS = [
  "Solo backpacking",
  "Family vacation",
  "Romantic getaway",
  "Friends weekend",
  "Wellness retreat",
  "City break",
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function ProfileForm() {
  const router = useRouter();
  const [store, setStore] = useState<ProfileStore>(() => createEmptyStore());
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    const existing = loadStore();
    if (existing && existing.profiles.length > 0) setStore(existing);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (status !== "saved") return;
    const id = setTimeout(() => setStatus("idle"), 2200);
    return () => clearTimeout(id);
  }, [status]);

  const activeProfile = useMemo<Profile>(() => {
    const found = store.profiles.find((p) => p.id === store.activeProfileId);
    return found ?? store.profiles[0];
  }, [store]);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setStore((prev) => ({
      ...prev,
      profiles: prev.profiles.map((p) =>
        p.id === activeProfile.id ? { ...p, [key]: value } : p
      ),
    }));
  }

  function deleteActive() {
    if (store.profiles.length <= 1) return;
    setStore((prev) => {
      const remaining = prev.profiles.filter((p) => p.id !== activeProfile.id);
      return {
        profiles: remaining,
        activeProfileId: remaining[0]?.id ?? null,
      };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveStore(store);
    setStatus("saved");
  }

  function handleNext() {
    saveStore(store);
    router.push("/browse?matched=1");
  }

  function handleReset() {
    clearStore();
    setStore(createEmptyStore());
    setStatus("idle");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Trip name */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
          Name your trip
        </h2>
        <div className="flex flex-wrap items-stretch gap-2">
          <input
            type="text"
            value={activeProfile.label}
            onChange={(e) => update("label", e.target.value)}
            placeholder="e.g. Solo backpacking, Family beach trip"
            className="input flex-1 min-w-0"
          />
          {store.profiles.length > 1 && (
            <button
              type="button"
              onClick={deleteActive}
              className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
            >
              Delete profile
            </button>
          )}
        </div>
      </section>

      {/* Trip profiles */}
      <section>
        <h2 className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
          Trip profiles
        </h2>
        <p className="mb-3 text-xs text-zinc-400">Pick as many as you like.</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_LABELS.map((preset) => (
            <Chip
              key={preset}
              selected={(activeProfile.tripTypes ?? []).includes(preset)}
              onClick={() => update("tripTypes", toggle(activeProfile.tripTypes ?? [], preset))}
            >
              {preset}
            </Chip>
          ))}
        </div>
      </section>

      {/* Basics */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input
              type="text"
              required
              value={activeProfile.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Jane Traveler"
              className="input"
            />
          </Field>
          <Field label="Age">
            <input
              type="number"
              min={1}
              max={120}
              value={activeProfile.age}
              onChange={(e) =>
                update("age", e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="29"
              className="input"
            />
          </Field>
          <Field label="Home city" className="sm:col-span-2">
            <input
              type="text"
              value={activeProfile.homeCity}
              onChange={(e) => update("homeCity", e.target.value)}
              placeholder="Lausanne, Switzerland"
              className="input"
            />
          </Field>
        </div>
      </section>

      {/* Travel style */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
          Who do you travel with?
        </h2>
        <div className="flex flex-wrap gap-2">
          {TRAVEL_STYLES.map((opt) => (
            <Chip
              key={opt.value}
              selected={activeProfile.travelStyle === opt.value}
              onClick={() => update("travelStyle", opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </section>

      {/* Vibes */}
      <section>
        <h2 className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
          Favorite kinds of places
        </h2>
        <p className="mb-3 text-xs text-zinc-400">Pick as many as you like.</p>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((opt) => (
            <Chip
              key={opt.value}
              selected={activeProfile.vibes.includes(opt.value)}
              onClick={() =>
                update("vibes", toggle(activeProfile.vibes, opt.value))
              }
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </section>

      {/* Pace */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Trip pace</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {PACES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("pace", opt.value)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                activeProfile.pace === opt.value
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white hover:border-zinc-400"
              }`}
            >
              <div className="text-sm font-medium">{opt.label}</div>
              <div
                className={`text-xs ${
                  activeProfile.pace === opt.value ? "text-white/70" : "text-zinc-500"
                }`}
              >
                {opt.hint}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Budget */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">Budget</h2>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((opt) => (
            <Chip
              key={opt.value}
              selected={activeProfile.budget === opt.value}
              onClick={() => update("budget", opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section>
        <h2 className="mb-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
          What do you love doing on a trip?
        </h2>
        <p className="mb-3 text-xs text-zinc-400">Pick as many as you like.</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((opt) => (
            <Chip
              key={opt.value}
              selected={activeProfile.interests.includes(opt.value)}
              onClick={() =>
                update("interests", toggle(activeProfile.interests, opt.value))
              }
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </section>

      {/* Bio */}
      <section>
        <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
          Anything else?
        </h2>
        <textarea
          rows={4}
          value={activeProfile.bio}
          onChange={(e) => update("bio", e.target.value)}
          placeholder="Allergies, languages, things you avoid, dream destinations…"
          className="input resize-none"
        />
      </section>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-between gap-3 border-t border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="text-xs text-zinc-500">
          <span className="font-medium text-zinc-700">
            {activeProfile.label || "Untitled"}
          </span>
          {hydrated && activeProfile.updatedAt ? (
            <> · saved {new Date(activeProfile.updatedAt).toLocaleString()}</>
          ) : (
            <> · stored on your device only</>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status === "saved" && (
            <span className="text-xs font-medium text-emerald-600">Saved ✓</span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Next
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-medium text-zinc-600">{label}</span>
      {children}
    </label>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        selected
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
      }`}
    >
      {children}
    </button>
  );
}
