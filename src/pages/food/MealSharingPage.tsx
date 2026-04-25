import { useState } from "react";
import { ArrowLeft, MapPin, Clock, Users, Shield, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { travelerProfiles } from "@/data/phase2Data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mealRequests = [
  { id: "m1", profileId: "tp1", venue: "Ichiran Ramen, Shibuya", time: "7:00 PM Tonight", cuisine: "Japanese", spots: 2, city: "Tokyo" },
  { id: "m2", profileId: "tp3", venue: "Thip Samai Pad Thai", time: "6:30 PM Tomorrow", cuisine: "Thai Street Food", spots: 3, city: "Bangkok" },
  { id: "m3", profileId: "tp4", venue: "Contramar, Roma Norte", time: "1:00 PM Saturday", cuisine: "Mexican Seafood", spots: 2, city: "Mexico City" },
];

const MealSharingPage = () => {
  const navigate = useNavigate();
  const [joined, setJoined] = useState<string[]>([]);

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Meal Sharing</h1>
      </div>

      <div className="px-5 mb-4 p-4 rounded-2xl safe-gradient-light border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-heading font-bold">Dine Together</h2>
        </div>
        <p className="text-xs text-muted-foreground">Connect with verified solo women travelers nearby for shared meals at public venues. Mutual opt-in only.</p>
      </div>

      <div className="px-5 pb-4 space-y-3">
        {mealRequests.map(req => {
          const profile = travelerProfiles.find(p => p.id === req.profileId);
          if (!profile) return null;
          const isJoined = joined.includes(req.id);
          return (
            <div key={req.id} className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">{profile.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-heading font-bold">{profile.name}</h3>
                    {profile.verified && <Badge className="text-[9px] bg-sage-light text-sage border-0 px-1.5">✓ Verified</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{profile.nationality} · {profile.travelStyle}</p>
                </div>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs"><MapPin className="w-3.5 h-3.5 text-primary" />{req.venue}</div>
                <div className="flex items-center gap-2 text-xs"><Clock className="w-3.5 h-3.5 text-primary" />{req.time}</div>
                <div className="flex items-center gap-2 text-xs"><Users className="w-3.5 h-3.5 text-primary" />{req.spots} spots available</div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => setJoined(prev => isJoined ? prev.filter(id => id !== req.id) : [...prev, req.id])} className={cn("flex-1 rounded-xl text-xs", isJoined ? "bg-sage text-primary-foreground" : "safe-gradient text-primary-foreground")}>
                  {isJoined ? "✓ Joined" : "Join Dinner"}
                </Button>
                <Button size="sm" variant="outline" className="rounded-xl text-xs"><MessageSquare className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 pb-4">
        <Button className="w-full rounded-xl safe-gradient text-primary-foreground">
          <Users className="w-4 h-4 mr-2" /> Create Meal Request
        </Button>
      </div>
    </div>
  );
};

export default MealSharingPage;
