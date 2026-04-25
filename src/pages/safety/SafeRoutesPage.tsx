import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { safetyHeatmap, SafetyHeatmapZone } from "@/data/phase2Data";
import { cities } from "@/data/mockData";

// Determine whether a given hour is nighttime (21-23 or 0-5)
const isNightHour = (hour: number) => hour >= 21 || hour <= 5;

const timeLabel = (hour: number) => {
  if (hour < 6) return "Night";
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  if (hour < 21) return "Evening";
  return "Night";
};

const timeEmoji = (hour: number) => {
  if (hour < 6) return "🌙";
  if (hour < 12) return "☀️";
  if (hour < 18) return "🌤️";
  if (hour < 21) return "🌆";
  return "🌙";
};

// Map a zone's safety level (or its night-adjusted level) to display properties
const levelConfig: Record<string, { color: string; bg: string; border: string; bubble: string; label: string }> = {
  safe: {
    color: "text-sage",
    bg: "bg-sage-light",
    border: "border-sage/30",
    bubble: "bg-sage/20 border-sage/30",
    label: "Safe",
  },
  moderate: {
    color: "text-amber-warm",
    bg: "bg-amber-warm/10",
    border: "border-amber-warm/30",
    bubble: "bg-amber-warm/20 border-amber-warm/30",
    label: "Moderate",
  },
  caution: {
    color: "text-amber-warm",
    bg: "bg-amber-warm/10",
    border: "border-amber-warm/30",
    bubble: "bg-amber-warm/20 border-amber-warm/30",
    label: "Caution",
  },
  avoid: {
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    bubble: "bg-destructive/20 border-destructive/30",
    label: "Avoid",
  },
};

// At nighttime hours, downgrade a zone's level one step
const effectiveLevel = (zone: SafetyHeatmapZone, night: boolean): SafetyHeatmapZone["level"] => {
  if (!night) return zone.level;
  const downgrade: Record<SafetyHeatmapZone["level"], SafetyHeatmapZone["level"]> = {
    safe: "moderate",
    moderate: "caution",
    caution: "avoid",
    avoid: "avoid",
  };
  return downgrade[zone.level];
};

interface GPSCoords {
  lat: number;
  lng: number;
}

const SafeRoutesPage = () => {
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState([14]);
  const [selectedCityId, setSelectedCityId] = useState("tokyo");
  const [gpsCoords, setGpsCoords] = useState<GPSCoords | null>(null);
  const [gpsLabel, setGpsLabel] = useState("Locating...");

  // Capture real GPS on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsLabel("GPS unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: GPSCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setGpsCoords(coords);
        const latDir = coords.lat >= 0 ? "N" : "S";
        const lngDir = coords.lng >= 0 ? "E" : "W";
        setGpsLabel(
          `${Math.abs(coords.lat).toFixed(3)}°${latDir}, ${Math.abs(coords.lng).toFixed(3)}°${lngDir}`
        );
      },
      () => {
        setGpsLabel("GPS unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const hour = timeOfDay[0];
  const night = isNightHour(hour);

  // Zones for selected city, with time-adjusted effective level
  const cityZones = safetyHeatmap
    .filter((z) => z.cityId === selectedCityId)
    .map((z) => ({ ...z, effectiveLevel: effectiveLevel(z, night) }));

  // Count by effective level for the summary row
  const countByLevel = (level: string) =>
    cityZones.filter((z) => z.effectiveLevel === level).length;

  // Build summary rows (only for levels that exist in this city's data)
  const allLevels: SafetyHeatmapZone["level"][] = ["safe", "moderate", "caution", "avoid"];
  const summaryRows = allLevels
    .map((lvl) => ({ level: lvl, count: countByLevel(lvl) }))
    .filter((row) => row.count > 0);

  // Map bubbles: we position up to 5 bubbles pseudo-randomly in the map area
  // using deterministic offsets derived from zone index so they don't jump on re-render
  const mapBubbles = cityZones.slice(0, 5).map((zone, i) => {
    const positions = [
      { top: "15%", left: "12%" },
      { top: "20%", right: "14%" },
      { top: "55%", left: "35%" },
      { top: "65%", right: "15%" },
      { top: "40%", left: "60%" },
    ];
    const pos = positions[i % positions.length];
    const cfg = levelConfig[zone.effectiveLevel] ?? levelConfig.safe;
    return { ...zone, pos, cfg };
  });

  const selectedCity = cities.find((c) => c.id === selectedCityId);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/safety")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-heading font-bold">Safe Routes</h1>
      </div>

      {/* City selector */}
      <div className="px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCityId(city.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0",
                selectedCityId === city.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40"
              )}
            >
              <span>{city.emoji}</span>
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* GPS badge */}
      <div className="px-5 mb-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground w-fit">
          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          {gpsLabel}
        </div>
      </div>

      {/* Stylized map */}
      <div className="mx-5 h-56 rounded-2xl bg-sage-light border border-border relative overflow-hidden">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--sage)) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        {/* Dynamic zone bubbles from real data */}
        {mapBubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={cn(
              "absolute w-14 h-14 rounded-full border flex items-center justify-center",
              bubble.cfg.bubble
            )}
            style={bubble.pos as React.CSSProperties}
            title={bubble.name}
          >
            <span className="text-[9px] font-semibold text-center leading-tight px-1 text-foreground/70 truncate max-w-[48px]">
              {bubble.name.split(" ")[0]}
            </span>
          </div>
        ))}

        {/* User location pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-warm">
            <Navigation className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>

        {/* City label */}
        {selectedCity && (
          <div className="absolute bottom-2 left-3 px-2 py-0.5 rounded-full bg-background/80 text-[10px] font-semibold text-foreground border border-border">
            {selectedCity.emoji} {selectedCity.name}
          </div>
        )}

        {/* Night indicator */}
        {night && (
          <div className="absolute top-2 right-3 px-2 py-0.5 rounded-full bg-background/80 text-[10px] font-medium text-amber-warm border border-amber-warm/30">
            Night mode
          </div>
        )}
      </div>

      {/* Time of Day slider */}
      <div className="mx-5 mt-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-heading font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Time of Day
          </h3>
          <span className="text-xs font-medium text-muted-foreground">
            {hour}:00 — {timeLabel(hour)} {timeEmoji(hour)}
          </span>
        </div>
        <Slider value={timeOfDay} onValueChange={setTimeOfDay} min={0} max={23} step={1} />
        <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
        {night && (
          <p className="mt-2 text-[11px] text-amber-warm">
            Nighttime: more areas may require extra caution.
          </p>
        )}
      </div>

      {/* Zone legend — driven by real data */}
      <div className="mx-5 mt-3 pb-4">
        <h3 className="text-sm font-heading font-semibold mb-1">
          Zone Safety — {selectedCity?.name}
        </h3>
        <p className="text-[11px] text-muted-foreground mb-3">
          Showing {cityZones.length} zone{cityZones.length !== 1 ? "s" : ""} · Safety adjusted for {timeLabel(hour).toLowerCase()} hours
        </p>

        {/* Summary counts */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {summaryRows.map((row) => {
            const cfg = levelConfig[row.level];
            return (
              <div
                key={row.level}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border",
                  cfg.bg,
                  cfg.border,
                  cfg.color
                )}
              >
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: "currentColor" }} />
                {cfg.label}: {row.count}
              </div>
            );
          })}
        </div>

        {/* Per-zone cards */}
        <div className="space-y-2">
          {cityZones.map((zone) => {
            const cfg = levelConfig[zone.effectiveLevel] ?? levelConfig.safe;
            const score = night ? zone.nightScore : zone.dayScore;
            return (
              <div
                key={zone.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border",
                  cfg.bg,
                  cfg.border
                )}
              >
                <div className={cn("w-3 h-3 rounded-full mt-1 flex-shrink-0", "bg-current", cfg.color)} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", cfg.color)}>{zone.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{zone.notes}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={cn("text-xs font-semibold", cfg.color)}>{cfg.label}</span>
                  <p className="text-[10px] text-muted-foreground">{score}/10</p>
                </div>
              </div>
            );
          })}
          {cityZones.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No zone data available for this city.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafeRoutesPage;
