"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MapClient from "@/components/map/MapClient";
import Starfield from "@/components/browse/Starfield";
import type { Trip } from "@/lib/mock/types";
import { filterTripsByProfile } from "@/lib/mock/trips";
import {
  getActiveProfile,
  loadStore,
  saveStore,
  type Profile,
  type ProfileStore,
} from "@/lib/profile";

export default function BrowseView({ trips }: { trips: Trip[] }) {
  const [store, setStore] = useState<ProfileStore | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(true);

  useEffect(() => {
    const loaded = loadStore();
    setStore(loaded);
    setHydrated(true);
    if (!loaded || !getActiveProfile(loaded)) {
      setFilterEnabled(false);
    }
  }, []);

  const profile: Profile | null = useMemo(() => getActiveProfile(store), [store]);
  const hasProfile = !!profile;
  const isFiltering = filterEnabled && hasProfile;

  const filteredTrips = useMemo(() => {
    if (!isFiltering) return trips;
    return filterTripsByProfile(trips, profile);
  }, [trips, isFiltering, profile]);

  const isEmpty = isFiltering && filteredTrips.length === 0;

  function switchProfile(profileId: string) {
    if (!store) return;
    const next: ProfileStore = { ...store, activeProfileId: profileId };
    setStore(next);
    saveStore(next);
    setFilterEnabled(true);
  }

  return (
    <div
      className="relative flex flex-1 flex-col text-white"
      style={{
        background:
          "radial-gradient(ellipse at 50% 35%, #1a2247 0%, #0d1230 45%, #060818 100%)",
      }}
    >
      <div className="absolute inset-0">
        <Starfield />
      </div>
      <div className="absolute inset-0">
        <MapClient mode="globe" trips={filteredTrips} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-300 to-violet-500" />
          <span className="text-lg font-semibold tracking-tight">atlas</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white/70 sm:gap-6">
          <Link className="hidden hover:text-white sm:inline" href="/discover">
            Discover
          </Link>
          <Link className="hidden hover:text-white sm:inline" href="/trips">
            Trips
          </Link>
          <Link className="hover:text-white" href="/">
            Home
          </Link>
        </nav>
      </header>

      {hydrated && hasProfile && (
        <div className="pointer-events-auto relative z-10 mx-auto mt-2 flex w-full max-w-3xl flex-wrap items-center gap-2 rounded-2xl border border-cyan-400/30 bg-black/60 px-3 py-2 text-xs text-white backdrop-blur sm:text-sm">
          <span
            className={`inline-flex h-2 w-2 shrink-0 rounded-full ${
              isFiltering ? "bg-cyan-300" : "bg-white/40"
            }`}
          />
          <span className="shrink-0">
            {isFiltering ? (
              <>
                <span className="font-semibold">{filteredTrips.length}</span> of{" "}
                {trips.length} for
              </>
            ) : (
              <>All {trips.length} trips · filter off ·</>
            )}
          </span>
          {store && store.profiles.length > 0 && (
            <div className="flex flex-1 flex-wrap items-center gap-1.5">
              {store.profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => switchProfile(p.id)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition sm:text-xs ${
                    isFiltering && p.id === profile?.id
                      ? "bg-cyan-300 text-black"
                      : "border border-white/20 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {p.label || "Untitled"}
                </button>
              ))}
            </div>
          )}
          {isFiltering ? (
            <button
              type="button"
              onClick={() => setFilterEnabled(false)}
              className="shrink-0 rounded-full border border-white/20 px-3 py-1 transition hover:bg-white/10"
            >
              Show all
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setFilterEnabled(true)}
              className="shrink-0 rounded-full bg-cyan-300 px-3 py-1 font-medium text-black transition hover:bg-cyan-200"
            >
              Show matched
            </button>
          )}
        </div>
      )}

      <main className="pointer-events-none relative z-10 flex flex-1 items-end px-6 pb-10 sm:px-8 sm:pb-16">
        <div className="max-w-md">
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-cyan-300/90 sm:mb-3 sm:text-xs">
            {isFiltering && profile?.label
              ? `Tailored for · ${profile.label}`
              : `${trips.length} trips · 6 continents`}
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {isEmpty
              ? "Nothing matches that profile."
              : isFiltering
              ? "Trips picked for the way you travel."
              : "Travel through other people's notebooks."}
          </h1>
          <p className="mt-3 text-sm text-white/70 sm:mt-4 sm:text-base">
            {isEmpty ? (
              <>
                Try loosening your preferences in{" "}
                <Link href="/discover" className="underline hover:text-white">
                  Discover
                </Link>{" "}
                or{" "}
                <button
                  type="button"
                  onClick={() => setFilterEnabled(false)}
                  className="underline hover:text-white"
                >
                  show all trips
                </button>
                .
              </>
            ) : (
              <>
                Spin the globe, click a pin, and walk through someone's trip day
                by day — every airport, hotel, meal, and detour.
              </>
            )}
          </p>
        </div>
      </main>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-56 bg-gradient-to-t from-[#060818]/85 via-[#060818]/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-[#060818]/50 to-transparent" />
    </div>
  );
}
