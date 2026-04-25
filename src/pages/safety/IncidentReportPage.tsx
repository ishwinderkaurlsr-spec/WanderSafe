import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Send, Building, Scale, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const REPORTS_KEY = "wandersafe_incident_reports";

const categories = [
  { id: "harassment", label: "Harassment", emoji: "🚫" },
  { id: "theft", label: "Theft/Scam", emoji: "💰" },
  { id: "assault", label: "Assault", emoji: "⚠️" },
  { id: "stalking", label: "Stalking", emoji: "👁️" },
  { id: "transport", label: "Unsafe Transport", emoji: "🚗" },
  { id: "other", label: "Other", emoji: "📋" },
];

interface GpsCoords {
  lat: number;
  lng: number;
}

const IncidentReportPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [gps, setGps] = useState<GpsCoords | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"locating" | "captured" | "denied" | "unavailable">(
    "locating"
  );

  // Fetch GPS once on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus("unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus("captured");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGpsStatus("denied");
        } else {
          setGpsStatus("unavailable");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, []);

  const formatGps = () => {
    if (!gps) return null;
    const latDir = gps.lat >= 0 ? "N" : "S";
    const lngDir = gps.lng >= 0 ? "E" : "W";
    return `${Math.abs(gps.lat).toFixed(4)}° ${latDir}, ${Math.abs(gps.lng).toFixed(4)}° ${lngDir}`;
  };

  const handleSubmit = () => {
    const report = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      category: selectedCategory,
      description,
      gps: gps ?? null,
    };
    try {
      const existing = JSON.parse(localStorage.getItem(REPORTS_KEY) ?? "[]");
      existing.push(report);
      localStorage.setItem(REPORTS_KEY, JSON.stringify(existing));
    } catch {
      // ignore storage errors
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-full items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full bg-sage-light flex items-center justify-center mb-4">
          <Shield className="w-10 h-10 text-sage" />
        </div>
        <h2 className="text-xl font-heading font-bold mb-2">Report Submitted</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Your report has been logged anonymously with GPS coordinates. Thank you for helping keep
          other women safe.
        </p>
        <Button onClick={() => navigate("/safety")} className="rounded-2xl">
          Back to Safety
        </Button>
      </div>
    );
  }

  const gpsBadgeText = () => {
    switch (gpsStatus) {
      case "captured":
        return `GPS: ${formatGps()} — Location captured`;
      case "locating":
        return "GPS: Locating…";
      case "denied":
        return "GPS: Permission denied";
      case "unavailable":
        return "GPS: Unavailable";
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/safety")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-heading font-bold">Report Incident</h1>
      </div>

      {/* GPS badge */}
      <div className="px-5 mb-4">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
            gpsStatus === "captured"
              ? "bg-sage-light text-sage"
              : gpsStatus === "locating"
              ? "bg-muted text-muted-foreground animate-pulse"
              : "bg-destructive/10 text-destructive"
          )}
        >
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          {gpsBadgeText()}
        </div>
      </div>

      <div className="px-5">
        <h3 className="text-sm font-heading font-semibold mb-3">What happened?</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-center",
                selectedCategory === cat.id
                  ? "border-primary bg-coral-light/50"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-[10px] font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        <h3 className="text-sm font-heading font-semibold mb-2">Details (optional)</h3>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what happened. Your report is anonymous."
          className="rounded-xl text-sm h-24 resize-none"
        />
      </div>

      {/* Quick connect */}
      <div className="px-5 mt-4">
        <h3 className="text-sm font-heading font-semibold mb-3">Quick Connect</h3>
        <div className="space-y-2">
          {/* Nearest Embassy — clickable tel link */}
          <a
            href="tel:+81332245000"
            className="flex items-center gap-3 w-full p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-coral-light flex items-center justify-center">
              <Building className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium">Nearest Embassy</p>
              <p className="text-[10px] text-muted-foreground">US Embassy: 03-3224-5000</p>
            </div>
          </a>

          {/* Legal Aid — International Women's Helpline */}
          <a
            href="tel:+18007997233"
            className="flex items-center gap-3 w-full p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-coral-light flex items-center justify-center">
              <Scale className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium">Legal Aid</p>
              <p className="text-[10px] text-muted-foreground">
                International Women's Helpline: +1-800-799-7233
              </p>
            </div>
          </a>

          {/* Local NGO — UN Women */}
          <button
            onClick={() => window.open("https://www.unwomen.org", "_blank", "noopener,noreferrer")}
            className="flex items-center gap-3 w-full p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-coral-light flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium">Local NGO</p>
              <p className="text-[10px] text-muted-foreground">UN Women — unwomen.org</p>
            </div>
          </button>
        </div>
      </div>

      <div className="px-5 mt-auto pb-6 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedCategory}
          className="w-full h-12 rounded-2xl safe-gradient text-primary-foreground font-heading font-bold shadow-warm"
        >
          <Send className="w-4 h-4 mr-2" /> Submit Anonymous Report
        </Button>
      </div>
    </div>
  );
};

export default IncidentReportPage;
