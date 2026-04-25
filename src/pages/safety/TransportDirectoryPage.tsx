import { useState, useCallback } from "react";
import { ArrowLeft, Search, Star, Shield, Phone, Car, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { cities } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const TransportDirectoryPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [search, setSearch] = useState("");
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  const handleCall = useCallback((id: string, phone: string) => {
    setActiveCallId(id);
    window.location.href = `tel:${phone}`;
    // Reset the active state after a short visual delay
    setTimeout(() => setActiveCallId(null), 1500);
  }, []);

  const filtered = selectedCity.transportOptions.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const typeIcon = (type: string) => {
    switch (type) {
      case "women-only": return <Users className="w-4 h-4" />;
      case "rideshare": return <Car className="w-4 h-4" />;
      case "taxi": return <Car className="w-4 h-4" />;
      default: return <Car className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/safety")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-heading font-bold">Safe Transport</h1>
      </div>

      {/* City selector */}
      <div className="px-5 mb-3 flex gap-2 overflow-x-auto hide-scrollbar">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
              selectedCity.id === city.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {city.emoji} {city.name}
          </button>
        ))}
      </div>

      <div className="px-5 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transport..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="px-5 pb-4 space-y-3">
        {filtered.map((t) => (
          <div key={t.id} className={cn(
            "p-4 rounded-2xl border bg-card",
            t.womenOnly ? "border-primary/30 bg-coral-light/30" : "border-border"
          )}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", t.womenOnly ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                  {typeIcon(t.type)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {t.womenOnly && <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-1.5 py-0">Women Only</Badge>}
                    {t.verified && <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-sage text-sage">✓ Verified</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-warm fill-amber-warm" />
                <span className="text-xs font-medium">{t.rating}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{t.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{t.priceRange}</span>
              {t.phone && (
                <button
                  onClick={() => handleCall(t.id, t.phone!)}
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium transition-colors px-2 py-1 rounded-lg",
                    activeCallId === t.id
                      ? "bg-primary text-primary-foreground"
                      : "text-primary hover:bg-primary/10"
                  )}
                >
                  <Phone className="w-3 h-3" /> Call
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportDirectoryPage;
