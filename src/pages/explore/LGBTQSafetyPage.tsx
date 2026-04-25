import { ArrowLeft, Shield, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLgbtqSafety } from "@/hooks/use-cities";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const LGBTQSafetyPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useLgbtqSafety();

  const getLevel = (score: number | null) => {
    if (!score) return "caution";
    if (score >= 8) return "safe";
    if (score >= 5) return "caution";
    return "dangerous";
  };

  const levelConfig = {
    safe: { bg: "bg-sage-light", text: "text-sage", label: "Safe", border: "border-sage/30" },
    caution: { bg: "bg-amber-warm/10", text: "text-amber-warm", label: "Caution", border: "border-amber-warm/30" },
    dangerous: { bg: "bg-destructive/10", text: "text-destructive", label: "Dangerous", border: "border-destructive/30" },
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/explore")} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-xl font-heading font-bold">🏳️‍🌈 LGBTQ+ Safety</h1>
          <p className="text-xs text-muted-foreground">Know before you go — 30 destinations</p>
        </div>
      </div>

      <div className="px-5 pb-4 space-y-3">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />) : (
          (data || []).map((item) => {
            const level = getLevel(item.overall_score);
            const config = levelConfig[level];
            const city = item.cities as any;
            return (
              <div key={item.id} className={cn("p-4 rounded-2xl border", config.bg, config.border)}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-heading font-bold">{city?.name}</h3>
                    <p className="text-xs text-muted-foreground">{city?.country}</p>
                  </div>
                  <Badge className={cn("text-[10px] border-0 px-2 py-0.5", config.bg, config.text)}>
                    {config.label} — {item.overall_score}/10
                  </Badge>
                </div>

                <div className="space-y-2 mt-3">
                  {item.legal_status && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Legal Status</p>
                      <p className="text-xs mt-0.5">{item.legal_status}</p>
                    </div>
                  )}
                  {item.social_acceptance && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Social Acceptance</p>
                      <p className="text-xs mt-0.5">{item.social_acceptance}</p>
                    </div>
                  )}
                  {item.safe_spaces && item.safe_spaces.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Safe Spaces</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.safe_spaces.map((space, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] px-2 py-0.5">
                            <MapPin className="w-2.5 h-2.5 mr-1" /> {space}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.warnings && item.warnings.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-destructive uppercase tracking-wider">⚠️ Warnings</p>
                      <ul className="mt-1 space-y-0.5">
                        {item.warnings.map((w, i) => (
                          <li key={i} className="text-xs flex items-start gap-1.5">
                            <span className="text-destructive">•</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LGBTQSafetyPage;
