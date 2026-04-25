import { useState } from "react";
import { User, Shield, Phone, Heart, ChevronRight, Plus, Settings, LogOut, Luggage, Shirt, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Traveler";

  const emergencyContacts = [
    { name: "Mom", phone: "+1 555-0123" },
    { name: "Sarah K.", phone: "+1 555-0456" },
  ];

  const phase2Features = [
    { icon: Luggage, label: "Packing Assistant", desc: "AI-powered packing lists", path: "/profile/packing", badge: "AI" },
    { icon: Shirt, label: "Outfit Advisor", desc: "Daily outfit suggestions", path: "/profile/outfit", badge: "AI" },
    { icon: Sparkles, label: "Capsule Wardrobe", desc: "Mix-and-match guide", path: "/profile/capsule" },
    { icon: Users, label: "Travelers Nearby", desc: "Meet verified women travelers", path: "/profile/social", badge: "New" },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-heading font-bold">Profile</h1>
      </div>
      <div className="mx-5 p-5 rounded-2xl safe-gradient text-primary-foreground mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center"><User className="w-8 h-8 text-primary-foreground" /></div>
          <div>
            <h2 className="text-lg font-heading font-bold">{displayName}</h2>
            <p className="text-sm text-primary-foreground/70">{user?.email}</p>
            <div className="flex items-center gap-1 mt-1"><Shield className="w-3 h-3" /><span className="text-xs">Safety features active</span></div>
          </div>
        </div>
      </div>

      {!user && (
        <div className="mx-5 mb-4 p-4 rounded-2xl bg-card border border-border text-center">
          <p className="text-sm text-muted-foreground mb-3">Sign in to save your preferences and sync across devices</p>
          <Button onClick={() => navigate("/auth")} className="rounded-xl safe-gradient text-primary-foreground">Sign In</Button>
        </div>
      )}

      <div className="mx-5 mb-4">
        <h3 className="text-sm font-heading font-semibold mb-3">Travel Tools</h3>
        <div className="space-y-2">
          {phase2Features.map(f => (
            <button key={f.label} onClick={() => navigate(f.path)} className="flex items-center gap-3 w-full p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center flex-shrink-0"><f.icon className="w-5 h-5 text-primary" /></div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{f.label}</p>
                  {"badge" in f && f.badge && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{f.badge}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <div className="mx-5 mb-4">
        <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Emergency Contacts</h3>
        <div className="space-y-2">
          {emergencyContacts.map((contact, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
              <div className="w-9 h-9 rounded-full bg-coral-light flex items-center justify-center text-xs font-bold text-primary">{contact.name.charAt(0)}</div>
              <div className="flex-1"><p className="text-sm font-medium">{contact.name}</p><p className="text-xs text-muted-foreground">{contact.phone}</p></div>
            </div>
          ))}
          <button className="flex items-center gap-3 w-full p-3 rounded-xl border border-dashed border-muted-foreground/40 text-muted-foreground"><Plus className="w-5 h-5" /><span className="text-sm">Add emergency contact</span></button>
        </div>
      </div>

      <div className="mx-5 mb-4">
        <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2"><Heart className="w-4 h-4 text-primary" /> Medical Info</h3>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
          <div><label className="text-xs text-muted-foreground">Allergies</label><p className="text-sm font-medium">Shellfish, Penicillin</p></div>
          <div><label className="text-xs text-muted-foreground">Blood Type</label><p className="text-sm font-medium">A+</p></div>
          <div><label className="text-xs text-muted-foreground">Medications</label><p className="text-sm font-medium">None</p></div>
        </div>
      </div>

      <div className="mx-5 mb-4">
        <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Settings</h3>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
          {[
            { label: "Push notifications", desc: "Safety alerts and reminders" },
            { label: "Shake for SOS", desc: "Shake phone to trigger emergency alert" },
            { label: "Location sharing default", desc: "Auto-share when in transit" },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between">
              <div><p className="text-sm font-medium">{setting.label}</p><p className="text-[10px] text-muted-foreground">{setting.desc}</p></div>
              <Switch defaultChecked />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-5 mb-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-heading font-bold">SafeHer Premium</p>
            <p className="text-xs text-muted-foreground">Unlock AI concierge, unlimited translations & more</p>
          </div>
          <Button size="sm" className="rounded-xl safe-gradient text-primary-foreground text-xs">Upgrade</Button>
        </div>
      </div>

      <div className="mx-5 pb-6">
        {user ? (
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"><LogOut className="w-4 h-4" /> Sign Out</button>
        ) : (
          <button onClick={() => navigate("/auth")} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"><User className="w-4 h-4" /> Sign In</button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
