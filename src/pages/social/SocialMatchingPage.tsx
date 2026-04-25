import { useState } from "react";
import { ArrowLeft, Shield, MapPin, MessageSquare, Star, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { travelerProfiles } from "@/data/phase2Data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SocialMatchingPage = () => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState<string[]>([]);

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Travelers Nearby</h1>
      </div>
      <div className="px-5 mb-4 p-4 rounded-2xl safe-gradient-light border border-primary/10">
        <h2 className="text-sm font-heading font-bold mb-1">👋 Who's Here Now?</h2>
        <p className="text-xs text-muted-foreground">Connect with verified women travelers in your city</p>
      </div>
      <div className="px-5 pb-4 space-y-3">
        {travelerProfiles.map(p => (
          <div key={p.id} className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">{p.avatar}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-heading font-bold">{p.name}</h3>
                  {p.verified && <BadgeCheck className="w-4 h-4 text-sage" />}
                </div>
                <p className="text-xs text-muted-foreground">{p.nationality} · {p.age} · {p.travelStyle}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{p.currentCity} · ⭐ {p.rating} · {p.tripsCompleted} trips</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{p.bio}</p>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {p.interests.map(i => <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-coral-light text-primary">{i}</span>)}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setConnected(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])} className={cn("flex-1 rounded-xl text-xs", connected.includes(p.id) ? "bg-sage text-primary-foreground" : "safe-gradient text-primary-foreground")}>
                {connected.includes(p.id) ? "✓ Connected" : "Connect"}
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl text-xs"><MessageSquare className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMatchingPage;
