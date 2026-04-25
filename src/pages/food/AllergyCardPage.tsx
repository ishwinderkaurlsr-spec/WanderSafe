import { useState, useCallback } from "react";
import { ArrowLeft, Plus, Globe, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/ai-stream";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const commonAllergies = ["Shellfish", "Peanuts", "Tree Nuts", "Gluten", "Dairy", "Eggs", "Soy", "Fish", "Sesame"];
const dietaryOptions = ["Vegetarian", "Vegan", "Halal", "Kosher", "No Pork", "No Beef"];

const LANGUAGES = [
  { code: "ja", name: "Japanese",   flag: "🇯🇵" },
  { code: "fr", name: "French",     flag: "🇫🇷" },
  { code: "ar", name: "Arabic",     flag: "🇸🇦" },
  { code: "th", name: "Thai",       flag: "🇹🇭" },
  { code: "es", name: "Spanish",    flag: "🇪🇸" },
  { code: "de", name: "German",     flag: "🇩🇪" },
  { code: "it", name: "Italian",    flag: "🇮🇹" },
  { code: "ko", name: "Korean",     flag: "🇰🇷" },
  { code: "zh", name: "Chinese",    flag: "🇨🇳" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "hi", name: "Hindi",      flag: "🇮🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
];

type TranslatedItem = { english: string; translated: string };
type CardData = {
  langName: string;
  langFlag: string;
  allergies: TranslatedItem[];
  dietary: TranslatedItem[];
  isLoading: boolean;
};

const AllergyCardPage = () => {
  const navigate = useNavigate();
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(["Shellfish"]);
  const [selectedDietary, setSelectedDietary]     = useState<string[]>([]);
  const [customAllergy, setCustomAllergy]         = useState("");
  const [selectedLang, setSelectedLang]           = useState("ja");
  const [cardData, setCardData]                   = useState<CardData | null>(null);

  const toggle = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const addCustom = () => {
    const trimmed = customAllergy.trim();
    if (trimmed && !selectedAllergies.includes(trimmed)) {
      setSelectedAllergies(prev => [...prev, trimmed]);
      setCustomAllergy("");
    }
  };

  const generateCard = useCallback(async () => {
    const lang = LANGUAGES.find(l => l.code === selectedLang)!;
    const allItems = [
      ...selectedAllergies.map(a => a),
      ...selectedDietary.map(d => d),
    ];
    if (allItems.length === 0) return;

    // Show loading card immediately
    setCardData({
      langName: lang.name,
      langFlag: lang.flag,
      allergies: selectedAllergies.map(a => ({ english: a, translated: "" })),
      dietary:   selectedDietary.map(d => ({ english: d, translated: "" })),
      isLoading: true,
    });

    const itemList = allItems.map(i => `- ${i}`).join("\n");
    const prompt = `Translate each food allergy and dietary term into ${lang.name}. Reply with ONLY a valid JSON object where each key is the English term and each value is the ${lang.name} translation. No extra text.\n\nTerms:\n${itemList}`;

    let result = "";
    await streamChat({
      messages: [{ role: "user", content: prompt }],
      feature: "translator",
      onDelta: chunk => { result += chunk; },
      onDone: () => {
        try {
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          const parsed: Record<string, string> = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
          setCardData(prev => prev ? {
            ...prev,
            isLoading: false,
            allergies: prev.allergies.map(a => ({
              ...a,
              translated: parsed[a.english] ?? parsed[a.english.toLowerCase()] ?? a.english,
            })),
            dietary: prev.dietary.map(d => ({
              ...d,
              translated: parsed[d.english] ?? parsed[d.english.toLowerCase()] ?? d.english,
            })),
          } : null);
        } catch {
          setCardData(prev => prev ? { ...prev, isLoading: false } : null);
          toast.error("Could not parse translation — try again");
        }
      },
      onError: err => {
        toast.error(err);
        setCardData(prev => prev ? { ...prev, isLoading: false } : null);
      },
    });
  }, [selectedAllergies, selectedDietary, selectedLang]);

  const canGenerate = selectedAllergies.length > 0 || selectedDietary.length > 0;
  const customAdded = selectedAllergies.filter(a => !commonAllergies.includes(a));

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/explore")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-heading font-bold">Allergy Card</h1>
          <p className="text-xs text-muted-foreground">AI-translated in 12 languages</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── CARD VIEW ─────────────────────────────────────────────── */}
        {cardData ? (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-5 pb-4 flex flex-col gap-3"
          >
            <div className="p-5 rounded-2xl bg-card border-2 border-primary/30 space-y-4">
              <div className="text-center border-b border-border pb-3">
                <p className="text-xs text-muted-foreground mb-1">
                  {cardData.langFlag} {cardData.langName}
                </p>
                <h2 className="text-lg font-heading font-bold text-destructive">
                  ⚠️ Food Allergy / Dietary Alert
                </h2>
              </div>

              {cardData.isLoading ? (
                <div className="flex flex-col items-center gap-2 py-6">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                  <p className="text-xs text-muted-foreground">Translating with AI…</p>
                </div>
              ) : (
                <>
                  {cardData.allergies.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-destructive uppercase tracking-wider mb-2">
                        ❌ I am allergic to:
                      </p>
                      <div className="space-y-2">
                        {cardData.allergies.map(a => (
                          <div key={a.english}>
                            <p className="text-xl font-bold text-destructive leading-tight">{a.translated}</p>
                            <p className="text-[10px] text-muted-foreground">({a.english})</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cardData.dietary.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-sage uppercase tracking-wider mb-2">
                        🍽️ Dietary restrictions:
                      </p>
                      <div className="space-y-2">
                        {cardData.dietary.map(d => (
                          <div key={d.english}>
                            <p className="text-xl font-bold text-sage leading-tight">{d.translated}</p>
                            <p className="text-[10px] text-muted-foreground">({d.english})</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-center text-muted-foreground italic border-t border-border pt-3">
                    Please ensure my food does not contain these items. Thank you!
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setCardData(null)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Edit Card
              </Button>
              {!cardData.isLoading && (
                <Button
                  onClick={generateCard}
                  variant="outline"
                  className="flex-1 rounded-xl gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retranslate
                </Button>
              )}
            </div>
          </motion.div>

        ) : (
        /* ── EDITOR VIEW ──────────────────────────────────────────── */
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col"
          >
            {/* Allergies */}
            <div className="px-5 mb-4">
              <h3 className="text-sm font-heading font-semibold mb-2">Allergies</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {commonAllergies.map(a => (
                  <button
                    key={a}
                    onClick={() => toggle(a, selectedAllergies, setSelectedAllergies)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      selectedAllergies.includes(a)
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : "bg-card border-border text-muted-foreground"
                    )}
                  >
                    {selectedAllergies.includes(a) && "✓ "}{a}
                  </button>
                ))}
              </div>

              {/* Custom allergy input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom allergy…"
                  value={customAllergy}
                  onChange={e => setCustomAllergy(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addCustom()}
                  className="rounded-xl text-sm"
                />
                <Button size="icon" variant="outline" onClick={addCustom} className="rounded-xl">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {customAdded.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {customAdded.map(a => (
                    <button
                      key={a}
                      onClick={() => setSelectedAllergies(prev => prev.filter(x => x !== a))}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border bg-destructive/10 text-destructive border-destructive/30"
                    >
                      ✓ {a} ×
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dietary restrictions */}
            <div className="px-5 mb-4">
              <h3 className="text-sm font-heading font-semibold mb-2">Dietary Restrictions</h3>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(d => (
                  <button
                    key={d}
                    onClick={() => toggle(d, selectedDietary, setSelectedDietary)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      selectedDietary.includes(d)
                        ? "bg-sage-light text-sage border-sage/30"
                        : "bg-card border-border text-muted-foreground"
                    )}
                  >
                    {selectedDietary.includes(d) && "✓ "}{d}
                  </button>
                ))}
              </div>
            </div>

            {/* Language selector */}
            <div className="px-5 mb-4">
              <h3 className="text-sm font-heading font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> Language
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
                        : "bg-card border-border text-muted-foreground"
                    )}
                  >
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 pb-4">
              <Button
                onClick={generateCard}
                disabled={!canGenerate}
                className="w-full rounded-xl safe-gradient text-primary-foreground"
              >
                ✨ Generate AI Card
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllergyCardPage;
