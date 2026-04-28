import { ArrowLeft, Shield, AlertTriangle, Phone } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCity, useCitySafety } from "@/hooks/use-cities";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CityImageCarousel } from "@/components/CityImageCarousel";
import { getCityVisual } from "@/data/cityVisuals";

const CityBriefingPage = () => {
  const navigate = useNavigate();
  const { cityId } = useParams();
  const { data: city, isLoading } = useCity(cityId);
  const { data: safety } = useCitySafety(cityId);
  const [openSection, setOpenSection] = useState<string | null>("tips");

  if (isLoading || !city) {
    return (
      <div className="px-5 pt-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    );
  }

  const safetyScore = Number(city.safety_score);
  const visual = getCityVisual(city.name);

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero image carousel */}
      <div className="relative">
        <CityImageCarousel
          visual={visual}
          cityName={city.name}
          country={city.country}
          region={city.region}
          height="h-52"
        />
        <button
          onClick={() => navigate("/explore")}
          className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Title below carousel */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-xl font-heading font-bold">{city.name}</h1>
        <p className="text-xs text-muted-foreground">{city.country} — Cultural & Safety Guide</p>
      </div>

      {/* Description */}
      {city.description && (
        <p className="px-5 text-sm text-muted-foreground mb-4 leading-relaxed">{city.description}</p>
      )}

      {/* Safety score */}
      <div className="mx-5 p-4 rounded-2xl safe-gradient-light border border-border mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Overall Safety Score</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-heading font-extrabold text-foreground">{city.safety_score}</span>
              <span className="text-sm text-muted-foreground">/10</span>
            </div>
          </div>
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold",
            safetyScore >= 8 ? "bg-sage text-primary-foreground" :
            safetyScore >= 6 ? "bg-amber-warm text-primary-foreground" :
            "bg-destructive text-primary-foreground"
          )}>
            {safetyScore >= 8 ? "Very Safe" : safetyScore >= 6 ? "Moderate" : "Use Caution"}
          </div>
        </div>
      </div>

      {/* Emergency numbers */}
      <div className="mx-5 p-4 rounded-2xl bg-card border border-border mb-4">
        <h3 className="text-sm font-heading font-semibold mb-2">🆘 Emergency Numbers</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Police", number: city.emergency_police },
            { label: "Ambulance", number: city.emergency_ambulance },
            { label: "Fire", number: city.emergency_fire },
          ].map((e) => (
            <a
              key={e.label}
              href={e.number ? `tel:${e.number}` : undefined}
              className="text-center p-2 rounded-xl bg-muted active:bg-primary/10 transition-colors"
            >
              <p className="text-[10px] text-muted-foreground">{e.label}</p>
              <p className="text-sm font-bold text-primary flex items-center justify-center gap-1">
                {e.number && <Phone className="w-3 h-3" />}{e.number || "N/A"}
              </p>
            </a>
          ))}
        </div>
        {city.emergency_women_helpline && (
          <a href={`tel:${city.emergency_women_helpline}`} className="mt-2 p-2 rounded-xl bg-coral-light/50 flex items-center justify-between active:bg-primary/10 transition-colors">
            <div>
              <p className="text-[10px] text-muted-foreground">Women's Helpline</p>
              <p className="text-sm font-bold text-primary">{city.emergency_women_helpline}</p>
            </div>
            <Phone className="w-4 h-4 text-primary" />
          </a>
        )}
      </div>

      {/* Cultural tips */}
      {city.cultural_tips && city.cultural_tips.length > 0 && (
        <div className="mx-5 p-4 rounded-2xl bg-coral-light/50 border border-primary/20 mb-4">
          <h3 className="text-sm font-heading font-semibold mb-2 text-primary">💡 Cultural Tips</h3>
          <ul className="space-y-1.5">
            {city.cultural_tips.map((tip, i) => (
              <li key={i} className="text-xs text-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Do's */}
      {city.dos && city.dos.length > 0 && (
        <div className="mx-5 p-4 rounded-2xl bg-sage-light/50 border border-sage/20 mb-4">
          <h3 className="text-sm font-heading font-semibold mb-2 text-sage">✅ Do's</h3>
          <ul className="space-y-1.5">
            {city.dos.map((item, i) => (
              <li key={i} className="text-xs text-foreground flex items-start gap-2">
                <span className="text-sage mt-0.5">✓</span>{item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Don'ts */}
      {city.donts && city.donts.length > 0 && (
        <div className="mx-5 p-4 rounded-2xl bg-destructive/5 border border-destructive/20 mb-4">
          <h3 className="text-sm font-heading font-semibold mb-2 text-destructive flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Don'ts
          </h3>
          <ul className="space-y-1.5">
            {city.donts.map((item, i) => (
              <li key={i} className="text-xs text-foreground flex items-start gap-2">
                <span className="text-destructive mt-0.5">✕</span>{item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safety details */}
      {safety && (
        <div className="mx-5 pb-4 space-y-2">
          <h3 className="text-sm font-heading font-semibold">Detailed Safety Scores</h3>
          {[
            { label: "Solo Travel", score: safety.solo_travel_score },
            { label: "Night Safety", score: safety.night_safety_score },
            { label: "Transport", score: safety.transport_safety_score },
            { label: "Scam Risk", score: safety.scam_risk_score },
            { label: "Street Harassment", score: safety.street_harassment_score },
          ].map((item) => item.score && (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <span className="text-xs font-medium w-32">{item.label}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full", Number(item.score) >= 7 ? "bg-sage" : Number(item.score) >= 5 ? "bg-amber-warm" : "bg-destructive")}
                  style={{ width: `${Number(item.score) * 10}%` }}
                />
              </div>
              <span className="text-xs font-bold w-8 text-right">{item.score}/10</span>
            </div>
          ))}

          {safety.safe_areas && safety.safe_areas.length > 0 && (
            <div className="p-3 rounded-xl bg-sage-light/50 border border-sage/20">
              <p className="text-[10px] font-semibold text-sage uppercase mb-1">Safe Areas</p>
              <p className="text-xs">{safety.safe_areas.join(" · ")}</p>
            </div>
          )}

          {safety.danger_zones && safety.danger_zones.length > 0 && (
            <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20">
              <p className="text-[10px] font-semibold text-destructive uppercase mb-1">Areas to Avoid</p>
              <p className="text-xs">{safety.danger_zones.join(" · ")}</p>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="mx-5 p-4 rounded-2xl bg-card border border-border mb-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div><span className="text-muted-foreground">Language:</span> <span className="font-medium">{city.language}</span></div>
          <div><span className="text-muted-foreground">Currency:</span> <span className="font-medium">{city.currency}</span></div>
          <div><span className="text-muted-foreground">Timezone:</span> <span className="font-medium">{city.timezone}</span></div>
          <div><span className="text-muted-foreground">Budget/day:</span> <span className="font-medium">${city.avg_daily_budget_usd}</span></div>
          {city.best_time_to_visit && (
            <div className="col-span-2"><span className="text-muted-foreground">Best time:</span> <span className="font-medium">{city.best_time_to_visit}</span></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityBriefingPage;
