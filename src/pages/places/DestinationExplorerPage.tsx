import { useState } from "react";
import { ArrowLeft, Shield, MapPin, Clock, Camera, AlertTriangle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { destinations } from "@/data/phase2Data";
import { cities } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DestinationExplorerPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDest, setSelectedDest] = useState<string | null>(null);

  const filtered = selectedCity ? destinations.filter(d => d.cityId === selectedCity) : destinations;

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/explore")} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Explore Places</h1>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        <button onClick={() => setSelectedCity(null)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", !selectedCity ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>All</button>
        {cities.map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", selectedCity === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {c.image} {c.name}
          </button>
        ))}
      </div>

      <div className="px-5 pb-4 space-y-3">
        {filtered.map(dest => {
          const city = cities.find(c => c.id === dest.cityId);
          const expanded = selectedDest === dest.id;
          return (
            <button key={dest.id} onClick={() => setSelectedDest(expanded ? null : dest.id)} className="w-full p-4 rounded-2xl bg-card border border-border text-left transition-all hover:border-primary/30">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{dest.image}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-heading font-bold">{dest.name}</h3>
                  <p className="text-xs text-muted-foreground">{city?.image} {city?.name} · {dest.type}</p>
                </div>
                <Badge className={cn("text-[10px] border-0", dest.safetyScore >= 8 ? "bg-sage-light text-sage" : "bg-amber-warm/20 text-amber-warm")}>
                  <Shield className="w-3 h-3 mr-1" />{dest.safetyScore}/10
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{dest.bestTime}</span>
                <span>👗 {dest.dressCode}</span>
              </div>

              {expanded && (
                <div className="mt-3 pt-3 border-t border-border space-y-2">
                  {dest.commonScams.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-destructive uppercase mb-1">⚠️ Common Scams</p>
                      {dest.commonScams.map(scam => (
                        <div key={scam} className="flex items-start gap-1.5 mb-1 text-xs">
                          <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{scam}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs">
                    <span>{dest.nearbyRestroom ? "🚻 Restroom nearby" : "❌ No restroom nearby"}</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DestinationExplorerPage;
