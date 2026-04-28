import { Languages, MessageSquare, Camera, Volume2, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TranslatePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: MessageSquare, title: "Conversation Translator", desc: "Real-time two-way voice translation with 60+ languages", path: "/translate/conversation", badge: "AI-Powered" },
    { icon: Camera, title: "Camera Translator", desc: "Point at signs, menus, and documents for instant translation", path: "/translate/camera", badge: "AR Mode" },
    { icon: Volume2, title: "Emergency Phrases", desc: "Life-saving phrases with audio playback in 40+ languages", path: "/translate/phrases", badge: "Offline" },
    { icon: BookOpen, title: "My Custom Phrases", desc: "Build your own phrasebook for your trip", path: "/translate/my-phrases", badge: "New" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-heading font-bold">Translate</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Break language barriers instantly</p>
      </div>
      <div className="px-5 mb-6">
        <div className="p-6 rounded-2xl safe-gradient-light border border-primary/10 text-center">
          <Languages className="w-12 h-12 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-heading font-bold mb-1">60+ Languages</h2>
          <p className="text-xs text-muted-foreground">Voice, camera, and text translation with women's safety context modes</p>
        </div>
      </div>
      <div className="px-5 pb-4 space-y-3">
        {features.map((feature) => (
          <button key={feature.title} onClick={() => navigate(feature.path)} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group text-left">
            <div className="w-12 h-12 rounded-2xl bg-coral-light flex items-center justify-center flex-shrink-0">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3 className="text-sm font-heading font-bold">{feature.title}</h3>
                <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap leading-none">{feature.badge}</span>
              </div>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TranslatePage;
