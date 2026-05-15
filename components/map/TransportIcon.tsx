import type { TransportMode } from "@/lib/mock/transport";

export default function TransportIcon({
  mode,
  className = "h-4 w-4",
}: {
  mode: TransportMode;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (mode) {
    case "foot":
      return (
        <svg {...common}>
          <circle cx="13" cy="4" r="1.6" />
          <path d="M13 7l-2.5 4 3 2 1 6" />
          <path d="M10.5 11L7 13l-2 4" />
          <path d="M13.5 13l4 1.5" />
        </svg>
      );
    case "car":
      return (
        <svg {...common}>
          <path d="M5 16v2M19 16v2" />
          <path d="M4 16l1.5-5.5A2 2 0 017.4 9h9.2a2 2 0 011.9 1.5L20 16z" />
          <rect x="3" y="16" width="18" height="3" rx="1" />
          <path d="M6.5 16h0M17.5 16h0" />
        </svg>
      );
    case "bus":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="13" rx="2" />
          <path d="M4 11h16M9 4v7M15 4v7" />
          <path d="M7 20v-3M17 20v-3" />
        </svg>
      );
    case "metro":
      return (
        <svg {...common}>
          <rect x="6" y="4" width="12" height="12" rx="2.5" />
          <path d="M6 10h12M9 19l-2 2M15 19l2 2" />
          <circle cx="9" cy="13" r="0.6" fill="currentColor" />
          <circle cx="15" cy="13" r="0.6" fill="currentColor" />
        </svg>
      );
    case "train":
      return (
        <svg {...common}>
          <rect x="6" y="3" width="12" height="13" rx="2" />
          <path d="M6 10h12M12 3v7" />
          <path d="M8 16l-2 4M16 16l2 4" />
          <circle cx="9" cy="13" r="0.6" fill="currentColor" />
          <circle cx="15" cy="13" r="0.6" fill="currentColor" />
        </svg>
      );
  }
}
