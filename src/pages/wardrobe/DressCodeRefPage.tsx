import { useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDressCodes, useCities } from "@/hooks/use-cities";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const modestyIcons: Record<string, string> = { relaxed: "😎", moderate: "👔", conservative: "🧕", strict: "🕌" };

const DressCodeRefPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const { data: cities } = useCities();
  const { data: dressCodes, isLoading } = useDressCodes(selectedCity);

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Dress Codes</h1>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        <button onClick={() => setSelectedCity(undefined)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", !selectedCity ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>All Cities</button>
        {(cities || []).map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", selectedCity === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="px-5 pb-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />) : (
          (dressCodes || []).map(ref => (
            <div key={ref.id} className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{modestyIcons[ref.modesty_level || "relaxed"] || "👗"}</span>
                <div>
                  <h3 className="text-sm font-heading font-bold">{ref.location_type}</h3>
                  <p className="text-xs text-muted-foreground">{(ref as any).cities?.name} · {ref.modesty_level}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{ref.recommended_attire}</p>
              {ref.cultural_notes && <p className="text-[10px] text-primary font-medium">💡 {ref.cultural_notes}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DressCodeRefPage;
