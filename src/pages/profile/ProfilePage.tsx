import { useState, useEffect } from "react";
import {
  User, Shield, Phone, Heart, ChevronRight, Plus, Settings,
  LogOut, Luggage, Shirt, Users, Sparkles, Pencil, Trash2,
  Check, X, Bell, MapPin, Smartphone, ChevronDown, ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";

// ─── Types ────────────────────────────────────────────────────────────────────
interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

interface MedicalInfo {
  allergies: string;
  bloodType: string;
  medications: string;
  conditions: string;
}

interface AppSettings {
  pushNotifications: boolean;
  shakeForSOS: boolean;
  locationSharing: boolean;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────
const load = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? "") ?? fallback; }
  catch { return fallback; }
};
const save = (key: string, value: unknown) =>
  localStorage.setItem(key, JSON.stringify(value));

// ─── Default values ───────────────────────────────────────────────────────────
const DEFAULT_CONTACTS: EmergencyContact[] = [
  { id: "1", name: "Mom", phone: "+1 555-0123", relation: "Parent" },
  { id: "2", name: "Sarah K.", phone: "+1 555-0456", relation: "Friend" },
];
const DEFAULT_MEDICAL: MedicalInfo = {
  allergies: "Shellfish, Penicillin",
  bloodType: "A+",
  medications: "None",
  conditions: "None",
};
const DEFAULT_SETTINGS: AppSettings = {
  pushNotifications: true,
  shakeForSOS: true,
  locationSharing: false,
};

// ─── Component ────────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Profile name
  const storedName = load<string>("profile_display_name", "");
  const defaultName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Traveler";
  const [displayName, setDisplayName] = useState(storedName || defaultName);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);

  // Emergency contacts
  const [contacts, setContacts] = useState<EmergencyContact[]>(
    load("profile_contacts", DEFAULT_CONTACTS)
  );
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });

  // Medical info
  const [medical, setMedical] = useState<MedicalInfo>(load("profile_medical", DEFAULT_MEDICAL));
  const [editingMedical, setEditingMedical] = useState(false);
  const [medicalDraft, setMedicalDraft] = useState<MedicalInfo>(medical);

  // Settings
  const [settings, setSettings] = useState<AppSettings>(load("profile_settings", DEFAULT_SETTINGS));

  // Travel tools section expand
  const [toolsExpanded, setToolsExpanded] = useState(true);

  // ── Persist on change ──────────────────────────────────────────────────────
  useEffect(() => { save("profile_contacts", contacts); }, [contacts]);
  useEffect(() => { save("profile_medical", medical); }, [medical]);
  useEffect(() => { save("profile_settings", settings); }, [settings]);

  // ── Name editing ───────────────────────────────────────────────────────────
  const saveName = () => {
    const trimmed = nameInput.trim() || defaultName;
    setDisplayName(trimmed);
    save("profile_display_name", trimmed);
    setEditingName(false);
  };

  // ── Emergency contacts ─────────────────────────────────────────────────────
  const addContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;
    setContacts(prev => [...prev, { ...newContact, id: Date.now().toString() }]);
    setNewContact({ name: "", phone: "", relation: "" });
    setShowAddContact(false);
  };
  const removeContact = (id: string) =>
    setContacts(prev => prev.filter(c => c.id !== id));

  // ── Medical info ───────────────────────────────────────────────────────────
  const saveMedical = () => {
    setMedical(medicalDraft);
    setEditingMedical(false);
  };
  const cancelMedical = () => {
    setMedicalDraft(medical);
    setEditingMedical(false);
  };

  // ── Settings ───────────────────────────────────────────────────────────────
  const toggleSetting = (key: keyof AppSettings) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Helpers ────────────────────────────────────────────────────────────────
  const initials = displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const travelTools = [
    { icon: Luggage, label: "Packing Assistant", desc: "AI-powered packing lists", path: "/profile/packing", badge: "AI" },
    { icon: Shirt, label: "Outfit Advisor", desc: "Daily outfit suggestions", path: "/profile/outfit", badge: "AI" },
    { icon: Sparkles, label: "Capsule Wardrobe", desc: "Mix-and-match guide", path: "/profile/capsule" },
    { icon: Users, label: "Travelers Nearby", desc: "Meet verified women travelers", path: "/profile/social", badge: "New" },
  ];

  const settingsList = [
    { key: "pushNotifications" as const, icon: Bell, label: "Push notifications", desc: "Safety alerts and reminders" },
    { key: "shakeForSOS" as const, icon: Smartphone, label: "Shake for SOS", desc: "Shake phone to trigger emergency alert" },
    { key: "locationSharing" as const, icon: MapPin, label: "Location sharing default", desc: "Auto-share when in transit" },
  ];

  return (
    <div className="flex flex-col min-h-full pb-8">

      {/* ── Header ── */}
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-heading font-bold">Profile</h1>
      </div>

      {/* ── Profile card ── */}
      <div className="mx-5 p-5 rounded-2xl safe-gradient text-primary-foreground mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xl font-bold text-primary-foreground select-none">
            {initials || <User className="w-8 h-8" />}
          </div>
          <div className="flex-1 min-w-0">
            {/* Editable name */}
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                  className="bg-primary-foreground/20 rounded-lg px-2 py-1 text-sm font-bold text-primary-foreground placeholder:text-primary-foreground/50 outline-none w-full"
                  placeholder="Your name"
                />
                <button onClick={saveName} className="p-1 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setEditingName(false)} className="p-1 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-bold truncate">{displayName}</h2>
                <button onClick={() => { setNameInput(displayName); setEditingName(true); }} className="p-1 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30">
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            )}
            <p className="text-sm text-primary-foreground/70 truncate">{user?.email ?? "Not signed in"}</p>
            <div className="flex items-center gap-1 mt-1">
              <Shield className="w-3 h-3" />
              <span className="text-xs">Safety features active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sign-in prompt (unauthenticated) ── */}
      {!user && (
        <div className="mx-5 mb-4 p-4 rounded-2xl bg-card border border-border text-center">
          <p className="text-sm text-muted-foreground mb-3">Sign in to save preferences and sync across devices</p>
          <Button onClick={() => navigate("/auth")} className="rounded-xl safe-gradient text-primary-foreground">
            Sign In
          </Button>
        </div>
      )}

      {/* ── Travel Tools ── */}
      <div className="mx-5 mb-4">
        <button
          onClick={() => setToolsExpanded(v => !v)}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="text-sm font-heading font-semibold">Travel Tools</h3>
          {toolsExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {toolsExpanded && (
          <div className="space-y-2">
            {travelTools.map(f => (
              <button
                key={f.label}
                onClick={() => navigate(f.path)}
                className="flex items-center gap-3 w-full p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{f.label}</p>
                    {"badge" in f && f.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{f.badge}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Emergency Contacts ── */}
      <div className="mx-5 mb-4">
        <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" /> Emergency Contacts
        </h3>
        <div className="space-y-2">
          {contacts.map(contact => (
            <div key={contact.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <div className="w-9 h-9 rounded-full bg-coral-light flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.phone} {contact.relation && `· ${contact.relation}`}</p>
              </div>
              <button
                onClick={() => removeContact(contact.id)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Add contact form */}
          {showAddContact ? (
            <div className="p-3 rounded-xl bg-card border border-primary/30 space-y-2">
              <input
                autoFocus
                placeholder="Name *"
                value={newContact.name}
                onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary/50"
              />
              <input
                placeholder="Phone number *"
                value={newContact.phone}
                onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary/50"
              />
              <input
                placeholder="Relation (e.g. Friend, Parent)"
                value={newContact.relation}
                onChange={e => setNewContact(p => ({ ...p, relation: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary/50"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={addContact} className="flex-1 rounded-lg safe-gradient text-primary-foreground text-xs">
                  Save Contact
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setShowAddContact(false); setNewContact({ name: "", phone: "", relation: "" }); }} className="flex-1 rounded-lg text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddContact(true)}
              className="flex items-center gap-3 w-full p-3 rounded-xl border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add emergency contact</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Medical Info ── */}
      <div className="mx-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-heading font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" /> Medical Info
          </h3>
          {!editingMedical ? (
            <button
              onClick={() => { setMedicalDraft(medical); setEditingMedical(true); }}
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={saveMedical} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                <Check className="w-3 h-3" /> Save
              </button>
              <button onClick={cancelMedical} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
          {(
            [
              { key: "allergies" as const, label: "Allergies" },
              { key: "bloodType" as const, label: "Blood Type" },
              { key: "medications" as const, label: "Medications" },
              { key: "conditions" as const, label: "Medical Conditions" },
            ] as const
          ).map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground">{label}</label>
              {editingMedical ? (
                <input
                  value={medicalDraft[key]}
                  onChange={e => setMedicalDraft(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full text-sm px-2 py-1 mt-0.5 rounded-lg border border-border bg-background outline-none focus:border-primary/50"
                />
              ) : (
                <p className="text-sm font-medium mt-0.5">{medical[key] || "—"}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Settings ── */}
      <div className="mx-5 mb-4">
        <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" /> Settings
        </h3>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
          {settingsList.map(({ key, icon: Icon, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-coral-light flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{desc}</p>
                </div>
              </div>
              <Switch
                checked={settings[key]}
                onCheckedChange={() => toggleSetting(key)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Premium CTA ── */}
      <div className="mx-5 mb-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-heading font-bold">SafeHer Premium</p>
            <p className="text-xs text-muted-foreground">Unlock AI concierge, unlimited translations & more</p>
          </div>
          <Button size="sm" className="rounded-xl safe-gradient text-primary-foreground text-xs flex-shrink-0">
            Upgrade
          </Button>
        </div>
      </div>

      {/* ── Sign out ── */}
      <div className="mx-5">
        {user ? (
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <User className="w-4 h-4" /> Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
