import { ArrowLeft, Shield, Train, Bus, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cities } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const womenOnlyServices = [
  { city: "tokyo", services: [{ name: "JR Women-Only Cars", type: "train", hours: "7:00-9:30 AM weekdays", description: "Pink-signed cars at front of major lines. Strictly women-only during rush.", available: true }, { name: "Tokyo Metro Women Cars", type: "train", hours: "7:00-9:30 AM weekdays", description: "Available on Marunouchi, Yurakucho, and other major lines.", available: true }] },
  { city: "mexico-city", services: [{ name: "Metro Women/Children Cars", type: "train", hours: "Rush hours", description: "First 2 cars of each train reserved for women and children.", available: true }, { name: "DiDi Mujer", type: "rideshare", hours: "24/7", description: "Women drivers matched with women passengers only.", available: true }, { name: "Atenea Bus", type: "bus", hours: "5:00 AM - 10:00 PM", description: "Women-only pink buses on select routes.", available: true }] },
  { city: "bangkok", services: [{ name: "BTS Ladies' Section", type: "train", hours: "Rush hours", description: "Designated women-only sections during peak times.", available: true }] },
  { city: "paris", services: [{ name: "No dedicated services", type: "info", hours: "-", description: "No women-only transport in Paris. RATP provides safety hotline: 3117.", available: false }] },
  { city: "marrakech", services: [{ name: "No dedicated services", type: "info", hours: "-", description: "No women-only transport. Arrange transport through your riad for safety.", available: false }] },
];

const WomenOnlyTransportPage = () => {
  const navigate = useNavigate();
  const typeIcons: Record<string, string> = { train: "🚆", bus: "🚌", rideshare: "🚗", info: "ℹ️" };

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Women-Only Transport</h1>
      </div>

      <div className="px-5 mb-4 p-4 rounded-2xl safe-gradient-light border border-primary/10">
        <h2 className="text-sm font-heading font-bold mb-1">🚺 Safer Transit Options</h2>
        <p className="text-xs text-muted-foreground">Women-only carriages, buses, and rideshare services by city</p>
      </div>

      <div className="px-5 pb-4 space-y-4">
        {womenOnlyServices.map(cityData => {
          const city = cities.find(c => c.id === cityData.city);
          return (
            <div key={cityData.city}>
              <h3 className="text-sm font-heading font-semibold mb-2 flex items-center gap-2">
                <span>{city?.image}</span> {city?.name}
              </h3>
              <div className="space-y-2">
                {cityData.services.map(service => (
                  <div key={service.name} className={cn("p-3 rounded-xl border", service.available ? "bg-card border-border" : "bg-muted/50 border-border")}>
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{typeIcons[service.type]}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{service.name}</p>
                          {service.available && <Badge className="text-[9px] bg-sage-light text-sage border-0">Available</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                        {service.available && <p className="text-[10px] text-primary mt-1">🕐 {service.hours}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WomenOnlyTransportPage;
