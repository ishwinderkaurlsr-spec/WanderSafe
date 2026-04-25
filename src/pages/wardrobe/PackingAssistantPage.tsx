import { useState } from "react";
import { ArrowLeft, Check, Sparkles, ChevronDown, Luggage } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { packingLists } from "@/data/phase2Data";
import { cities } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const categories = { clothing: "👗", toiletries: "🧴", documents: "📄", safety: "🛡️", tech: "📱", health: "💊" };

const PackingAssistantPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("tokyo");
  const [checked, setChecked] = useState<string[]>([]);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const items = packingLists[selectedCity] || [];
  const city = cities.find(c => c.id === selectedCity);
  const grouped = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const toggleCheck = (id: string) => setChecked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const progress = items.length ? Math.round((checked.length / items.length) * 100) : 0;

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Packing Assistant</h1>
        <Badge className="text-[9px] bg-primary/10 text-primary border-0 ml-auto"><Sparkles className="w-3 h-3 mr-1" />AI</Badge>
      </div>

      <div className="px-5 mb-4">
        <button onClick={() => setShowCityPicker(!showCityPicker)} className="w-full p-3 rounded-xl bg-card border border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{city?.image}</span>
            <span className="text-sm font-medium">{city?.name}, {city?.country}</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showCityPicker && "rotate-180")} />
        </button>
        {showCityPicker && (
          <div className="mt-2 rounded-xl bg-card border border-border overflow-hidden">
            {cities.map(c => (
              <button key={c.id} onClick={() => { setSelectedCity(c.id); setShowCityPicker(false); setChecked([]); }} className={cn("w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-muted transition-colors", selectedCity === c.id && "bg-coral-light/50")}>
                <span>{c.image}</span> {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Packed: {checked.length}/{items.length}</span>
          <span className="text-xs font-medium text-primary">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full safe-gradient transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="px-5 pb-4 space-y-4">
        {Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat}>
            <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>{categories[cat as keyof typeof categories]}</span> {cat}
            </h3>
            <div className="space-y-1.5">
              {catItems.map(item => (
                <button key={item.id} onClick={() => toggleCheck(item.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left", checked.includes(item.id) ? "bg-sage-light/50 border-sage/20" : "bg-card border-border")}>
                  <div className={cn("w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all", checked.includes(item.id) ? "bg-sage border-sage" : "border-muted-foreground/30")}>
                    {checked.includes(item.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className={cn("text-sm", checked.includes(item.id) && "line-through text-muted-foreground")}>{item.name}</p>
                    {item.culturalNote && <p className="text-[10px] text-primary mt-0.5">💡 {item.culturalNote}</p>}
                  </div>
                  {item.essential && <Badge className="text-[9px] bg-destructive/10 text-destructive border-0">Essential</Badge>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingAssistantPage;
