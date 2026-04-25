import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowLeft, Plus, Volume2, Globe, Trash2, Loader2, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/ai-stream";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// ── Language config ───────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "ja", name: "Japanese", flag: "🇯🇵", ttsCode: "ja-JP"  },
  { code: "fr", name: "French",   flag: "🇫🇷", ttsCode: "fr-FR"  },
  { code: "ar", name: "Arabic",   flag: "🇲🇦", ttsCode: "ar-001" },
  { code: "th", name: "Thai",     flag: "🇹🇭", ttsCode: "th-TH"  },
  { code: "es", name: "Spanish",  flag: "🇲🇽", ttsCode: "es-ES"  },
  { code: "de", name: "German",   flag: "🇩🇪", ttsCode: "de-DE"  },
  { code: "it", name: "Italian",  flag: "🇮🇹", ttsCode: "it-IT"  },
  { code: "ko", name: "Korean",   flag: "🇰🇷", ttsCode: "ko-KR"  },
];

const CATEGORY_ICONS: Record<string, string> = {
  health: "💊", directions: "🗺️", food: "🍽️",
  shopping: "🛍️", safety: "🛡️", custom: "✏️",
};

// ── Types & defaults ──────────────────────────────────────────────────────────
type Phrase = {
  id: string;
  english: string;
  category: string;
  translations: Record<string, string>; // lang code → translated text
};

const STORAGE_KEY = "wandersafe_custom_phrases_v2";

const DEFAULT_PHRASES: Phrase[] = [
  { id: "cp1", english: "I have a shellfish allergy",  category: "health",     translations: {} },
  { id: "cp2", english: "My hotel is at this address", category: "directions", translations: {} },
  { id: "cp3", english: "I am vegetarian",             category: "food",       translations: {} },
  { id: "cp4", english: "How much does this cost?",    category: "shopping",   translations: {} },
  { id: "cp5", english: "Is this area safe at night?", category: "safety",     translations: {} },
];

// ── Component ─────────────────────────────────────────────────────────────────
const PhraseBuilderPage = () => {
  const navigate = useNavigate();

  const [phrases, setPhrases]           = useState<Phrase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PHRASES;
    } catch { return DEFAULT_PHRASES; }
  });
  const [selectedLang, setSelectedLang] = useState("ja");
  const [newPhrase, setNewPhrase]       = useState("");
  const [translating, setTranslating]   = useState<Set<string>>(new Set());
  const [playingId, setPlayingId]       = useState<string | null>(null);
  const [inputShake, setInputShake]     = useState(false);
  const inputRef   = useRef<HTMLInputElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);

  // Persist to localStorage whenever phrases change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases));
  }, [phrases]);

  // ── Translate a single phrase into the given language ─────────────────────
  const translateOne = useCallback(async (phrase: Phrase, langCode: string) => {
    if (phrase.translations[langCode]) return; // already translated
    const langName = LANGUAGES.find(l => l.code === langCode)?.name ?? langCode;

    setTranslating(prev => new Set([...prev, phrase.id + langCode]));

    let result = "";
    await streamChat({
      messages: [{ role: "user", content: `Translate to ${langName}. Reply with ONLY the translated text, nothing else: "${phrase.english}"` }],
      feature:  "translator",
      onDelta:  chunk => { result += chunk; },
      onDone:   () => {
        setPhrases(prev => prev.map(p =>
          p.id === phrase.id
            ? { ...p, translations: { ...p.translations, [langCode]: result.trim() } }
            : p
        ));
        setTranslating(prev => { const s = new Set(prev); s.delete(phrase.id + langCode); return s; });
      },
      onError:  err => {
        toast.error(err);
        setTranslating(prev => { const s = new Set(prev); s.delete(phrase.id + langCode); return s; });
      },
    });
  }, []);

  // ── When language changes, translate all phrases not yet translated ────────
  useEffect(() => {
    phrases.forEach(p => {
      if (!p.translations[selectedLang]) translateOne(p, selectedLang);
    });
  }, [selectedLang]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Add new phrase ────────────────────────────────────────────────────────
  const addPhrase = useCallback(async () => {
    const text = newPhrase.trim();
    if (!text) {
      // Shake the input to signal "type something first"
      inputRef.current?.focus();
      setInputShake(true);
      setTimeout(() => setInputShake(false), 500);
      return;
    }
    const id = `cp${Date.now()}`;
    const phrase: Phrase = { id, english: text, category: "custom", translations: {} };
    setPhrases(prev => [...prev, phrase]);
    setNewPhrase("");
    inputRef.current?.focus();
    translateOne(phrase, selectedLang);
    // Scroll to the new phrase after render
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [newPhrase, selectedLang, translateOne]);

  // ── Delete phrase ─────────────────────────────────────────────────────────
  const deletePhrase = useCallback((id: string) => {
    setPhrases(prev => prev.filter(p => p.id !== id));
    window.speechSynthesis?.cancel();
    setPlayingId(null);
  }, []);

  // ── TTS playback ──────────────────────────────────────────────────────────
  const playPhrase = useCallback((phraseId: string, text: string, langCode: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (playingId === phraseId) { setPlayingId(null); return; }

    const ttsCode = LANGUAGES.find(l => l.code === langCode)?.ttsCode ?? "en-US";

    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      const voice  =
        voices.find(v => v.lang === ttsCode) ??
        voices.find(v => v.lang.startsWith(ttsCode.split("-")[0]));

      const utterance      = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.lang       = voice?.lang ?? ttsCode;
      utterance.rate       = 0.9;
      utterance.onstart    = () => setPlayingId(phraseId);
      utterance.onend      = () => setPlayingId(null);
      utterance.onerror    = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [playingId]);

  const currentLang = LANGUAGES.find(l => l.code === selectedLang)!;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-full">

      {/* Header */}
      <div className="px-5 pt-2 pb-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-sm font-heading font-bold">My Custom Phrases</h1>
          <p className="text-[10px] text-muted-foreground">Save & translate your key phrases</p>
        </div>
      </div>

      {/* Language selector */}
      <div className="px-5 pt-3 pb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-primary" /> Translate to
        </h3>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => setSelectedLang(l.code)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all",
                selectedLang === l.code
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {l.flag} {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add phrase input */}
      <div className="px-5 py-3 flex gap-2">
        <Input
          ref={inputRef}
          value={newPhrase}
          onChange={e => setNewPhrase(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addPhrase()}
          placeholder="Add a phrase in English…"
          className={cn("rounded-xl text-sm transition-all", inputShake && "animate-[shake_0.4s_ease-in-out]")}
        />
        <Button
          size="icon"
          onClick={addPhrase}
          className="rounded-xl safe-gradient flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Phrase list */}
      <div className="px-5 pb-6 space-y-2 flex-1">
        <AnimatePresence initial={false}>
          {phrases.map(phrase => {
            const translation   = phrase.translations[selectedLang];
            const isTranslating = translating.has(phrase.id + selectedLang);
            const isPlaying     = playingId === phrase.id;

            return (
              <motion.div
                key={phrase.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="rounded-2xl bg-card border border-border overflow-hidden"
              >
                {/* English */}
                <div className="px-4 pt-3 pb-2 flex items-start gap-3">
                  <span className="text-lg mt-0.5 flex-shrink-0">
                    {CATEGORY_ICONS[phrase.category] ?? "📝"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">{phrase.english}</p>
                    <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{phrase.category}</p>
                  </div>
                  <button
                    onClick={() => deletePhrase(phrase.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Translation */}
                <div className="px-4 pb-3 flex items-center gap-2 border-t border-border/50 pt-2">
                  <span className="text-xs flex-shrink-0">{currentLang.flag}</span>
                  <div className="flex-1 min-w-0">
                    {isTranslating ? (
                      <div className="flex items-center gap-1.5">
                        {[0, 0.15, 0.3].map(delay => (
                          <motion.div
                            key={delay}
                            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 0.9, delay }}
                            className="w-1.5 h-1.5 rounded-full bg-primary"
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">Translating…</span>
                      </div>
                    ) : translation ? (
                      <p className="text-sm font-semibold text-primary leading-snug truncate">{translation}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No translation yet</p>
                    )}
                  </div>

                  {translation && !isTranslating && (
                    <button
                      onClick={() => playPhrase(phrase.id, translation, selectedLang)}
                      className={cn(
                        "p-2 rounded-full transition-all flex-shrink-0",
                        isPlaying
                          ? "bg-primary text-primary-foreground scale-110"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      {isPlaying
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Volume2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={bottomRef} />

        {phrases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Languages className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">No phrases yet</p>
            <p className="text-xs text-muted-foreground max-w-[200px]">Add your first phrase above — it'll be translated instantly</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhraseBuilderPage;
