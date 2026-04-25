import { useState } from "react";
import { ArrowLeft, Heart, MessageSquare, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { travelStories } from "@/data/phase2Data";
import { cities } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const TravelStoriesPage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [liked, setLiked] = useState<string[]>([]);

  const filtered = selectedCity ? travelStories.filter(s => s.cityId === selectedCity) : travelStories;

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/explore")} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Travel Stories</h1>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        <button onClick={() => setSelectedCity(null)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", !selectedCity ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>All</button>
        {cities.map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", selectedCity === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {c.image} {c.name}
          </button>
        ))}
      </div>

      <div className="px-5 pb-4 space-y-4">
        {filtered.map(story => {
          const city = cities.find(c => c.id === story.cityId);
          const isLiked = liked.includes(story.id);
          return (
            <div key={story.id} className="p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{story.authorAvatar}</span>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold">{story.authorName}</h4>
                  <p className="text-[10px] text-muted-foreground">{city?.image} {city?.name} · {story.date}</p>
                </div>
              </div>
              <h3 className="text-sm font-heading font-bold mb-2">{story.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{story.excerpt}</p>

              <div className="p-2.5 rounded-lg bg-sage-light/50 mb-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <Shield className="w-3.5 h-3.5 text-sage" />
                  <span className="font-medium text-sage">Safety Tip:</span>
                  <span className="text-muted-foreground">{story.safetyTip}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {story.tags.map(tag => <Badge key={tag} variant="outline" className="text-[10px] px-2 py-0.5">{tag}</Badge>)}
                </div>
                <button onClick={() => setLiked(prev => isLiked ? prev.filter(id => id !== story.id) : [...prev, story.id])} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className={cn("w-4 h-4", isLiked ? "fill-primary text-primary" : "")} />
                  {isLiked ? story.likes + 1 : story.likes}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TravelStoriesPage;
