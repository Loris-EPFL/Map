"use client";

const COLORS = [
  "#22d3ee",
  "#f97316",
  "#f472b6",
  "#34d399",
  "#a78bfa",
  "#fbbf24",
];

// Deterministic-per-index pseudo-random so SSR/CSR markup matches.
function rand(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function Confetti({ count = 36 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = rand(i, 1) * 100;
        const drift = (rand(i, 2) - 0.5) * 240;
        const delay = rand(i, 3) * 0.6;
        const duration = 1.8 + rand(i, 4) * 1.4;
        const color = COLORS[i % COLORS.length];
        const rounded = i % 3 === 0;
        return (
          <span
            key={i}
            className="confetti-pi"
            style={
              {
                left: `${left}%`,
                background: color,
                borderRadius: rounded ? "9999px" : "1px",
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                "--x": `${drift}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
