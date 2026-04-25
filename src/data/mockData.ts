export interface City {
  id: string;
  name: string;
  country: string;
  emoji: string;
  safetyScore: number; // 1-10
  image: string;
  timezone: string;
  currency: string;
  language: string;
  emergencyNumber: string;
  policeNumber: string;
  ambulanceNumber: string;
  embassyNote: string;
  culturalBrief: CulturalBrief;
  lgbtqSafety: LGBTQSafety;
  transportOptions: TransportOption[];
  safeZones: Zone[];
  cautionZones: Zone[];
  avoidZones: Zone[];
  healthResources: HealthResource[];
  reproductiveRights: ReproductiveRights;
  offlinePack: OfflinePack;
}

export interface CulturalBrief {
  dressCode: string;
  greetings: string;
  doNots: string[];
  womenTips: string[];
  photoRules: string;
  alcoholRules: string;
  lgbtqLaws: string;
  religiousSites: string;
}

export interface LGBTQSafety {
  score: number; // 1-10
  level: "safe" | "caution" | "dangerous";
  legalStatus: string;
  enforcement: string;
  safeSpaces: string[];
  tips: string[];
}

export interface TransportOption {
  id: string;
  name: string;
  type: "taxi" | "rideshare" | "public" | "women-only";
  rating: number;
  verified: boolean;
  womenOnly: boolean;
  description: string;
  priceRange: string;
  phone?: string;
}

export interface Zone {
  name: string;
  description: string;
  lat: number;
  lng: number;
}

export interface HealthResource {
  id: string;
  name: string;
  type: "pharmacy" | "clinic" | "hospital";
  hasFemaleDoctor: boolean;
  hasEmergencyContraception: boolean;
  address: string;
  distance: string;
  rating: number;
}

export interface ReproductiveRights {
  contraceptionLegal: boolean;
  emergencyContraceptionOTC: boolean;
  abortionLegal: string;
  notes: string;
  packFromHome: string[];
  nearestFullAccess: string;
}

export interface OfflinePack {
  sizeInMB: number;
  lastUpdated: string;
  includes: string[];
}

export interface EmergencyPhrase {
  id: string;
  english: string;
  category: "safety" | "medical" | "directions" | "general";
  icon: string;
  translations: Record<string, { text: string; pronunciation: string }>;
}

export const emergencyPhrases: EmergencyPhrase[] = [
  {
    id: "help",
    english: "Help! Call the police!",
    category: "safety",
    icon: "🚨",
    translations: {
      ja: { text: "助けて！警察を呼んで！", pronunciation: "Tasukete! Keisatsu wo yonde!" },
      fr: { text: "Au secours ! Appelez la police !", pronunciation: "Oh secoor! Applay la poleess!" },
      ar: { text: "!النجدة! اتصلوا بالشرطة", pronunciation: "An-najda! Ittasilu bi-shurta!" },
      th: { text: "ช่วยด้วย! เรียกตำรวจ!", pronunciation: "Chûay dûay! Rîak tam-rùat!" },
      es: { text: "¡Socorro! ¡Llamen a la policía!", pronunciation: "So-kor-ro! Yah-men ah la po-lee-see-ah!" },
    },
  },
  {
    id: "doctor",
    english: "I need a doctor",
    category: "medical",
    icon: "🏥",
    translations: {
      ja: { text: "医者が必要です", pronunciation: "Isha ga hitsuyō desu" },
      fr: { text: "J'ai besoin d'un médecin", pronunciation: "Jay bezwan dun may-deh-san" },
      ar: { text: "أحتاج طبيب", pronunciation: "Ahtaju tabib" },
      th: { text: "ฉันต้องการหมอ", pronunciation: "Chan tông-gaan mŏr" },
      es: { text: "Necesito un médico", pronunciation: "Neh-seh-see-toh oon meh-dee-ko" },
    },
  },
  {
    id: "leave-alone",
    english: "Leave me alone!",
    category: "safety",
    icon: "🛑",
    translations: {
      ja: { text: "放っておいて！", pronunciation: "Hotte oite!" },
      fr: { text: "Laissez-moi tranquille !", pronunciation: "Lay-say mwa tron-keel!" },
      ar: { text: "!اتركني وشأني", pronunciation: "Utrukni wa sha'ni!" },
      th: { text: "ปล่อยฉันไว้!", pronunciation: "Bplòi chăn wái!" },
      es: { text: "¡Déjame en paz!", pronunciation: "Deh-ha-meh en pahs!" },
    },
  },
  {
    id: "embassy",
    english: "Take me to my embassy",
    category: "safety",
    icon: "🏛️",
    translations: {
      ja: { text: "大使館に連れて行ってください", pronunciation: "Taishikan ni tsurete itte kudasai" },
      fr: { text: "Emmenez-moi à mon ambassade", pronunciation: "Om-nay mwa ah mon om-bah-sahd" },
      ar: { text: "خذني إلى سفارتي", pronunciation: "Khuthni ila sifarati" },
      th: { text: "พาฉันไปที่สถานทูต", pronunciation: "Paa chăn bpai tee sa-tăan-tôot" },
      es: { text: "Lléveme a mi embajada", pronunciation: "Yeh-veh-meh ah mee em-bah-ha-da" },
    },
  },
  {
    id: "not-interested",
    english: "I'm not interested. Go away.",
    category: "safety",
    icon: "✋",
    translations: {
      ja: { text: "興味がありません。あっちへ行って。", pronunciation: "Kyōmi ga arimasen. Acchi e itte." },
      fr: { text: "Ça ne m'intéresse pas. Allez-vous en.", pronunciation: "Sa nuh man-teh-ress pah. Ah-lay voo zon." },
      ar: { text: ".لست مهتمة. ابتعد", pronunciation: "Lastu muhtamma. Ibta'id." },
      th: { text: "ฉันไม่สนใจ ไปให้พ้น", pronunciation: "Chăn mâi sŏn-jai. Bpai hâi pón." },
      es: { text: "No me interesa. Váyase.", pronunciation: "No meh een-teh-reh-sa. Vah-ya-seh." },
    },
  },
  {
    id: "taxi",
    english: "Call me a taxi, please",
    category: "general",
    icon: "🚕",
    translations: {
      ja: { text: "タクシーを呼んでください", pronunciation: "Takushī wo yonde kudasai" },
      fr: { text: "Appelez-moi un taxi, s'il vous plaît", pronunciation: "Applay mwa un taxi, seel voo play" },
      ar: { text: "من فضلك، اطلب لي تاكسي", pronunciation: "Min fadlak, utlub li taxi" },
      th: { text: "เรียกแท็กซี่ให้ฉันหน่อย", pronunciation: "Rîak taxi hâi chăn nòi" },
      es: { text: "Llámeme un taxi, por favor", pronunciation: "Yah-meh-meh oon taxi, por fa-vor" },
    },
  },
  {
    id: "hospital",
    english: "Where is the nearest hospital?",
    category: "medical",
    icon: "🏥",
    translations: {
      ja: { text: "一番近い病院はどこですか？", pronunciation: "Ichiban chikai byōin wa doko desu ka?" },
      fr: { text: "Où est l'hôpital le plus proche ?", pronunciation: "Oo ay lo-pee-tal luh ploo prosh?" },
      ar: { text: "أين أقرب مستشفى؟", pronunciation: "Ayn aqrab mustashfa?" },
      th: { text: "โรงพยาบาลที่ใกล้ที่สุดอยู่ที่ไหน?", pronunciation: "Rohng-pá-yaa-baan tee glâi tee sùt yòo tee năi?" },
      es: { text: "¿Dónde está el hospital más cercano?", pronunciation: "Don-deh es-tah el os-pee-tal mas ser-kah-no?" },
    },
  },
  {
    id: "allergic",
    english: "I am allergic. This is an emergency.",
    category: "medical",
    icon: "⚠️",
    translations: {
      ja: { text: "アレルギーがあります。緊急です。", pronunciation: "Arerugī ga arimasu. Kinkyū desu." },
      fr: { text: "Je suis allergique. C'est une urgence.", pronunciation: "Juh swee al-air-jeek. Set une ur-zhons." },
      ar: { text: ".عندي حساسية. هذه حالة طوارئ", pronunciation: "Indi hasasiya. Hadhihi halat tawari'." },
      th: { text: "ฉันแพ้ นี่เป็นเหตุฉุกเฉิน", pronunciation: "Chăn pâe. Nêe bpen hèht chùk-chěrn." },
      es: { text: "Soy alérgica. Es una emergencia.", pronunciation: "Soy ah-lair-hee-ka. Es oo-nah eh-mer-hen-see-ah." },
    },
  },
];

export const cities: City[] = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    emoji: "🇯🇵",
    safetyScore: 9,
    image: "🏯",
    timezone: "JST (UTC+9)",
    currency: "JPY (¥)",
    language: "Japanese",
    emergencyNumber: "110",
    policeNumber: "110",
    ambulanceNumber: "119",
    embassyNote: "US Embassy: 03-3224-5000",
    culturalBrief: {
      dressCode: "Generally relaxed, but cover shoulders and knees at temples and shrines. Conservative dress appreciated in business settings.",
      greetings: "Bow slightly when greeting. Handshakes are acceptable for foreigners. Avoid physical contact.",
      doNots: [
        "Don't tip — it's considered rude",
        "Don't eat while walking",
        "Don't talk loudly on public transport",
        "Don't stick chopsticks upright in rice",
      ],
      womenTips: [
        "Women-only train cars available during rush hours",
        "Extremely safe for solo women at all hours",
        "Konbini (convenience stores) are safe havens 24/7",
        "Be aware of discreet photography on trains — report to staff",
      ],
      photoRules: "Ask permission before photographing people. No photos in many temples and museums.",
      alcoholRules: "Legal drinking age is 20. Public drinking is legal but be mindful.",
      lgbtqLaws: "Same-sex relationships are legal. No anti-discrimination protection. Growing acceptance in urban areas.",
      religiousSites: "Remove shoes before entering temples. Purify hands at the water basin. Bow before entering.",
    },
    lgbtqSafety: {
      score: 7,
      level: "caution",
      legalStatus: "Legal but no anti-discrimination laws",
      enforcement: "No criminalization. Limited partnership recognition in some wards.",
      safeSpaces: ["Shinjuku Ni-chōme district", "Proudly bar", "Rainbow Pride events in April"],
      tips: ["PDA may draw stares but not hostility", "Ni-chōme is the heart of LGBTQ+ nightlife", "Most locals are accepting but private"],
    },
    transportOptions: [
      { id: "t1", name: "JR Yamanote Line", type: "public", rating: 9.5, verified: true, womenOnly: false, description: "Major loop line connecting all major stations. Women-only cars in morning rush.", priceRange: "¥150-500" },
      { id: "t2", name: "Women-Only Cars", type: "women-only", rating: 9.8, verified: true, womenOnly: true, description: "Available on major lines during rush hours (7-9:30 AM). Look for pink signage.", priceRange: "Same fare" },
      { id: "t3", name: "Japan Taxi", type: "taxi", rating: 9.0, verified: true, womenOnly: false, description: "Official taxi app. All drivers vetted and licensed. Automatic doors.", priceRange: "¥700-3000", phone: "03-5755-2151" },
    ],
    safeZones: [
      { name: "Shibuya Crossing Area", description: "Extremely busy and well-lit 24/7", lat: 35.6595, lng: 139.7004 },
      { name: "Ginza", description: "Upscale shopping district with constant police presence", lat: 35.6717, lng: 139.7649 },
    ],
    cautionZones: [
      { name: "Kabukichō", description: "Entertainment district — safe but persistent touts at night", lat: 35.6945, lng: 139.7035 },
    ],
    avoidZones: [],
    healthResources: [
      { id: "h1", name: "St. Luke's International Hospital", type: "hospital", hasFemaleDoctor: true, hasEmergencyContraception: true, address: "9-1 Akashi-cho, Chuo-ku", distance: "2.3 km", rating: 4.8 },
      { id: "h2", name: "Matsumoto Kiyoshi Shibuya", type: "pharmacy", hasFemaleDoctor: false, hasEmergencyContraception: true, address: "Shibuya Center-Gai", distance: "0.5 km", rating: 4.5 },
    ],
    reproductiveRights: {
      contraceptionLegal: true,
      emergencyContraceptionOTC: false,
      abortionLegal: "Legal with spousal consent requirement (controversial)",
      notes: "Emergency contraception requires a prescription (~¥7,000-15,000). Birth control pills available by prescription.",
      packFromHome: ["Sufficient birth control supply", "Emergency contraception", "Prescription documentation in English"],
      nearestFullAccess: "Available locally with prescription",
    },
    offlinePack: {
      sizeInMB: 45,
      lastUpdated: "2024-12-01",
      includes: ["Metro map", "Emergency numbers", "50 key phrases", "Safe zones map", "Hospital locations"],
    },
  },
  {
    id: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    emoji: "🇲🇦",
    safetyScore: 5,
    image: "🕌",
    timezone: "WET (UTC+1)",
    currency: "MAD (د.م.)",
    language: "Arabic, French",
    emergencyNumber: "19",
    policeNumber: "19",
    ambulanceNumber: "15",
    embassyNote: "US Consulate Casablanca: 0522-642-099",
    culturalBrief: {
      dressCode: "Cover shoulders, chest, and knees. Loose-fitting clothes recommended. Headscarf not required but useful for mosque visits.",
      greetings: "Right hand over heart for greeting. Men may not initiate handshake with women — let her extend first.",
      doNots: [
        "Don't photograph people without asking",
        "Don't drink alcohol in public outside licensed venues",
        "Don't show excessive affection in public",
        "Don't enter mosques (non-Muslims generally not permitted)",
      ],
      womenTips: [
        "Persistent vendor attention is normal — firm 'la shukran' (no thank you) works",
        "Hire a female guide for medina tours",
        "Riads (guesthouses) are generally safer than hotels for solo women",
        "Dress modestly to reduce unwanted attention significantly",
      ],
      photoRules: "Always ask before photographing people, especially women. Some may request payment.",
      alcoholRules: "Legal in licensed venues only. Not sold during Ramadan in many places. Public intoxication is illegal.",
      lgbtqLaws: "Same-sex relations are illegal. Up to 3 years imprisonment. Extreme caution advised.",
      religiousSites: "Non-Muslims cannot enter most mosques except Ben Youssef Madrasa. Dress very conservatively.",
    },
    lgbtqSafety: {
      score: 2,
      level: "dangerous",
      legalStatus: "Illegal — Article 489 criminalizes same-sex relations",
      enforcement: "Actively enforced. Arrests do occur.",
      safeSpaces: ["Private gatherings only", "Some international hotels are discreet"],
      tips: ["Avoid all public displays of affection", "Use VPN for dating apps", "Do not disclose orientation to locals"],
    },
    transportOptions: [
      { id: "t1", name: "Careem", type: "rideshare", rating: 7.5, verified: true, womenOnly: false, description: "App-based rideshare with driver tracking and fare estimates.", priceRange: "30-100 MAD" },
      { id: "t2", name: "Petit Taxi", type: "taxi", rating: 6.0, verified: false, womenOnly: false, description: "Metered city taxis. Insist on meter or agree price before. Sit in back seat.", priceRange: "20-50 MAD" },
      { id: "t3", name: "Riad-Arranged Transport", type: "taxi", rating: 8.5, verified: true, womenOnly: false, description: "Ask your riad to arrange trusted drivers. Pricier but safest option.", priceRange: "50-200 MAD" },
    ],
    safeZones: [
      { name: "Jemaa el-Fnaa (daytime)", description: "Main square — crowded and touristy, generally safe during the day", lat: 31.6258, lng: -7.9891 },
      { name: "Gueliz (New Town)", description: "Modern district with cafes and shops, more relaxed atmosphere", lat: 31.6340, lng: -8.0100 },
    ],
    cautionZones: [
      { name: "Medina Side Streets", description: "Can be disorienting. Persistent touts. Stay on main paths.", lat: 31.6310, lng: -7.9860 },
      { name: "Jemaa el-Fnaa (after 10 PM)", description: "Main square gets rougher late. Increased harassment risk.", lat: 31.6258, lng: -7.9891 },
    ],
    avoidZones: [
      { name: "Mellah after dark", description: "Poorly lit, sparse foot traffic at night", lat: 31.6210, lng: -7.9840 },
    ],
    healthResources: [
      { id: "h1", name: "Clinique Internationale", type: "clinic", hasFemaleDoctor: true, hasEmergencyContraception: false, address: "Rue Ibn Aicha, Gueliz", distance: "3.1 km", rating: 4.2 },
      { id: "h2", name: "Pharmacie du Sud", type: "pharmacy", hasFemaleDoctor: false, hasEmergencyContraception: false, address: "Avenue Mohammed V", distance: "1.8 km", rating: 4.0 },
    ],
    reproductiveRights: {
      contraceptionLegal: true,
      emergencyContraceptionOTC: false,
      abortionLegal: "Illegal except to save the mother's life",
      notes: "Contraception available at pharmacies but emergency contraception is very difficult to obtain. Abortion is criminalized.",
      packFromHome: ["All contraception needs", "Emergency contraception", "Menstrual products (preferred brands)", "Any prescription medications"],
      nearestFullAccess: "Spain (nearest with full reproductive healthcare access)",
    },
    offlinePack: {
      sizeInMB: 38,
      lastUpdated: "2024-11-15",
      includes: ["Medina map", "Emergency numbers", "40 key phrases (Arabic/French)", "Safe zones", "Pharmacy locations"],
    },
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    emoji: "🇫🇷",
    safetyScore: 7,
    image: "🗼",
    timezone: "CET (UTC+1)",
    currency: "EUR (€)",
    language: "French",
    emergencyNumber: "112",
    policeNumber: "17",
    ambulanceNumber: "15",
    embassyNote: "US Embassy: 01 43 12 22 22",
    culturalBrief: {
      dressCode: "Parisians dress stylishly but modestly. Avoid overly casual tourist wear. Church visits require covered shoulders.",
      greetings: "La bise (cheek kiss) among friends. Handshake for strangers. Always say 'Bonjour' when entering shops.",
      doNots: [
        "Don't skip greetings — saying 'Bonjour' is essential",
        "Don't be loud in restaurants",
        "Don't assume everyone speaks English",
        "Don't eat on the metro",
      ],
      womenTips: [
        "Catcalling is illegal since 2018 — you can report it",
        "Metro is generally safe but watch for pickpockets",
        "Well-lit areas along the Seine are beautiful but be cautious at night",
        "Pharmacies (green cross) are trusted for health advice",
      ],
      photoRules: "Street photography is generally fine. Respect privacy requests.",
      alcoholRules: "Legal drinking age is 18. Wine culture is central. Public drinking is legal.",
      lgbtqLaws: "Full legal protection. Same-sex marriage legal since 2013. Anti-discrimination laws in place.",
      religiousSites: "Cover shoulders in churches. Some require covered knees.",
    },
    lgbtqSafety: {
      score: 9,
      level: "safe",
      legalStatus: "Full legal equality including marriage",
      enforcement: "Strong anti-discrimination protections",
      safeSpaces: ["Le Marais district", "Centre LGBTI Paris-ÎdF", "Pride March in June"],
      tips: ["Very welcoming city overall", "Le Marais is the historic LGBTQ+ quarter", "PDA is normal and accepted"],
    },
    transportOptions: [
      { id: "t1", name: "RATP Metro", type: "public", rating: 8.0, verified: true, womenOnly: false, description: "Extensive metro network. Avoid empty cars late at night.", priceRange: "€2.15 per trip" },
      { id: "t2", name: "G7 Taxi", type: "taxi", rating: 8.5, verified: true, womenOnly: false, description: "Official Paris taxi company. Booked via app or phone.", priceRange: "€10-40", phone: "01 47 39 47 39" },
      { id: "t3", name: "Uber", type: "rideshare", rating: 8.0, verified: true, womenOnly: false, description: "Available throughout Paris. Good for late-night rides.", priceRange: "€8-35" },
    ],
    safeZones: [
      { name: "Le Marais", description: "Vibrant, well-populated neighborhood. Safe at all hours.", lat: 48.8566, lng: 2.3522 },
      { name: "Saint-Germain-des-Prés", description: "Upscale Left Bank area with constant foot traffic", lat: 48.8539, lng: 2.3338 },
    ],
    cautionZones: [
      { name: "Gare du Nord area", description: "Busy transit hub. Pickpockets active. Stay aware at night.", lat: 48.8809, lng: 2.3553 },
      { name: "Châtelet-Les Halles (night)", description: "Underground area can feel isolated after 11 PM", lat: 48.8612, lng: 2.3470 },
    ],
    avoidZones: [],
    healthResources: [
      { id: "h1", name: "Hôpital Hôtel-Dieu", type: "hospital", hasFemaleDoctor: true, hasEmergencyContraception: true, address: "1 Place du Parvis Notre-Dame", distance: "1.2 km", rating: 4.3 },
      { id: "h2", name: "Pharmacie des Champs", type: "pharmacy", hasFemaleDoctor: false, hasEmergencyContraception: true, address: "84 Avenue des Champs-Élysées", distance: "2.0 km", rating: 4.6 },
    ],
    reproductiveRights: {
      contraceptionLegal: true,
      emergencyContraceptionOTC: true,
      abortionLegal: "Legal up to 14 weeks, free with French health coverage",
      notes: "Emergency contraception (NorLevo) available OTC at any pharmacy for ~€7-20. Full reproductive healthcare access.",
      packFromHome: ["Prescription documentation if on specific birth control brand"],
      nearestFullAccess: "Available locally — France has full reproductive healthcare",
    },
    offlinePack: {
      sizeInMB: 52,
      lastUpdated: "2024-12-10",
      includes: ["Metro map", "Emergency numbers", "45 key phrases", "Safe zones map", "Pharmacy locations"],
    },
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    emoji: "🇹🇭",
    safetyScore: 6,
    image: "🛕",
    timezone: "ICT (UTC+7)",
    currency: "THB (฿)",
    language: "Thai",
    emergencyNumber: "191",
    policeNumber: "191",
    ambulanceNumber: "1669",
    embassyNote: "US Embassy: 02-205-4000",
    culturalBrief: {
      dressCode: "Cover knees and shoulders at temples. Thai women dress modestly. Casual wear OK in tourist areas but avoid very revealing clothing.",
      greetings: "Wai gesture (palms together, slight bow) is the standard greeting. Very respectful culture.",
      doNots: [
        "Never disrespect the monarchy — it's a serious crime",
        "Don't touch anyone's head",
        "Don't point feet at people or Buddha images",
        "Don't raise your voice — Thai culture values composure",
      ],
      womenTips: [
        "Generally safe for solo women travelers",
        "Avoid going to isolated areas with strangers",
        "Tuk-tuk drivers may overcharge — use Grab instead",
        "Full moon parties: go in groups and watch your drink",
      ],
      photoRules: "Ask before photographing monks. Never pose inappropriately with Buddha statues.",
      alcoholRules: "Legal drinking age is 20. Alcohol sales restricted 2-5 PM and after midnight.",
      lgbtqLaws: "No criminalization. Growing acceptance. Transgender people are relatively visible in society.",
      religiousSites: "Remove shoes. Cover knees and shoulders. Women cannot touch monks or hand things directly to them.",
    },
    lgbtqSafety: {
      score: 7,
      level: "caution",
      legalStatus: "Legal. Civil partnership bill passed in 2024.",
      enforcement: "No criminalization. Growing legal protections.",
      safeSpaces: ["Silom Soi 4", "DJ Station", "Bangkok Pride events"],
      tips: ["Thai society is generally tolerant", "Kathoey (transgender) are more visible here than most countries", "PDA is uncommon for all couples in Thai culture"],
    },
    transportOptions: [
      { id: "t1", name: "BTS Skytrain", type: "public", rating: 8.5, verified: true, womenOnly: false, description: "Modern elevated rail. Clean, safe, air-conditioned. Covers major tourist areas.", priceRange: "฿16-59" },
      { id: "t2", name: "Grab", type: "rideshare", rating: 8.0, verified: true, womenOnly: false, description: "Southeast Asia's main rideshare app. Tracked rides with upfront pricing.", priceRange: "฿60-300" },
      { id: "t3", name: "BTS Ladies' Car", type: "women-only", rating: 8.5, verified: true, womenOnly: true, description: "Designated women-only sections during rush hours on BTS.", priceRange: "Same fare" },
    ],
    safeZones: [
      { name: "Sukhumvit Road area", description: "Tourist-friendly area with hotels, malls, and nightlife", lat: 13.7373, lng: 100.5601 },
      { name: "Siam Square", description: "Major shopping and entertainment hub, well-policed", lat: 13.7453, lng: 100.5347 },
    ],
    cautionZones: [
      { name: "Khao San Road (late night)", description: "Backpacker area gets rowdy after midnight. Watch drinks.", lat: 13.7588, lng: 100.4972 },
      { name: "Patpong", description: "Red light district. Scams targeting tourists common.", lat: 13.7281, lng: 100.5347 },
    ],
    avoidZones: [],
    healthResources: [
      { id: "h1", name: "Bumrungrad International Hospital", type: "hospital", hasFemaleDoctor: true, hasEmergencyContraception: true, address: "33 Sukhumvit 3", distance: "1.5 km", rating: 4.9 },
      { id: "h2", name: "Watsons Pharmacy Siam", type: "pharmacy", hasFemaleDoctor: false, hasEmergencyContraception: true, address: "Siam Paragon, Floor 1", distance: "0.8 km", rating: 4.4 },
    ],
    reproductiveRights: {
      contraceptionLegal: true,
      emergencyContraceptionOTC: true,
      abortionLegal: "Legal up to 12 weeks (since 2021). Up to 20 weeks with conditions.",
      notes: "Emergency contraception available OTC at pharmacies (~฿50-200). Generally progressive reproductive healthcare.",
      packFromHome: ["Preferred contraception brand if specific"],
      nearestFullAccess: "Available locally",
    },
    offlinePack: {
      sizeInMB: 41,
      lastUpdated: "2024-11-28",
      includes: ["BTS/MRT map", "Emergency numbers", "45 Thai phrases", "Safe zones", "Hospital locations"],
    },
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    emoji: "🇲🇽",
    safetyScore: 6,
    image: "🌮",
    timezone: "CST (UTC-6)",
    currency: "MXN ($)",
    language: "Spanish",
    emergencyNumber: "911",
    policeNumber: "911",
    ambulanceNumber: "911",
    embassyNote: "US Embassy: 55-5080-2000",
    culturalBrief: {
      dressCode: "Casual and modern. No specific restrictions. Mexicans tend to dress up more than casual tourists.",
      greetings: "Cheek kiss on right cheek among women and mixed company. Handshake is fine for strangers.",
      doNots: [
        "Don't flash expensive jewelry or electronics",
        "Don't take unmarked taxis",
        "Don't walk alone late at night in unfamiliar areas",
        "Don't drink tap water",
      ],
      womenTips: [
        "Use authorized taxi stands (sitio) or Uber/DiDi",
        "Metro has women-only cars during rush hours",
        "Condesa and Roma neighborhoods are the safest for solo women",
        "Street food is generally safe from busy stalls",
      ],
      photoRules: "Generally relaxed. Ask permission in indigenous communities.",
      alcoholRules: "Legal drinking age is 18. Mezcal and tequila culture is strong. Avoid drinking excessively alone.",
      lgbtqLaws: "Same-sex marriage legal in Mexico City since 2010. Anti-discrimination protections.",
      religiousSites: "Catholic churches may request covered shoulders. Remove hats.",
    },
    lgbtqSafety: {
      score: 7,
      level: "caution",
      legalStatus: "Marriage equality and anti-discrimination laws in Mexico City",
      enforcement: "Laws are progressive but enforcement varies. Hate crimes still occur.",
      safeSpaces: ["Zona Rosa district", "Pride March in June (one of Latin America's largest)", "La Purísima bar"],
      tips: ["Mexico City is one of Latin America's most LGBTQ+-friendly cities", "Zona Rosa is the main LGBTQ+ neighborhood", "Exercise normal precautions"],
    },
    transportOptions: [
      { id: "t1", name: "Metro Women's Cars", type: "women-only", rating: 7.5, verified: true, womenOnly: true, description: "First 2 cars of each train are women/children only during rush hours.", priceRange: "$5 MXN" },
      { id: "t2", name: "Uber", type: "rideshare", rating: 8.0, verified: true, womenOnly: false, description: "Widely available and generally safe. Check driver ratings.", priceRange: "$50-200 MXN" },
      { id: "t3", name: "DiDi", type: "rideshare", rating: 7.5, verified: true, womenOnly: false, description: "Alternative rideshare app. DiDi Mujer option connects women drivers with women riders.", priceRange: "$45-180 MXN" },
      { id: "t4", name: "DiDi Mujer", type: "women-only", rating: 8.5, verified: true, womenOnly: true, description: "Women drivers for women passengers only. Extra safety features.", priceRange: "$50-200 MXN" },
    ],
    safeZones: [
      { name: "Roma & Condesa", description: "Trendy, well-lit neighborhoods popular with expats. Safe for walking.", lat: 19.4117, lng: -99.1711 },
      { name: "Polanco", description: "Upscale area with museums, restaurants, and strong security presence", lat: 19.4350, lng: -99.1949 },
    ],
    cautionZones: [
      { name: "Centro Histórico (night)", description: "Beautiful by day, some streets become isolated after dark", lat: 19.4326, lng: -99.1332 },
      { name: "Tepito", description: "Known for street markets but higher crime. Go with a guide only.", lat: 19.4440, lng: -99.1260 },
    ],
    avoidZones: [
      { name: "Doctores (night)", description: "Higher crime rates. Avoid walking alone after dark.", lat: 19.4200, lng: -99.1500 },
    ],
    healthResources: [
      { id: "h1", name: "Hospital Ángeles", type: "hospital", hasFemaleDoctor: true, hasEmergencyContraception: true, address: "Agrarismo 208, Escandón", distance: "2.8 km", rating: 4.7 },
      { id: "h2", name: "Farmacia San Pablo", type: "pharmacy", hasFemaleDoctor: false, hasEmergencyContraception: true, address: "Multiple locations", distance: "0.3 km", rating: 4.3 },
    ],
    reproductiveRights: {
      contraceptionLegal: true,
      emergencyContraceptionOTC: true,
      abortionLegal: "Legal up to 12 weeks in Mexico City (since 2007)",
      notes: "Emergency contraception available OTC at pharmacies. Mexico City has the most progressive reproductive rights in Mexico.",
      packFromHome: ["Preferred contraception brand if specific"],
      nearestFullAccess: "Available locally in Mexico City",
    },
    offlinePack: {
      sizeInMB: 44,
      lastUpdated: "2024-12-05",
      includes: ["Metro map", "Emergency numbers", "50 Spanish phrases", "Safe zones", "Hospital locations"],
    },
  },
];

export const languages = [
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "ar", name: "Arabic", flag: "🇲🇦" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "es", name: "Spanish", flag: "🇲🇽" },
];
