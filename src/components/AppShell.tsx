import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Shield, Globe, Languages, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "safety",    label: "Safety",    icon: Shield,    path: "/safety" },
  { id: "translate", label: "Translate", icon: Languages, path: "/translate" },
  { id: "explore",   label: "Explore",   icon: Globe,     path: "/explore" },
  { id: "health",    label: "Health",    icon: Heart,     path: "/health" },
  { id: "profile",   label: "Profile",   icon: User,      path: "/profile" },
];

const AppShell = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const activeTab = tabs.find(t => location.pathname.startsWith(t.path))?.id || "explore";

  return (
    /*
     * Mobile  (<md): full-screen flex column — no phone frame, no outer padding.
     *               Nav sits at bottom via flex layout + safe-area padding.
     * Desktop (md+): centred phone-frame simulation with outer muted bg.
     */
    <div className="md:min-h-screen md:bg-muted md:flex md:items-center md:justify-center md:p-4">
      <div
        className={cn(
          // shared
          "flex flex-col bg-background w-full relative",
          // mobile: true full-screen, no rounded frame
          "h-dvh md:h-[844px]",
          // desktop: phone frame look
          "md:max-w-[390px] md:phone-frame md:overflow-hidden"
        )}
      >
        {/* Fake status bar — only on desktop phone-frame */}
        <div className="hidden md:flex h-12 flex-shrink-0 items-center justify-between px-6 pt-2 bg-background z-10">
          <span className="text-xs font-medium text-muted-foreground">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2.5 border border-muted-foreground rounded-sm relative">
              <div className="absolute inset-[1px] right-[2px] bg-sage rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Scrollable content — overflow-x-hidden prevents horizontal scroll on all tabs */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar min-h-0">
          <Outlet />
        </div>

        {/* Bottom nav — flex-shrink-0 keeps it pinned at bottom of the flex column.
            Uses env(safe-area-inset-bottom) so it clears the iPhone home indicator. */}
        <div
          className="flex-shrink-0 bg-card border-t border-border px-2 pt-2"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)" }}
        >
          <nav className="flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={cn(
                    "flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-200",
                    isActive && "bg-coral-light"
                  )}>
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
