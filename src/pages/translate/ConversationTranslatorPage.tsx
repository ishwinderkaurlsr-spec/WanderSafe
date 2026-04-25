import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft, Mic, MicOff, Volume2, ArrowLeftRight, RefreshCw, MicOff as MicBlocked, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/ai-stream";
import { toast } from "sonner";

const LANGUAGES = [
  { label: "English",    speechCode: "en-US", ttsCode: "en-US" },
  { label: "Spanish",    speechCode: "es-ES", ttsCode: "es-ES" },
  { label: "French",     speechCode: "fr-FR", ttsCode: "fr-FR" },
  { label: "Japanese",   speechCode: "ja-JP", ttsCode: "ja-JP" },
  { label: "Arabic",     speechCode: "ar-SA", ttsCode: "ar-001" },
  { label: "Hindi",      speechCode: "hi-IN", ttsCode: "hi-IN" },
  { label: "Thai",       speechCode: "th-TH", ttsCode: "th-TH" },
  { label: "Korean",     speechCode: "ko-KR", ttsCode: "ko-KR" },
  { label: "Portuguese", speechCode: "pt-BR", ttsCode: "pt-BR" },
  { label: "Italian",    speechCode: "it-IT", ttsCode: "it-IT" },
  { label: "German",     speechCode: "de-DE", ttsCode: "de-DE" },
  { label: "Chinese",    speechCode: "zh-CN", ttsCode: "zh-CN" },
  { label: "Russian",    speechCode: "ru-RU", ttsCode: "ru-RU" },
  { label: "Turkish",    speechCode: "tr-TR", ttsCode: "tr-TR" },
  { label: "Vietnamese", speechCode: "vi-VN", ttsCode: "vi-VN" },
];

type TranslationEntry = {
  id: string;
  original: string;
  translated: string;
  fromLang: string;
  toLang: string;
  toLangCode: string;
  isPlaying: boolean;
};

const SpeechRecognitionAPI =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const ConversationTranslatorPage = () => {
  const navigate = useNavigate();
  const [fromLang, setFromLang] = useState(LANGUAGES[0]);
  const [toLang, setToLang]     = useState(LANGUAGES[1]);
  const [isListening, setIsListening]     = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [interimText, setInterimText]     = useState("");
  const [history, setHistory] = useState<TranslationEntry[]>([]);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
  const recognitionRef  = useRef<any>(null);
  const historyEndRef   = useRef<HTMLDivElement>(null);

  // Check mic permission on mount and listen for changes
  useEffect(() => {
    navigator.permissions?.query({ name: "microphone" as PermissionName }).then((status) => {
      setMicPermission(status.state as any);
      status.onchange = () => setMicPermission(status.state as any);
    }).catch(() => setMicPermission("unknown"));
  }, []);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // ── TTS ──────────────────────────────────────────────────────────────────
  const speakText = useCallback((text: string, langCode: string, entryId?: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Small delay avoids Chrome's cancel() → speak() race condition
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();

      // Pick best voice: exact lang match → prefix match → let browser decide
      const exact  = voices.find(v => v.lang === langCode);
      const prefix = voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
      const voice  = exact ?? prefix ?? null;

      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang ?? langCode;
      utterance.rate = 0.9;

      if (entryId) {
        utterance.onstart = () =>
          setHistory(h => h.map(e => e.id === entryId ? { ...e, isPlaying: true }  : e));
        utterance.onend   = () =>
          setHistory(h => h.map(e => e.id === entryId ? { ...e, isPlaying: false } : e));
      }
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, []);

  // ── Stop recognition ─────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText("");
  }, []);

  // ── Translate & stream ───────────────────────────────────────────────────
  const handleTranslate = useCallback(async (spokenText: string) => {
    if (!spokenText.trim()) return;
    setIsTranslating(true);

    const entryId = Date.now().toString();
    const toLangSnapshot = toLang;

    setHistory(h => [...h, {
      id: entryId,
      original:   spokenText,
      translated: "...",
      fromLang:   fromLang.label,
      toLang:     toLangSnapshot.label,
      toLangCode: toLangSnapshot.ttsCode,
      isPlaying:  false,
    }]);

    let translated = "";
    try {
      await streamChat({
        messages: [{
          role: "user",
          content: `Translate the following from ${fromLang.label} to ${toLangSnapshot.label}. Reply with ONLY the translated text, no explanations:\n\n"${spokenText}"`,
        }],
        feature: "translator",
        onDelta: (chunk) => {
          translated += chunk;
          setHistory(h =>
            h.map(e => e.id === entryId ? { ...e, translated } : e)
          );
        },
        onDone: () => {
          setIsTranslating(false);
          speakText(translated, toLangSnapshot.ttsCode, entryId);
        },
        onError: (err) => {
          toast.error(err);
          setIsTranslating(false);
          setHistory(h =>
            h.map(e => e.id === entryId ? { ...e, translated: "Translation failed" } : e)
          );
        },
      });
    } catch {
      toast.error("Translation failed");
      setIsTranslating(false);
    }
  }, [fromLang, toLang, speakText]);

  // ── Start recognition ────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      toast.error("Speech recognition not supported. Try Chrome or Edge.");
      return;
    }

    // Unlock TTS while we're inside a user-gesture context — Chrome silently
    // blocks speechSynthesis.speak() called later from async callbacks unless
    // it has been "warmed up" by at least one call during a user gesture.
    if (window.speechSynthesis) {
      const unlock = new SpeechSynthesisUtterance("");
      unlock.volume = 0;
      window.speechSynthesis.speak(unlock);
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous     = false;
    recognition.interimResults = true;
    recognition.lang           = fromLang.speechCode;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let interim = "";
      let final   = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      if (final) {
        setInterimText("");
        stopListening();
        handleTranslate(final);
      } else {
        setInterimText(interim);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setInterimText("");
      if (event.error === "aborted") return;
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        toast.error("Microphone access denied. Please allow mic access in your browser settings and try again.");
        return;
      }
      if (event.error === "no-speech") {
        // Silently ignore — user just didn't speak
        return;
      }
      if (event.error === "network") {
        toast.error("Network error with speech recognition. Please check your connection.");
        return;
      }
      if (event.error === "audio-capture") {
        toast.error("No microphone found. Please connect a microphone and try again.");
        return;
      }
      toast.error(`Mic error: ${event.error}. Try again.`);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [fromLang, stopListening, handleTranslate]);

  const swapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
  };

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background">

      {/* Header */}
      <div className="px-5 pt-2 pb-4 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate("/translate")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-sm font-heading font-bold">Voice Translator</h1>
          <p className="text-[10px] text-muted-foreground">Speak — get instant translation</p>
        </div>
      </div>

      {/* Mic permission denied banner */}
      {micPermission === "denied" && (
        <div className="mx-5 mt-3 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-destructive mb-0.5">Microphone access blocked</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Click the <span className="font-medium">🔒 lock icon</span> in your browser's address bar → <span className="font-medium">Site settings</span> → set Microphone to <span className="font-medium">Allow</span>, then reload.
            </p>
          </div>
        </div>
      )}

      {/* Language selectors */}
      <div className="px-5 py-3 flex items-center gap-2">
        <select
          value={fromLang.label}
          onChange={e => setFromLang(LANGUAGES.find(l => l.label === e.target.value)!)}
          className="flex-1 text-sm rounded-xl border border-border bg-card px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {LANGUAGES.map(l => <option key={l.label}>{l.label}</option>)}
        </select>

        <button
          onClick={swapLanguages}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex-shrink-0"
        >
          <ArrowLeftRight className="w-4 h-4 text-primary" />
        </button>

        <select
          value={toLang.label}
          onChange={e => setToLang(LANGUAGES.find(l => l.label === e.target.value)!)}
          className="flex-1 text-sm rounded-xl border border-border bg-card px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {LANGUAGES.map(l => <option key={l.label}>{l.label}</option>)}
        </select>
      </div>

      {/* Translation history */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3">
        {history.length === 0 && !isListening && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center pb-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground">Tap the mic and start speaking</p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              Your speech is translated instantly and spoken aloud in the target language
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {history.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="rounded-2xl overflow-hidden border border-border shadow-sm"
            >
              {/* Original speech */}
              <div className="px-4 py-3 bg-card">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                  {entry.fromLang}
                </p>
                <p className="text-sm text-foreground">{entry.original}</p>
              </div>

              {/* Translated text */}
              <div className="px-4 py-3 bg-primary/5 flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-widest mb-1">
                    {entry.toLang}
                  </p>
                  {entry.translated === "..." ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      {[0, 0.15, 0.3].map((delay) => (
                        <motion.div
                          key={delay}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 0.9, delay }}
                          className="w-1.5 h-1.5 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-foreground">{entry.translated}</p>
                  )}
                </div>

                {entry.translated !== "..." && entry.translated !== "Translation failed" && (
                  <button
                    onClick={() => { window.speechSynthesis?.cancel(); speakText(entry.translated, entry.toLangCode, entry.id); }}
                    className={cn(
                      "p-2 rounded-full transition-all mt-0.5 flex-shrink-0",
                      entry.isPlaying
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={historyEndRef} />
      </div>

      {/* Interim / live transcript */}
      <AnimatePresence>
        {(isListening || interimText) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-2"
          >
            <div className="rounded-xl bg-card border border-border px-4 py-2 flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-2 rounded-full bg-destructive flex-shrink-0"
              />
              <p className="text-sm text-muted-foreground italic truncate">
                {interimText || "Listening…"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big mic button */}
      <div className="flex flex-col items-center pb-8 pt-3 gap-2">
        {history.length > 0 && (
          <button
            onClick={() => { setHistory([]); window.speechSynthesis?.cancel(); }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <RefreshCw className="w-3 h-3" /> New conversation
          </button>
        )}

        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Ripple rings */}
          {isListening && [1.7, 1.4].map((scale, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, scale], opacity: [0.35, 0] }}
              transition={{ repeat: Infinity, duration: 1.3, delay: i * 0.25, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-destructive"
            />
          ))}
          {isTranslating && (
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.25, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-primary"
            />
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={isListening ? stopListening : startListening}
            disabled={isTranslating || micPermission === "denied"}
            className={cn(
              "relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all",
              micPermission === "denied"
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : isListening
                ? "bg-destructive text-white"
                : isTranslating
                ? "bg-primary/50 text-white cursor-not-allowed"
                : "safe-gradient text-white"
            )}
          >
            {micPermission === "denied"
              ? <MicBlocked className="w-8 h-8" />
              : isListening
              ? <MicOff className="w-8 h-8" />
              : <Mic className="w-8 h-8"    />
            }
          </motion.button>
        </div>

        <p className="text-xs font-medium text-muted-foreground">
          {micPermission === "denied"
            ? "Microphone blocked — see instructions above"
            : isTranslating ? "Translating…"
            : isListening   ? "Tap to stop"
            : "Tap to speak"}
        </p>
      </div>
    </div>
  );
};

export default ConversationTranslatorPage;
