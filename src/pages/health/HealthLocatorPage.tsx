import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  User,
  Pill,
  Phone,
  Globe,
  Shield,
  Search,
  Sparkles,
  Send,
  Bot,
  Loader2,
  X,
  Navigation,
  Building2,
  Cross,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHealthResources, useCities } from "@/hooks/use-cities";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/ai-stream";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type FilterTab = "all" | "clinic" | "pharmacy" | "hospital" | "female_doctor";
type AiMessage = { role: "user" | "assistant"; content: string };

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "clinic", label: "Clinic" },
  { key: "pharmacy", label: "Pharmacy" },
  { key: "hospital", label: "Hospital" },
  { key: "female_doctor", label: "Female Doctor" },
];

const resourceIconConfig: Record<
  string,
  { icon: React.ElementType; bg: string; text: string }
> = {
  clinic: { icon: Cross, bg: "bg-blue-50", text: "text-blue-600" },
  pharmacy: { icon: Pill, bg: "bg-green-50", text: "text-green-600" },
  hospital: { icon: Building2, bg: "bg-red-50", text: "text-red-600" },
  default: { icon: MapPin, bg: "bg-coral-light", text: "text-primary" },
};

function getIconConfig(type: string) {
  return resourceIconConfig[type.toLowerCase()] ?? resourceIconConfig.default;
}

const HealthLocatorPage = () => {
  const navigate = useNavigate();
  const { data: cities } = useCities();
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>();
  const activeCityId = selectedCityId || cities?.[0]?.id;
  const { data: resources, isLoading } = useHealthResources(activeCityId);

  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // AI sheet state
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<AiMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! Ask me to help find health resources — female gynecologists, pharmacies, or clinics in any city worldwide.",
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const aiBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiOpen) {
      aiBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiMessages, aiOpen]);

  const handleAsk = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || aiLoading) return;

    const userMsg: AiMessage = { role: "user", content: trimmed };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setAiMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...aiMessages, userMsg],
        feature: "health-locator",
        onDelta: upsertAssistant,
        onDone: () => setAiLoading(false),
        onError: (err) => {
          toast.error(err);
          setAiLoading(false);
        },
      });
    } catch {
      toast.error("Failed to get a response. Please try again.");
      setAiLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        toast.success("Location detected! Showing nearby resources.");
      },
      () => {
        toast.error("Could not access your location. Please allow location permission.");
      },
    );
  };

  // Filter resources
  const filteredResources = (resources || []).filter(r => {
    const nameMatch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.address ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    if (!nameMatch) return false;
    if (activeFilter === "all") return true;
    if (activeFilter === "female_doctor") return r.has_female_doctors;
    return r.type?.toLowerCase() === activeFilter;
  });

  return (
    <div className="flex flex-col min-h-full pb-24 relative">
      {/* Header */}
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate("/health")}
          className="p-1.5 rounded-xl hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-heading font-bold">Health Resources</h1>
          <p className="text-xs text-muted-foreground">Find clinics, pharmacies &amp; female doctors</p>
        </div>
        <button
          onClick={handleUseLocation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-light border border-sage/30 text-xs font-medium text-sage hover:bg-sage/10 transition-all"
        >
          <Navigation className="w-3 h-3" />
          Near Me
        </button>
      </div>

      {/* City Pills */}
      <div className="px-5 mb-3 flex gap-2 overflow-x-auto hide-scrollbar">
        {(cities || []).map(city => (
          <button
            key={city.id}
            onClick={() => setSelectedCityId(city.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
              activeCityId === city.id
                ? "bg-primary text-primary-foreground border-primary shadow-warm"
                : "bg-card border-border text-muted-foreground hover:border-primary/30",
            )}
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="px-5 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search clinics, pharmacies…"
            className="pl-9 rounded-xl text-sm bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
              activeFilter === tab.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-muted-foreground hover:border-primary/30",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="px-5 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
        ) : filteredResources.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-primary/30 bg-coral-light/20 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-coral-light flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-sm font-heading font-bold mb-1">No resources found</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              We don't have listings for this area yet. Use AI to find health resources near you.
            </p>
            <button
              onClick={() => {
                setAiOpen(true);
                const cityName = cities?.find(c => c.id === activeCityId)?.name ?? "this city";
                setAiInput(`Find female doctors and pharmacies in ${cityName}`);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl safe-gradient text-white text-xs font-semibold shadow-warm-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI to find health resources
            </button>
          </div>
        ) : (
          filteredResources.map(resource => {
            const { icon: ResourceIcon, bg, text } = getIconConfig(resource.type ?? "");
            return (
              <div
                key={resource.id}
                className="p-4 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-warm transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
                    <ResourceIcon className={cn("w-5 h-5", text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-heading font-bold leading-snug">{resource.name}</h3>
                    {resource.address && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-start gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        {resource.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 capitalize border-border">
                    {resource.type?.replace("_", " ") ?? "Resource"}
                  </Badge>
                  {resource.operating_hours && (
                    <Badge className="text-[10px] px-2 py-0.5 border-0 bg-muted text-muted-foreground">
                      {resource.operating_hours}
                    </Badge>
                  )}
                  {resource.has_female_doctors && (
                    <Badge className="text-[10px] px-2 py-0.5 border-0 bg-coral-light text-primary">
                      <User className="w-2.5 h-2.5 mr-0.5" /> Female Doctor
                    </Badge>
                  )}
                  {resource.english_speaking && (
                    <Badge className="text-[10px] px-2 py-0.5 border-0 bg-sage-light text-sage">
                      <Globe className="w-2.5 h-2.5 mr-0.5" /> English
                    </Badge>
                  )}
                  {resource.has_reproductive_services && (
                    <Badge className="text-[10px] px-2 py-0.5 border-0 bg-sage-light text-sage">
                      <Pill className="w-2.5 h-2.5 mr-0.5" /> Reproductive
                    </Badge>
                  )}
                  {resource.accepts_travel_insurance && (
                    <Badge className="text-[10px] px-2 py-0.5 border-0 bg-muted text-muted-foreground">
                      <Shield className="w-2.5 h-2.5 mr-0.5" /> Insurance
                    </Badge>
                  )}
                </div>

                {resource.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{resource.description}</p>
                )}

                {resource.phone && (
                  <a
                    href={`tel:${resource.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    {resource.phone}
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Ask AI Button */}
      <button
        onClick={() => setAiOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl safe-gradient text-white text-sm font-semibold shadow-warm-lg hover:opacity-90 transition-all active:scale-95"
      >
        <Sparkles className="w-4 h-4" />
        Ask AI
      </button>

      {/* AI Bottom Sheet */}
      {aiOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setAiOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-card border-t border-border overflow-hidden flex flex-col max-h-[70vh] shadow-warm-lg">
            {/* Sheet Header */}
            <div className="safe-gradient px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-heading font-bold text-white">AI Health Locator</h2>
                  <p className="text-[10px] text-white/75">Find health resources worldwide</p>
                </div>
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {aiMessages.map((msg, i) => (
                <div key={i} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[82%] rounded-2xl px-3 py-2 text-xs",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted border border-border rounded-bl-sm prose prose-xs prose-p:my-0.5 prose-ul:my-0.5 prose-li:my-0",
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}

              {aiLoading && aiMessages[aiMessages.length - 1]?.role === "user" && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                  </div>
                  <div className="px-3 py-2 rounded-2xl bg-muted border border-border rounded-bl-sm">
                    <span className="text-xs text-muted-foreground">Searching…</span>
                  </div>
                </div>
              )}
              <div ref={aiBottomRef} />
            </div>

            {/* Quick suggestions */}
            {aiMessages.length <= 1 && (
              <div className="px-5 pb-2 pt-1 border-t border-border flex-shrink-0">
                <div className="flex flex-wrap gap-1.5 py-2">
                  {[
                    "Female gynecologist near Shibuya",
                    "24-hour pharmacy in Bangkok",
                    "English-speaking clinic in Paris",
                  ].map(s => (
                    <button
                      key={s}
                      onClick={() => handleAsk(s)}
                      className="px-2.5 py-1 rounded-full bg-coral-light/60 border border-primary/15 text-[10px] text-primary font-medium hover:bg-coral-light transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-6 pt-2 border-t border-border flex gap-2 flex-shrink-0">
              <Input
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAsk(aiInput)}
                placeholder="e.g. find female gynecologist near Shibuya"
                className="rounded-xl text-xs h-10 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary/40"
                disabled={aiLoading}
              />
              <Button
                size="icon"
                className="h-10 w-10 rounded-xl safe-gradient flex-shrink-0"
                onClick={() => handleAsk(aiInput)}
                disabled={aiLoading || !aiInput.trim()}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HealthLocatorPage;
