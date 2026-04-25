import { useState } from "react";
import { ArrowLeft, Check, X, AlertTriangle, ChevronDown, Search, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ── Real country data ─────────────────────────────────────────────────────────
// Accurate as of 2024 — always advise users to verify before travel.
type CountryRights = {
  id: string;
  name: string;
  flag: string;
  region: string;
  contraceptionLegal: boolean;
  ecOTC: boolean; // Emergency Contraception Over-The-Counter
  abortionStatus: "legal-on-request" | "legal-limited" | "illegal-exceptions" | "illegal";
  abortionWeeks?: number; // weeks limit if on request / limited
  abortionDetail: string;
  notes: string;
  packFromHome: string[];
  nearestFullAccess?: string;
  helpline?: string;
};

const COUNTRIES: CountryRights[] = [
  // ── Asia Pacific ───────────────────────────────────────────────────────────
  {
    id: "japan", name: "Japan", flag: "🇯🇵", region: "Asia Pacific",
    contraceptionLegal: true, ecOTC: false,
    abortionStatus: "legal-limited", abortionWeeks: 22,
    abortionDetail: "Legal up to ~22 weeks but requires partner consent (controversial requirement). Performed by licensed physicians only.",
    notes: "The oral contraceptive pill was only approved in 1999 — far later than most countries. EC (morning-after pill) received OTC approval in 2023 but availability is still limited and expensive (~¥7,000–15,000). Bring your regular pill from home.",
    packFromHome: ["3-month supply of oral contraceptives", "Emergency contraception (Plan B)", "Preferred brand condoms — Japanese sizes run small"],
    nearestFullAccess: "Major hospitals in Tokyo, Osaka, Kyoto",
    helpline: "TELL Japan: 03-5774-0992",
  },
  {
    id: "thailand", name: "Thailand", flag: "🇹🇭", region: "Asia Pacific",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-limited", abortionWeeks: 12,
    abortionDetail: "Decriminalized up to 12 weeks in 2022 (major reform). Women can access safe services at registered clinics.",
    notes: "Contraception widely available at pharmacies. EC (Postinor) sold OTC at most pharmacies for ~฿80. The pill is inexpensive (~฿30–100/month). Good English-speaking health staff in tourist areas.",
    packFromHome: ["Your preferred brand contraceptive pill"],
    helpline: "SAFE clinics in Bangkok: 02-245-8484",
  },
  {
    id: "indonesia", name: "Indonesia", flag: "🇮🇩", region: "Asia Pacific",
    contraceptionLegal: true, ecOTC: false,
    abortionStatus: "illegal-exceptions",
    abortionDetail: "Illegal except for rape victims (with strict bureaucratic process) and medical emergencies. In practice, access even in exceptional cases is very difficult.",
    notes: "Deeply conservative legal environment. EC is not available OTC and very difficult to obtain. The pill requires a prescription and some pharmacies may refuse unmarried women. Bring contraception from home.",
    packFromHome: ["3-month supply of contraceptives", "Emergency contraception — not available locally", "Condoms (bring from home)"],
    nearestFullAccess: "Singapore (1–2 hr flight from Bali)",
  },
  {
    id: "singapore", name: "Singapore", flag: "🇸🇬", region: "Asia Pacific",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 24,
    abortionDetail: "Legal up to 24 weeks. Counseling required. High-quality, confidential service at public hospitals and private clinics.",
    notes: "Excellent healthcare system. English widely spoken by all medical staff. EC available OTC at all pharmacies (~S$30). The pill easily obtained after consultation (~S$20/month).",
    packFromHome: [],
    helpline: "Singapore FSS: 1800-111-2222",
  },
  {
    id: "south-korea", name: "South Korea", flag: "🇰🇷", region: "Asia Pacific",
    contraceptionLegal: true, ecOTC: false,
    abortionStatus: "legal-on-request", abortionWeeks: 14,
    abortionDetail: "Decriminalized in 2021. Currently legal but new legislation is still being finalized — access can be inconsistent across providers.",
    notes: "EC requires a doctor's prescription in most cases. The pill is available at pharmacies. English-speaking OB/GYN clinics are common in Seoul (Gangnam district).",
    packFromHome: ["Emergency contraception (prescription required locally)", "Your preferred pill brand"],
    helpline: "Korea Women's Hotline: 1366",
  },
  {
    id: "india", name: "India", flag: "🇮🇳", region: "Asia Pacific",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-limited", abortionWeeks: 24,
    abortionDetail: "Legal up to 24 weeks with conditions under the Medical Termination of Pregnancy Act (amended 2021). Up to 20 weeks requires one doctor's opinion; 20–24 weeks requires two doctors.",
    notes: "EC ('i-Pill', 'Unwanted-72') is widely available OTC at chemist shops (~₹80–100). Contraceptive pill easily available. Major cities (Mumbai, Delhi, Jaipur) have excellent private hospitals with female gynecologists.",
    packFromHome: ["Your preferred brand contraceptives"],
    helpline: "iCall India: 9152987821",
  },
  {
    id: "hong-kong", name: "Hong Kong", flag: "🇭🇰", region: "Asia Pacific",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-limited", abortionWeeks: 24,
    abortionDetail: "Legal up to 24 weeks with medical authorization. Widely accessible at public and private hospitals.",
    notes: "Excellent medical facilities. English widely spoken. EC available at pharmacies (Plan B ~HK$200).",
    packFromHome: [],
  },
  // ── Europe ─────────────────────────────────────────────────────────────────
  {
    id: "france", name: "France", flag: "🇫🇷", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 14,
    abortionDetail: "Legal up to 14 weeks (extended from 12 in 2022). Free for all in public hospitals. The right to abortion is now constitutionally protected (2024).",
    notes: "Contraception is free for anyone under 26. EC is free and available without prescription at pharmacies and school nurses. Excellent, highly accessible reproductive healthcare.",
    packFromHome: [],
    helpline: "Planning Familial: 0800 803 803 (free)",
  },
  {
    id: "netherlands", name: "Netherlands", flag: "🇳🇱", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 22,
    abortionDetail: "Legal up to 22 weeks. Five-day reflection period was abolished in 2023. Widely accessible.",
    notes: "Very progressive reproductive healthcare. The pill costs ~€10–20/month. English universally spoken by medical staff.",
    packFromHome: [],
  },
  {
    id: "spain", name: "Spain", flag: "🇪🇸", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 14,
    abortionDetail: "Legal up to 14 weeks on request. 16–17 year olds no longer need parental consent (2023 reform). Up to 22 weeks in medical circumstances.",
    notes: "EC available OTC since 2009. Oral contraceptives available at pharmacies. Some regions may have higher conscientious objection rates among providers.",
    packFromHome: [],
    helpline: "Teléfono de atención a mujeres: 016",
  },
  {
    id: "italy", name: "Italy", flag: "🇮🇹", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-limited", abortionWeeks: 13,
    abortionDetail: "Legal up to 90 days (~13 weeks) under Law 194 (1978). However, 70%+ of gynecologists in some regions exercise conscientious objection, making access difficult in practice.",
    notes: "Despite legal status, actual access is severely limited in Southern Italy, Sicily, and Sardinia due to high conscientious objection rates. In Rome and Milan, access is better. EC (EllaOne) available OTC without prescription since 2015.",
    packFromHome: ["Mifepristone not available in many regions — plan ahead"],
    nearestFullAccess: "Milan, Rome, Bologna — or Switzerland (Bern)",
  },
  {
    id: "czech-republic", name: "Czech Republic", flag: "🇨🇿", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 12,
    abortionDetail: "Legal up to 12 weeks on request. Widely accessible and affordable.",
    notes: "Good healthcare system. EC widely available. Medical abortion accessible. Affordable healthcare for tourists.",
    packFromHome: [],
  },
  {
    id: "greece", name: "Greece", flag: "🇬🇷", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 12,
    abortionDetail: "Legal up to 12 weeks. Rape/incest up to 19 weeks; fetal abnormality up to 24 weeks.",
    notes: "EC available OTC at pharmacies (~€15). Oral contraceptives accessible. Athens and major cities have good services. Islands and rural areas may be limited.",
    packFromHome: [],
  },
  {
    id: "portugal", name: "Portugal", flag: "🇵🇹", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 10,
    abortionDetail: "Legal up to 10 weeks on request. No cost in public health system for residents; some out-of-pocket costs for visitors.",
    notes: "EC free in public hospitals, available OTC in pharmacies. Good access in Lisbon and Porto.",
    packFromHome: [],
  },
  {
    id: "austria", name: "Austria", flag: "🇦🇹", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 12,
    abortionDetail: "Legal up to 12 weeks but NOT covered by public health insurance. Costs ~€400–700 at private clinics. Only a handful of clinics perform them nationwide.",
    notes: "Technically legal but practically difficult due to cost and limited providers. EC available OTC without prescription. Bring enough contraception from home.",
    packFromHome: ["3-month supply of regular contraception"],
    nearestFullAccess: "Vienna (4–5 clinics), Munich, Germany",
  },
  {
    id: "germany", name: "Germany", flag: "🇩🇪", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-limited", abortionWeeks: 12,
    abortionDetail: "Legal up to 12 weeks but technically 'unlawful' under §218 StGB (under reform as of 2024). Mandatory 3-day counseling period. Costs vary (~€300–600), not covered by standard insurance.",
    notes: "EC (EllaOne) available OTC without prescription since 2015. The pill requires a doctor's visit. Abortion reform was debated in parliament in 2024.",
    packFromHome: [],
  },
  {
    id: "denmark", name: "Denmark", flag: "🇩🇰", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 18,
    abortionDetail: "Legal up to 18 weeks (extended from 12 in 2023). Free in public healthcare system. Very accessible.",
    notes: "Excellent and free reproductive healthcare. EC available at pharmacies. Very progressive and accessible.",
    packFromHome: [],
  },
  {
    id: "uk", name: "United Kingdom", flag: "🇬🇧", region: "Europe",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 24,
    abortionDetail: "Legal up to 24 weeks under the Abortion Act 1967 (England, Wales, Scotland). Fully free on the NHS. Northern Ireland fully decriminalized in 2019.",
    notes: "Excellent free reproductive healthcare via NHS. EC free from GPs, sexual health clinics, and pharmacies. Visitors can access services but may pay non-resident fees.",
    packFromHome: [],
    helpline: "Marie Stopes: 0345 300 8090 | BPAS: 03457 30 40 30",
  },
  // ── Americas ───────────────────────────────────────────────────────────────
  {
    id: "new-york", name: "New York (USA)", flag: "🇺🇸", region: "Americas",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 24,
    abortionDetail: "New York State: legal up to 24 weeks; after 24 weeks when necessary for health/life. Strong legal protections post-Roe. Other US states vary significantly.",
    notes: "EC (Plan B) available OTC at all pharmacies ($40–50). Excellent reproductive healthcare in NYC. Note: Laws vary drastically across US states — research your specific destination.",
    packFromHome: [],
    helpline: "Planned Parenthood: 1-800-230-PLAN",
  },
  {
    id: "mexico-city", name: "Mexico City", flag: "🇲🇽", region: "Americas",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 12,
    abortionDetail: "Mexico City has allowed abortion up to 12 weeks since 2007. Federal decriminalization ruling in 2023 means abortion is no longer a federal crime, though state laws still vary.",
    notes: "Excellent access in CDMX. EC sold OTC at all pharmacies (~MX$150). The pill inexpensive and widely available. Safe, affordable clinics in the capital.",
    packFromHome: [],
    helpline: "GIRE Mexico: 55-5658-6684",
  },
  {
    id: "buenos-aires", name: "Buenos Aires", flag: "🇦🇷", region: "Americas",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 14,
    abortionDetail: "Nationwide legalization up to 14 weeks since January 2021 (Law 27.610). Free in public healthcare system.",
    notes: "Major victory for reproductive rights in Latin America. EC freely available at pharmacies. Excellent OB/GYN care in Buenos Aires. Public hospitals provide free services.",
    packFromHome: [],
    helpline: "Línea 0800 222 3444 (free, national)",
  },
  {
    id: "colombia", name: "Colombia (Cartagena)", flag: "🇨🇴", region: "Americas",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 24,
    abortionDetail: "Constitutional Court ruling (2022) decriminalized abortion up to 24 weeks nationwide. Landmark decision for Latin America.",
    notes: "Major reform — access still improving in smaller cities like Cartagena. Bogotá has best access. EC available OTC at all pharmacies (~COP$30,000).",
    packFromHome: [],
  },
  // ── Middle East / Africa ───────────────────────────────────────────────────
  {
    id: "morocco", name: "Morocco (Marrakech)", flag: "🇲🇦", region: "Middle East / Africa",
    contraceptionLegal: true, ecOTC: false,
    abortionStatus: "illegal-exceptions",
    abortionDetail: "Illegal except to preserve the mother's physical health (Article 453 of Penal Code). Very difficult to access even in exceptional cases.",
    notes: "Contraception is technically legal but social stigma is significant, especially for unmarried women. EC is not available OTC and very hard to find. Bring all contraception from home. Conservative country — discretion advised.",
    packFromHome: ["3-month supply of all contraceptives", "Emergency contraception — not available locally", "All prescription medications with original packaging and doctor's note"],
    nearestFullAccess: "Spain (Málaga, Seville) or France",
  },
  {
    id: "uae", name: "UAE (Dubai)", flag: "🇦🇪", region: "Middle East / Africa",
    contraceptionLegal: false, ecOTC: false,
    abortionStatus: "illegal-exceptions",
    abortionDetail: "Illegal except to save the mother's life or prevent serious harm to health. Very strictly enforced.",
    notes: "CRITICAL: Contraception is only legally accessible for married women. Unmarried women can face significant barriers. Do NOT rely on local access — bring ALL contraception from home with original packaging and a doctor's letter. EC is essentially unavailable.",
    packFromHome: ["ALL contraceptives — do not rely on local access", "Emergency contraception (absolutely cannot obtain locally)", "Prescription medications with original packaging + doctor's letter", "Note: possession of certain medications without prescription can be illegal"],
    nearestFullAccess: "India, Singapore, Thailand (short flights)",
    helpline: "Dubai Health Authority: 800 342",
  },
  {
    id: "turkey", name: "Turkey (Istanbul)", flag: "🇹🇷", region: "Middle East / Africa",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 10,
    abortionDetail: "Legal up to 10 weeks for unmarried women; married women formally need husband's consent (though rarely enforced). Access has been declining in recent years.",
    notes: "EC (Postinor, NorLevo) available OTC at pharmacies (~TL 200). The pill available at pharmacies. Good access in Istanbul. Conservative areas of Anatolia may be more restrictive.",
    packFromHome: ["Emergency contraception (as backup)"],
    helpline: "Women's shelter hotline: 183",
  },
  {
    id: "south-africa", name: "South Africa (Cape Town)", flag: "🇿🇦", region: "Middle East / Africa",
    contraceptionLegal: true, ecOTC: true,
    abortionStatus: "legal-on-request", abortionWeeks: 20,
    abortionDetail: "Legal up to 20 weeks under the Choice on Termination of Pregnancy Act (1996). Free at public healthcare facilities.",
    notes: "One of the most progressive abortion laws in Africa. EC freely available at public clinics; available OTC at pharmacies. Excellent healthcare in Cape Town.",
    packFromHome: [],
    helpline: "Marie Stopes SA: 0800 11 77 85 (free)",
  },
];

const STATUS_CONFIG = {
  "legal-on-request":    { label: "Legal on request",    color: "bg-sage-light text-sage",             dot: "bg-sage" },
  "legal-limited":       { label: "Legal (limited)",     color: "bg-amber-warm/20 text-amber-warm",    dot: "bg-amber-warm" },
  "illegal-exceptions":  { label: "Illegal (exceptions)","color": "bg-orange-100 text-orange-700",     dot: "bg-orange-500" },
  "illegal":             { label: "Illegal",              color: "bg-destructive/10 text-destructive",  dot: "bg-destructive" },
};

const REGIONS = ["All", "Asia Pacific", "Europe", "Americas", "Middle East / Africa"];

const ReproductiveRightsPage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");

  const filtered = COUNTRIES.filter((c) => {
    const matchRegion = region === "All" || c.region === region;
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.region.toLowerCase().includes(search.toLowerCase());
    return matchRegion && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-3 flex items-center gap-3">
        <button onClick={() => navigate("/health")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-heading font-bold">Reproductive Rights</h1>
          <p className="text-xs text-muted-foreground">{COUNTRIES.length} countries · Know before you go</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mx-5 mb-3 p-3 rounded-xl bg-coral-light/50 border border-primary/20 flex gap-2">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-foreground">
          Laws change frequently. Always verify current status before traveling and consult a healthcare provider for personal advice.
        </p>
      </div>

      {/* Search */}
      <div className="px-5 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Region filter */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all",
              region === r ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Country cards */}
      <div className="px-5 pb-6 space-y-2.5">
        {filtered.map((country) => {
          const statusCfg = STATUS_CONFIG[country.abortionStatus];
          const isOpen = expanded === country.id;

          return (
            <div key={country.id} className="rounded-2xl bg-card border border-border overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : country.id)}
                className="flex items-center justify-between w-full px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="text-left">
                    <h3 className="text-sm font-heading font-bold">{country.name}</h3>
                    <p className="text-[10px] text-muted-foreground">{country.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Status badge */}
                  <Badge className={cn("text-[9px] px-2 py-0.5 border-0", statusCfg.color)}>
                    {statusCfg.label}
                  </Badge>
                  {/* EC OTC indicator */}
                  <div
                    className={cn("w-2 h-2 rounded-full flex-shrink-0", country.ecOTC ? "bg-sage" : "bg-amber-warn")}
                    title={country.ecOTC ? "EC available OTC" : "EC requires prescription"}
                  />
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", isOpen && "rotate-180")} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3">
                  {/* Quick status grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-muted">
                      <p className="text-[10px] text-muted-foreground mb-1">Contraception</p>
                      <div className="flex items-center gap-1">
                        {country.contraceptionLegal
                          ? <Check className="w-3.5 h-3.5 text-sage" />
                          : <X className="w-3.5 h-3.5 text-destructive" />}
                        <span className="text-xs font-medium">
                          {country.contraceptionLegal ? "Legal" : "Restricted"}
                        </span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted">
                      <p className="text-[10px] text-muted-foreground mb-1">Emergency Contraception</p>
                      <div className="flex items-center gap-1">
                        {country.ecOTC
                          ? <Check className="w-3.5 h-3.5 text-sage" />
                          : <AlertTriangle className="w-3.5 h-3.5 text-amber-warm" />}
                        <span className="text-xs font-medium">{country.ecOTC ? "OTC" : "Rx Required"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Abortion */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Abortion Access</p>
                    <div className={cn("px-3 py-2 rounded-xl text-xs", statusCfg.color)}>
                      {country.abortionDetail}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Traveler Notes</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{country.notes}</p>
                  </div>

                  {/* Pack from home */}
                  {country.packFromHome.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-warm/10 border border-amber-warm/20">
                      <p className="text-[10px] font-semibold text-amber-warm uppercase tracking-wider mb-2">📦 Pack From Home</p>
                      <ul className="space-y-1.5">
                        {country.packFromHome.map((item, i) => (
                          <li key={i} className="text-xs flex items-start gap-1.5 text-foreground">
                            <Check className="w-3 h-3 text-amber-warm mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Nearest full access */}
                  {country.nearestFullAccess && (
                    <div className="p-2.5 rounded-xl bg-sage-light border border-sage/20">
                      <p className="text-[10px] font-semibold text-sage uppercase tracking-wider mb-0.5">🏥 Nearest Full Access</p>
                      <p className="text-xs">{country.nearestFullAccess}</p>
                    </div>
                  )}

                  {/* Helpline */}
                  {country.helpline && (
                    <div className="p-2.5 rounded-xl bg-muted">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">📞 Helpline</p>
                      <p className="text-xs font-medium">{country.helpline}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm">No countries found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReproductiveRightsPage;
