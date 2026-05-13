import Link from "next/link";
import Starfield from "@/components/browse/Starfield";

type Card = {
  href: string;
  title: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
};

const cards: Card[] = [
  {
    href: "/browse",
    title: "Browse",
    description: "Spin the globe and explore real trips pinned by travelers around the world.",
    accent: "from-cyan-400/80 to-sky-500/80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
      </svg>
    ),
  },
  {
    href: "/discover",
    title: "Discover",
    description: "Tell us about yourself and what you love — we'll tailor trips to match.",
    accent: "from-violet-400/80 to-fuchsia-500/80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M12 2l2.2 6.6L21 11l-5.4 4 1.8 7-5.4-3.6L6.6 22l1.8-7L3 11l6.8-2.4L12 2z" />
      </svg>
    ),
  },
  {
    href: "/trips",
    title: "Trips",
    description: "All the trips you've saved — keep planning or mark them as completed.",
    accent: "from-amber-300/80 to-orange-500/80",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M4 4h11l5 5v11H4z" />
        <path d="M15 4v5h5M8 13h8M8 17h5" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div
      className="relative flex flex-1 flex-col overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #182148 0%, #0c1230 50%, #04060f 100%)",
      }}
    >
      {/* Starfield (animated canvas) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Starfield />
      </div>

      {/* Drifting color orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="orb orb-a absolute -left-32 -top-40 h-[640px] w-[640px] rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="orb orb-b absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full bg-violet-500/25 blur-3xl" />
        <div className="orb orb-c absolute -bottom-44 left-1/4 h-[700px] w-[700px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="orb orb-d absolute right-1/4 top-1/3 h-[340px] w-[340px] rounded-full bg-amber-300/15 blur-3xl" />
      </div>

      {/* Soft vignette so the hero text reads cleanly */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-64 bg-gradient-to-t from-[#04060f]/70 via-[#04060f]/20 to-transparent" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-300 to-violet-500" />
          <span className="text-lg font-semibold tracking-tight">atlas</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/70 sm:flex">
          <Link className="hover:text-white" href="/browse">Browse</Link>
          <Link className="hover:text-white" href="/discover">Discover</Link>
          <Link className="hover:text-white" href="/trips">Trips</Link>
        </nav>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 sm:px-8">
        <div className="mb-10 max-w-2xl text-center sm:mb-14">
          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-cyan-300/90 sm:text-xs">
            Travel planner
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Let us help you organize your next trip effortlessly
          </h1>
          <p className="mt-4 text-sm text-white/70 sm:text-base">
            Browse trips others have taken, tell us what you love,
            or pick up a draft you started.
          </p>
        </div>

        <div className="grid w-full max-w-5xl gap-4 sm:gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md transition hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.1] sm:p-7"
            >
              <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${card.accent} opacity-60`}
              />
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}
              >
                {card.icon}
              </div>
              <div className="text-xl font-semibold tracking-tight">{card.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {card.description}
              </p>
              <div className="mt-5 inline-flex items-center text-sm text-white/70 transition group-hover:text-white">
                Open
                <span className="ml-1 transition group-hover:translate-x-0.5">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
