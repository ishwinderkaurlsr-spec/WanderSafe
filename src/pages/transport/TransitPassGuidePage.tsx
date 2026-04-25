import { ArrowLeft, CreditCard, Smartphone, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cities } from "@/data/mockData";
import { useState } from "react";
import { cn } from "@/lib/utils";

const transitPasses: Record<string, { name: string; price: string; duration: string; where: string; topUp: string; contactless: boolean; tips: string[] }[]> = {
  tokyo: [
    { name: "Suica / PASMO", price: "¥500 deposit + charge", duration: "Rechargeable", where: "Any JR station machine", topUp: "Station machines or konbini", contactless: true, tips: ["Works on all trains, buses, and vending machines", "Get a refund at any JR counter when leaving", "Mobile Suica available on iPhone"] },
  ],
  paris: [
    { name: "Navigo Easy", price: "€2 card + tickets", duration: "Rechargeable", where: "Any metro station", topUp: "Station machines", contactless: true, tips: ["Load t+ tickets or day passes", "Carnet of 10 tickets is cheapest for short stays", "Navigo Découverte for weekly pass (€30)"] },
  ],
  bangkok: [
    { name: "Rabbit Card (BTS)", price: "฿200 (฿100 deposit)", duration: "Rechargeable", where: "Any BTS station", topUp: "BTS station machines", contactless: false, tips: ["Only works on BTS, not MRT", "Separate card needed for MRT (MRT Plus)", "Can also use at some shops"] },
  ],
  marrakech: [
    { name: "Tram Card", price: "20 MAD", duration: "Rechargeable", where: "Tram stations", topUp: "Tram ticket machines", contactless: false, tips: ["Only valid on tram, not buses", "Single trip tickets also available", "Keep your ticket — inspectors check frequently"] },
  ],
  "mexico-city": [
    { name: "Tarjeta de Movilidad", price: "$21 MXN", duration: "Rechargeable", where: "Metro stations", topUp: "Metro station machines", contactless: false, tips: ["Works on Metro, Metrobús, and Tren Ligero", "Individual metro tickets available ($5 MXN)", "Very affordable — one of the cheapest metros worldwide"] },
  ],
};

const TransitPassGuidePage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("tokyo");
  const passes = transitPasses[selectedCity] || [];
  const city = cities.find(c => c.id === selectedCity);

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Transit Passes</h1>
      </div>

      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {cities.map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)} className={cn("px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all", selectedCity === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground")}>
            {c.image} {c.name}
          </button>
        ))}
      </div>

      <div className="px-5 pb-4 space-y-3">
        {passes.map(pass => (
          <div key={pass.name} className="p-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-heading font-bold">{pass.name}</h3>
                <p className="text-xs text-muted-foreground">{pass.price} · {pass.duration}</p>
              </div>
            </div>
            <div className="space-y-2 mb-3 text-xs">
              <div className="flex items-center gap-2"><span className="text-muted-foreground">Where to buy:</span><span className="font-medium">{pass.where}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground">Top up:</span><span className="font-medium">{pass.topUp}</span></div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                <span className={pass.contactless ? "text-sage font-medium" : "text-muted-foreground"}>
                  {pass.contactless ? "✓ Contactless supported" : "✗ No contactless"}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              {pass.tips.map(tip => (
                <div key={tip} className="flex items-start gap-2 text-xs">
                  <Info className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransitPassGuidePage;
