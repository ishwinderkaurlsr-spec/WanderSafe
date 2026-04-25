import { useState, useEffect } from "react";
import { ArrowLeft, Download, Check, Trash2, WifiOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCities } from "@/hooks/use-cities";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STORAGE_KEY = "wandersafe_offline_packs";

const PACK_CONTENTS = [
  "Emergency numbers", "Safety scores", "Cultural tips",
  "Do's & Don'ts", "Safe areas", "Emergency phrases",
];

type PackMeta = {
  cityId: string;
  cityName: string;
  downloadedAt: string;
  sizeKB: number;
};

const OfflinePacksPage = () => {
  const navigate = useNavigate();
  const { data: cities, isLoading } = useCities();

  const [downloading, setDownloading]   = useState<string | null>(null);
  const [progress, setProgress]         = useState(0);
  const [packs, setPacks]               = useState<Record<string, PackMeta>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch { return {}; }
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packs));
  }, [packs]);

  const handleDownload = async (cityId: string, cityName: string) => {
    setDownloading(cityId);
    setProgress(0);

    // ── Tick progress while fetching ──────────────────────────────
    let fakeProgress = 0;
    const ticker = setInterval(() => {
      fakeProgress = Math.min(fakeProgress + 6, 85);
      setProgress(fakeProgress);
    }, 150);

    try {
      // Fetch city data + safety details + emergency phrases in parallel
      const [cityRes, safetyRes, phrasesRes] = await Promise.all([
        supabase.from("cities").select("*").eq("id", cityId).single(),
        supabase.from("city_safety_details").select("*").eq("city_id", cityId).maybeSingle(),
        supabase.from("emergency_phrases").select("*").eq("city_id", cityId).limit(40),
      ]);

      const packData = {
        city:    cityRes.data,
        safety:  safetyRes.data,
        phrases: phrasesRes.data ?? [],
        cachedAt: new Date().toISOString(),
      };

      const json    = JSON.stringify(packData);
      const sizeKB  = Math.round(new TextEncoder().encode(json).length / 1024);

      // Save pack data
      localStorage.setItem(`wandersafe_pack_${cityId}`, json);

      clearInterval(ticker);
      setProgress(100);

      setTimeout(() => {
        setPacks(prev => ({
          ...prev,
          [cityId]: {
            cityId,
            cityName,
            downloadedAt: new Date().toLocaleDateString(),
            sizeKB,
          },
        }));
        setDownloading(null);
        setProgress(0);
        toast.success(`${cityName} pack saved for offline use`);
      }, 400);

    } catch (err) {
      clearInterval(ticker);
      setDownloading(null);
      setProgress(0);
      toast.error("Download failed — check your connection");
    }
  };

  const handleDelete = (cityId: string, cityName: string) => {
    localStorage.removeItem(`wandersafe_pack_${cityId}`);
    setPacks(prev => {
      const next = { ...prev };
      delete next[cityId];
      return next;
    });
    toast.success(`${cityName} pack removed`);
  };

  const totalSizeKB = Object.values(packs).reduce((sum, p) => sum + p.sizeKB, 0);

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/explore")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-heading font-bold">Offline Packs</h1>
          <p className="text-xs text-muted-foreground">Download before you go</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="mx-5 mb-4 p-3 rounded-xl bg-coral-light/50 border border-primary/20 flex items-start gap-2">
        <WifiOff className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-foreground">
          Download city packs for offline access to emergency numbers, safety info, cultural tips, and phrases — no internet needed.
        </p>
      </div>

      {/* Storage used */}
      {Object.keys(packs).length > 0 && (
        <div className="mx-5 mb-4 px-4 py-2.5 rounded-xl bg-card border border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {Object.keys(packs).length} pack{Object.keys(packs).length !== 1 ? "s" : ""} downloaded
          </p>
          <p className="text-xs font-semibold text-foreground">
            {totalSizeKB < 1024
              ? `${totalSizeKB} KB`
              : `${(totalSizeKB / 1024).toFixed(1)} MB`} used
          </p>
        </div>
      )}

      {/* City list */}
      <div className="px-5 pb-4 space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          : (cities ?? []).map(city => {
              const pack          = packs[city.id];
              const isDownloaded  = !!pack;
              const isDownloading = downloading === city.id;

              return (
                <div key={city.id} className="p-4 rounded-2xl bg-card border border-border">
                  {/* City title row */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-heading font-bold">{city.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {city.country}
                        {pack && ` · ${pack.sizeKB} KB · Saved ${pack.downloadedAt}`}
                      </p>
                    </div>
                    {isDownloaded && (
                      <button
                        onClick={() => handleDelete(city.id, city.name)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* What's included */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {PACK_CONTENTS.map(item => (
                      <span
                        key={item}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full",
                          isDownloaded
                            ? "bg-sage-light text-sage"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {isDownloaded && "✓ "}{item}
                      </span>
                    ))}
                  </div>

                  {/* Progress / buttons */}
                  {isDownloading ? (
                    <div className="space-y-1.5">
                      <Progress value={progress} className="h-2" />
                      <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Downloading… {Math.round(progress)}%
                      </p>
                    </div>
                  ) : isDownloaded ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-xl text-sage border-sage/30 gap-1.5"
                      onClick={() => handleDelete(city.id, city.name)}
                    >
                      <Check className="w-4 h-4" /> Downloaded — tap to remove
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleDownload(city.id, city.name)}
                      className="w-full rounded-xl safe-gradient text-primary-foreground gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Download Pack
                    </Button>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default OfflinePacksPage;
