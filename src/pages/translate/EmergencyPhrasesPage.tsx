import { useState, useCallback, useRef } from "react";
import { ArrowLeft, Volume2, Maximize2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmergencyPhrases } from "@/hooks/use-cities";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Map language names → BCP-47 TTS codes (matched to available macOS/Chrome voices)
const LANG_TTS: Record<string, string> = {
  Japanese:   "ja-JP",
  French:     "fr-FR",
  Spanish:    "es-ES",
  Thai:       "th-TH",
  Arabic:     "ar-001",  // only voice available is Majed (ar-001)
  Portuguese: "pt-PT",   // flag is 🇵🇹, use Joana pt-PT
  Italian:    "it-IT",
  German:     "de-DE",
  Indonesian: "id-ID",
  Greek:      "el-GR",
};

const languageOptions = [
  { code: "Japanese",   flag: "🇯🇵", name: "Japanese"   },
  { code: "French",     flag: "🇫🇷", name: "French"     },
  { code: "Spanish",    flag: "🇪🇸", name: "Spanish"    },
  { code: "Thai",       flag: "🇹🇭", name: "Thai"       },
  { code: "Arabic",     flag: "🇲🇦", name: "Arabic"     },
  { code: "Portuguese", flag: "🇵🇹", name: "Portuguese" },
  { code: "Italian",    flag: "🇮🇹", name: "Italian"    },
  { code: "German",     flag: "🇩🇪", name: "German"     },
  { code: "Indonesian", flag: "🇮🇩", name: "Indonesian" },
  { code: "Greek",      flag: "🇬🇷", name: "Greek"      },
];

const EmergencyPhrasesPage = () => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState("Japanese");
  const [showMode, setShowMode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { data: phrases, isLoading } = useEmergencyPhrases(selectedLang);

  const playPhrase = useCallback((phraseId: string, text: string) => {
    if (!window.speechSynthesis) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    if (playingId === phraseId) { setPlayingId(null); return; }

    const langCode = LANG_TTS[selectedLang] ?? "en-US";

    // Slight delay avoids cancel() → speak() race condition in Chrome
    setTimeout(() => {
      const allVoices = window.speechSynthesis.getVoices();
      const voice =
        allVoices.find(v => v.lang === langCode) ??
        allVoices.find(v => v.lang.startsWith(langCode.split("-")[0]));

      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang ?? langCode;
      utterance.rate = 0.85;

      utterance.onstart = () => setPlayingId(phraseId);
      utterance.onend   = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);

      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [selectedLang, playingId]);

  const categories = [
    { id: "all", label: "All" },
    { id: "emergency", label: "🚨 Emergency" },
    { id: "safety", label: "🛡️ Safety" },
    { id: "medical", label: "🏥 Medical" },
    { id: "transport", label: "🚕 Transport" },
  ];

  const filtered = activeCategory === "all" ? phrases : (phrases || []).filter(p => p.category === activeCategory);

  if (showMode) {
    const phrase = (phrases || []).find(p => p.id === showMode);
    if (!phrase) return null;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col min-h-full items-center justify-center px-8 bg-primary safe-gradient"
        onClick={() => setShowMode(null)}
      >
        <p className="text-sm text-primary-foreground/70 mb-4">Show to someone — tap to close</p>
        <p className="text-4xl font-heading font-extrabold text-primary-foreground text-center leading-tight mb-4">
          {phrase.translated_text}
        </p>
        <p className="text-lg text-primary-foreground/80 text-center">{phrase.original_text}</p>
        {phrase.pronunciation && <p className="text-sm text-primary-foreground/50 mt-2">({phrase.pronunciation})</p>}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button onClick={() => navigate("/translate")} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-xl font-heading font-bold">Emergency Phrases</h1>
      </div>

      <div className="px-5 mb-3">
        <select value={selectedLang} onChange={(e) => { window.speechSynthesis?.cancel(); setPlayingId(null); setSelectedLang(e.target.value); }} className="w-full h-9 rounded-xl border border-border bg-card px-3 text-sm">
          {languageOptions.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
        </select>
      </div>

      <div className="px-5 mb-3 flex gap-2 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border", activeCategory === cat.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="px-5 mb-2 p-2 rounded-xl bg-coral-light/50 border border-primary/20">
        <p className="text-[10px] text-center text-foreground">✈️ Tap ⛶ for full-screen show mode — show your phone to locals</p>
      </div>

      <div className="px-5 pb-4 space-y-2">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />) : (
          (filtered || []).map((phrase) => (
            <div key={phrase.id} className="p-3.5 rounded-2xl bg-card border border-border">
              <p className="text-sm font-semibold mb-1">{phrase.original_text}</p>
              <p className="text-base font-bold text-primary mb-0.5">{phrase.translated_text}</p>
              {phrase.pronunciation && <p className="text-xs text-muted-foreground italic mb-2">{phrase.pronunciation}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => playPhrase(phrase.id, phrase.translated_text)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    playingId === phrase.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  {playingId === phrase.id
                    ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Playing…</>
                    : <><Volume2 className="w-3.5 h-3.5" /> Play Audio</>
                  }
                </button>
                <button onClick={() => setShowMode(phrase.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
                  <Maximize2 className="w-3.5 h-3.5" /> Show Mode
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergencyPhrasesPage;
