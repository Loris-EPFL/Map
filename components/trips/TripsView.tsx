"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getTripById } from "@/lib/mock/trips";
import { loadBookedStepIds } from "@/lib/bookings";
import type { Trip } from "@/lib/mock/types";
import {
  deleteUserTrip,
  loadUserTrips,
  toggleUserTripStatus,
  updateUserTrip,
  type UserTrip,
  type UserTripStatus,
} from "@/lib/userTrips";

type Filter = "all" | "planning" | "completed";

export default function TripsView() {
  const [trips, setTrips] = useState<UserTrip[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setTrips(loadUserTrips());
  }, []);

  const filtered = useMemo(() => {
    if (!trips) return [];
    if (filter === "all") return trips;
    return trips.filter((t) => t.status === filter);
  }, [trips, filter]);

  const counts = useMemo(() => {
    if (!trips) return { all: 0, planning: 0, completed: 0 };
    return {
      all: trips.length,
      planning: trips.filter((t) => t.status === "planning").length,
      completed: trips.filter((t) => t.status === "completed").length,
    };
  }, [trips]);

  function startRename(t: UserTrip) {
    setEditingId(t.id);
    setDraftName(t.name);
  }

  function commitRename() {
    if (editingId == null) return;
    const name = draftName.trim() || "Untitled trip";
    setTrips(updateUserTrip(editingId, { name }));
    setEditingId(null);
    setDraftName("");
  }

  function cancelRename() {
    setEditingId(null);
    setDraftName("");
  }

  function toggleStatus(id: string) {
    setTrips(toggleUserTripStatus(id));
  }

  function removeTrip(id: string) {
    setTrips(deleteUserTrip(id));
    setConfirmDeleteId(null);
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 text-zinc-900">
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-300 to-violet-500" />
          <span className="text-base font-semibold tracking-tight">atlas</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-500 sm:gap-6">
          <Link className="transition hover:text-zinc-900" href="/browse">Browse</Link>
          <Link className="transition hover:text-zinc-900" href="/discover">Discover</Link>
          <Link className="transition hover:text-zinc-900" href="/trips">Trips</Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-amber-600">
              Trips
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your trips
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Everything you've saved — keep planning the upcoming ones, mark the
              ones you've finished.
            </p>
          </div>
          <Link
            href="/browse"
            className="hidden shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 sm:inline-flex"
          >
            + Plan a new trip
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
            All
            <span className="ml-1.5 text-xs opacity-60">{counts.all}</span>
          </FilterPill>
          <FilterPill
            active={filter === "planning"}
            onClick={() => setFilter("planning")}
          >
            Planning
            <span className="ml-1.5 text-xs opacity-60">{counts.planning}</span>
          </FilterPill>
          <FilterPill
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
          >
            Completed
            <span className="ml-1.5 text-xs opacity-60">{counts.completed}</span>
          </FilterPill>
        </div>

        {trips === null ? (
          <EmptySkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <ul className="space-y-3">
            {filtered.map((t) => {
              const base = getTripById(t.baseTripId);
              return (
                <TripCard
                  key={t.id}
                  userTrip={t}
                  base={base}
                  isEditing={editingId === t.id}
                  draftName={draftName}
                  onDraftChange={setDraftName}
                  onStartRename={() => startRename(t)}
                  onCommitRename={commitRename}
                  onCancelRename={cancelRename}
                  onToggleStatus={() => toggleStatus(t.id)}
                  onRequestDelete={() => setConfirmDeleteId(t.id)}
                  isConfirmingDelete={confirmDeleteId === t.id}
                  onConfirmDelete={() => removeTrip(t.id)}
                  onCancelDelete={() => setConfirmDeleteId(null)}
                />
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
      }`}
    >
      {children}
    </button>
  );
}

function EmptySkeleton() {
  return (
    <ul className="space-y-3">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="flex animate-pulse items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-3"
        >
          <div className="h-20 w-28 rounded-xl bg-zinc-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-zinc-100" />
            <div className="h-3 w-1/3 rounded bg-zinc-100" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  const message =
    filter === "completed"
      ? "Nothing finished yet. Mark a planned trip as completed when you get back home."
      : filter === "planning"
      ? "No trips in planning. Head to the globe to bookmark one."
      : "You haven't saved any trips. Open a trip from the globe and tap Save.";
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-12 text-center">
      <p className="mx-auto max-w-sm text-sm text-zinc-500">{message}</p>
      <Link
        href="/browse"
        className="mt-4 inline-flex items-center gap-1 rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-700"
      >
        Open the globe →
      </Link>
    </div>
  );
}

type TripCardProps = {
  userTrip: UserTrip;
  base: Trip | undefined;
  isEditing: boolean;
  draftName: string;
  onDraftChange: (v: string) => void;
  onStartRename: () => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onToggleStatus: () => void;
  onRequestDelete: () => void;
  isConfirmingDelete: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
};

function TripCard({
  userTrip,
  base,
  isEditing,
  draftName,
  onDraftChange,
  onStartRename,
  onCommitRename,
  onCancelRename,
  onToggleStatus,
  onRequestDelete,
  isConfirmingDelete,
  onConfirmDelete,
  onCancelDelete,
}: TripCardProps) {
  const completed = userTrip.status === "completed";
  const allStepIds =
    base?.days.flatMap((d) => d.steps.map((s) => s.id)) ?? [];
  const totalStops = allStepIds.length;
  const bookedSet = new Set(loadBookedStepIds(userTrip.baseTripId));
  const bookedCount = allStepIds.filter((id) => bookedSet.has(id)).length;
  const fullyBooked = totalStops > 0 && bookedCount === totalStops;

  return (
    <li
      className={`overflow-hidden rounded-2xl border bg-white transition ${
        completed ? "border-emerald-200" : "border-zinc-200"
      }`}
    >
      <div className="flex gap-4 p-3">
        {/* Cover */}
        <Link
          href={`/explore/${userTrip.baseTripId}`}
          className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-24 sm:w-32"
        >
          {base ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={base.coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : null}
          {completed && (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/30">
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Done
              </span>
            </div>
          )}
        </Link>

        {/* Body */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              <input
                autoFocus
                type="text"
                value={draftName}
                onChange={(e) => onDraftChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onCommitRename();
                  if (e.key === "Escape") onCancelRename();
                }}
                className="input flex-1 min-w-0"
                placeholder="Trip name"
              />
              <button
                type="button"
                onClick={onCommitRename}
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancelRename}
                className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartRename}
              className="text-left text-base font-semibold leading-tight hover:underline"
            >
              {userTrip.name}
            </button>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
            <StatusPill status={userTrip.status} />
            {base && !completed && !fullyBooked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                <span aria-hidden>⚠</span>
                {bookedCount === 0
                  ? "Nothing booked yet"
                  : `Not fully booked · ${bookedCount}/${totalStops}`}
              </span>
            )}
            {base && fullyBooked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                <span aria-hidden>✓</span> All booked
              </span>
            )}
            {base && (
              <span>
                {base.durationDays} days · {totalStops} stops · based on {base.title}
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              href={`/explore/${userTrip.baseTripId}`}
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
            >
              Open
            </Link>
            <button
              type="button"
              onClick={onToggleStatus}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-400"
            >
              {completed ? "Mark as planning" : "Mark complete"}
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              className="ml-auto rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {isConfirmingDelete && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-900">
          <span>Remove this trip from your list? This can't be undone.</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancelDelete}
              className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-medium text-rose-700"
            >
              Keep
            </button>
            <button
              type="button"
              onClick={onConfirmDelete}
              className="rounded-full bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function StatusPill({ status }: { status: UserTripStatus }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
        <span>✓</span> Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
      <span>◷</span> Planning
    </span>
  );
}
