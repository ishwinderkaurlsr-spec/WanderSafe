import { useState } from "react";
import { ArrowLeft, MapPin, Clock, Shield, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockRoutes = [
  { id: "1", mode: "🚆 Metro + 🚶 Walk", duration: "25 min", cost: "¥170", safety: 9, steps: ["Walk to Shibuya Station (3 min)", "Yamanote Line to Shinjuku (12 min, women-only car available)", "Walk to hotel (10 min, well-lit path)"], safetyStar: true },
  { id: "2", mode: "🚕 Taxi", duration: "15 min", cost: "¥1,800", safety: 9.5, steps: ["Pick up at hotel entrance", "Direct route via Meiji-dori", "Drop off at destination"], safetyStar: false },
  { id: "3", mode: "🚌 Bus + 🚶 Walk", duration: "35 min", cost: "¥210", safety: 7, steps: ["Walk to bus stop (5 min)", "Bus #86 to Shinjuku (20 min)", "Walk through side streets (10 min)"], safetyStar: false, warning: "Walk segment through quieter area" },
];

const JourneyPlannerPage = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("Shibuya Hotel");
  const [to, setTo] = useState("Shinjuku Golden Gai");
  const [showResults, setShowResults] = useState(true);
  const [safetyFirst, setSafetyFirst] = useState(true);

  const sorted = [...mockRoutes].sort((a, b) => safetyFirst ? b.safety - a.safety : parseInt(a.duration) - parseInt(b.duration));

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Journey Planner</h1>
        <Badge className="text-[9px] bg-primary/10 text-primary border-0 ml-auto"><Sparkles className="w-3 h-3 mr-1" />AI</Badge>
      </div>

      <div className="px-5 mb-4 space-y-2">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" />
          <Input value={from} onChange={e => setFrom(e.target.value)} className="pl-9 rounded-xl text-sm" placeholder="From..." />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
          <Input value={to} onChange={e => setTo(e.target.value)} className="pl-9 rounded-xl text-sm" placeholder="To..." />
        </div>
      </div>

      <div className="px-5 mb-4 flex gap-2">
        <button onClick={() => setSafetyFirst(true)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all", safetyFirst ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
          🛡️ Safety First
        </button>
        <button onClick={() => setSafetyFirst(false)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all", !safetyFirst ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
          ⚡ Fastest
        </button>
      </div>

      <div className="px-5 pb-4 space-y-3">
        {sorted.map((route, i) => (
          <div key={route.id} className={cn("p-4 rounded-2xl border", i === 0 ? "bg-coral-light/30 border-primary/30" : "bg-card border-border")}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-heading font-bold">{route.mode}</span>
                {i === 0 && <Badge className="text-[9px] bg-sage-light text-sage border-0">Recommended</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{route.duration}</span>
              <span>{route.cost}</span>
              <Badge className={cn("text-[10px] border-0", route.safety >= 8 ? "bg-sage-light text-sage" : "bg-amber-warm/20 text-amber-warm")}>
                <Shield className="w-3 h-3 mr-1" />{route.safety}/10
              </Badge>
            </div>
            <div className="space-y-1.5">
              {route.steps.map((step, si) => (
                <div key={si} className="flex items-start gap-2 text-xs">
                  <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{si + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            {"warning" in route && route.warning && (
              <p className="text-[10px] text-amber-500 mt-2">⚠️ {route.warning}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyPlannerPage;
