import { useState } from "react";
import { ArrowLeft, Star, Shield, Heart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRestaurants, useCities } from "@/hooks/use-cities";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const filters = ["All", "Vegetarian", "Vegan", "Gluten-Free", "Seafood"];

const RestaurantFinderPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCity, setSelectedCity] = useState<string | undefined>();
  const [favorites, setFavorites] = useState<string[]>([]);
  const { data: cities } = useCities();
  const { data: restaurants, isLoading } = useRestaurants(selectedCity);

  const toggleFav = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const filtered = (restaurants || []).filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine_type.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "All") return matchesSearch;
    return matchesSearch && r.dietary_options?.some(d => d.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/explore")} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Restaurant Finder</h1>
      </div>

      {/* City filter */}
      <div className="px-5 mb-3 flex gap-2 overflow-x-auto hide-scrollbar">
        <button onClick={() => setSelectedCity(undefined)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", !selectedCity ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>All Cities</button>
        {(cities || []).map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", selectedCity === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="px-5 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search restaurants..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 rounded-xl text-sm" />
        </div>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all", activeFilter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {f}
          </button>
        ))}
      </div>

      <div className="px-5 pb-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />) : (
          filtered.map(r => (
            <div key={r.id} className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-heading font-bold">{r.name}</h3>
                  <p className="text-xs text-muted-foreground">{r.cuisine_type} · {r.price_range} · {(r as any).cities?.name}</p>
                </div>
                <button onClick={() => toggleFav(r.id)}>
                  <Heart className={cn("w-5 h-5", favorites.includes(r.id) ? "fill-primary text-primary" : "text-muted-foreground")} />
                </button>
              </div>

              <div className="flex gap-2 flex-wrap mb-2">
                {r.rating && <Badge variant="outline" className="text-[10px] gap-1"><Star className="w-3 h-3 text-amber-500" />{r.rating}/5</Badge>}
                {r.women_safety_score && <Badge variant="outline" className="text-[10px] gap-1"><Shield className="w-3 h-3 text-sage" />Safety: {r.women_safety_score}/10</Badge>}
              </div>

              {r.dietary_options && r.dietary_options.length > 0 && (
                <div className="flex gap-1 mb-2 flex-wrap">
                  {r.dietary_options.map(d => <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-sage-light text-sage">{d}</span>)}
                </div>
              )}

              {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
              {r.highlight && <p className="text-[10px] text-primary mt-1 font-medium">✨ {r.highlight}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RestaurantFinderPage;
