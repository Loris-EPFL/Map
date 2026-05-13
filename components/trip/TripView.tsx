"use client";

import Link from "next/link";
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

  const activeUser: Friend =
    activeUserId === "me"
      ? ME
      : FRIENDS.find((f) => f.id === activeUserId) ?? ME;
  const activeState = users[activeUserId] ?? emptyUserState();
  const { checked, booked, swaps } = activeState;

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
  const bookedCount = booked.size;
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

  function confirmCancelSelected() {
    setBooked((prev) => {
      const next = new Set(prev);
      checkedArray.forEach((id) => next.delete(id));
      return next;
    });
    setChecked(new Set());
    setConfirmingCancel(false);
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
        <Link
          href="/browse"
          className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-zinc-700 shadow-md backdrop-blur transition hover:bg-white"
        >
          ← Back to globe
        </Link>

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
      <aside className="relative z-10 flex min-h-0 w-full flex-1 flex-col bg-white shadow-2xl lg:w-[460px] lg:flex-none">
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
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <h1 className="text-2xl font-semibold leading-tight">{trip.title}</h1>
              <p className="mt-1 text-sm text-white/80">{trip.subtitle}</p>
            </div>
          </div>

          {/* Sticky summary: trip meta + (user switcher) + day pills */}
          <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
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
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SaveTripButton baseTripId={trip.id} title={trip.title} />
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
                          >
                            {(dragProps) => (
                              <StepRow
                                step={step}
                                dayNumber={day.dayNumber}
                                stepIndex={i + 1}
                                isBooked={isBooked}
                                isChecked={isChecked}
                                isSwapped={isSwapped}
                                onToggleCheck={() => toggleCheck(step.id)}
                                onToggleChange={() =>
                                  setOpenChangeFor(isOpen ? null : step.id)
                                }
                                isChangeOpen={isOpen}
                                alternatives={alts}
                                onPickAlternative={(c) =>
                                  applySwap(step.id, c)
                                }
                                onRestore={() => restoreOriginal(step.id)}
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
          const unbookedSelected = checkedArray.length - bookedSelected;
          const hasSelection = checkedArray.length > 0;
          return (
            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 px-5 py-3 backdrop-blur lg:left-auto lg:right-0 lg:w-[460px]">
              {confirmingCancel ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    <span aria-hidden className="mt-0.5">⚠</span>
                    <span>
                      Cancelling {bookedSelected} booked{" "}
                      {bookedSelected === 1 ? "stop" : "stops"} may incur a
                      refund fee depending on each provider's policy.
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setConfirmingCancel(false)}
                      className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-400"
                    >
                      Keep bookings
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
                        {bookedSelected > 0 && unbookedSelected > 0 && (
                          <span className="ml-1 text-xs text-zinc-500">
                            ({unbookedSelected} new, {bookedSelected} booked)
                          </span>
                        )}
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
                    {bookedSelected > 0 && (
                      <button
                        onClick={() => setConfirmingCancel(true)}
                        className="rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                      >
                        Cancel selected
                      </button>
                    )}
                    {unbookedSelected > 0 && (
                      <button
                        onClick={() => {
                          const ids = checkedArray.filter((id) => !booked.has(id));
                          router.push(`/explore/${trip.id}/book?steps=${ids.join(",")}`);
                        }}
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
  isChecked: boolean;
  isSwapped: boolean;
  isChangeOpen: boolean;
  alternatives: SwapChoice[];
  onToggleCheck: () => void;
  onToggleChange: () => void;
  onPickAlternative: (choice: SwapChoice) => void;
  onRestore: () => void;
  onOpenDetail: () => void;
  dragHandleProps?: DragHandleProps;
};

function StepRow({
  step,
  dayNumber,
  stepIndex,
  isBooked,
  isChecked,
  isSwapped,
  isChangeOpen,
  alternatives,
  onToggleCheck,
  onToggleChange,
  onPickAlternative,
  onRestore,
  onOpenDetail,
  dragHandleProps,
}: StepRowProps) {
  return (
    <div
      className={`rounded-lg border p-2 transition ${
        isBooked
          ? "border-emerald-200 bg-emerald-50/60"
          : isChecked
          ? "border-zinc-300 bg-zinc-50"
          : "border-transparent"
      }`}
    >
      <div className="flex items-start gap-1">
        <button
          type="button"
          onClick={onOpenDetail}
          className="group flex w-full gap-3 rounded-md text-left transition hover:bg-zinc-100/60"
        >
          <div className="relative h-14 w-14 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.imageUrl}
              alt={step.name}
              className={`h-14 w-14 rounded-md object-cover ${
                isBooked ? "ring-2 ring-emerald-400" : ""
              }`}
            />
            {isBooked && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[10px] font-bold text-white">
                ✓
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-zinc-400">
              <span>
                {dayNumber}.{stepIndex} · {step.kind}
                {step.time ? ` · ${step.time}` : ""}
              </span>
              {isSwapped && (
                <span className="rounded-full bg-violet-100 px-1.5 py-px text-[9px] font-semibold text-violet-700">
                  Changed
                </span>
              )}
              {isBooked && (
                <span className="rounded-full bg-emerald-100 px-1.5 py-px text-[9px] font-semibold text-emerald-700">
                  Booked
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 truncate text-sm font-medium">
              <span className="truncate">{step.name}</span>
              <span
                aria-hidden
                className="shrink-0 text-xs text-zinc-400 opacity-0 transition group-hover:opacity-100"
              >
                →
              </span>
            </div>
            {step.notes && (
              <div className="mt-0.5 truncate text-xs text-zinc-500">{step.notes}</div>
            )}
          </div>
        </button>
        {dragHandleProps && (
          <button
            type="button"
            aria-label="Drag to reorder"
            title="Drag to reorder"
            {...(dragHandleProps.attributes as Record<string, unknown>)}
            {...((dragHandleProps.listeners ?? {}) as Record<string, unknown>)}
            className="mt-1 inline-flex h-7 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 active:cursor-grabbing"
          >
            <GripIcon />
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 pl-[68px]">
        <label className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={onToggleCheck}
            className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
          />
          Select
        </label>
        <div className="flex items-center gap-1.5">
          {alternatives.length > 0 && (
            <button
              type="button"
              onClick={onToggleChange}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                isChangeOpen
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 text-zinc-700 hover:border-zinc-400"
              }`}
            >
              Change
            </button>
          )}
        </div>
      </div>

      {isChangeOpen && alternatives.length > 0 && (
        <div className="mt-2 ml-[68px] rounded-md border border-zinc-200 bg-white p-2">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-zinc-500">
            Alternatives
          </div>
          <div className="flex flex-col gap-1">
            {alternatives.map((alt) => (
              <button
                key={alt.imageSeed}
                type="button"
                onClick={() => onPickAlternative(alt)}
                className="rounded-md px-2 py-1.5 text-left text-xs text-zinc-700 transition hover:bg-zinc-100"
              >
                {alt.name}
              </button>
            ))}
            {isSwapped && (
              <button
                type="button"
                onClick={onRestore}
                className="rounded-md border-t border-zinc-100 px-2 py-1.5 text-left text-xs text-zinc-500 transition hover:bg-zinc-50"
              >
                Restore original
              </button>
            )}
          </div>
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
}: {
  baseTripId: string;
  title: string;
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
  children,
}: {
  step: TripStep;
  color: string;
  isBooked: boolean;
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
          isBooked ? "border-emerald-400" : "border-white"
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
