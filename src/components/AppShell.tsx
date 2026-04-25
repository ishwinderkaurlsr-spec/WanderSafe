import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Shield, Globe, Languages, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "safety", label: "Safety", icon: Shield, path: "/safety" },
  { id: "explore", label: "Explore", icon: Globe, path: "/explore" },
  { id: "translate", label: "Translate", icon: Languages, path: "/translate" },
  { id: "health", label: "Health", icon: Heart, path: "/health" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = tabs.find(t => location.pathname.startsWith(t.path))?.id || "safety";

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="w-full max-w-[390px] h-[844px] bg-background phone-frame overflow-hidden flex flex-col relative">
        {/* Status Bar */}
        <div className="h-12 flex items-center justify-between px-6 pt-2 bg-background z-10">
          <span className="text-xs font-medium text-muted-foreground">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2.5 border border-muted-foreground rounded-sm relative">
              <div className="absolute inset-[1px] right-[2px] bg-sage rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <Outlet />
        </div>

        {/* Bottom Navigation */}
        <div className="bg-card border-t border-border px-2 pb-6 pt-2">
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
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-200",
                    isActive && "bg-coral-light"
                  )}>
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium",
                    isActive && "font-semibold"
                  )}>
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
