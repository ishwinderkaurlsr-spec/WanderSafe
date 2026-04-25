import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MapPin, Users, Bell, Plus, Shield, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "wandersafe_trusted_contacts";

interface Contact {
  id: string;
  name: string;
  phone: string;
  initials: string;
  active: boolean;
}

interface GeoState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  status: "pending" | "ok" | "denied" | "unavailable";
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function loadContacts(): Contact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Contact[];
  } catch {
    // ignore parse errors
  }
  return [
    { id: "1", name: "Mom", phone: "", initials: "MM", active: true },
    { id: "2", name: "Sarah K.", phone: "", initials: "SK", active: true },
  ];
}

const LocationSharingPage = () => {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(loadContacts);
  const [geo, setGeo] = useState<GeoState>({ lat: null, lng: null, accuracy: null, status: "pending" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const watchIdRef = useRef<number | null>(null);

  // Persist contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  // Start/stop geolocation watch based on isSharing toggle
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeo((g) => ({ ...g, status: "unavailable" }));
      return;
    }

    if (isSharing) {
      setGeo({ lat: null, lng: null, accuracy: null, status: "pending" });
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setGeo({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            status: "ok",
          });
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setGeo({ lat: null, lng: null, accuracy: null, status: "denied" });
          } else {
            setGeo({ lat: null, lng: null, accuracy: null, status: "unavailable" });
          }
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
      );
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setGeo({ lat: null, lng: null, accuracy: null, status: "pending" });
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isSharing]);

  const toggleContact = (id: string) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const handleAddContact = () => {
    const trimmedName = newName.trim();
    const trimmedPhone = newPhone.trim();
    if (!trimmedName) return;
    const newContact: Contact = {
      id: Date.now().toString(),
      name: trimmedName,
      phone: trimmedPhone,
      initials: getInitials(trimmedName),
      active: true,
    };
    setContacts((prev) => [...prev, newContact]);
    setNewName("");
    setNewPhone("");
    setShowAddForm(false);
  };

  const activeCount = contacts.filter((c) => c.active).length;

  const mapStatusContent = () => {
    if (!isSharing) {
      return (
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <MapPin className="w-5 h-5 text-muted-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Enable sharing to see your location</span>
        </div>
      );
    }
    if (geo.status === "denied") {
      return (
        <div className="flex flex-col items-center gap-1 z-10 px-4 text-center">
          <MapPin className="w-5 h-5 text-destructive" />
          <span className="text-xs font-medium text-destructive">Location permission denied</span>
          <span className="text-[10px] text-muted-foreground">Please allow location access in your browser settings</span>
        </div>
      );
    }
    if (geo.status === "unavailable") {
      return (
        <div className="flex flex-col items-center gap-1 z-10 px-4 text-center">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Location unavailable</span>
        </div>
      );
    }
    if (geo.status === "pending") {
      return (
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Locating…</span>
        </div>
      );
    }
    // geo.status === "ok"
    return (
      <div className="flex flex-col items-center gap-2 z-10">
        {/* Pulsing live dot */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full bg-primary/30 animate-ping" />
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-warm z-10">
            <MapPin className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center shadow-sm">
          <p className="text-[11px] font-semibold text-foreground leading-tight">
            {geo.lat!.toFixed(5)}° {geo.lat! >= 0 ? "N" : "S"},{" "}
            {Math.abs(geo.lng!).toFixed(5)}° {geo.lng! >= 0 ? "E" : "W"}
          </p>
          {geo.accuracy !== null && (
            <p className="text-[9px] text-muted-foreground mt-0.5">
              ±{Math.round(geo.accuracy)} m accuracy
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/safety")} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-heading font-bold text-foreground">Live Location</h1>
      </div>

      {/* Live map area */}
      <div className="mx-5 h-48 rounded-2xl bg-sage-light border border-border flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, hsl(var(--sage)) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {mapStatusContent()}
      </div>

      {/* Share toggle */}
      <div className="mx-5 mt-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                isSharing ? "bg-sage-light" : "bg-muted"
              )}
            >
              <Shield
                className={cn("w-5 h-5", isSharing ? "text-sage" : "text-muted-foreground")}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Share My Location</p>
              <p className="text-xs text-muted-foreground">
                {isSharing
                  ? `Sharing with ${activeCount} contact${activeCount !== 1 ? "s" : ""}`
                  : "Currently not sharing"}
              </p>
            </div>
          </div>
          <Switch checked={isSharing} onCheckedChange={setIsSharing} />
        </div>
      </div>

      {/* Auto-alerts */}
      <div className="mx-5 mt-3 p-4 rounded-2xl bg-card border border-border">
        <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" /> Auto-Alerts
        </h3>
        <div className="space-y-2.5">
          {[
            { label: "Route deviation alert", desc: "If you leave your planned path" },
            { label: "Stopped moving alert", desc: "If no movement for 15+ minutes" },
            { label: "Phone dies alert", desc: "Last known location sent if battery critical" },
          ].map((alert) => (
            <div key={alert.label} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-foreground">{alert.label}</p>
                <p className="text-[10px] text-muted-foreground">{alert.desc}</p>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      {/* Trusted contacts */}
      <div className="mx-5 mt-3 pb-4">
        <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" /> Trusted Circle
        </h3>
        <div className="space-y-2">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => toggleContact(contact.id)}
              className={cn(
                "flex items-center gap-3 w-full p-3 rounded-xl border transition-all",
                contact.active
                  ? "border-primary/30 bg-coral-light/50"
                  : "border-border bg-card"
              )}
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                {contact.initials}
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium block">{contact.name}</span>
                {contact.phone ? (
                  <span className="text-[10px] text-muted-foreground">{contact.phone}</span>
                ) : null}
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2",
                  contact.active ? "bg-primary border-primary" : "border-muted-foreground"
                )}
              />
            </button>
          ))}

          {/* Inline add contact form */}
          {showAddForm ? (
            <div className="p-3 rounded-xl border border-primary/40 bg-card space-y-2">
              <input
                type="text"
                placeholder="Full name *"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary transition-colors"
                autoFocus
              />
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full text-sm rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary transition-colors"
              />
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleAddContact}
                  disabled={!newName.trim()}
                  className="flex-1 rounded-xl h-8 text-xs"
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewName("");
                    setNewPhone("");
                  }}
                  className="flex-1 rounded-xl h-8 text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-3 w-full p-3 rounded-xl border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary/40 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add trusted contact</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSharingPage;
