import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import MapClient from "@/components/map/MapClient";
import { getTripById } from "@/lib/mock/trips";

const DAY_COLORS = ["#22d3ee", "#fbbf24", "#f472b6", "#34d399", "#a78bfa", "#fb7185"];

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = getTripById(tripId);
  if (!trip) notFound();

  const totalSteps = trip.days.reduce((acc, d) => acc + d.steps.length, 0);

  return (
    <div className="relative flex flex-1 flex-col bg-zinc-50 text-zinc-900 lg:flex-row">
      {/* Map */}
      <div className="relative h-[55vh] shrink-0 lg:h-auto lg:flex-1">
        <MapClient mode="itinerary" trip={trip} />
        <Link
          href="/"
          className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-zinc-700 shadow-md backdrop-blur transition hover:bg-white"
        >
          ← Back to globe
        </Link>
      </div>

      {/* Side panel */}
      <aside className="z-10 flex w-full flex-1 flex-col bg-white shadow-2xl lg:w-[420px] lg:flex-none">
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={trip.coverImageUrl}
            alt={trip.title}
            fill
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <h1 className="text-2xl font-semibold leading-tight">{trip.title}</h1>
            <p className="mt-1 text-sm text-white/80">{trip.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b px-5 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={trip.author.avatarUrl}
            alt={trip.author.name}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <div className="text-sm font-medium">{trip.author.name}</div>
            <div className="text-xs text-zinc-500">
              {trip.durationDays} days · {totalSteps} stops
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {trip.days.map((day) => {
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
                <ol className="relative ml-1 border-l-2 pl-5" style={{ borderColor: `${color}40` }}>
                  {day.steps.map((step, i) => (
                    <li key={step.id} className="mb-4 last:mb-0">
                      <span
                        className="absolute -left-[7px] mt-1 inline-block h-3 w-3 rounded-full border-2 border-white"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={step.imageUrl}
                          alt={step.name}
                          className="h-14 w-14 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-wide text-zinc-400">
                            {day.dayNumber}.{i + 1} · {step.kind}
                            {step.time ? ` · ${step.time}` : ""}
                          </div>
                          <div className="truncate text-sm font-medium">
                            {step.name}
                          </div>
                          {step.notes && (
                            <div className="mt-0.5 text-xs text-zinc-500">
                              {step.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
