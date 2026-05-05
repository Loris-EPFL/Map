import MapClient from "@/components/map/MapClient";
import { trips } from "@/lib/mock/trips";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col bg-black text-white">
      <div className="absolute inset-0">
        <MapClient mode="globe" trips={trips} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-300 to-violet-500" />
          <span className="text-lg font-semibold tracking-tight">atlas</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-white/70 sm:gap-6">
          <a className="hidden hover:text-white sm:inline" href="#">Explore</a>
          <a className="hidden hover:text-white sm:inline" href="#">Plan a trip</a>
          <a className="hover:text-white" href="#">Sign in</a>
        </nav>
      </header>

      <main className="pointer-events-none relative z-10 flex flex-1 items-end px-6 pb-10 sm:px-8 sm:pb-16">
        <div className="max-w-md">
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-cyan-300/90 sm:mb-3 sm:text-xs">
            {trips.length} trips · 6 continents
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Travel through other people's notebooks.
          </h1>
          <p className="mt-3 text-sm text-white/70 sm:mt-4 sm:text-base">
            Spin the globe, click a pin, and walk through someone's trip
            day by day — every airport, hotel, meal, and detour.
          </p>
        </div>
      </main>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
    </div>
  );
}
