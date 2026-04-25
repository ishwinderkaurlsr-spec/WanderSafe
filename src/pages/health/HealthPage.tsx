import { useState, useRef, useEffect } from "react";
import { Heart, MapPin, Scale, ChevronRight, Droplets, Shield as ShieldIcon, Sparkles, Send, Bot, Loader2, Lightbulb, Package, Phone, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/ai-stream";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const quickPrompts = [
  "Is my medication legal in Thailand?",
  "Female gynecologist in Tokyo?",
  "Emergency contraception in Bali?",
  "Do I need prescriptions in France?",
];

const features = [
  {
    icon: MapPin,
    title: "Health Resource Locator",
    desc: "Find female doctors, pharmacies, and clinics with English-speaking staff near you — rated and verified by travellers.",
    path: "/health/locator",
    color: "bg-coral-light text-primary",
    accentBg: "bg-coral-light/40",
    badge: "Find Now",
  },
  {
    icon: Scale,
    title: "Reproductive Rights Guide",
    desc: "Country-by-country breakdown of contraception access, abortion laws, and emergency contraception availability.",
    path: "/health/reproductive",
    color: "bg-sage-light text-sage",
    accentBg: "bg-sage-light/40",
    badge: "Know Your Rights",
  },
  {
    icon: Droplets,
    title: "Safe Restroom Finder",
    desc: "Community-rated restrooms with safety, cleanliness, and accessibility scores so you're never caught off guard.",
    path: "/health/restrooms",
    color: "bg-coral-light text-primary",
    accentBg: "bg-coral-light/40",
    badge: "Find Nearby",
  },
  {
    icon: ShieldIcon,
    title: "Travel Insurance Advisor",
    desc: "Compare plans with women-specific coverage including assault care, mental health support, and pregnancy complications.",
    path: "/health/insurance",
    color: "bg-sage-light text-sage",
    accentBg: "bg-sage-light/40",
    badge: "Compare Plans",
  },
];

const quickTips = [
  {
    icon: Package,
    title: "Pack a 3-Month Supply",
    desc: "Bring enough of any prescription medication for your entire trip plus 30% extra. Many drugs have different names or may be unavailable abroad.",
    color: "text-primary",
    bg: "bg-coral-light/50",
  },
  {
    icon: Phone,
    title: "Save Local Emergency Numbers",
    desc: "112 works in EU countries, but Japan uses 119 for ambulance and 110 for police. Research your destination before you land.",
    color: "text-sage",
    bg: "bg-sage-light/50",
  },
  {
    icon: WifiOff,
    title: "Download Offline Health Info",
    desc: "Save translated pharmacy phrases, your blood type, allergies, and key health info to your phone before departure — in case of no signal.",
    color: "text-primary",
    bg: "bg-coral-light/50",
  },
];

const HealthPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Health Advisor ✨\n\nAsk me anything about women's health while travelling — medication legality, finding female doctors, emergency services, or reproductive healthcare access by country.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        feature: "health-advisor",
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast.error(err);
          setIsLoading(false);
        },
      });
    } catch {
      toast.error("Failed to get a response. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-6">
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-heading font-bold">Health</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Women's health resources worldwide</p>
      </div>

      {/* AI Health Advisor */}
      <div className="px-5 mb-6">
        <div className="rounded-2xl border border-primary/15 overflow-hidden shadow-warm">
          {/* Chat header */}
          <div className="safe-gradient px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-bold text-white">AI Health Advisor</h2>
              <p className="text-[10px] text-white/75">Ask anything about health while travelling</p>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-card max-h-56 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
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

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                </div>
                <div className="px-3 py-2 rounded-2xl bg-muted border border-border rounded-bl-sm">
                  <span className="text-xs text-muted-foreground">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts — only shown initially */}
          {messages.length <= 1 && (
            <div className="bg-card border-t border-border px-4 pb-3 pt-2">
              <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Try asking</p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-2.5 py-1 rounded-full bg-coral-light/60 border border-primary/15 text-[10px] text-primary font-medium hover:bg-coral-light transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input row */}
          <div className="bg-card border-t border-border px-3 py-2.5 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask a health question…"
              className="rounded-xl text-xs h-9 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary/40"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="h-9 w-9 rounded-xl safe-gradient flex-shrink-0"
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-5 mb-2">
        <h2 className="text-base font-heading font-bold mb-3">Health Tools</h2>
        <div className="space-y-3">
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="w-full flex items-start gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-warm transition-all group text-left"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5", feature.color)}>
                <feature.icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-heading font-bold">{feature.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-primary bg-coral-light/60 px-2 py-0.5 rounded-full">
                  {feature.badge} →
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h2 className="text-base font-heading font-bold">Quick Tips</h2>
        </div>
        <div className="space-y-3">
          {quickTips.map((tip) => (
            <div key={tip.title} className={cn("flex items-start gap-3 p-4 rounded-2xl border border-border", tip.bg)}>
              <div className={cn("w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0", tip.color)}>
                <tip.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-sm font-heading font-bold mb-0.5">{tip.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
