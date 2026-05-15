// Tiny time helpers for "HH:MM" 24h strings. Pure, no deps.

export function parseHHMM(t: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t?.trim() ?? "");
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return NaN;
  return h * 60 + min;
}

export function formatHHMM(mins: number): string {
  const wrapped = ((Math.round(mins) % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addMinutes(t: string, delta: number): string {
  const base = parseHHMM(t);
  if (Number.isNaN(base)) return t;
  return formatHHMM(base + delta);
}

// Inclusive start, exclusive end. Bad inputs → false.
export function inWindow(t: string, start: string, end: string): boolean {
  const v = parseHHMM(t);
  const s = parseHHMM(start);
  const e = parseHHMM(end);
  if (Number.isNaN(v) || Number.isNaN(s) || Number.isNaN(e)) return false;
  return v >= s && v < e;
}

// "20:30" → "8:30pm" (used in tooltip copy).
export function to12h(t: string): string {
  const v = parseHHMM(t);
  if (Number.isNaN(v)) return t;
  const h24 = Math.floor(v / 60);
  const m = v % 60;
  const ampm = h24 < 12 ? "am" : "pm";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")}${ampm}`;
}
