// City visual config — gradients + landmark emojis for every city card
// Also contains hardcoded India cities (Mumbai, Delhi, Jaipur) that merge
// with Supabase data so they show up immediately without a DB migration.

export type CityVisual = {
  gradient: string; // Tailwind gradient classes
  emoji: string;    // Landmark emoji
  flag: string;     // Country flag emoji
};

// ── Visual config (keyed by lowercase city name) ─────────────────────────────
export const CITY_VISUALS: Record<string, CityVisual> = {
  // Asia
  tokyo:          { gradient: "from-pink-500 to-purple-700",     emoji: "⛩️",  flag: "🇯🇵" },
  kyoto:          { gradient: "from-rose-400 to-pink-700",       emoji: "🌸",  flag: "🇯🇵" },
  osaka:          { gradient: "from-orange-400 to-red-600",      emoji: "🏯",  flag: "🇯🇵" },
  bangkok:        { gradient: "from-amber-400 to-orange-600",    emoji: "🛕",  flag: "🇹🇭" },
  bali:           { gradient: "from-green-400 to-teal-600",      emoji: "🌴",  flag: "🇮🇩" },
  singapore:      { gradient: "from-sky-400 to-blue-700",        emoji: "🦁",  flag: "🇸🇬" },
  seoul:          { gradient: "from-indigo-400 to-purple-700",   emoji: "🏙️", flag: "🇰🇷" },
  "hong kong":    { gradient: "from-red-400 to-rose-700",        emoji: "🌃",  flag: "🇭🇰" },
  taipei:         { gradient: "from-teal-400 to-cyan-700",       emoji: "🗼",  flag: "🇹🇼" },
  // India
  mumbai:         { gradient: "from-orange-500 to-red-700",      emoji: "🕌",  flag: "🇮🇳" },
  delhi:          { gradient: "from-amber-500 to-orange-700",    emoji: "🏛️", flag: "🇮🇳" },
  jaipur:         { gradient: "from-pink-500 to-rose-700",       emoji: "🏰",  flag: "🇮🇳" },
  // Southeast Asia
  "chiang mai":   { gradient: "from-orange-400 to-red-600",      emoji: "🛕",  flag: "🇹🇭" },
  "chiang rai":   { gradient: "from-emerald-400 to-teal-600",    emoji: "⛩️",  flag: "🇹🇭" },
  "ho chi minh":  { gradient: "from-red-500 to-orange-700",      emoji: "🏍️", flag: "🇻🇳" },
  "ho chi minh city": { gradient: "from-red-500 to-orange-700",  emoji: "🏍️", flag: "🇻🇳" },
  hanoi:          { gradient: "from-red-400 to-rose-600",        emoji: "🌉",  flag: "🇻🇳" },
  "kuala lumpur": { gradient: "from-blue-500 to-indigo-700",     emoji: "🗼",  flag: "🇲🇾" },
  penang:         { gradient: "from-teal-400 to-cyan-600",       emoji: "🏮",  flag: "🇲🇾" },
  // Europe
  paris:          { gradient: "from-blue-400 to-indigo-700",     emoji: "🗼",  flag: "🇫🇷" },
  amsterdam:      { gradient: "from-orange-400 to-amber-600",    emoji: "🌷",  flag: "🇳🇱" },
  barcelona:      { gradient: "from-yellow-400 to-red-600",      emoji: "⛪",  flag: "🇪🇸" },
  madrid:         { gradient: "from-red-500 to-rose-700",        emoji: "🎨",  flag: "🇪🇸" },
  rome:           { gradient: "from-amber-400 to-orange-700",    emoji: "🏛️", flag: "🇮🇹" },
  florence:       { gradient: "from-rose-400 to-amber-600",      emoji: "🎭",  flag: "🇮🇹" },
  prague:         { gradient: "from-red-400 to-rose-700",        emoji: "🏰",  flag: "🇨🇿" },
  athens:         { gradient: "from-sky-400 to-blue-600",        emoji: "🏛️", flag: "🇬🇷" },
  lisbon:         { gradient: "from-yellow-400 to-orange-600",   emoji: "🚃",  flag: "🇵🇹" },
  porto:          { gradient: "from-blue-400 to-indigo-600",     emoji: "🍷",  flag: "🇵🇹" },
  vienna:         { gradient: "from-indigo-400 to-purple-600",   emoji: "🎵",  flag: "🇦🇹" },
  berlin:         { gradient: "from-gray-500 to-slate-700",      emoji: "🏗️", flag: "🇩🇪" },
  copenhagen:     { gradient: "from-blue-400 to-cyan-600",       emoji: "🧜",  flag: "🇩🇰" },
  stockholm:      { gradient: "from-blue-500 to-indigo-700",     emoji: "👑",  flag: "🇸🇪" },
  edinburgh:      { gradient: "from-slate-500 to-blue-700",      emoji: "🏰",  flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  london:         { gradient: "from-slate-400 to-gray-700",      emoji: "🎡",  flag: "🇬🇧" },
  // Americas
  "new york":     { gradient: "from-blue-500 to-slate-700",      emoji: "🗽",  flag: "🇺🇸" },
  "mexico city":  { gradient: "from-green-500 to-emerald-700",   emoji: "🌵",  flag: "🇲🇽" },
  "buenos aires": { gradient: "from-sky-400 to-blue-700",        emoji: "🎭",  flag: "🇦🇷" },
  cartagena:      { gradient: "from-yellow-400 to-orange-600",   emoji: "🏖️", flag: "🇨🇴" },
  medellin:       { gradient: "from-green-400 to-emerald-700",   emoji: "🌸",  flag: "🇨🇴" },
  "rio de janeiro": { gradient: "from-green-400 to-teal-600",    emoji: "🏖️", flag: "🇧🇷" },
  // Middle East / Africa
  marrakech:      { gradient: "from-orange-500 to-red-700",      emoji: "🕌",  flag: "🇲🇦" },
  dubai:          { gradient: "from-amber-400 to-yellow-600",    emoji: "🏙️", flag: "🇦🇪" },
  istanbul:       { gradient: "from-teal-500 to-blue-700",       emoji: "🕌",  flag: "🇹🇷" },
  capetown:       { gradient: "from-blue-400 to-emerald-600",    emoji: "🌄",  flag: "🇿🇦" },
  "cape town":    { gradient: "from-blue-400 to-emerald-600",    emoji: "🌄",  flag: "🇿🇦" },
  // Oceania
  sydney:         { gradient: "from-cyan-400 to-sky-700",        emoji: "🌉",  flag: "🇦🇺" },
  melbourne:      { gradient: "from-blue-400 to-purple-600",     emoji: "🏙️", flag: "🇦🇺" },
};

// ── Wikipedia article slugs per city (3 per city) ────────────────────────────
// Wikipedia REST API: https://en.wikipedia.org/api/rest_v1/page/summary/{slug}
// Returns free, real landmark photos with proper CORS headers — no API key needed.
export const CITY_WIKI_SLUGS: Record<string, [string, string, string]> = {
  tokyo:          ["Tokyo",               "Shibuya_crossing",           "Senso-ji"],
  kyoto:          ["Kyoto",               "Fushimi_Inari-taisha",       "Kinkaku-ji"],
  osaka:          ["Osaka",               "Osaka_Castle",               "Dotonbori"],
  bangkok:        ["Bangkok",             "Wat_Phra_Kaew",              "Chao_Phraya_River"],
  bali:           ["Bali",                "Tanah_Lot",                  "Ubud"],
  singapore:      ["Singapore",           "Marina_Bay_Sands",           "Gardens_by_the_Bay"],
  seoul:          ["Seoul",               "Gyeongbokgung",              "Bukchon_Hanok_Village"],
  "hong kong":    ["Hong_Kong",           "Victoria_Harbour",           "Victoria_Peak"],
  taipei:         ["Taipei",              "Taipei_101",                 "Chiang_Kai-shek_Memorial_Hall"],
  "chiang mai":   ["Chiang_Mai",          "Doi_Suthep",                 "Chiang_Mai_Night_Bazaar"],
  mumbai:         ["Mumbai",              "Gateway_of_India",           "Marine_Drive,_Mumbai"],
  delhi:          ["Delhi",               "Red_Fort",                   "Qutub_Minar"],
  jaipur:         ["Jaipur",              "Amber_Fort",                 "Hawa_Mahal"],
  paris:          ["Paris",               "Eiffel_Tower",               "Louvre"],
  amsterdam:      ["Amsterdam",           "Rijksmuseum",                "Canals_of_Amsterdam"],
  barcelona:      ["Barcelona",           "Sagrada_Família",            "Park_Güell"],
  madrid:         ["Madrid",              "Royal_Palace_of_Madrid",     "Retiro_Park"],
  rome:           ["Rome",                "Colosseum",                  "Trevi_Fountain"],
  florence:       ["Florence",            "Florence_Cathedral",         "Ponte_Vecchio"],
  prague:         ["Prague",              "Prague_Castle",              "Charles_Bridge"],
  athens:         ["Athens",              "Acropolis_of_Athens",        "Parthenon"],
  lisbon:         ["Lisbon",              "Belém_Tower",                "Alfama"],
  porto:          ["Porto",               "Dom_Luís_I_Bridge",          "Livraria_Lello"],
  vienna:         ["Vienna",              "Schönbrunn_Palace",          "Stephansdom"],
  berlin:         ["Berlin",              "Brandenburg_Gate",           "Reichstag_building"],
  copenhagen:     ["Copenhagen",          "Nyhavn",                     "Tivoli_Gardens"],
  stockholm:      ["Stockholm",           "Gamla_stan",                 "Vasa_(ship)"],
  london:         ["London",              "Tower_Bridge",               "Buckingham_Palace"],
  edinburgh:      ["Edinburgh",           "Edinburgh_Castle",           "Arthur's_Seat"],
  "new york":     ["New_York_City",       "Times_Square",               "Central_Park"],
  "mexico city":  ["Mexico_City",         "Teotihuacan",                "Zócalo"],
  "buenos aires": ["Buenos_Aires",        "Obelisk_of_Buenos_Aires",    "La_Boca"],
  cartagena:      ["Cartagena,_Colombia", "Walled_City_of_Cartagena",   "Bocagrande"],
  medellin:       ["Medellín",            "Plaza_Botero",               "El_Poblado"],
  marrakech:      ["Marrakesh",           "Djemaa_el-Fna",              "Koutoubia_Mosque"],
  dubai:          ["Dubai",               "Burj_Khalifa",               "Palm_Jumeirah"],
  istanbul:       ["Istanbul",            "Blue_Mosque",                "Bosphorus"],
  "cape town":    ["Cape_Town",           "Table_Mountain",             "Cape_of_Good_Hope"],
  sydney:         ["Sydney",              "Sydney_Opera_House",         "Sydney_Harbour_Bridge"],
  melbourne:      ["Melbourne",           "Federation_Square",          "Flinders_Street_Station"],
};

/** Returns the 3 Wikipedia page slugs for a city (or generic fallback). */
export function getCityWikiSlugs(cityName: string): [string, string, string] {
  const key = cityName.toLowerCase();
  return (
    CITY_WIKI_SLUGS[key] ??
    CITY_WIKI_SLUGS[key.split(" ").slice(0, 2).join(" ")] ??
    [cityName, `${cityName}_skyline`, `${cityName}_landmark`]
  );
}

export function getCityVisual(cityName: string): CityVisual {
  const key = cityName.toLowerCase();
  return (
    CITY_VISUALS[key] ??
    // Fallback by first word (e.g. "New York City" → "new york")
    CITY_VISUALS[key.split(" ").slice(0, 2).join(" ")] ??
    { gradient: "from-primary to-accent", emoji: "🌍", flag: "🌐" }
  );
}

// ── India cities — hardcoded so they show up without a DB migration ───────────
export type LocalCity = {
  id: string;
  name: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  safety_score: number;
  description: string;
  image_url: string | null;
  language: string;
  currency: string;
  timezone: string;
  best_time_to_visit: string;
  avg_daily_budget_usd: number;
  cultural_tips: string[];
  dos: string[];
  donts: string[];
  emergency_police: string;
  emergency_ambulance: string;
  emergency_fire: string;
  emergency_women_helpline: string;
  created_at: string;
  updated_at: string;
};

export const INDIA_CITIES: LocalCity[] = [
  {
    id: "local-mumbai",
    name: "Mumbai",
    country: "India",
    region: "Asia",
    latitude: 19.076,
    longitude: 72.8777,
    safety_score: 6.5,
    description: "India's financial capital and Bollywood hub — a vibrant, chaotic, and incredibly exciting city with stunning colonial architecture, street food, and a resilient spirit.",
    image_url: null,
    language: "Hindi, Marathi, English",
    currency: "INR (₹)",
    timezone: "IST (UTC+5:30)",
    best_time_to_visit: "November to February",
    avg_daily_budget_usd: 35,
    cultural_tips: [
      "Dress modestly, especially when visiting temples and markets",
      "Remove shoes before entering religious sites",
      "Bargaining is expected in local markets — start at 50% of the asking price",
      "The local trains have women-only carriages — use them during peak hours",
      "Street food is delicious; stick to busy stalls with high turnover",
    ],
    dos: [
      "Use prepaid taxis or app-based rides (Ola/Uber) for safety",
      "Keep a copy of your passport and emergency numbers",
      "Try the local BEST buses for affordable city travel",
      "Visit Gateway of India and Marine Drive at dawn for safety",
      "Use the women-only metro and train carriages",
    ],
    donts: [
      "Don't walk alone in isolated areas after 10 PM",
      "Don't accept food or drinks from strangers on trains",
      "Don't display expensive jewellery or phones in crowded areas",
      "Don't ignore locals who warn you about unsafe areas",
      "Avoid Dharavi and certain parts of Kurla at night",
    ],
    emergency_police: "100",
    emergency_ambulance: "108",
    emergency_fire: "101",
    emergency_women_helpline: "1091",
  },
  {
    id: "local-delhi",
    name: "Delhi",
    country: "India",
    region: "Asia",
    latitude: 28.6139,
    longitude: 77.209,
    safety_score: 6.0,
    description: "India's capital, a millennia-old city of Mughal monuments, vibrant street markets, and modern infrastructure. Rich in history and culture — plan ahead for safety.",
    image_url: null,
    language: "Hindi, Punjabi, English",
    currency: "INR (₹)",
    timezone: "IST (UTC+5:30)",
    best_time_to_visit: "October to March",
    avg_daily_budget_usd: 30,
    cultural_tips: [
      "The Delhi Metro is safe, affordable, and has women-only carriages",
      "Cover your head when visiting Sikh Gurdwaras (a dupatta is provided)",
      "Saying 'Namaste' with folded hands is a respectful greeting",
      "Old Delhi is best explored in the morning; avoid late evenings",
      "Auto-rickshaws should always use the meter — insist on it",
    ],
    dos: [
      "Use Delhi Metro and women-only coaches during peak hours",
      "Pre-book accommodation in well-reviewed, central areas",
      "Carry a portable phone charger and offline maps",
      "Visit Red Fort, Qutub Minar, and Humayun's Tomb during day",
      "Share your live location with a trusted contact",
    ],
    donts: [
      "Don't walk alone in unlit areas after dark",
      "Don't take unlicensed taxis — use Ola, Uber, or prepaid cabs",
      "Don't let strangers steer you to 'their' shop or restaurant",
      "Avoid Paharganj backstreets very late at night",
      "Don't leave your drink unattended in bars or clubs",
    ],
    emergency_police: "100",
    emergency_ambulance: "108",
    emergency_fire: "101",
    emergency_women_helpline: "1091",
  },
  {
    id: "local-jaipur",
    name: "Jaipur",
    country: "India",
    region: "Asia",
    latitude: 26.9124,
    longitude: 75.7873,
    safety_score: 7.0,
    description: "The 'Pink City' of Rajasthan — a UNESCO World Heritage city famous for its stunning palaces, forts, and bazaars. One of India's most popular and relatively safe tourist destinations.",
    image_url: null,
    language: "Hindi, Rajasthani",
    currency: "INR (₹)",
    timezone: "IST (UTC+5:30)",
    best_time_to_visit: "October to February",
    avg_daily_budget_usd: 28,
    cultural_tips: [
      "Dress conservatively — long sleeves and skirts/trousers are best",
      "Bargain firmly but politely in the bazaars",
      "Remove shoes before entering all temples and the City Palace inner sanctums",
      "The Pink City Bazaar is best explored in the morning before crowds",
      "Camels and elephants near forts — check welfare before riding",
    ],
    dos: [
      "Book registered guides from the tourist office for forts",
      "Use Ola/Uber or hotel-arranged taxis",
      "Explore Hawa Mahal and Amber Fort with other tourists around",
      "Try Rajasthani thali — it's filling and delicious",
      "Keep hotel/guesthouse card with you at all times",
    ],
    donts: [
      "Don't accept 'free' tours from touts near monuments",
      "Don't wander into non-tourist areas alone after sunset",
      "Don't leave valuables in auto-rickshaws",
      "Don't photograph military or government buildings",
      "Avoid gem shop touts who promise wholesale prices",
    ],
    emergency_police: "100",
    emergency_ambulance: "108",
    emergency_fire: "101",
    emergency_women_helpline: "1091",
  },
];
