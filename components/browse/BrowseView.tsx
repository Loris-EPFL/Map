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
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [focus, setFocus] = useState<{ tripId: string; nonce: number } | null>(
    null
  );

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

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return filteredTrips
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, filteredTrips]);

  function goToTrip(t: Trip) {
    setQuery(t.title);
    setSearchOpen(false);
    setFocus({ tripId: t.id, nonce: Date.now() });
  }

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
        <MapClient mode="globe" trips={filteredTrips} focus={focus} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-300 to-violet-500" />
          <span className="text-lg font-semibold tracking-tight">atlas</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-white/70 sm:gap-6">
          <Link className="transition hover:text-white" href="/browse">Browse</Link>
          <Link className="transition hover:text-white" href="/discover">Discover</Link>
          <Link className="transition hover:text-white" href="/trips">Trips</Link>
        </nav>
      </header>

      <div className="pointer-events-auto relative z-20 mx-auto mt-1 w-full max-w-md px-6 sm:px-0">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchResults[0]) goToTrip(searchResults[0]);
              if (e.key === "Escape") setSearchOpen(false);
            }}
            placeholder="Search a place"
            aria-label="Search trips by place"
            className="w-full rounded-full border border-white/20 bg-black/60 py-2.5 pl-11 pr-11 text-sm text-white placeholder-white/40 backdrop-blur transition focus:border-cyan-300/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSearchOpen(false);
              }}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}

          {searchOpen && query.trim() && (
            <ul className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-white/15 bg-[#0d1230]/95 shadow-2xl backdrop-blur">
              {searchResults.length === 0 ? (
                <li className="px-4 py-3 text-sm text-white/50">
                  No trips match “{query.trim()}”.
                </li>
              ) : (
                searchResults.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToTrip(t)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/10"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={t.coverImageUrl}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-white">
                          {t.title}
                        </span>
                        <span className="block truncate text-xs text-white/50">
                          {t.subtitle}
                        </span>
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

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
