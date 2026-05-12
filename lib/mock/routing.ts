export type Coord = [number, number];

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

const cache = new Map<string, Coord[]>();
const inflight = new Map<string, Promise<Coord[] | null>>();

function keyFor(coords: Coord[]): string {
  return coords
    .map(([lng, lat]) => `${lng.toFixed(4)},${lat.toFixed(4)}`)
    .join("|");
}

export async function fetchRoute(coords: Coord[]): Promise<Coord[] | null> {
  if (coords.length < 2) return null;
  const key = keyFor(coords);
  if (cache.has(key)) return cache.get(key)!;
  const pending = inflight.get(key);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const path = coords.map(([lng, lat]) => `${lng},${lat}`).join(";");
      const url = `${OSRM_BASE}/${path}?overview=full&geometries=geojson&steps=false`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.code !== "Ok") return null;
      const geom = data.routes?.[0]?.geometry?.coordinates;
      if (!Array.isArray(geom) || geom.length < 2) return null;
      const route = geom as Coord[];
      cache.set(key, route);
      return route;
    } catch {
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}
