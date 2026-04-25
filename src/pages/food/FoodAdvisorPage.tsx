import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/ai-stream";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const quickQuestions = [
  "What should I try in Tokyo?",
  "Best street food in Bangkok?",
  "Safe restaurants in Marrakech?",
  "Solo dining tips for Paris?",
  "Vegan options in Bali?",
  "Late-night safe eats in Barcelona?",
];

const FoodAdvisorPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your AI food advisor 🍽️\n\nTell me where you are (or where you're heading) and I'll recommend safe, solo-friendly restaurants, must-try dishes, and allergy-safe options across **30 destinations worldwide**!" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
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
        feature: "food-advisor",
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          toast.error(err);
          setIsLoading(false);
        },
      });
    } catch {
      toast.error("Failed to get response");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate("/explore")} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-heading font-bold">AI Food Advisor</h1>
            <p className="text-[10px] text-muted-foreground">Powered by Lovable AI</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1"><Bot className="w-4 h-4 text-primary" /></div>}
            <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm", msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card border border-border rounded-bl-md prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0")}>
              {msg.role === "assistant" ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Loader2 className="w-4 h-4 text-primary animate-spin" /></div>
            <div className="px-4 py-3 rounded-2xl bg-card border border-border rounded-bl-md">
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-5 pb-3">
          <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map(q => (
              <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1.5 rounded-full bg-card border border-border text-xs hover:border-primary/30 transition-all">{q}</button>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 pb-4 flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && input && !isLoading && sendMessage(input)} placeholder="Ask about food..." className="rounded-xl text-sm" disabled={isLoading} />
        <Button size="icon" onClick={() => input && !isLoading && sendMessage(input)} className="rounded-xl safe-gradient" disabled={isLoading}><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
};

export default FoodAdvisorPage;
