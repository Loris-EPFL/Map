"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MapClient from "@/components/map/MapClient";
import type { StepKind, Trip, TripDay, TripStep } from "@/lib/mock/types";
import {
  FRIENDS,
  ME,
  emptyUserState,
  makeUserInitialState,
  type Friend,
  type SwapChoice,
  type UserTripState,
} from "@/lib/mock/friends";
import { addUserTrip, loadUserTrips } from "@/lib/userTrips";

const DAY_COLORS = ["#22d3ee", "#f97316", "#f472b6", "#34d399", "#a78bfa", "#fb7185"];

const CONFIRMABLE_KINDS: Set<StepKind> = new Set(["viewpoint"]);

const ALTERNATIVES: Record<StepKind, SwapChoice[]> = {
  airport: [
    { name: "Private airport transfer", imageSeed: "alt-transfer" },
    { name: "Express train into the city", imageSeed: "alt-train" },
  ],
  hotel: [
    { name: "The Ritz-Carlton (luxury)", imageSeed: "alt-ritz" },
    { name: "Mid-range boutique stay", imageSeed: "alt-boutique" },
    { name: "Budget capsule hotel", imageSeed: "alt-capsule" },
  ],
  activity: [
    { name: "Local food tour instead", imageSeed: "alt-food-tour" },
    { name: "Guided cycling experience", imageSeed: "alt-cycling" },
    { name: "Half-day private guide", imageSeed: "alt-guide" },
  ],
  restaurant: [
    { name: "Highly rated street food", imageSeed: "alt-street" },
    { name: "Michelin-starred tasting menu", imageSeed: "alt-tasting" },
    { name: "Local family-run bistro", imageSeed: "alt-bistro" },
  ],
  transport: [
    { name: "Local taxi", imageSeed: "alt-taxi" },
    { name: "Public transit day pass", imageSeed: "alt-transit" },
  ],
  viewpoint: [
    { name: "Same spot at sunrise", imageSeed: "alt-sunrise" },
    { name: "Helicopter aerial view", imageSeed: "alt-heli" },
  ],
};

function img(seed: string, w = 800, h = 600) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

function applySwaps(
  trip: Trip,
  swaps: Record<string, SwapChoice>
): Trip {
  if (Object.keys(swaps).length === 0) return trip;
  return {
    ...trip,
    days: trip.days.map((day) => ({
      ...day,
      steps: day.steps.map((step) => {
        const swap = swaps[step.id];
        if (!swap) return step;
        return { ...step, name: swap.name, imageUrl: img(swap.imageSeed) };
      }),
    })),
  };
}

export default function TripView({ trip: initialTrip }: { trip: Trip }) {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip>(initialTrip);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [placementDay, setPlacementDay] = useState<number | null>(null);
  const [users, setUsers] = useState<Record<string, UserTripState>>({
    me: emptyUserState(),
  });
  const [activeUserId, setActiveUserId] = useState<string>("me");
  const [addedFriendIds, setAddedFriendIds] = useState<string[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [openChangeFor, setOpenChangeFor] = useState<string | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [detailStepId, setDetailStepId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [tripSaved, setTripSaved] = useState(() =>
    Boolean(loadUserTrips().find((t) => t.baseTripId === initialTrip.id))
  );

  function guardAction(fn: () => void) {
    if (activeUserId === "me") {
      fn();
    } else {
      setPendingAction(() => fn);
    }
  }

  const activeUser: Friend =
    activeUserId === "me"
      ? ME
      : FRIENDS.find((f) => f.id === activeUserId) ?? ME;
  const activeState = users[activeUserId] ?? emptyUserState();
  const { checked, booked, confirmed, swaps } = activeState;

  type Updater<T> = T | ((prev: T) => T);
  function setChecked(value: Updater<Set<string>>) {
    setUsers((prev) => {
      const cur = prev[activeUserId] ?? emptyUserState();
      const next = typeof value === "function" ? (value as (p: Set<string>) => Set<string>)(cur.checked) : value;
      return { ...prev, [activeUserId]: { ...cur, checked: next } };
    });
  }
  function setBooked(value: Updater<Set<string>>) {
    setUsers((prev) => {
      const cur = prev[activeUserId] ?? emptyUserState();
      const next = typeof value === "function" ? (value as (p: Set<string>) => Set<string>)(cur.booked) : value;
      return { ...prev, [activeUserId]: { ...cur, booked: next } };
    });
  }
  function setConfirmed(value: Updater<Set<string>>) {
    setUsers((prev) => {
      const cur = prev[activeUserId] ?? emptyUserState();
      const next = typeof value === "function" ? (value as (p: Set<string>) => Set<string>)(cur.confirmed) : value;
      return { ...prev, [activeUserId]: { ...cur, confirmed: next } };
    });
  }
  function setSwaps(value: Updater<Record<string, SwapChoice>>) {
    setUsers((prev) => {
      const cur = prev[activeUserId] ?? emptyUserState();
      const next =
        typeof value === "function"
          ? (value as (p: Record<string, SwapChoice>) => Record<string, SwapChoice>)(cur.swaps)
          : value;
      return { ...prev, [activeUserId]: { ...cur, swaps: next } };
    });
  }

  function addFriend(friendId: string) {
    setAddedFriendIds((prev) =>
      prev.includes(friendId) ? prev : [...prev, friendId]
    );
    setUsers((prev) =>
      prev[friendId]
        ? prev
        : { ...prev, [friendId]: makeUserInitialState(friendId, trip) }
    );
  }
  function removeFriend(friendId: string) {
    setAddedFriendIds((prev) => prev.filter((id) => id !== friendId));
    if (activeUserId === friendId) setActiveUserId("me");
  }

  const addedFriends = addedFriendIds
    .map((id) => FRIENDS.find((f) => f.id === id))
    .filter((f): f is Friend => Boolean(f));

  const displayedTrip = useMemo(() => {
    const swapped = applySwaps(trip, swaps);
    if (selectedDay === null) return swapped;
    return { ...swapped, days: swapped.days.filter((d) => d.dayNumber === selectedDay) };
  }, [trip, swaps, selectedDay]);

  const totalSteps = trip.days.reduce((acc, d) => acc + d.steps.length, 0);
  const isDirty = useMemo(() => {
    const origSteps = initialTrip.days.reduce((a, d) => a + d.steps.length, 0);
    return (
      Object.keys(swaps).length > 0 ||
      totalSteps !== origSteps ||
      booked.size > 0 ||
      confirmed.size > 0
    );
  }, [initialTrip, swaps, totalSteps, booked, confirmed]);

  const bookedCount = booked.size;
  const confirmedCount = confirmed.size;
  const checkedArray = Array.from(checked);

  const visibleStepIds = useMemo(
    () => displayedTrip.days.flatMap((d) => d.steps.map((s) => s.id)),
    [displayedTrip]
  );
  const allVisibleSelected =
    visibleStepIds.length > 0 && visibleStepIds.every((id) => checked.has(id));

  function toggleSelectAllVisible() {
    setChecked((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleStepIds.forEach((id) => next.delete(id));
      } else {
        visibleStepIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function isConfirmable(stepId: string): boolean {
    for (const day of trip.days) {
      const step = day.steps.find((s) => s.id === stepId);
      if (step) return CONFIRMABLE_KINDS.has(step.kind);
    }
    return false;
  }

  function confirmCancelSelected() {
    setBooked((prev) => {
      const next = new Set(prev);
      checkedArray.forEach((id) => next.delete(id));
      return next;
    });
    setConfirmed((prev) => {
      const next = new Set(prev);
      checkedArray.forEach((id) => next.delete(id));
      return next;
    });
    setChecked(new Set());
    setConfirmingCancel(false);
  }

  function deleteStep(stepId: string) {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) => ({
        ...d,
        steps: d.steps.filter((s) => s.id !== stepId),
      })),
    }));
    setChecked((prev) => { const n = new Set(prev); n.delete(stepId); return n; });
    setBooked((prev) => { const n = new Set(prev); n.delete(stepId); return n; });
    setConfirmed((prev) => { const n = new Set(prev); n.delete(stepId); return n; });
    setSwaps((prev) => { const n = { ...prev }; delete n[stepId]; return n; });
  }

  function confirmStep(stepId: string) {
    setConfirmed((prev) => { const n = new Set(prev); n.add(stepId); return n; });
    setChecked((prev) => { const n = new Set(prev); n.delete(stepId); return n; });
  }

  function confirmSelected() {
    const ids = checkedArray.filter((id) => !booked.has(id) && !confirmed.has(id) && isConfirmable(id));
    setConfirmed((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    setChecked((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }

  function applySwap(stepId: string, choice: SwapChoice) {
    setSwaps((prev) => ({ ...prev, [stepId]: choice }));
    setOpenChangeFor(null);
  }

  function restoreOriginal(stepId: string) {
    setSwaps((prev) => {
      const next = { ...prev };
      delete next[stepId];
      return next;
    });
    setOpenChangeFor(null);
  }

  function addDay() {
    const nextNum =
      trip.days.length === 0
        ? 1
        : Math.max(...trip.days.map((d) => d.dayNumber)) + 1;
    const newDay: TripDay = {
      dayNumber: nextNum,
      date: "",
      title: "New day",
      steps: [],
    };
    setTrip((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
      durationDays: prev.days.length + 1,
    }));
    setSelectedDay(nextNum);
  }

  function addStep(dayNumber: number, lng: number, lat: number) {
    const id = `s_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 7)}`;
    const newStep: TripStep = {
      id,
      kind: "activity",
      name: "New stop",
      lng,
      lat,
      time: "",
      imageUrl: `https://picsum.photos/seed/${id}/800/600`,
      notes: "Custom stop you added.",
    };
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.dayNumber === dayNumber ? { ...d, steps: [...d.steps, newStep] } : d
      ),
    }));
  }

  function startAddStep(dayNumber: number) {
    setSelectedDay(dayNumber);
    setPlacementDay(dayNumber);
  }

  function editStep(stepId: string, patch: Partial<TripStep>) {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) => ({
        ...d,
        steps: d.steps.map((s) =>
          s.id === stepId ? { ...s, ...patch } : s
        ),
      })),
    }));
  }

  function reorderSteps(dayNumber: number, fromId: string, toId: string) {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.map((d) => {
        if (d.dayNumber !== dayNumber) return d;
        const from = d.steps.findIndex((s) => s.id === fromId);
        const to = d.steps.findIndex((s) => s.id === toId);
        if (from < 0 || to < 0 || from === to) return d;
        const next = d.steps.slice();
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return { ...d, steps: next };
      }),
    }));
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  useEffect(() => {
    if (placementDay == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPlacementDay(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [placementDay]);

  return (
    <div className="relative flex h-[100dvh] flex-col bg-zinc-50 text-zinc-900 lg:flex-row">
      {/* Map */}
      <div className="relative h-[55vh] shrink-0 lg:h-auto lg:flex-1">
        <MapClient
          mode="itinerary"
          trip={displayedTrip}
          bookedStepIds={Array.from(booked)}
          onStepClick={(id) => setDetailStepId(id)}
          openStepId={detailStepId ?? undefined}
          onCloseStep={() => setDetailStepId(null)}
          addingStep={placementDay != null}
          onMapPick={(lng, lat) => {
            if (placementDay != null) {
              addStep(placementDay, lng, lat);
              setPlacementDay(null);
            }
          }}
          onEditStep={(stepId, patch) => editStep(stepId, patch)}
        />
        <button
          type="button"
          onClick={() => {
            if (isDirty && !tripSaved) {
              setShowLeaveConfirm(true);
            } else {
              router.push("/browse");
            }
          }}
          className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-zinc-700 shadow-md backdrop-blur transition hover:bg-white"
        >
          ← Back to globe
        </button>

        {placementDay != null && (
          <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center px-4">
            <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-zinc-900 px-4 py-2 text-sm text-white shadow-2xl">
              <span aria-hidden>📍</span>
              <span>
                Click on the map to add a stop to Day {placementDay}
              </span>
              <button
                type="button"
                onClick={() => setPlacementDay(null)}
                className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium transition hover:bg-white/25"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side panel */}
      <aside className={`relative z-10 flex min-h-0 w-full flex-1 flex-col shadow-2xl lg:w-[460px] lg:flex-none transition-all ${
        activeUserId !== "me"
          ? "bg-amber-50 border-t-4 border-t-amber-400 lg:border-t-0 lg:border-l-4 lg:border-l-amber-400"
          : "bg-white"
      }`}>
        <div className="min-h-0 flex-1 overflow-y-auto pb-36">
          {/* Cover (scrolls away) */}
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={trip.coverImageUrl}
              alt={trip.title}
              fill
              sizes="(min-width: 1024px) 460px, 100vw"
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0" />
            {activeUserId !== "me" && (
              <div className="absolute inset-0 bg-amber-500/25" />
            )}
            {activeUserId !== "me" && (
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-amber-400/90 px-3 py-1.5 backdrop-blur-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeUser.avatarUrl}
                  alt={activeUser.name}
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-white/60"
                />
                <span className="text-xs font-semibold text-amber-950">
                  {activeUser.name}'s view
                </span>
              </div>
            )}
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <h1 className="text-2xl font-semibold leading-tight">{trip.title}</h1>
              <p className="mt-1 text-sm text-white/80">{trip.subtitle}</p>
            </div>
          </div>

          {/* Sticky summary: trip meta + (user switcher) + day pills */}
          <div className={`sticky top-0 z-20 border-b shadow-sm backdrop-blur ${
            activeUserId !== "me"
              ? "border-amber-200 bg-amber-50/95"
              : "border-zinc-200 bg-white/95"
          }`}>
            {activeUserId !== "me" && (
              <div className="flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeUser.avatarUrl}
                    alt={activeUser.name}
                    className="h-6 w-6 shrink-0 rounded-full object-cover ring-2 ring-amber-300"
                  />
                  <span className="truncate text-xs font-medium text-amber-900">
                    Viewing <span className="font-semibold">{activeUser.name}</span>'s itinerary
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveUserId("me")}
                  className="shrink-0 text-xs font-medium text-amber-700 underline underline-offset-2 transition hover:text-amber-900"
                >
                  Back to yours
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 px-5 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={trip.author.avatarUrl}
                alt={trip.author.name}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{trip.title}</div>
                <div className="text-xs text-zinc-500">
                  {trip.durationDays} days · {totalSteps} stops
                  {bookedCount > 0 ? (
                    <>
                      {" · "}
                      <span className="font-medium text-emerald-600">
                        {bookedCount} booked
                      </span>
                    </>
                  ) : null}
                  {confirmedCount > 0 ? (
                    <>
                      {" · "}
                      <span className="font-medium text-indigo-600">
                        {confirmedCount} confirmed
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SaveTripButton baseTripId={trip.id} title={trip.title} onSave={() => setTripSaved(true)} />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShareOpen((v) => !v)}
                    aria-label="Share trip"
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                      shareOpen
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                    }`}
                  >
                    <ShareIcon />
                  </button>
                  {shareOpen && (
                    <SharePopover
                      addedFriendIds={addedFriendIds}
                      onAdd={addFriend}
                      onRemove={removeFriend}
                      onClose={() => setShareOpen(false)}
                    />
                  )}
                </div>
              </div>
            </div>

            {addedFriends.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto border-t border-zinc-100 px-5 py-2">
                <UserPill
                  user={ME}
                  active={activeUserId === "me"}
                  onClick={() => setActiveUserId("me")}
                />
                {addedFriends.map((f) => (
                  <UserPill
                    key={f.id}
                    user={f}
                    active={activeUserId === f.id}
                    onClick={() => setActiveUserId(f.id)}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 overflow-x-auto border-t border-zinc-100 px-5 py-2">
              <DayPill
                active={selectedDay === null}
                color="#18181b"
                onClick={() => setSelectedDay(null)}
              >
                All days
              </DayPill>
              {trip.days.map((day) => {
                const color = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];
                return (
                  <DayPill
                    key={day.dayNumber}
                    active={selectedDay === day.dayNumber}
                    color={color}
                    onClick={() =>
                      setSelectedDay(
                        selectedDay === day.dayNumber ? null : day.dayNumber
                      )
                    }
                  >
                    Day {day.dayNumber}
                  </DayPill>
                );
              })}
              <button
                type="button"
                onClick={addDay}
                className="shrink-0 rounded-full border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-500 hover:text-zinc-900"
              >
                + Day
              </button>
            </div>
          </div>

          <div className="px-5 py-4">
          {displayedTrip.days.map((day) => {
            const color = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];
            return (
              <section key={day.dayNumber} className="mb-6">
                <div className="mb-3 flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <h2 className="text-sm font-semibold uppercase tracking-wide">
                      Day {day.dayNumber} — {day.title}
                    </h2>
                  </div>
                  <span className="text-xs text-zinc-400">{day.date}</span>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e: DragEndEvent) => {
                    const { active, over } = e;
                    if (!over || active.id === over.id) return;
                    reorderSteps(
                      day.dayNumber,
                      String(active.id),
                      String(over.id)
                    );
                  }}
                >
                  <SortableContext
                    items={day.steps.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ol
                      className="relative ml-1 border-l-2 pl-5"
                      style={{ borderColor: `${color}40` }}
                    >
                      {day.steps.map((step, i) => {
                        const isBooked = booked.has(step.id);
                        const isConfirmed = confirmed.has(step.id);
                        const isChecked = checked.has(step.id);
                        const isSwapped = !!swaps[step.id];
                        const isOpen = openChangeFor === step.id;
                        const alts = ALTERNATIVES[step.kind] ?? [];
                        return (
                          <SortableStepLI
                            key={step.id}
                            step={step}
                            color={color}
                            isBooked={isBooked}
                            isConfirmed={isConfirmed}
                          >
                            {(dragProps) => (
                              <StepRow
                                step={step}
                                dayNumber={day.dayNumber}
                                stepIndex={i + 1}
                                isBooked={isBooked}
                                isConfirmed={isConfirmed}
                                isChecked={isChecked}
                                isSwapped={isSwapped}
                                isConfirmable={isConfirmable(step.id)}
                                onToggleCheck={() => toggleCheck(step.id)}
                                onToggleChange={() =>
                                  setOpenChangeFor(isOpen ? null : step.id)
                                }
                                isChangeOpen={isOpen}
                                alternatives={alts}
                                onPickAlternative={(c) =>
                                  guardAction(() => applySwap(step.id, c))
                                }
                                onRestore={() => guardAction(() => restoreOriginal(step.id))}
                                onDelete={() => guardAction(() => deleteStep(step.id))}
                                onBook={() => guardAction(() => router.push(`/explore/${trip.id}/book?steps=${step.id}`))}
                                onConfirm={() => guardAction(() => confirmStep(step.id))}
                                onOpenDetail={() => setDetailStepId(step.id)}
                                dragHandleProps={dragProps}
                              />
                            )}
                          </SortableStepLI>
                        );
                      })}
                    </ol>
                  </SortableContext>
                </DndContext>
                <button
                  type="button"
                  onClick={() => startAddStep(day.dayNumber)}
                  className={`mt-3 ml-1 inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1.5 text-xs font-medium transition ${
                    placementDay === day.dayNumber
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-600 hover:border-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {placementDay === day.dayNumber
                    ? "Click on the map…"
                    : "+ Add itinerary"}
                </button>
              </section>
            );
          })}
          {displayedTrip.days.length === 0 && (
            <div className="py-12 text-center text-sm text-zinc-500">
              No activities scheduled for this day.
            </div>
          )}
          </div>
        </div>

        {/* Always-visible bottom bar */}
        {(() => {
          const bookedSelected = checkedArray.filter((id) => booked.has(id)).length;
          const confirmedSelectedCount = checkedArray.filter((id) => confirmed.has(id)).length;
          const pendingSelected = checkedArray.filter((id) => !booked.has(id) && !confirmed.has(id));
          const pendingBookable = pendingSelected.filter((id) => !isConfirmable(id));
          const pendingConfirmable = pendingSelected.filter((id) => isConfirmable(id));
          const hasAnyToCancel = bookedSelected > 0 || confirmedSelectedCount > 0;
          const hasSelection = checkedArray.length > 0;
          return (
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 px-5 py-3 backdrop-blur lg:left-auto lg:right-0 lg:w-[460px]">
              {confirmingCancel ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    <span aria-hidden className="mt-0.5">⚠</span>
                    <span>
                      {bookedSelected > 0
                        ? `Cancelling ${bookedSelected} booked ${bookedSelected === 1 ? "stop" : "stops"} may incur a refund fee depending on each provider's policy.`
                        : `This will remove ${confirmedSelectedCount} confirmed ${confirmedSelectedCount === 1 ? "stop" : "stops"} from your itinerary.`}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setConfirmingCancel(false)}
                      className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-400"
                    >
                      Keep
                    </button>
                    <button
                      onClick={confirmCancelSelected}
                      className="rounded-full bg-rose-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-rose-700"
                    >
                      Confirm cancellation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-zinc-700">
                    {hasSelection ? (
                      <>
                        <span className="font-medium">{checkedArray.length}</span>{" "}
                        selected
                      </>
                    ) : (
                      <span className="text-zinc-500">No stops selected</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleSelectAllVisible}
                      disabled={visibleStepIds.length === 0}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition disabled:opacity-40 ${
                        allVisibleSelected
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      {allVisibleSelected ? "Deselect all" : "Select all"}
                    </button>
                    {hasAnyToCancel && (
                      <button
                        onClick={() => guardAction(() => setConfirmingCancel(true))}
                        className="rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                      >
                        Cancel selected
                      </button>
                    )}
                    {pendingConfirmable.length > 0 && (
                      <button
                        onClick={() => guardAction(confirmSelected)}
                        className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
                      >
                        Confirm selected
                      </button>
                    )}
                    {pendingBookable.length > 0 && (
                      <button
                        onClick={() => guardAction(() => {
                          router.push(`/explore/${trip.id}/book?steps=${pendingBookable.join(",")}`);
                        })}
                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-emerald-700"
                      >
                        Book selected
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </aside>

      {/* Leave without saving modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:items-center sm:pb-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLeaveConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-zinc-500" aria-hidden>
                  <path fillRule="evenodd" d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13zm8.75-1.5v3.25c0 .138.112.25.25.25H15.5L11.75 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-zinc-900">Go back without saving?</h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600">
              You made changes to this trip but haven&apos;t saved it yet. If you leave now, your modifications will be lost.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/browse")}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
              >
                Go to globe
              </button>
              <button
                type="button"
                onClick={() => {
                  addUserTrip(initialTrip.id, initialTrip.title);
                  setTripSaved(true);
                  setShowLeaveConfirm(false);
                  router.push("/browse");
                }}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Save my trip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Friend modification guard modal */}
      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 pb-6 sm:pb-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPendingAction(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-amber-600" aria-hidden>
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-zinc-900">Are you sure?</h2>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              You are modifying the itinerary of{" "}
              <span className="font-semibold text-zinc-900">{activeUser.name}</span>.
              This will affect their view of the trip.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { pendingAction(); setPendingAction(null); }}
                className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
              >
                Yes, proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DayPill({
  active,
  color,
  onClick,
  children,
}: {
  active: boolean;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
      }`}
    >
      <span className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: color }} />
      {children}
    </button>
  );
}

type DragHandleProps = {
  attributes: Record<string, unknown>;
  listeners: Record<string, unknown> | undefined;
  isDragging: boolean;
};

type StepRowProps = {
  step: TripStep;
  dayNumber: number;
  stepIndex: number;
  isBooked: boolean;
  isConfirmed: boolean;
  isChecked: boolean;
  isSwapped: boolean;
  isConfirmable: boolean;
  isChangeOpen: boolean;
  alternatives: SwapChoice[];
  onToggleCheck: () => void;
  onToggleChange: () => void;
  onPickAlternative: (choice: SwapChoice) => void;
  onRestore: () => void;
  onDelete: () => void;
  onBook: () => void;
  onConfirm: () => void;
  onOpenDetail: () => void;
  dragHandleProps?: DragHandleProps;
};

function StepRow({
  step,
  dayNumber,
  stepIndex,
  isBooked,
  isConfirmed,
  isChecked,
  isSwapped,
  isConfirmable,
  isChangeOpen,
  alternatives,
  onToggleCheck,
  onToggleChange,
  onPickAlternative,
  onRestore,
  onDelete,
  onBook,
  onConfirm,
  onOpenDetail,
  dragHandleProps,
}: StepRowProps) {
  return (
    <div
      className={`rounded-lg border transition ${
        isBooked
          ? "border-emerald-200 bg-emerald-50/60"
          : isConfirmed
          ? "border-indigo-200 bg-indigo-50/60"
          : isChecked
          ? "border-zinc-300 bg-zinc-50"
          : "border-transparent"
      }`}
    >
      {/* Main info row */}
      <div className="flex items-start gap-1 p-2">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="relative h-14 w-14 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.imageUrl}
              alt={step.name}
              className={`h-14 w-14 rounded-md object-cover ${
                isBooked ? "ring-2 ring-emerald-400" : isConfirmed ? "ring-2 ring-indigo-400" : ""
              }`}
            />
            {isBooked && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[10px] font-bold text-white">✓</span>
            )}
            {isConfirmed && !isBooked && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-[10px] font-bold text-white">✓</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-wide text-zinc-400">
              <span>{dayNumber}.{stepIndex} · {step.kind}{step.time ? ` · ${step.time}` : ""}</span>
              {isSwapped && <span className="rounded-full bg-violet-100 px-1.5 py-px text-[9px] font-semibold text-violet-700">Changed</span>}
              {isBooked && <span className="rounded-full bg-emerald-100 px-1.5 py-px text-[9px] font-semibold text-emerald-700">Booked</span>}
              {isConfirmed && !isBooked && <span className="rounded-full bg-indigo-100 px-1.5 py-px text-[9px] font-semibold text-indigo-700">Confirmed</span>}
            </div>
            <div className="truncate text-sm font-medium text-zinc-900">{step.name}</div>
            {step.notes && <div className="mt-0.5 truncate text-xs text-zinc-500">{step.notes}</div>}
            <label className="mt-1 inline-flex cursor-pointer items-center gap-1.5 text-xs text-zinc-500">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={onToggleCheck}
                className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
              />
              Select
            </label>
          </div>
        </div>
        {/* Map details + drag */}
        <div className="flex shrink-0 items-start gap-0.5">
          <button
            type="button"
            onClick={onOpenDetail}
            aria-label="View on map"
            title="View on map"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
          >
            <MapPinIcon />
          </button>
          {dragHandleProps && (
            <button
              type="button"
              aria-label="Drag to reorder"
              title="Drag to reorder"
              {...(dragHandleProps.attributes as Record<string, unknown>)}
              {...((dragHandleProps.listeners ?? {}) as Record<string, unknown>)}
              className="inline-flex h-8 w-6 cursor-grab touch-none items-center justify-center rounded text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 active:cursor-grabbing"
            >
              <GripIcon />
            </button>
          )}
        </div>
      </div>

      {/* Action row: Trash + Select (left) + Change / Book/Confirm (right) */}
      <div className="flex items-center justify-between gap-2 px-2 pb-2">
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete stop"
          title="Delete stop"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 transition hover:bg-rose-50 hover:text-rose-500"
        >
          <TrashIcon />
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleChange}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              isChangeOpen
                ? "bg-zinc-900 text-white"
                : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
            }`}
          >
            Change
          </button>
          {isBooked ? (
            <span className="text-[11px] font-medium text-emerald-600">Booked ✓</span>
          ) : isConfirmed ? (
            <span className="text-[11px] font-medium text-indigo-600">Confirmed ✓</span>
          ) : isConfirmable ? (
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
            >
              Confirm
            </button>
          ) : (
            <button
              type="button"
              onClick={onBook}
              className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-emerald-700"
            >
              Book
            </button>
          )}
        </div>
      </div>

      {/* Alternatives panel */}
      {isChangeOpen && alternatives.length > 0 && (
        <div className="mx-2 mb-2 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-100 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Swap with
          </div>
          {alternatives.map((alt) => (
            <button
              key={alt.imageSeed}
              type="button"
              onClick={() => onPickAlternative(alt)}
              className="flex w-full items-center gap-3 border-b border-zinc-100 px-3 py-2.5 text-left last:border-b-0 transition hover:bg-zinc-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(alt.imageSeed)}/120/90`}
                alt={alt.name}
                className="h-10 w-10 shrink-0 rounded-md object-cover"
              />
              <span className="text-sm text-zinc-800">{alt.name}</span>
            </button>
          ))}
          {isSwapped && (
            <button
              type="button"
              onClick={onRestore}
              className="flex w-full items-center gap-2 border-t border-zinc-100 px-3 py-2.5 text-xs text-zinc-500 transition hover:bg-zinc-50"
            >
              <span className="text-base leading-none">↩</span> Restore original
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 13.3L15.8 17.7M15.8 6.3L8.2 10.7" />
    </svg>
  );
}

function UserPill({
  user,
  active,
  onClick,
}: {
  user: Friend;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium transition ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={user.avatarUrl}
        alt=""
        className={`h-5 w-5 rounded-full object-cover ${
          active ? "ring-2 ring-white/40" : ""
        }`}
      />
      <span className="pr-1">{user.name}</span>
    </button>
  );
}

function SharePopover({
  addedFriendIds,
  onAdd,
  onRemove,
  onClose,
}: {
  addedFriendIds: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const inviteLink = typeof window !== "undefined"
    ? `${window.location.origin}/invite/${Math.random().toString(36).slice(2, 10)}`
    : "https://atlas.example/invite/abc123";

  function copyLink() {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      {/* click-away backdrop */}
      <div className="fixed inset-0 z-30" onClick={onClose} aria-hidden />
      <div className="absolute right-0 top-11 z-40 w-72 rounded-xl border border-zinc-200 bg-white p-3 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">Share with friends</div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 transition hover:text-zinc-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="mb-3 text-xs text-zinc-500">
          Anyone you add gets their own copy of this trip — switch between them
          at any time.
        </p>
        <ul className="space-y-1">
          {FRIENDS.map((f) => {
            const added = addedFriendIds.includes(f.id);
            return (
              <li
                key={f.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.avatarUrl}
                  alt={f.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{f.name}</div>
                  <div className="text-xs text-zinc-500">{f.tagline}</div>
                </div>
                {added ? (
                  <button
                    type="button"
                    onClick={() => onRemove(f.id)}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:border-rose-300 hover:text-rose-700"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAdd(f.id)}
                    className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-zinc-700"
                  >
                    Add
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-3 border-t border-zinc-100 pt-3">
          <div className="mb-1.5 text-xs font-semibold text-zinc-700">Invite new friends</div>
          <p className="mb-2 text-xs text-zinc-500">
            Share this link with anyone — they can join and plan together.
          </p>
          <div className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5">
            <span className="min-w-0 flex-1 truncate text-[11px] text-zinc-500 font-mono">
              {inviteLink}
            </span>
            <button
              type="button"
              onClick={copyLink}
              className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                copied
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-200"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

function SaveTripButton({
  baseTripId,
  title,
  onSave,
}: {
  baseTripId: string;
  title: string;
  onSave?: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    const existing = loadUserTrips().find((t) => t.baseTripId === baseTripId);
    setSaved(Boolean(existing));
  }, [baseTripId]);

  useEffect(() => {
    if (!justSaved) return;
    const id = setTimeout(() => setJustSaved(false), 1800);
    return () => clearTimeout(id);
  }, [justSaved]);

  function handleClick() {
    if (saved) return;
    addUserTrip(baseTripId, title);
    setSaved(true);
    setJustSaved(true);
    onSave?.();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? "Already in your trips" : "Save to your trips"}
        title={saved ? "Already in your trips" : "Save to your trips"}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
          saved
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
        }`}
      >
        {saved ? <BookmarkFilledIcon /> : <BookmarkIcon />}
      </button>
      {justSaved && (
        <div className="absolute right-0 top-11 z-40 whitespace-nowrap rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg">
          Saved to Trips
        </div>
      )}
    </div>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  );
}

function BookmarkFilledIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M6 3h12v18l-6-4-6 4V3z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden>
      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5z" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5" aria-hidden>
      <path d="M2 4h12M5 4V2.5h6V4M6 7v5M10 7v5M3 4l1 9h8l1-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="currentColor"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <circle cx="3" cy="3" r="1.1" />
      <circle cx="9" cy="3" r="1.1" />
      <circle cx="3" cy="6" r="1.1" />
      <circle cx="9" cy="6" r="1.1" />
      <circle cx="3" cy="9" r="1.1" />
      <circle cx="9" cy="9" r="1.1" />
    </svg>
  );
}

function SortableStepLI({
  step,
  color,
  isBooked,
  isConfirmed,
  children,
}: {
  step: TripStep;
  color: string;
  isBooked: boolean;
  isConfirmed: boolean;
  children: (props: DragHandleProps) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: "relative",
  };

  return (
    <li ref={setNodeRef} style={style} className="mb-4 last:mb-0">
      <span
        className={`absolute -left-[7px] mt-1 inline-block h-3 w-3 rounded-full border-2 ${
          isBooked
            ? "border-emerald-400"
            : isConfirmed
            ? "border-indigo-400"
            : "border-white"
        }`}
        style={{ backgroundColor: color }}
      />
      {children({
        attributes: attributes as unknown as Record<string, unknown>,
        listeners: listeners as unknown as Record<string, unknown> | undefined,
        isDragging,
      })}
    </li>
  );
}
