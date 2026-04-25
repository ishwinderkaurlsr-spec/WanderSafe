// Phase 2 Mock Data

export interface Restaurant {
  id: string;
  name: string;
  cityId: string;
  cuisine: string;
  soloFriendly: number; // 1-5
  safetyRating: number; // 1-5
  staffRespect: number; // 1-5
  walkHomeSafety: number; // 1-5
  priceRange: "$" | "$$" | "$$$";
  dietary: string[];
  address: string;
  distance: string;
  image: string;
  reviewSnippet: string;
  reviewerName: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: "clothing" | "toiletries" | "documents" | "safety" | "tech" | "health";
  essential: boolean;
  culturalNote?: string;
}

export interface OutfitSuggestion {
  id: string;
  name: string;
  items: string[];
  occasions: string[];
  weather: string;
  culturallyAppropriate: boolean;
  image: string;
}

export interface DressCodeRef {
  id: string;
  cityId: string;
  context: string;
  description: string;
  image: string;
  dos: string[];
  donts: string[];
}

export interface TransitRoute {
  id: string;
  cityId: string;
  name: string;
  type: "metro" | "bus" | "tram" | "ferry" | "tuk-tuk" | "train";
  safetyScore: number;
  womenOnlyCars: boolean;
  operatingHours: string;
  fare: string;
  tips: string[];
}

export interface RideRecord {
  id: string;
  driverName: string;
  driverPhoto: string;
  licensePlate: string;
  vehicleModel: string;
  rating: number;
  date: string;
  status: "active" | "completed" | "cancelled";
  from: string;
  to: string;
}

export interface TravelerProfile {
  id: string;
  name: string;
  avatar: string;
  nationality: string;
  age: number;
  verified: boolean;
  currentCity: string;
  languages: string[];
  travelStyle: string;
  interests: string[];
  tripsCompleted: number;
  rating: number;
  bio: string;
}

export interface TravelStory {
  id: string;
  authorName: string;
  authorAvatar: string;
  cityId: string;
  title: string;
  excerpt: string;
  date: string;
  likes: number;
  safetyTip: string;
  tags: string[];
}

export interface Restroom {
  id: string;
  cityId: string;
  name: string;
  type: "hotel" | "mall" | "restaurant" | "public";
  safetyScore: number;
  cleanlinessScore: number;
  free: boolean;
  accessible: boolean;
  distance: string;
}

export interface FairPrice {
  id: string;
  cityId: string;
  item: string;
  localPrice: string;
  touristPrice: string;
  currency: string;
  tip: string;
}

export interface SafetyHeatmapZone {
  id: string;
  cityId: string;
  name: string;
  level: "safe" | "moderate" | "caution" | "avoid";
  dayScore: number;
  nightScore: number;
  lat: number;
  lng: number;
  notes: string;
}

export interface Destination {
  id: string;
  cityId: string;
  name: string;
  type: "landmark" | "museum" | "market" | "park" | "restaurant" | "nightlife";
  safetyScore: number;
  bestTime: string;
  dressCode: string;
  commonScams: string[];
  nearbyRestroom: boolean;
  image: string;
}

// ============ MOCK DATA ============

export const restaurants: Restaurant[] = [
  { id: "r1", name: "Sakura Teahouse", cityId: "tokyo", cuisine: "Japanese", soloFriendly: 5, safetyRating: 5, staffRespect: 5, walkHomeSafety: 5, priceRange: "$$", dietary: ["vegetarian", "gluten-free"], address: "Shibuya 2-4-1", distance: "0.3 km", image: "🍣", reviewSnippet: "Perfect for solo dining. Counter seating and warm staff made me feel so welcome.", reviewerName: "Emma T." },
  { id: "r2", name: "Le Petit Cluny", cityId: "paris", cuisine: "French", soloFriendly: 4, safetyRating: 5, staffRespect: 4, walkHomeSafety: 5, priceRange: "$$", dietary: ["vegetarian"], address: "14 Rue du Cluny, 5ème", distance: "1.2 km", image: "🥐", reviewSnippet: "Lovely sidewalk seating area. Staff doesn't rush you. Safe neighborhood.", reviewerName: "Maria L." },
  { id: "r3", name: "Riad Café", cityId: "marrakech", cuisine: "Moroccan", soloFriendly: 3, safetyRating: 4, staffRespect: 4, walkHomeSafety: 3, priceRange: "$", dietary: ["halal", "vegetarian"], address: "Derb Dabachi, Medina", distance: "0.8 km", image: "🫖", reviewSnippet: "Ask your riad for a female guide to help navigate the medina. Food is divine.", reviewerName: "Aisha K." },
  { id: "r4", name: "Sorn Bangkok", cityId: "bangkok", cuisine: "Thai", soloFriendly: 4, safetyRating: 5, staffRespect: 5, walkHomeSafety: 4, priceRange: "$$$", dietary: ["gluten-free"], address: "56 Sukhumvit 26", distance: "1.5 km", image: "🍜", reviewSnippet: "Intimate setting, gorgeous plating. Staff genuinely cares about solo guests.", reviewerName: "Lisa W." },
  { id: "r5", name: "Contramar", cityId: "mexico-city", cuisine: "Mexican Seafood", soloFriendly: 4, safetyRating: 5, staffRespect: 5, walkHomeSafety: 5, priceRange: "$$", dietary: ["gluten-free"], address: "Calle de Durango 200, Roma", distance: "0.5 km", image: "🌮", reviewSnippet: "Iconic CDMX spot. Solo counter is perfect. Roma Norte neighborhood feels very safe.", reviewerName: "Sofia R." },
  { id: "r6", name: "Ichiran Ramen", cityId: "tokyo", cuisine: "Japanese Ramen", soloFriendly: 5, safetyRating: 5, staffRespect: 5, walkHomeSafety: 5, priceRange: "$", dietary: [], address: "Shibuya Center-Gai", distance: "0.2 km", image: "🍜", reviewSnippet: "Individual booths designed for solo diners! Zero awkwardness. Open late and safe area.", reviewerName: "Rachel K." },
  { id: "r7", name: "Café de Flore", cityId: "paris", cuisine: "French Café", soloFriendly: 5, safetyRating: 5, staffRespect: 4, walkHomeSafety: 5, priceRange: "$$$", dietary: ["vegetarian"], address: "172 Blvd Saint-Germain", distance: "0.9 km", image: "☕", reviewSnippet: "Classic Parisian café. Reading alone here is practically a tradition.", reviewerName: "Claire D." },
  { id: "r8", name: "Rosetta", cityId: "mexico-city", cuisine: "Italian-Mexican", soloFriendly: 4, safetyRating: 5, staffRespect: 5, walkHomeSafety: 5, priceRange: "$$$", dietary: ["vegetarian"], address: "Colima 166, Roma Norte", distance: "0.7 km", image: "🍝", reviewSnippet: "Beautiful courtyard dining. Roma Norte is one of the safest neighborhoods in CDMX.", reviewerName: "Ana G." },
];

export const packingLists: Record<string, PackingItem[]> = {
  tokyo: [
    { id: "p1", name: "Comfortable walking shoes", category: "clothing", essential: true },
    { id: "p2", name: "Modest temple outfit (shoulders & knees covered)", category: "clothing", essential: true, culturalNote: "Required for temple visits" },
    { id: "p3", name: "Portable WiFi or SIM card", category: "tech", essential: true },
    { id: "p4", name: "Cash (many places don't accept cards)", category: "documents", essential: true },
    { id: "p5", name: "Small towel (for onsen visits)", category: "toiletries", essential: false },
    { id: "p6", name: "Door wedge alarm", category: "safety", essential: true },
    { id: "p7", name: "Prescription translations in Japanese", category: "health", essential: false },
    { id: "p8", name: "Rain gear (collapsible umbrella)", category: "clothing", essential: true },
  ],
  marrakech: [
    { id: "p1", name: "Long loose pants/skirts", category: "clothing", essential: true, culturalNote: "Essential for reducing unwanted attention" },
    { id: "p2", name: "Lightweight scarf (multipurpose)", category: "clothing", essential: true, culturalNote: "For mosque areas, sun protection, and modesty" },
    { id: "p3", name: "Closed-toe shoes (medina cobblestones)", category: "clothing", essential: true },
    { id: "p4", name: "Personal safety alarm", category: "safety", essential: true },
    { id: "p5", name: "Anti-theft crossbody bag", category: "safety", essential: true },
    { id: "p6", name: "Sunscreen SPF 50+", category: "toiletries", essential: true },
    { id: "p7", name: "All medications from home", category: "health", essential: true, culturalNote: "Some medications unavailable locally" },
    { id: "p8", name: "Photocopies of passport", category: "documents", essential: true },
  ],
  paris: [
    { id: "p1", name: "Stylish walking shoes", category: "clothing", essential: true },
    { id: "p2", name: "Light scarf for churches", category: "clothing", essential: true, culturalNote: "Cover shoulders in churches" },
    { id: "p3", name: "Anti-theft bag (pickpocket protection)", category: "safety", essential: true },
    { id: "p4", name: "Metro pass (Navigo Découverte)", category: "documents", essential: false },
    { id: "p5", name: "Portable charger", category: "tech", essential: true },
    { id: "p6", name: "Travel umbrella", category: "clothing", essential: true },
  ],
  bangkok: [
    { id: "p1", name: "Long pants/skirt for temples", category: "clothing", essential: true, culturalNote: "Knees and shoulders must be covered at temples" },
    { id: "p2", name: "Lightweight, breathable clothes", category: "clothing", essential: true },
    { id: "p3", name: "Bug spray with DEET", category: "toiletries", essential: true },
    { id: "p4", name: "Reusable water bottle with filter", category: "health", essential: true, culturalNote: "Don't drink tap water" },
    { id: "p5", name: "Portable door lock", category: "safety", essential: true },
    { id: "p6", name: "Grab app installed", category: "tech", essential: true },
  ],
  "mexico-city": [
    { id: "p1", name: "Layers (altitude = variable temps)", category: "clothing", essential: true },
    { id: "p2", name: "Sunscreen & hat", category: "toiletries", essential: true },
    { id: "p3", name: "Anti-theft bag", category: "safety", essential: true },
    { id: "p4", name: "Uber/DiDi apps installed", category: "tech", essential: true, culturalNote: "Never hail unmarked taxis" },
    { id: "p5", name: "Pepto-Bismol/probiotics", category: "health", essential: true },
    { id: "p6", name: "Cash in small bills", category: "documents", essential: true },
  ],
};

export const outfitSuggestions: OutfitSuggestion[] = [
  { id: "o1", name: "Temple Day Look", items: ["Wide-leg linen pants", "Cotton button-up (3/4 sleeve)", "Comfortable sandals", "Lightweight scarf"], occasions: ["Temple visits", "Cultural sites"], weather: "Warm", culturallyAppropriate: true, image: "👗" },
  { id: "o2", name: "Medina Explorer", items: ["Loose maxi dress", "Flat leather sandals", "Crossbody bag", "Sun hat"], occasions: ["Market shopping", "City walks"], weather: "Hot", culturallyAppropriate: true, image: "👘" },
  { id: "o3", name: "Parisian Chic", items: ["Dark jeans", "Breton stripe top", "Trench coat", "Ballet flats"], occasions: ["Cafés", "Museums", "Evening out"], weather: "Cool", culturallyAppropriate: true, image: "🧥" },
  { id: "o4", name: "Street Food Tour", items: ["Breathable shorts", "Loose tank top", "Sneakers", "Small backpack"], occasions: ["Market tours", "Food crawls"], weather: "Hot & humid", culturallyAppropriate: true, image: "👟" },
  { id: "o5", name: "Night Out Safe", items: ["Midi dress", "Denim jacket (for cabs)", "Block heels", "Clutch with phone pocket"], occasions: ["Dinner", "Bars"], weather: "Mild", culturallyAppropriate: true, image: "👠" },
];

export const dressCodeRefs: DressCodeRef[] = [
  { id: "d1", cityId: "tokyo", context: "Temples & Shrines", description: "Modest clothing covering shoulders and knees. Shoes removed at entrance.", image: "⛩️", dos: ["Cover shoulders", "Wear easy-to-remove shoes", "Carry a small towel"], donts: ["No sleeveless tops", "No very short skirts", "No loud colors at funerals"] },
  { id: "d2", cityId: "marrakech", context: "Daily Wear", description: "Loose-fitting clothing covering from shoulders to below knees. Headscarf helpful but not required.", image: "🧕", dos: ["Loose pants or long skirts", "Covered shoulders always", "Light layers for heat"], donts: ["No tight/revealing clothes", "No shorts in the medina", "No bikini tops outside pools"] },
  { id: "d3", cityId: "paris", context: "Church Visits", description: "Cover shoulders. Some basilicas check at entry.", image: "⛪", dos: ["Carry a light scarf", "Dress elegantly", "Comfortable but chic"], donts: ["No tank tops", "No flip-flops", "No very casual tourist wear"] },
  { id: "d4", cityId: "bangkok", context: "Royal Palace & Temples", description: "Strict dress code: long pants/skirts, covered shoulders, closed shoes. Sarongs available for rent at some sites.", image: "🛕", dos: ["Long pants or maxi skirt", "Sleeved top", "Closed-toe shoes"], donts: ["No bare shoulders", "No shorts", "No see-through clothing"] },
  { id: "d5", cityId: "mexico-city", context: "Catholic Churches", description: "Cover shoulders. Remove hats. Generally relaxed otherwise.", image: "⛪", dos: ["Light scarf for shoulders", "Modest neckline", "Remove hats indoors"], donts: ["No very revealing outfits", "No caps inside churches"] },
];

export const transitRoutes: TransitRoute[] = [
  { id: "tr1", cityId: "tokyo", name: "Yamanote Line", type: "train", safetyScore: 9.5, womenOnlyCars: true, operatingHours: "4:30 AM – 1:00 AM", fare: "¥150-500", tips: ["Women-only cars at front during 7-9:30 AM", "Very crowded during rush hour", "Avoid last trains (drunk passengers)"] },
  { id: "tr2", cityId: "paris", name: "Métro", type: "metro", safetyScore: 7.5, womenOnlyCars: false, operatingHours: "5:30 AM – 1:15 AM", fare: "€2.15 single", tips: ["Stay in populated cars", "Watch for pickpockets on Line 1", "Avoid Châtelet late at night"] },
  { id: "tr3", cityId: "bangkok", name: "BTS Skytrain", type: "train", safetyScore: 8.5, womenOnlyCars: true, operatingHours: "6:00 AM – 12:00 AM", fare: "฿16-59", tips: ["Ladies' car available during rush", "Air-conditioned", "Covers major tourist areas"] },
  { id: "tr4", cityId: "mexico-city", name: "Metro", type: "metro", safetyScore: 6.5, womenOnlyCars: true, operatingHours: "5:00 AM – 12:00 AM", fare: "$5 MXN", tips: ["First 2 cars women/children only in rush", "Very crowded", "Watch belongings on Line 3"] },
  { id: "tr5", cityId: "marrakech", name: "Tram T1", type: "tram", safetyScore: 7.0, womenOnlyCars: false, operatingHours: "6:00 AM – 10:30 PM", fare: "6 MAD", tips: ["Clean and modern", "Covers Gueliz to Medina", "Can get crowded midday"] },
  { id: "tr6", cityId: "bangkok", name: "Chao Phraya Express Boat", type: "ferry", safetyScore: 7.5, womenOnlyCars: false, operatingHours: "6:00 AM – 7:00 PM", fare: "฿15-32", tips: ["Orange flag boats are cheapest", "Great for avoiding traffic", "Watch your step on/off"] },
];

export const rideRecords: RideRecord[] = [
  { id: "rd1", driverName: "Yuki T.", driverPhoto: "👩", licensePlate: "品川 300 あ 12-34", vehicleModel: "Toyota Comfort", rating: 4.9, date: "2024-12-15", status: "completed", from: "Shibuya Station", to: "Hotel Gracery Shinjuku" },
  { id: "rd2", driverName: "Pierre M.", driverPhoto: "👨", licensePlate: "AB-123-CD", vehicleModel: "Peugeot 508", rating: 4.7, date: "2024-12-14", status: "completed", from: "CDG Airport", to: "Le Marais Hotel" },
  { id: "rd3", driverName: "Active Ride", driverPhoto: "👩", licensePlate: "กท 1234", vehicleModel: "Toyota Vios", rating: 4.8, date: "Today", status: "active", from: "Siam Paragon", to: "Sukhumvit 26" },
];

export const travelerProfiles: TravelerProfile[] = [
  { id: "tp1", name: "Sarah Chen", avatar: "👩‍💻", nationality: "Canadian", age: 29, verified: true, currentCity: "Tokyo", languages: ["English", "Mandarin", "Basic Japanese"], travelStyle: "Cultural Explorer", interests: ["Photography", "Street Food", "Temple hopping"], tripsCompleted: 12, rating: 4.9, bio: "Software engineer traveling Asia. Love finding hidden gems and safe solo spots." },
  { id: "tp2", name: "Maya Johansson", avatar: "👩‍🎨", nationality: "Swedish", age: 34, verified: true, currentCity: "Paris", languages: ["English", "Swedish", "French"], travelStyle: "Art & Culture", interests: ["Museums", "Wine tasting", "Cycling"], tripsCompleted: 23, rating: 4.8, bio: "Art curator exploring European cities one gallery at a time." },
  { id: "tp3", name: "Priya Sharma", avatar: "👩‍⚕️", nationality: "Indian", age: 27, verified: true, currentCity: "Bangkok", languages: ["English", "Hindi", "Basic Thai"], travelStyle: "Budget Adventurer", interests: ["Street food", "Yoga", "Night markets"], tripsCompleted: 8, rating: 4.7, bio: "Medical student on a gap year. Love cooking classes and meditation retreats." },
  { id: "tp4", name: "Elena Rodriguez", avatar: "👩‍💼", nationality: "Mexican", age: 31, verified: true, currentCity: "Mexico City", languages: ["English", "Spanish", "Portuguese"], travelStyle: "Food & Nightlife", interests: ["Mezcal tours", "Local food scenes", "Salsa dancing"], tripsCompleted: 15, rating: 4.6, bio: "Marketing manager by day, taco hunter by night. Ask me about hidden mezcalerías!" },
  { id: "tp5", name: "Amara Osei", avatar: "👩‍🔬", nationality: "Ghanaian", age: 26, verified: true, currentCity: "Marrakech", languages: ["English", "French", "Twi"], travelStyle: "Solo Backpacker", interests: ["Hiking", "Bargaining", "Photography"], tripsCompleted: 6, rating: 4.8, bio: "Researcher exploring North Africa. Specialist in navigating souks and finding the best mint tea." },
];

export const travelStories: TravelStory[] = [
  { id: "ts1", authorName: "Sarah Chen", authorAvatar: "👩‍💻", cityId: "tokyo", title: "48 Hours Solo in Tokyo: A Women's Safety Guide", excerpt: "From konbini at 3AM to women-only train cars, here's everything I wish I knew before my first solo trip to Tokyo...", date: "2024-12-10", likes: 234, safetyTip: "Konbini convenience stores are 24/7 safe havens", tags: ["Solo", "Safety", "First-timer"] },
  { id: "ts2", authorName: "Amara Osei", authorAvatar: "👩‍🔬", cityId: "marrakech", title: "Navigating Marrakech's Medina as a Solo Woman", excerpt: "The medina can feel overwhelming at first. Here's how I found confidence, safety, and the most incredible rooftop restaurants...", date: "2024-11-28", likes: 189, safetyTip: "Always arrange riad pickup for your first day", tags: ["Solo", "Cultural", "Tips"] },
  { id: "ts3", authorName: "Maya Johansson", authorAvatar: "👩‍🎨", cityId: "paris", title: "Paris Beyond the Tourist Trail: Safe & Solo", excerpt: "Forget the Eiffel Tower selfie. Here are the neighborhoods, cafés, and hidden spots where Parisian women actually hang out...", date: "2024-12-05", likes: 312, safetyTip: "Le Marais is the safest area for solo dining at night", tags: ["Art", "Solo", "Hidden gems"] },
  { id: "ts4", authorName: "Priya Sharma", authorAvatar: "👩‍⚕️", cityId: "bangkok", title: "Bangkok on a Budget: Safe & Spicy", excerpt: "How I spent 2 weeks in Bangkok for under $500, ate the best food of my life, and never once felt unsafe...", date: "2024-12-01", likes: 276, safetyTip: "Grab app is your best friend for safe transport", tags: ["Budget", "Food", "Solo"] },
  { id: "ts5", authorName: "Elena Rodriguez", authorAvatar: "👩‍💼", cityId: "mexico-city", title: "CDMX: Why Every Solo Woman Should Visit", excerpt: "Roma Norte, incredible food, warm people, and a city that actually gets safer every year for solo women travelers...", date: "2024-12-08", likes: 198, safetyTip: "Stick to Roma/Condesa and always use Uber or DiDi", tags: ["Food", "Culture", "Safety"] },
];

export const restrooms: Restroom[] = [
  { id: "rr1", cityId: "tokyo", name: "Shibuya 109 Mall", type: "mall", safetyScore: 5, cleanlinessScore: 5, free: true, accessible: true, distance: "0.2 km" },
  { id: "rr2", cityId: "tokyo", name: "Starbucks Shibuya Crossing", type: "restaurant", safetyScore: 5, cleanlinessScore: 4, free: true, accessible: true, distance: "0.3 km" },
  { id: "rr3", cityId: "paris", name: "Galeries Lafayette", type: "mall", safetyScore: 5, cleanlinessScore: 4, free: true, accessible: true, distance: "1.1 km" },
  { id: "rr4", cityId: "paris", name: "Sanisettes (Public)", type: "public", safetyScore: 3, cleanlinessScore: 3, free: true, accessible: true, distance: "0.4 km" },
  { id: "rr5", cityId: "marrakech", name: "Royal Mansour Hotel", type: "hotel", safetyScore: 5, cleanlinessScore: 5, free: false, accessible: true, distance: "0.8 km" },
  { id: "rr6", cityId: "bangkok", name: "CentralWorld Mall", type: "mall", safetyScore: 5, cleanlinessScore: 5, free: true, accessible: true, distance: "0.5 km" },
  { id: "rr7", cityId: "mexico-city", name: "Palacio de Hierro Polanco", type: "mall", safetyScore: 5, cleanlinessScore: 5, free: true, accessible: true, distance: "1.3 km" },
];

export const fairPrices: FairPrice[] = [
  { id: "fp1", cityId: "tokyo", item: "Taxi (5 km ride)", localPrice: "¥1,500", touristPrice: "¥1,500", currency: "JPY", tip: "Taxis use meters — no need to negotiate" },
  { id: "fp2", cityId: "marrakech", item: "Leather bag in souk", localPrice: "150-200 MAD", touristPrice: "500-800 MAD", currency: "MAD", tip: "Start at 30% of asking price. Walk away if needed." },
  { id: "fp3", cityId: "marrakech", item: "Taxi Medina to Gueliz", localPrice: "15-20 MAD", touristPrice: "50-100 MAD", currency: "MAD", tip: "Insist on meter or agree price before entering" },
  { id: "fp4", cityId: "bangkok", item: "Tuk-tuk short ride", localPrice: "฿40-60", touristPrice: "฿200-300", currency: "THB", tip: "Use Grab instead for fair pricing" },
  { id: "fp5", cityId: "bangkok", item: "Pad Thai (street stall)", localPrice: "฿40-60", touristPrice: "฿100-150", currency: "THB", tip: "Walk to stalls where locals are eating" },
  { id: "fp6", cityId: "mexico-city", item: "Street tacos (5 pcs)", localPrice: "$30-50 MXN", touristPrice: "$80-120 MXN", currency: "MXN", tip: "Eat where there's a queue of locals" },
  { id: "fp7", cityId: "paris", item: "Coffee at café", localPrice: "€2-3", touristPrice: "€5-7", currency: "EUR", tip: "Standing at the bar (comptoir) is cheaper than sitting" },
];

export const safetyHeatmap: SafetyHeatmapZone[] = [
  { id: "sh1", cityId: "tokyo", name: "Shibuya Center", level: "safe", dayScore: 9.5, nightScore: 9, lat: 35.6595, lng: 139.7004, notes: "Extremely busy and well-lit 24/7" },
  { id: "sh2", cityId: "tokyo", name: "Kabukichō", level: "moderate", dayScore: 8, nightScore: 5, lat: 35.6945, lng: 139.7035, notes: "Entertainment district — safe daytime, persistent touts at night" },
  { id: "sh3", cityId: "paris", name: "Le Marais", level: "safe", dayScore: 9, nightScore: 8.5, lat: 48.8566, lng: 2.3522, notes: "Vibrant, well-populated. Safe at all hours." },
  { id: "sh4", cityId: "paris", name: "Gare du Nord", level: "caution", dayScore: 7, nightScore: 4, lat: 48.8809, lng: 2.3553, notes: "Transit hub. Pickpockets. Uncomfortable at night." },
  { id: "sh5", cityId: "marrakech", name: "Jemaa el-Fnaa", level: "moderate", dayScore: 7.5, nightScore: 4, lat: 31.6258, lng: -7.9891, notes: "Touristy and busy during day, rougher after 10 PM" },
  { id: "sh6", cityId: "marrakech", name: "Gueliz", level: "safe", dayScore: 8.5, nightScore: 7, lat: 31.6340, lng: -8.0100, notes: "Modern district. Relaxed atmosphere." },
  { id: "sh7", cityId: "bangkok", name: "Siam Square", level: "safe", dayScore: 9, nightScore: 8, lat: 13.7453, lng: 100.5347, notes: "Major shopping hub, well-policed" },
  { id: "sh8", cityId: "bangkok", name: "Khao San Road", level: "caution", dayScore: 7, nightScore: 4.5, lat: 13.7588, lng: 100.4972, notes: "Backpacker area gets rowdy after midnight" },
  { id: "sh9", cityId: "mexico-city", name: "Roma & Condesa", level: "safe", dayScore: 9, nightScore: 8, lat: 19.4117, lng: -99.1711, notes: "Trendy, well-lit. Safe for walking." },
  { id: "sh10", cityId: "mexico-city", name: "Doctores", level: "avoid", dayScore: 5, nightScore: 2, lat: 19.4200, lng: -99.1500, notes: "Higher crime. Avoid walking alone after dark." },
];

export const destinations: Destination[] = [
  { id: "dest1", cityId: "tokyo", name: "Senso-ji Temple", type: "landmark", safetyScore: 9.5, bestTime: "Early morning (7-9 AM)", dressCode: "Cover shoulders and knees", commonScams: ["Fake monks asking for donations"], nearbyRestroom: true, image: "⛩️" },
  { id: "dest2", cityId: "tokyo", name: "Tsukiji Outer Market", type: "market", safetyScore: 9, bestTime: "Morning (8-11 AM)", dressCode: "Casual", commonScams: ["Overpriced sushi at tourist-facing stalls"], nearbyRestroom: true, image: "🐟" },
  { id: "dest3", cityId: "paris", name: "Musée d'Orsay", type: "museum", safetyScore: 9.5, bestTime: "Thursday evenings (late opening)", dressCode: "Smart casual", commonScams: ["Petition scam outside"], nearbyRestroom: true, image: "🎨" },
  { id: "dest4", cityId: "marrakech", name: "Jardin Majorelle", type: "park", safetyScore: 8.5, bestTime: "Late afternoon", dressCode: "Modest — cover shoulders", commonScams: ["Unofficial guides at entrance"], nearbyRestroom: true, image: "🌿" },
  { id: "dest5", cityId: "bangkok", name: "Grand Palace", type: "landmark", safetyScore: 8, bestTime: "Opening time (8:30 AM)", dressCode: "Strict — long pants, covered shoulders, closed shoes", commonScams: ["'Palace is closed today' redirect scam"], nearbyRestroom: true, image: "🏯" },
  { id: "dest6", cityId: "mexico-city", name: "Museo Frida Kahlo", type: "museum", safetyScore: 9, bestTime: "Weekday mornings", dressCode: "Casual", commonScams: ["Fake tickets from street vendors"], nearbyRestroom: true, image: "🎭" },
];

export const customPhrases = [
  { id: "cp1", english: "I have a shellfish allergy", category: "health" },
  { id: "cp2", english: "My hotel is at this address", category: "directions" },
  { id: "cp3", english: "I am vegetarian", category: "food" },
  { id: "cp4", english: "How much does this cost?", category: "shopping" },
  { id: "cp5", english: "Is this area safe at night?", category: "safety" },
];

export const insurancePlans = [
  { id: "ins1", name: "SafeHer Travel Shield", price: "$45/trip", coverage: ["Emergency evacuation", "Assault-related medical care", "Mental health support", "Pregnancy emergencies", "Stolen belongings"], rating: 4.8, womenSpecific: true, redFlags: [] },
  { id: "ins2", name: "World Nomads Explorer", price: "$65/trip", coverage: ["Adventure activities", "Medical evacuation", "Trip cancellation", "Electronics coverage"], rating: 4.5, womenSpecific: false, redFlags: ["No specific assault-related coverage", "Mental health exclusion"] },
  { id: "ins3", name: "Allianz Global Assist", price: "$55/trip", coverage: ["Medical emergency", "Trip interruption", "Baggage loss", "24/7 hotline"], rating: 4.3, womenSpecific: false, redFlags: ["Pregnancy exclusion after 26 weeks", "Limited mental health coverage"] },
];

export const capsuleWardrobe = {
  items: [
    { id: "cw1", name: "Black leggings", versatility: 5, image: "🦵" },
    { id: "cw2", name: "White button-down", versatility: 5, image: "👔" },
    { id: "cw3", name: "Linen wide-leg pants", versatility: 4, image: "👖" },
    { id: "cw4", name: "Maxi wrap dress", versatility: 5, image: "👗" },
    { id: "cw5", name: "Denim jacket", versatility: 4, image: "🧥" },
    { id: "cw6", name: "Black midi skirt", versatility: 5, image: "💃" },
    { id: "cw7", name: "Neutral tank top", versatility: 4, image: "👚" },
    { id: "cw8", name: "Light scarf", versatility: 5, image: "🧣" },
  ],
  outfits: [
    { name: "Temple Visit", items: ["cw3", "cw2", "cw8"] },
    { name: "City Exploration", items: ["cw1", "cw7", "cw5"] },
    { name: "Dinner Out", items: ["cw4", "cw8"] },
    { name: "Market Day", items: ["cw6", "cw2", "cw5"] },
    { name: "Travel Day", items: ["cw1", "cw2", "cw5"] },
    { name: "Beach Cover-up", items: ["cw3", "cw7", "cw8"] },
  ],
};
