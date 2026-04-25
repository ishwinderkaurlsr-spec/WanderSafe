import { useState } from "react";
import { ArrowLeft, Shield, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { safetyHeatmap } from "@/data/phase2Data";
import { cities } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const levelColors = { safe: "bg-sage", moderate: "bg-amber-500", caution: "bg-orange-500", avoid: "bg-destructive" };
const levelBg = { safe: "bg-sage-light text-sage", moderate: "bg-amber-warm/20 text-amber-warm", caution: "bg-orange-100 text-orange-600", avoid: "bg-destructive/10 text-destructive" };

const SafetyHeatmapPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("tokyo");
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day");

  const zones = safetyHeatmap.filter(z => z.cityId === selectedCity);
  const sorted = [...zones].sort((a, b) => {
    const scoreA = timeOfDay === "day" ? a.dayScore : a.nightScore;
    const scoreB = timeOfDay === "day" ? b.dayScore : b.nightScore;
    return scoreB - scoreA;
  });

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/explore")} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Safety Map</h1>
      </div>

      {/* Map placeholder */}
      <div className="mx-5 h-40 rounded-2xl bg-sage-light border border-border flex items-center justify-center relative overflow-hidden mb-4">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--sage)) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="grid grid-cols-3 gap-2 z-10">
          {zones.slice(0, 6).map(zone => (
            <div key={zone.id} className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground", levelColors[zone.level])}>
              {timeOfDay === "day" ? zone.dayScore : zone.nightScore}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {cities.map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", selectedCity === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {c.image} {c.name}
          </button>
        ))}
      </div>

      <div className="px-5 mb-4 flex gap-2">
        <button onClick={() => setTimeOfDay("day")} className={cn("flex-1 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all", timeOfDay === "day" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
          <Sun className="w-4 h-4" /> Daytime
        </button>
        <button onClick={() => setTimeOfDay("night")} className={cn("flex-1 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all", timeOfDay === "night" ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
          <Moon className="w-4 h-4" /> Nighttime
        </button>
      </div>

      <div className="px-5 mb-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-sage" /><span className="text-[10px]">Safe</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-500" /><span className="text-[10px]">Moderate</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-orange-500" /><span className="text-[10px]">Caution</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-destructive" /><span className="text-[10px]">Avoid</span></div>
      </div>

      <div className="px-5 pb-4 space-y-2">
        {sorted.map(zone => {
          const score = timeOfDay === "day" ? zone.dayScore : zone.nightScore;
          return (
            <div key={zone.id} className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground", levelColors[zone.level])}>
                {score}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{zone.name}</h4>
                <p className="text-xs text-muted-foreground">{zone.notes}</p>
              </div>
              <Badge className={cn("text-[10px] border-0", levelBg[zone.level])}>{zone.level}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SafetyHeatmapPage;
