import { useState } from "react";
import { ChevronRight, Search, Shield, Utensils, MapPin, Map, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCities } from "@/hooks/use-cities";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCityVisual } from "@/data/cityVisuals";
import { CityImageCarousel } from "@/components/CityImageCarousel";

const QUICK_ACTIONS = [
  { label: "🏳️‍🌈 LGBTQ+ Safety",  path: "/explore/lgbtq" },
  { label: "Restaurants",         path: "/explore/restaurants",  icon: Utensils },
  { label: "Places",              path: "/explore/destinations", icon: MapPin },
  { label: "Safety Map",          path: "/explore/heatmap",      icon: Map },
  { label: "Stories",             path: "/explore/stories",      icon: BookOpen },
  { label: "👗 Dress Codes",      path: "/explore/dress-codes" },
  { label: "✨ AI Food Advisor",  path: "/explore/food-advisor" },
  { label: "⚠️ Allergy Card",    path: "/explore/allergy-card" },
  { label: "💰 Fair Prices",      path: "/explore/fair-prices" },
  { label: "📥 Offline Packs",   path: "/explore/offline" },
];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: cities, isLoading } = useCities();

  const filtered = (cities || []).filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-heading font-bold">Explore</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Women-friendly destinations worldwide</p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Quick action chips */}
      <div className="px-5 mb-4 flex gap-2 flex-wrap">
        {QUICK_ACTIONS.map((btn) => (
          <button
            key={btn.path}
            onClick={() => navigate(btn.path)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium hover:border-primary/30 transition-all"
          >
            {"icon" in btn && btn.icon && <btn.icon className="w-3 h-3" />}
            {btn.label}
          </button>
        ))}
      </div>

      {/* City cards */}
      <div className="px-5 pb-4 space-y-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))
          : filtered.map((city) => {
              const visual    = getCityVisual(city.name);
              const safetyNum = Number(city.safety_score);
              const safetyColor =
                safetyNum >= 8 ? "bg-sage-light text-sage" :
                safetyNum >= 6 ? "bg-amber-warm/20 text-amber-warm" :
                "bg-destructive/10 text-destructive";

              return (
                <div
                  key={city.id}
                  className="rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-warm transition-all overflow-hidden group"
                >
                  {/* Tappable image carousel — navigates on tap but swipe is for carousel */}
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/explore/city/${city.id}`)}
                  >
                    <CityImageCarousel
                      visual={visual}
                      cityName={city.name}
                      country={city.country}
                      region={city.region}
                      height="h-44"
                    />
                  </div>

                  {/* Info row — tappable separately */}
                  <button
                    className="w-full text-left"
                    onClick={() => navigate(`/explore/city/${city.id}`)}
                  >
                    <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 flex-wrap">
                      <Badge className={cn("text-[10px] px-2 py-0.5 border-0", safetyColor)}>
                        <Shield className="w-3 h-3 mr-1" />Safety: {city.safety_score}/10
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5">{city.language}</Badge>
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5">{city.currency}</Badge>
                      {city.avg_daily_budget_usd && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                          ~${city.avg_daily_budget_usd}/day
                        </Badge>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                    </div>

                    {city.description && (
                      <p className="px-4 pb-3 text-xs text-muted-foreground line-clamp-2">
                        {city.description}
                      </p>
                    )}
                  </button>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default ExplorePage;
