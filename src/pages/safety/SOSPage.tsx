import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Phone, MapPin, Wifi, WifiOff, ChevronRight, AlertTriangle, Train, Car, Route, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GPSCoords {
  lat: number;
  lng: number;
}

const formatCoords = (coords: GPSCoords): string => {
  const latDir = coords.lat >= 0 ? "N" : "S";
  const lngDir = coords.lng >= 0 ? "E" : "W";
  return `GPS: ${Math.abs(coords.lat).toFixed(2)}°${latDir}, ${Math.abs(coords.lng).toFixed(2)}°${lngDir}`;
};

const SOSPage = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isOffline] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<GPSCoords | null>(null);
  const [gpsLabel, setGpsLabel] = useState("Locating...");
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsLabel("GPS unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: GPSCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setGpsCoords(coords);
        setGpsLabel(formatCoords(coords));
      },
      () => {
        setGpsLabel("GPS unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSOSPress = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsActivated(true);
          setTimeout(() => { setIsActivated(false); setCountdown(null); }, 4000);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCancel = () => { setCountdown(null); setIsActivated(false); };

  const alertLocationText = gpsCoords
    ? formatCoords(gpsCoords)
    : "GPS location unavailable";

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-heading font-bold text-foreground">Safety</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your safety is our priority</p>
      </div>

      <div className="px-5 mb-4">
        <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium", isOffline ? "bg-amber-warm/20 text-amber-warm" : "bg-sage-light text-sage")}>
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          {isOffline ? "Offline — SMS fallback active" : "Connected — all systems active"}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-4">
        <AnimatePresence mode="wait">
          {isActivated ? (
            <motion.div key="activated" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-sage flex items-center justify-center"><Shield className="w-16 h-16 text-primary-foreground" /></div>
              <h2 className="text-xl font-heading font-bold text-sage">Alert Sent!</h2>
              <p className="text-sm text-muted-foreground text-center max-w-[260px]">
                Emergency contacts, local police, and nearest embassy have been notified.
              </p>
              <p className="text-xs font-medium text-muted-foreground bg-card border border-border rounded-lg px-3 py-1.5">
                {alertLocationText}
              </p>
            </motion.div>
          ) : countdown !== null ? (
            <motion.div key="countdown" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex flex-col items-center gap-6">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="relative">
                <div className="w-40 h-40 rounded-full bg-destructive flex items-center justify-center"><span className="text-6xl font-heading font-bold text-primary-foreground">{countdown}</span></div>
                <div className="absolute inset-0 rounded-full border-4 border-destructive animate-pulse-ring" />
              </motion.div>
              <p className="text-sm font-medium text-destructive">Sending alert in {countdown}...</p>
              <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
            </motion.div>
          ) : (
            <motion.div key="default" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex flex-col items-center gap-4">
              {/* GPS badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border text-[11px] font-medium text-muted-foreground">
                <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                {gpsLabel}
              </div>

              <motion.button
                onClick={handleSOSPress}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-ring" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-ring [animation-delay:0.5s]" />
                <div className="w-44 h-44 rounded-full safe-gradient shadow-warm-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition-shadow hover:shadow-warm-lg">
                  <AlertTriangle className="w-12 h-12 text-primary-foreground" />
                  <span className="text-2xl font-heading font-extrabold text-primary-foreground">SOS</span>
                </div>
              </motion.button>

              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Tap for SOS</p>
              <p className="text-xs text-muted-foreground text-center max-w-[200px]">Sends your GPS to police, embassy, and emergency contacts</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 pb-4">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { icon: Phone, label: "Fake Call", desc: "Simulate an incoming call", path: "/safety/fake-call" },
            { icon: MapPin, label: "Share Live Location", desc: "With trusted contacts", path: "/safety/location", comingSoon: true },
            { icon: Shield, label: "Safe Transport", desc: "Verified taxi & rideshare", path: "/safety/transport" },
            { icon: Train, label: "Transit Guide", desc: "City transit with safety layer", path: "/safety/transit" },
            { icon: Car, label: "Ride Verification", desc: "Verify & track your ride", path: "/safety/ride-verify" },
            { icon: Route, label: "Journey Planner", desc: "Safety-first route planning", path: "/safety/journey" },
            { icon: UsersIcon, label: "Women-Only Transport", desc: "Women-only carriages & rides", path: "/safety/women-transport" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => !action.comingSoon && navigate(action.path)}
              disabled={action.comingSoon}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all group",
                action.comingSoon
                  ? "bg-muted/50 border-border opacity-60 cursor-not-allowed"
                  : "bg-card border-border hover:border-primary/30"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", action.comingSoon ? "bg-muted" : "bg-coral-light")}>
                <action.icon className={cn("w-5 h-5", action.comingSoon ? "text-muted-foreground" : "text-primary")} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className={cn("text-sm font-medium", action.comingSoon ? "text-muted-foreground" : "text-foreground")}>{action.label}</p>
                  {action.comingSoon && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted-foreground/20 text-muted-foreground font-medium whitespace-nowrap">Coming Soon</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
              {!action.comingSoon && <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SOSPage;
