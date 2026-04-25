import { useState } from "react";
import { ArrowLeft, Droplets, Shield, MapPin, Loader2, Search, Send, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/ai-stream";

// ── Curated restroom data per city ────────────────────────────────────────────
type Restroom = {
  name: string;
  address: string;
  type: "public" | "mall" | "cafe" | "hotel" | "museum" | "transit";
  free: boolean;
  accessible: boolean;
  safetyScore: number;
  cleanlinessScore: number;
  hours: string;
  tip: string;
};

type CityData = { emoji: string; restrooms: Restroom[] };

const CITY_DATA: Record<string, CityData> = {
  Tokyo: {
    emoji: "🇯🇵",
    restrooms: [
      { name: "Shibuya Station (JR East)", address: "1 Chome Dōgenzaka, Shibuya", type: "transit", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "Always open", tip: "Japan has some of the world's cleanest public toilets. Station restrooms have heated seats and bidet functions — very safe at all hours." },
      { name: "Tokyo Metropolitan Government Building", address: "2-8-1 Nishi-Shinjuku, Shinjuku", type: "public", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "8:30 AM – 10:30 PM", tip: "Open to public, beautifully maintained, staffed in daytime. Excellent views from the observation deck too." },
      { name: "Sensoji Temple Complex", address: "2 Chome-3-1 Asakusa, Taito", type: "public", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 4, hours: "6:00 AM – 9:00 PM", tip: "Multiple restrooms around the temple grounds. Clean and staffed. Bring small change for towel dispensers." },
      { name: "Omotesando Hills", address: "4 Chome-12-10 Jingumae, Shibuya", type: "mall", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "11:00 AM – 9:00 PM", tip: "Luxury shopping mall with immaculate restrooms. Powder room with mirror/seating area for women." },
    ],
  },
  Bangkok: {
    emoji: "🇹🇭",
    restrooms: [
      { name: "Siam Paragon Mall", address: "991/1 Rama I Rd, Pathum Wan", type: "mall", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "10:00 AM – 10:00 PM", tip: "Best restrooms in Bangkok. Multiple floors, always staffed, very clean. Air-conditioned with attendant and fresh towels." },
      { name: "Central World Plaza", address: "999/9 Rama I Rd, Pathumwan", type: "mall", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 4, hours: "10:00 AM – 10:00 PM", tip: "Clean and reliable. Coin-operated towel dispensers (5 baht). Women's restrooms have lounge area." },
      { name: "BTS Asok Station", address: "Sukhumvit Soi 21, Asok Intersection", type: "transit", free: true, accessible: true, safetyScore: 4, cleanlinessScore: 4, hours: "6:00 AM – midnight", tip: "BTS (Skytrain) stations generally have clean facilities. Staff are present during operating hours." },
      { name: "Wat Pho (Temple of Reclining Buddha)", address: "2 Sanam Chai Rd, Phra Nakhon", type: "public", free: false, accessible: true, safetyScore: 4, cleanlinessScore: 3, hours: "8:00 AM – 6:30 PM", tip: "Small fee (~10 baht). Cleaner than average temple facilities. Attendant on duty during temple hours." },
    ],
  },
  Paris: {
    emoji: "🇫🇷",
    restrooms: [
      { name: "Sanisette (Automatic Public Toilets)", address: "Throughout Paris streets", type: "public", free: true, accessible: true, safetyScore: 4, cleanlinessScore: 4, hours: "24/7", tip: "The green automatic toilets across Paris are free and self-cleaning after each use. Very safe — door locks automatically. Find them on the Paris Sanisette app." },
      { name: "Galeries Lafayette Haussmann", address: "40 Bd Haussmann, 9e", type: "mall", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "9:30 AM – 8:30 PM (Mon–Sat)", tip: "Gorgeous department store with excellent restrooms. Look for 'Toilettes' signs on each floor. Women's lounge area on select floors." },
      { name: "Musée du Louvre", address: "Rue de Rivoli, 1er arrondissement", type: "museum", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "During museum hours (9 AM – 6 PM)", tip: "Large, clean and accessible. Multiple locations within the museum. Buy museum entry or just enter the Carrousel du Louvre shopping area below for free." },
      { name: "McDonald's / Quick Restaurants", address: "Citywide", type: "cafe", free: false, accessible: true, safetyScore: 3, cleanlinessScore: 3, hours: "During restaurant hours", tip: "You must buy something (coffee ~€1.50) to get the restroom code. Not the best but reliable when nothing else is open." },
    ],
  },
  Amsterdam: {
    emoji: "🇳🇱",
    restrooms: [
      { name: "De Bijenkorf Department Store", address: "Dam 1, 1012 JS Amsterdam", type: "mall", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "10:00 AM – 8:00 PM", tip: "Best restrooms in the city centre. Multiple floors, always clean and staffed. Women's lounge available." },
      { name: "Centraal Station", address: "Stationsplein 1, 1012 AB", type: "transit", free: false, accessible: true, safetyScore: 4, cleanlinessScore: 4, hours: "Always open", tip: "€0.70 coin required. Very clean and supervised. 24/7 access — reliable for late-night arrivals." },
      { name: "Stedelijk Museum", address: "Museumplein 10, 1071 DJ", type: "museum", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "10:00 AM – 6:00 PM", tip: "Free museum entry on Museum Card; toilet accessible to all. Excellent facilities." },
      { name: "Vondelpark Public Toilets", address: "Vondelpark, various locations", type: "public", free: false, accessible: false, safetyScore: 3, cleanlinessScore: 3, hours: "8:00 AM – dusk", tip: "€0.50 coin-operated. Adequate for daytime park use. Avoid after dark — use the Filmmuseum café instead." },
    ],
  },
  Mumbai: {
    emoji: "🇮🇳",
    restrooms: [
      { name: "Phoenix Palladium Mall", address: "462, Senapati Bapat Marg, Lower Parel", type: "mall", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "10:00 AM – 10:00 PM", tip: "Best restrooms in South Mumbai. Staffed, clean, safe. Women's attendant present. Located in premium mall." },
      { name: "Chhatrapati Shivaji Maharaj Terminus", address: "Dr. Dadabhai Naoroji Rd, Fort", type: "transit", free: false, accessible: false, safetyScore: 3, cleanlinessScore: 3, hours: "Always open", tip: "Look for the dedicated women's toilet on the main concourse (₹5). Quality varies — use during peak hours when attended." },
      { name: "Colaba Causeway (Café Coffee Day)", address: "7 Colaba Causeway, Colaba", type: "cafe", free: false, accessible: false, safetyScore: 4, cleanlinessScore: 4, hours: "8:00 AM – 11:00 PM", tip: "Buy a drink (₹80–120) to access clean restrooms in a safe, staffed environment." },
      { name: "Oberoi Hotel Lobby", address: "Nariman Point, South Mumbai", type: "hotel", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "24/7", tip: "5-star hotel lobby restrooms — free to use. Walk in confidently. Spotlessly clean with attendant." },
    ],
  },
  Delhi: {
    emoji: "🇮🇳",
    restrooms: [
      { name: "Select Citywalk Mall, Saket", address: "Plot A-3, District Centre, Saket", type: "mall", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 5, hours: "10:00 AM – 10:00 PM", tip: "Best public facilities in South Delhi. Staffed women's restrooms with attendants. Very clean." },
      { name: "Delhi Metro (all stations)", address: "Throughout the city", type: "transit", free: true, accessible: true, safetyScore: 5, cleanlinessScore: 4, hours: "5:30 AM – 11:30 PM", tip: "Delhi Metro stations have well-maintained restrooms with CISF security present. Women's carriages available on all lines — use them." },
      { name: "India Gate lawns (public toilet van)", address: "Rajpath, India Gate", type: "public", free: false, accessible: false, safetyScore: 3, cleanlinessScore: 2, hours: "8:00 AM – 8:00 PM", tip: "Look for the NDMC mobile toilet vans. Pay ₹5. Adequate but bring tissue. Daytime use only recommended." },
      { name: "Connaught Place (McDonald's)", address: "N-17, N Block, Connaught Place", type: "cafe", free: false, accessible: false, safetyScore: 4, cleanlinessScore: 4, hours: "8:00 AM – midnight", tip: "Buy a coffee to access restrooms. Central location, well lit, safe to use at most hours." },
    ],
  },
};

const CITIES = Object.keys(CITY_DATA);
const TYPE_EMOJI: Record<string, string> = {
  public: "🏛️", mall: "🛍️", cafe: "☕", hotel: "🏨", museum: "🖼️", transit: "🚉",
};

const SYSTEM_PROMPT = `You are a women's travel safety assistant specializing in finding safe, clean restrooms worldwide.
Help travelers find clean, safe restroom facilities in any city. Be specific about locations, costs, safety, and hours.
Focus on: safety (solo women travelers), cleanliness, accessibility, hours, and any tips.
Format responses with specific named locations and practical advice. Keep it concise.`;

const RestroomFinderPage = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("Tokyo");
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const data = CITY_DATA[city];

  const askAI = async () => {
    const q = question.trim();
    if (!q || aiLoading) return;
    setShowAi(true);
    setAiResponse("");
    setAiLoading(true);

    const prompt = `Find safe, clean restrooms for women near: ${q}. Focus on safety, cleanliness, cost, and hours.`;
    await streamChat({
      messages: [{ role: "user", content: prompt }],
      feature: "restroom-finder",
      onDelta: (token) => setAiResponse((p) => p + token),
      onDone: () => setAiLoading(false),
    });
  };

  const scoreBar = (score: number) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={cn("w-2.5 h-2.5 rounded-full", i < score ? "bg-sage" : "bg-muted")} />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-heading font-bold">Safe Restrooms</h1>
          <p className="text-xs text-muted-foreground">Curated safe, clean facilities for women</p>
        </div>
      </div>

      {/* AI Search */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askAI()}
              placeholder="Ask AI: safe restrooms near Shibuya…"
              className="pl-9 h-9 rounded-xl text-sm"
            />
          </div>
          <Button onClick={askAI} disabled={aiLoading || !question.trim()} size="sm" className="h-9 w-9 p-0 rounded-xl flex-shrink-0">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        {showAi && (
          <div className="mt-2 p-3 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-[8px]">AI</span>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground">AI SUGGESTION</span>
            </div>
            {aiLoading && !aiResponse ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" /> Finding safe restrooms…
              </div>
            ) : (
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
            )}
          </div>
        )}
      </div>

      {/* City filter */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {CITIES.map((c) => (
          <button
            key={c}
            onClick={() => setCity(c)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
              city === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground"
            )}
          >
            {CITY_DATA[c].emoji} {c}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="px-5 mb-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Shield className="w-3 h-3 text-sage" /> Safety
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Droplets className="w-3 h-3 text-blue-400" /> Cleanliness
        </div>
        <div className="text-[10px] text-muted-foreground">● = 1 point out of 5</div>
      </div>

      {/* Restrooms */}
      <div className="px-5 pb-6 space-y-3">
        {(data?.restrooms || []).map((r, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center text-lg flex-shrink-0">
                {TYPE_EMOJI[r.type] || "🚻"}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-heading font-bold leading-tight">{r.name}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                  <p className="text-[10px] text-muted-foreground truncate">{r.address}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 capitalize">{r.type}</Badge>
              <Badge className={cn("text-[9px] px-1.5 py-0.5 border-0", r.free ? "bg-sage-light text-sage" : "bg-muted text-muted-foreground")}>
                {r.free ? "Free" : "Paid"}
              </Badge>
              {r.accessible && <Badge className="text-[9px] px-1.5 py-0.5 border-0 bg-sky-100 text-sky-700">♿ Accessible</Badge>}
              <span className="text-[10px] text-muted-foreground ml-auto">{r.hours}</span>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-sage" />
                {scoreBar(r.safetyScore)}
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3 h-3 text-blue-400" />
                {scoreBar(r.cleanlinessScore)}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">{r.tip}</p>
          </div>
        ))}

        {/* Ask AI for more cities */}
        <div className="p-4 rounded-2xl border border-dashed border-border text-center">
          <p className="text-sm font-heading font-bold mb-1">Looking for another city?</p>
          <p className="text-xs text-muted-foreground mb-3">Use the AI search above to find safe restrooms anywhere in the world.</p>
          <button
            onClick={() => {
              setQuestion("safe clean restrooms for women in ");
              document.querySelector<HTMLInputElement>("input[placeholder*='Ask AI']")?.focus();
            }}
            className="text-xs text-primary font-medium underline underline-offset-2"
          >
            Ask AI →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestroomFinderPage;
