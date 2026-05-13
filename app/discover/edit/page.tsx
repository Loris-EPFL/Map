import Link from "next/link";
import ProfileForm from "@/components/discover/ProfileForm";

export const metadata = {
  title: "Edit profile — Atlas",
};

export default function DiscoverEdit() {
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

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 sm:mb-10">
          <Link
            href="/discover"
            className="text-xs text-zinc-400 transition hover:text-zinc-700"
          >
            ← Back to profiles
          </Link>
          <p className="mt-4 mb-2 text-xs uppercase tracking-[0.2em] text-violet-600">
            Discover
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Edit profile
          </h1>
          <p className="mt-3 text-sm text-zinc-600 sm:text-base">
            We&apos;ll use this to surface trips that fit how you like to travel.
            Everything stays on your device — nothing is sent anywhere.
          </p>
        </div>

        <ProfileForm />
      </main>
    </div>
  );
}
