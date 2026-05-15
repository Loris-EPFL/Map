"use client";

import Link from "next/link";
import { useState } from "react";
import type { Trip, TripStep, StepKind } from "@/lib/mock/types";
import { addBookedStepIds } from "@/lib/bookings";

const PRICE_RANGES: Record<StepKind, [number, number]> = {
  airport: [20, 40],
  hotel: [89, 299],
  activity: [25, 120],
  restaurant: [18, 75],
  transport: [5, 28],
  viewpoint: [0, 18],
};

function stepPrice(step: TripStep): number {
  const [min, max] = PRICE_RANGES[step.kind];
  let h = 0;
  for (const c of step.id) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff;
  const t = h / 0x7fffffff;
  return Math.round((min + t * (max - min)) * 100) / 100;
}

const KIND_LABEL: Record<StepKind, string> = {
  airport: "Airport",
  hotel: "Hotel",
  activity: "Activity",
  restaurant: "Restaurant",
  transport: "Transport",
  viewpoint: "Viewpoint",
};

const KIND_COLOR: Record<StepKind, string> = {
  airport: "bg-sky-100 text-sky-700",
  hotel: "bg-violet-100 text-violet-700",
  activity: "bg-amber-100 text-amber-700",
  restaurant: "bg-rose-100 text-rose-700",
  transport: "bg-zinc-100 text-zinc-600",
  viewpoint: "bg-emerald-100 text-emerald-700",
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function findDayNumber(trip: Trip, stepId: string): number | null {
  for (const day of trip.days) {
    if (day.steps.some((s) => s.id === stepId)) return day.dayNumber;
  }
  return null;
}

type Props = { trip: Trip; steps: TripStep[] };

export default function BookingView({ trip, steps }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("flavia@hotmail.com");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const prices = steps.map((s) => stepPrice(s));
  const subtotal = prices.reduce((a, b) => a + b, 0);
  const serviceFee = Math.round(subtotal * 0.08 * 100) / 100;
  const taxes = Math.round(subtotal * 0.1 * 100) / 100;
  const total = Math.round((subtotal + serviceFee + taxes) * 100) / 100;

  function formatCard(raw: string) {
    return raw
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  }

  function handleConfirm() {
    addBookedStepIds(
      trip.id,
      steps.map((s) => s.id)
    );
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-5">
        <div className="w-full max-w-sm rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-emerald-600">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">Booking confirmed!</h1>
          <p className="mt-2 text-sm text-zinc-500">
            {steps.length} {steps.length === 1 ? "stop" : "stops"} booked for{" "}
            <span className="font-medium text-zinc-700">{fmt(total)}</span>.
            <br />A confirmation will appear in your trips.
          </p>
          <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Your reservations and all necessary information have been sent to{" "}
            <span className="font-semibold">{email}</span>.
          </p>
          <Link
            href={`/explore/${trip.id}`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Back to itinerary
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-5 py-4">
          <Link
            href={`/explore/${trip.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back
          </Link>
          <span className="text-zinc-300">|</span>
          <h1 className="text-sm font-semibold text-zinc-900">Review &amp; Pay</h1>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-5 py-6 space-y-6">
        {/* Trip label */}
        <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          {trip.title}
        </div>

        {/* Selections */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">
            Your selections{" "}
            <span className="ml-1 font-normal text-zinc-400">
              · {steps.length} {steps.length === 1 ? "stop" : "stops"}
            </span>
          </h2>
          <ul className="space-y-2">
            {steps.map((step, i) => {
              const dayNumber = findDayNumber(trip, step.id);
              return (
                <li
                  key={step.id}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.imageUrl}
                    alt={step.name}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded-full px-2 py-px text-[10px] font-semibold ${KIND_COLOR[step.kind]}`}
                      >
                        {KIND_LABEL[step.kind]}
                      </span>
                      {dayNumber && (
                        <span className="text-[10px] text-zinc-400">Day {dayNumber}</span>
                      )}
                      {step.time && (
                        <span className="text-[10px] text-zinc-400">· {step.time}</span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-sm font-medium text-zinc-900">
                      {step.name}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-zinc-900">
                    {prices[i] === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      fmt(prices[i])
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Price summary */}
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">Price summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-600">
              <dt>Subtotal ({steps.length} {steps.length === 1 ? "stop" : "stops"})</dt>
              <dd>{fmt(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-zinc-600">
              <dt>Service fee (8%)</dt>
              <dd>{fmt(serviceFee)}</dd>
            </div>
            <div className="flex justify-between text-zinc-600">
              <dt>Estimated taxes (10%)</dt>
              <dd>{fmt(taxes)}</dd>
            </div>
            <div className="my-1 border-t border-zinc-100" />
            <div className="flex justify-between text-base font-semibold text-zinc-900">
              <dt>Total</dt>
              <dd>{fmt(total)}</dd>
            </div>
          </dl>
        </section>

        {/* Payment form */}
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">Payment details</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">
                Cardholder name
              </label>
              <input
                type="text"
                placeholder="Flavia Wallenhorst"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
              <p className="mt-1 text-xs text-zinc-400">
                Your reservations and all necessary information will be sent to
                this address.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-600">
                Card number
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCard(e.target.value))}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 pr-14 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <CardIcon digits={cardNumber.replace(/\s/g, "")} />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Expiry date
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
              <div className="w-28">
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  CVV
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123"
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
            <LockIcon />
            Payments are encrypted and secure. This is a prototype — no real charge will occur.
          </p>
        </section>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full rounded-full bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
          >
            Confirm &amp; Pay · {fmt(total)}
          </button>
          <p className="mt-2 text-center text-xs text-zinc-500">
            On confirmation, your reservations and all necessary information
            will be sent by email to{" "}
            <span className="font-medium text-zinc-700">{email}</span>.
          </p>
          <p className="mt-1 text-center text-xs text-zinc-400">
            By confirming you agree to the cancellation policy for each provider.
          </p>
        </div>
      </div>
    </div>
  );
}

function CardIcon({ digits }: { digits: string }) {
  const isVisa = digits.startsWith("4");
  const isMC = /^5[1-5]/.test(digits) || /^2[2-7]/.test(digits);
  const isAmex = /^3[47]/.test(digits);

  if (isVisa) {
    return (
      <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-tight text-blue-700">
        VISA
      </span>
    );
  }
  if (isMC) {
    return (
      <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-tight text-red-600">
        MC
      </span>
    );
  }
  if (isAmex) {
    return (
      <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-bold tracking-tight text-sky-600">
        AMEX
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-zinc-300" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden>
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  );
}
