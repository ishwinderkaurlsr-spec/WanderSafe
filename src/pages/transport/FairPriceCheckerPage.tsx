import { useState } from "react";
import { ArrowLeft, Search, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fairPrices } from "@/data/phase2Data";
import { cities } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const FairPriceCheckerPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = fairPrices.filter(p => {
    const matchCity = !selectedCity || p.cityId === selectedCity;
    const matchSearch = p.item.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/explore")} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Fair Prices</h1>
      </div>

      <div className="px-5 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..." className="pl-9 rounded-xl text-sm" />
        </div>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        <button onClick={() => setSelectedCity(null)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", !selectedCity ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>All Cities</button>
        {cities.map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", selectedCity === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {c.image} {c.name}
          </button>
        ))}
      </div>

      <div className="px-5 pb-4 space-y-3">
        {filtered.map(price => {
          const city = cities.find(c => c.id === price.cityId);
          return (
            <div key={price.id} className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-heading font-bold">{price.item}</h3>
                  <p className="text-xs text-muted-foreground">{city?.image} {city?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 rounded-lg bg-sage-light/50">
                  <p className="text-[10px] text-sage font-semibold uppercase">Local Price</p>
                  <p className="text-sm font-bold text-sage">{price.localPrice}</p>
                </div>
                <div className="p-2 rounded-lg bg-destructive/5">
                  <p className="text-[10px] text-destructive font-semibold uppercase">Tourist Price</p>
                  <p className="text-sm font-bold text-destructive">{price.touristPrice}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{price.tip}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FairPriceCheckerPage;
