"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  loadStore,
  saveStore,
  createEmptyStore,
  createProfile,
  formatDateRange,
  type Profile,
  type ProfileStore,
} from "@/lib/profile";

const PRESET_LABELS = [
  "Solo backpacking",
  "Family vacation",
  "Romantic getaway",
  "Friends weekend",
  "Wellness retreat",
  "City break",
];

const TRAVEL_STYLE_LABELS: Record<string, string> = {
  solo: "Solo",
  couple: "Couple",
  family: "Family",
  friends: "With friends",
};

const PACE_LABELS: Record<string, string> = {
  relaxed: "Relaxed",
  balanced: "Balanced",
  packed: "Packed",
};

const BUDGET_LABELS: Record<string, string> = {
  budget: "Budget",
  midrange: "Mid-range",
  luxury: "Luxury",
};

export default function DiscoverView() {
  const router = useRouter();
  const [store, setStore] = useState<ProfileStore | null>(null);
  const [showNewPresets, setShowNewPresets] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const existing = loadStore();
    setStore(existing ?? createEmptyStore());
  }, []);

  function addProfile(label: string) {
    const fresh = createProfile(label);
    setStore((prev) => {
      const base = prev ?? createEmptyStore();
      const next: ProfileStore = {
        profiles: [...base.profiles, fresh],
        activeProfileId: fresh.id,
      };
      saveStore(next);
      return next;
    });
    setShowNewPresets(false);
    router.push("/discover/edit");
  }

  function deleteProfile(id: string) {
    setStore((prev) => {
      if (!prev || prev.profiles.length <= 1) return prev;
      const remaining = prev.profiles.filter((p) => p.id !== id);
      const next: ProfileStore = {
        profiles: remaining,
        activeProfileId:
          prev.activeProfileId === id ? remaining[0].id : prev.activeProfileId,
      };
      saveStore(next);
      return next;
    });
    setConfirmDeleteId(null);
  }

  function openEdit(profileId: string) {
    if (!store) return;
    const next = { ...store, activeProfileId: profileId };
    saveStore(next);
    router.push("/discover/edit");
  }

  if (!store) return null;

  const { profiles } = store;

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
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-violet-600">
              Discover
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Your travel profiles
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              {profiles.length}{" "}
              {profiles.length === 1 ? "profile" : "profiles"} saved
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewPresets((v) => !v)}
            className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            + New profile
          </button>
        </div>

        {showNewPresets && (
          <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="mb-3 text-sm font-medium text-zinc-700">
              Choose a starting point
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => addProfile(label)}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-400"
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => addProfile("New trip")}
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-700"
              >
                Blank
              </button>
            </div>
          </div>
        )}

        {profiles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-8 py-16 text-center">
            <p className="text-sm text-zinc-500">
              No profiles yet. Create one to get started.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                canDelete={profiles.length > 1}
                isConfirmingDelete={confirmDeleteId === profile.id}
                onEdit={() => openEdit(profile.id)}
                onRequestDelete={() => setConfirmDeleteId(profile.id)}
                onCancelDelete={() => setConfirmDeleteId(null)}
                onConfirmDelete={() => deleteProfile(profile.id)}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function ProfileCard({
  profile,
  canDelete,
  isConfirmingDelete,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  profile: Profile;
  canDelete: boolean;
  isConfirmingDelete: boolean;
  onEdit: () => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  const meta = [
    profile.travelStyle ? TRAVEL_STYLE_LABELS[profile.travelStyle] : null,
    profile.pace ? PACE_LABELS[profile.pace] : null,
    profile.budget ? BUDGET_LABELS[profile.budget] : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="p-5">
        <h2 className="text-base font-semibold leading-tight text-zinc-900">
          {profile.label || "Untitled"}
        </h2>
        {meta ? (
          <div className="mt-1 text-xs text-zinc-500">{meta}</div>
        ) : (
          <div className="mt-1 text-xs text-zinc-400 italic">No preferences set yet</div>
        )}
        {profile.startDate && profile.endDate && (
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-medium text-violet-700">
            <span aria-hidden>📅</span>
            {formatDateRange(profile.startDate, profile.endDate)}
          </div>
        )}
        {profile.updatedAt && (
          <div className="mt-1 text-xs text-zinc-400">
            Updated {new Date(profile.updatedAt).toLocaleDateString()}
          </div>
        )}

        {(profile.vibes.length > 0 || profile.interests.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {profile.vibes.map((v) => (
              <span
                key={v}
                className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-medium text-violet-700"
              >
                {v}
              </span>
            ))}
            {profile.interests.map((i) => (
              <span
                key={i}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600"
              >
                {i}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
          >
            Edit profile
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={onRequestDelete}
              className="ml-auto rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {isConfirmingDelete && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-900">
          <span>Remove this profile? This can&apos;t be undone.</span>
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
              className="rounded-full bg-rose-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
