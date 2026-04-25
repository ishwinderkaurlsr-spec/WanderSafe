import { useState, useRef } from "react";
import { ArrowLeft, Shield, AlertTriangle, Check, ChevronDown, Send, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/ai-stream";

// ── Real insurance plan data ──────────────────────────────────────────────────
type Plan = {
  id: string;
  name: string;
  provider: string;
  rating: number;
  priceFrom: string;
  pricePer: string;
  womenFocused: boolean;
  medicalLimit: string;
  highlights: string[];
  womenCoverage: string[];
  redFlags: string[];
  bestFor: string;
  url: string;
};

const PLANS: Plan[] = [
  {
    id: "world-nomads",
    name: "World Nomads Explorer",
    provider: "World Nomads",
    rating: 4.4,
    priceFrom: "$5.50",
    pricePer: "day",
    womenFocused: false,
    medicalLimit: "$100,000",
    highlights: [
      "Emergency medical up to $100,000",
      "Medical evacuation & repatriation",
      "Trip cancellation & interruption",
      "24/7 emergency assistance hotline",
      "Adventure sports coverage included",
      "Covers 150+ activities",
    ],
    womenCoverage: [
      "Emergency contraception if medically necessary",
      "Sexual assault medical care",
      "Pregnancy complications up to 26 weeks",
    ],
    redFlags: [
      "Abortion not covered under any circumstances",
      "Elective reproductive procedures excluded",
      "Pre-existing conditions require upgrade",
    ],
    bestFor: "Adventure travelers, digital nomads",
    url: "https://www.worldnomads.com",
  },
  {
    id: "safetywing",
    name: "SafetyWing Nomad Insurance",
    provider: "SafetyWing",
    rating: 4.2,
    priceFrom: "$1.87",
    pricePer: "day",
    womenFocused: false,
    medicalLimit: "$250,000",
    highlights: [
      "Emergency medical up to $250,000",
      "Monthly rolling subscription (no fixed end date)",
      "COVID-19 coverage included",
      "Home country coverage for 30 days",
      "Very affordable — ideal for long trips",
      "US included for non-US citizens",
    ],
    womenCoverage: [
      "Emergency obstetric care (complications)",
      "Sexual assault emergency care",
    ],
    redFlags: [
      "No trip cancellation coverage",
      "Routine gynecological visits not covered",
      "Maximum $2,500 for acute unforeseen mental health",
      "Pre-existing conditions excluded by default",
    ],
    bestFor: "Long-term travelers, remote workers",
    url: "https://safetywing.com",
  },
  {
    id: "seven-corners",
    name: "Seven Corners Liaison",
    provider: "Seven Corners",
    rating: 4.5,
    priceFrom: "$4.00",
    pricePer: "day",
    womenFocused: true,
    medicalLimit: "$500,000",
    highlights: [
      "Emergency medical up to $500,000",
      "Trip cancellation up to $5,000",
      "Mental health counseling sessions",
      "Telemedicine / virtual doctor visits",
      "Prescription medication coverage abroad",
      "Hospital of choice benefit",
    ],
    womenCoverage: [
      "Emergency contraception (medically necessary)",
      "Sexual assault comprehensive care including counseling",
      "Pregnancy complications up to 36 weeks",
      "Mental health / trauma counseling (10 sessions)",
      "Telemedicine for women's health questions",
    ],
    redFlags: [
      "No elective termination coverage",
      "Pre-existing maternity excluded",
      "Some US states have limited network",
    ],
    bestFor: "Travelers wanting comprehensive mental health + women's care",
    url: "https://www.sevencorners.com",
  },
  {
    id: "img-global",
    name: "IMG Patriot International",
    provider: "International Medical Group",
    rating: 4.3,
    priceFrom: "$3.50",
    pricePer: "day",
    womenFocused: true,
    medicalLimit: "$1,000,000",
    highlights: [
      "Emergency medical up to $1 million",
      "Medical evacuation unlimited",
      "Prescription drugs covered abroad",
      "24/7 multilingual assistance",
      "Direct billing at major hospitals",
      "Dental emergency coverage",
    ],
    womenCoverage: [
      "Sexual assault care & forensic exam",
      "Emergency contraception after assault",
      "Pregnancy complications & emergency delivery",
      "Telemedicine for OB/GYN consultations",
      "Domestic violence emergency support line",
    ],
    redFlags: [
      "No pre-existing condition coverage standard",
      "Elective procedures not covered",
      "Some countries excluded (N. Korea, Iran, Sudan)",
    ],
    bestFor: "Long international trips, high medical limit needed",
    url: "https://www.imglobal.com",
  },
  {
    id: "tin-leg",
    name: "Tin Leg Gold",
    provider: "Tin Leg",
    rating: 4.6,
    priceFrom: "$6.20",
    pricePer: "day",
    womenFocused: true,
    medicalLimit: "$500,000",
    highlights: [
      "Emergency medical $500,000",
      "\"Cancel for any reason\" upgrade available",
      "Trip delay & missed connection",
      "24/7 concierge travel assistance",
      "Excellent claims satisfaction rating",
      "Pre-existing condition waiver available",
    ],
    womenCoverage: [
      "Sexual assault emergency treatment & counseling",
      "Pregnancy complications up to 36 weeks",
      "Mental health emergencies",
      "Emergency contraception post-assault",
      "Gynecological emergency visits",
    ],
    redFlags: [
      "Pricier than competitors",
      "\"Cancel for any reason\" is an add-on cost",
    ],
    bestFor: "Travelers wanting highest rated customer service",
    url: "https://www.tinleg.com",
  },
  {
    id: "axa-assistance",
    name: "AXA Assistance USA Premium",
    provider: "AXA",
    rating: 4.2,
    priceFrom: "$5.00",
    pricePer: "day",
    womenFocused: false,
    medicalLimit: "$250,000",
    highlights: [
      "Emergency medical $250,000",
      "Trip cancellation up to 100%",
      "Cancel for any reason 75% add-on",
      "Global network of AXA hospitals",
      "Lost baggage & personal effects",
      "Known brand, global presence",
    ],
    womenCoverage: [
      "Pregnancy complications coverage",
      "Emergency delivery care",
    ],
    redFlags: [
      "Limited specific women's health benefits",
      "Sexual assault care not specifically itemized",
      "Mental health limited to emergency only",
    ],
    bestFor: "Standard coverage, trusted brand, business travelers",
    url: "https://www.axatravelinsurance.com",
  },
];

const SYSTEM_PROMPT = `You are a women's travel insurance expert. Help travelers choose the right insurance plan based on their needs.
You know about these specific plans: World Nomads Explorer, SafetyWing Nomad Insurance, Seven Corners Liaison, IMG Patriot International, Tin Leg Gold, and AXA Assistance USA Premium.
Focus on women-specific coverage: reproductive health, sexual assault care, mental health, pregnancy complications.
Give specific, actionable advice. Keep responses concise and helpful. If asked about a specific plan, give honest pros and cons.`;

type Message = { role: "user" | "assistant"; content: string };

const InsuranceAdvisorPage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "women">("all");
  const [aiOpen, setAiOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I can help you choose the right travel insurance. Ask me anything — e.g. \"Which plan covers sexual assault care best?\" or \"I'm 20 weeks pregnant, what should I look for?\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const displayPlans = filter === "women" ? PLANS.filter((p) => p.womenFocused) : PLANS;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    const aiMsg: Message = { role: "assistant", content: "" };
    setMessages((m) => [...m, aiMsg]);

    await streamChat({
      messages: [...messages, userMsg],
      feature: "insurance-advisor",
      onDelta: (token) => {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + token };
          return copy;
        });
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      },
      onDone: () => setLoading(false),
    });
  };

  const stars = (n: number) => "★".repeat(Math.floor(n)) + (n % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(n));

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-heading font-bold">Travel Insurance</h1>
          <p className="text-xs text-muted-foreground">Women-focused coverage comparison</p>
        </div>
      </div>

      {/* AI Advisor toggle */}
      <div className="px-5 mb-4">
        <button
          onClick={() => setAiOpen(!aiOpen)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-coral-light border border-primary/20 hover:border-primary/40 transition-all"
        >
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="flex-1 text-left">
            <p className="text-sm font-heading font-bold">AI Insurance Advisor</p>
            <p className="text-xs text-muted-foreground">Ask which plan suits your trip best</p>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", aiOpen && "rotate-180")} />
        </button>

        {aiOpen && (
          <div className="mt-2 rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  )}>
                    {msg.content || (loading && i === messages.length - 1 && (
                      <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Thinking…</span>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="border-t border-border p-2 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about coverage…"
                className="h-8 text-xs rounded-xl"
                disabled={loading}
              />
              <Button size="sm" onClick={sendMessage} disabled={loading || !input.trim()} className="h-8 w-8 p-0 rounded-xl flex-shrink-0">
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="px-5 mb-4 flex gap-2">
        {[["all", "All Plans"], ["women", "🩺 Women-Focused"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key as "all" | "women")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              filter === key ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Plans */}
      <div className="px-5 pb-6 space-y-3">
        {displayPlans.map((plan) => {
          const isOpen = expanded === plan.id;
          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-2xl border overflow-hidden",
                plan.womenFocused ? "bg-coral-light/20 border-primary/30" : "bg-card border-border"
              )}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : plan.id)}
                className="w-full px-4 py-3 flex items-start justify-between gap-3"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-heading font-bold">{plan.name}</h3>
                    {plan.womenFocused && (
                      <Badge className="text-[9px] px-2 py-0.5 border-0 bg-primary/10 text-primary">
                        🩺 Women-Focused
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{plan.provider}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-amber-400">{stars(plan.rating)}</span>
                    <span className="text-[10px] text-muted-foreground">{plan.rating}</span>
                    <span className="text-xs font-bold text-primary">From {plan.priceFrom}/{plan.pricePer}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold">{plan.medicalLimit}</span>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3">
                  {/* Best for */}
                  <p className="text-xs italic text-muted-foreground">✦ Best for: {plan.bestFor}</p>

                  {/* Highlights */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">What's Covered</p>
                    <div className="space-y-1">
                      {plan.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <Check className="w-3 h-3 text-sage flex-shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Women's coverage */}
                  {plan.womenCoverage.length > 0 && (
                    <div className="p-3 rounded-xl bg-sage-light border border-sage/20">
                      <p className="text-[10px] font-semibold text-sage uppercase tracking-wider mb-2">🩺 Women's Health Coverage</p>
                      <div className="space-y-1.5">
                        {plan.womenCoverage.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <Check className="w-3 h-3 text-sage flex-shrink-0" />
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Red flags */}
                  {plan.redFlags.length > 0 && (
                    <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20">
                      <p className="text-[10px] font-semibold text-destructive uppercase tracking-wider mb-2">⚠️ Watch Out</p>
                      <div className="space-y-1.5">
                        {plan.redFlags.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-destructive">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <a
                    href={plan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    View Plan Details <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mx-5 mb-6 p-3 rounded-xl bg-muted border border-border">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          ℹ️ Prices are indicative and vary by trip length, age, and destination. Always read full policy terms. Links go to provider websites — WanderSafe is not affiliated with any insurer.
        </p>
      </div>
    </div>
  );
};

export default InsuranceAdvisorPage;
