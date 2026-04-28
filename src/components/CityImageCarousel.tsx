import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { type CityVisual, getCityWikiSlugs } from "@/data/cityVisuals";

// ── Wikipedia photo fetcher ───────────────────────────────────────────────────
// Fetches thumbnail URLs from Wikipedia REST API (free, CORS-enabled, no key).
// Upsizes the thumbnail by replacing the width in the Wikimedia CDN URL.

const LS_PREFIX = "city_photos_v2_";

async function fetchWikiPhoto(slug: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const src: string | undefined =
      data?.originalimage?.source ?? data?.thumbnail?.source;
    if (!src) return null;
    // 400px is enough for mobile cards and loads ~3× faster than 700px
    return src.replace(/\/\d+px-/, "/400px-");
  } catch {
    return null;
  }
}

// ── Hook: loads 3 photos for a city — memory cache → localStorage → Wikipedia ─
const memCache = new Map<string, (string | null)[]>();

function readLS(key: string): (string | null)[] | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? (JSON.parse(raw) as (string | null)[]) : null;
  } catch { return null; }
}

function writeLS(key: string, value: (string | null)[]) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)); } catch { /* quota */ }
}

function useCityPhotos(cityName: string) {
  const slugs    = getCityWikiSlugs(cityName);
  const cacheKey = cityName.toLowerCase();

  const [photos, setPhotos] = useState<(string | null)[]>(() => {
    // 1. memory cache (fastest — same session)
    if (memCache.has(cacheKey)) return memCache.get(cacheKey)!;
    // 2. localStorage cache (fast — persists across sessions)
    const ls = readLS(cacheKey);
    if (ls) { memCache.set(cacheKey, ls); return ls; }
    return [null, null, null];
  });

  useEffect(() => {
    if (memCache.has(cacheKey) && memCache.get(cacheKey)!.some(Boolean)) return;
    let cancelled = false;

    Promise.all(slugs.map(fetchWikiPhoto)).then((results) => {
      if (cancelled) return;
      memCache.set(cacheKey, results);
      writeLS(cacheKey, results);
      setPhotos(results);
    });

    return () => { cancelled = true; };
  }, [cacheKey]);

  return photos;
}

// ── Component ─────────────────────────────────────────────────────────────────
type Props = {
  visual: CityVisual;
  cityName: string;
  country: string;
  region: string;
  height?: string;
};

export function CityImageCarousel({ visual, cityName, country, region, height = "h-44" }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set());
  const [errorSet, setErrorSet] = useState<Set<number>>(new Set());

  const photos = useCityPhotos(cityName);
  // Valid (non-null) photos only
  const validPhotos = photos.filter((p): p is string => !!p);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const markLoaded = (i: number) =>
    setLoadedSet((s) => { const n = new Set(s); n.add(i); return n; });
  const markError = (i: number) =>
    setErrorSet((s) => { const n = new Set(s); n.add(i); return n; });

  return (
    <div className={cn("relative w-full overflow-hidden rounded-t-2xl", height)}>
      {/* Always-visible gradient fallback */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", visual.gradient)} />

      {/* Photo carousel — renders once we have at least 1 valid URL */}
      {validPhotos.length > 0 && (
        <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
          <div className="flex h-full touch-pan-y select-none">
            {validPhotos.map((src, i) => (
              <div key={i} className="relative flex-none w-full h-full" style={{ minWidth: "100%" }}>
                {/* Pulse placeholder while this slide's photo loads */}
                {!loadedSet.has(i) && !errorSet.has(i) && (
                  <div className={cn("absolute inset-0 bg-gradient-to-br animate-pulse", visual.gradient)} />
                )}
                {!errorSet.has(i) && (
                  <img
                    src={src}
                    alt={`${cityName} photo ${i + 1}`}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-700",
                      loadedSet.has(i) ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => markLoaded(i)}
                    onError={() => markError(i)}
                    draggable={false}
                    crossOrigin="anonymous"
                  />
                )}
                {/* Dark vignette for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading shimmer while Wikipedia fetches */}
      {validPhotos.length === 0 && (
        <div className={cn("absolute inset-0 bg-gradient-to-br animate-pulse opacity-80", visual.gradient)} />
      )}

      {/* City text overlay — always on top */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pointer-events-none z-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl leading-none mb-1">{visual.flag}</p>
            <h3 className="text-[17px] font-heading font-extrabold text-white leading-tight drop-shadow">
              {cityName}
            </h3>
            <p className="text-[11px] text-white/70">{country} · {region}</p>
          </div>
          <span className="text-3xl leading-none pb-1 drop-shadow">{visual.emoji}</span>
        </div>
      </div>

      {/* Slide-indicator dots (top-right, only if >1 valid photo) */}
      {validPhotos.length > 1 && (
        <div className="absolute top-2.5 right-3 flex gap-1 pointer-events-none z-10">
          {validPhotos.map((_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-full transition-all duration-200",
                i === selectedIndex ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
