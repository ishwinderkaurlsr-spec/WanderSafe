import { useState } from "react";
import { ArrowLeft, Shield, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTransitRoutes, useCities } from "@/hooks/use-cities";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TransitNavigatorPage = () => {
  const navigate = useNavigate();
  const { data: cities } = useCities();
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const firstCityId = cities?.[0]?.id;
  const activeCityId = selectedCity || firstCityId;
  const { data: routes, isLoading } = useTransitRoutes(activeCityId);

  const typeIcons: Record<string, string> = { metro: "🚇", bus: "🚌", train: "🚆", tram: "🚊", ferry: "⛴️", taxi: "🚕", rideshare: "🚗", bike: "🚲" };

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Transit Guide</h1>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {(cities || []).map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", activeCityId === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="px-5 pb-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />) : (
          (routes || []).map(route => (
            <div key={route.id} className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{typeIcons[route.transport_type] || "🚏"}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-heading font-bold">{route.route_name}</h3>
                    {route.women_only && <Badge className="text-[9px] bg-primary/10 text-primary border-0">👩 Women-Only</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{route.transport_type}</p>
                </div>
                {route.safety_rating && (
                  <Badge className={cn("text-[10px] border-0", Number(route.safety_rating) >= 8 ? "bg-sage-light text-sage" : Number(route.safety_rating) >= 6 ? "bg-amber-warm/20 text-amber-warm" : "bg-destructive/10 text-destructive")}>
                    <Shield className="w-3 h-3 mr-1" />{route.safety_rating}/10
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                {route.operating_hours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{route.operating_hours}</span>}
                {route.fare_info && <span>{route.fare_info}</span>}
              </div>

              {route.description && <p className="text-xs text-muted-foreground mb-2">{route.description}</p>}

              {route.tips && route.tips.length > 0 && (
                <div className="space-y-1.5">
                  {route.tips.map(tip => (
                    <div key={tip} className="flex items-start gap-2 text-xs">
                      <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        {!isLoading && (!routes || routes.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Select a city to see transit options</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransitNavigatorPage;
