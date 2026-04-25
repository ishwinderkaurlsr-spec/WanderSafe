import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { capsuleWardrobe } from "@/data/phase2Data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const CapsuleWardrobePage = () => {
  const navigate = useNavigate();
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null);
  const selectedOutfitData = capsuleWardrobe.outfits.find(o => o.name === selectedOutfit);
  const highlightedItems = selectedOutfitData?.items || [];

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Capsule Wardrobe</h1>
      </div>

      <div className="px-5 mb-4 p-4 rounded-2xl safe-gradient-light border border-primary/10 text-center">
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
        <h2 className="text-sm font-heading font-bold mb-1">{capsuleWardrobe.items.length} Items → {capsuleWardrobe.outfits.length} Outfits</h2>
        <p className="text-xs text-muted-foreground">Mix-and-match guide for your trip</p>
      </div>

      <div className="px-5 mb-4">
        <h3 className="text-sm font-heading font-semibold mb-2">Your Items</h3>
        <div className="grid grid-cols-2 gap-2">
          {capsuleWardrobe.items.map(item => (
            <div key={item.id} className={cn("p-3 rounded-xl border transition-all", highlightedItems.includes(item.id) ? "bg-coral-light/50 border-primary/30" : "bg-card border-border")}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.image}</span>
                <div>
                  <p className="text-xs font-medium">{item.name}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: item.versatility }).map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4">
        <h3 className="text-sm font-heading font-semibold mb-2">Outfit Combinations</h3>
        <div className="space-y-2">
          {capsuleWardrobe.outfits.map(outfit => (
            <button key={outfit.name} onClick={() => setSelectedOutfit(selectedOutfit === outfit.name ? null : outfit.name)} className={cn("w-full p-3 rounded-xl border transition-all text-left", selectedOutfit === outfit.name ? "bg-coral-light/50 border-primary/30" : "bg-card border-border")}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{outfit.name}</h4>
                <div className="flex -space-x-1">
                  {outfit.items.map(itemId => {
                    const item = capsuleWardrobe.items.find(i => i.id === itemId);
                    return <span key={itemId} className="text-sm">{item?.image}</span>;
                  })}
                </div>
              </div>
              {selectedOutfit === outfit.name && (
                <div className="mt-2 pt-2 border-t border-border">
                  {outfit.items.map(itemId => {
                    const item = capsuleWardrobe.items.find(i => i.id === itemId);
                    return <p key={itemId} className="text-xs text-muted-foreground">• {item?.name}</p>;
                  })}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CapsuleWardrobePage;
