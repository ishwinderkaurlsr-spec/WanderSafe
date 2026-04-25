import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { INDIA_CITIES, type LocalCity } from "@/data/cityVisuals";

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .order("name");
      if (error) throw error;

      // Merge hardcoded India cities (if not already in DB)
      const ids = new Set((data ?? []).map(c => c.name.toLowerCase()));
      const extra = INDIA_CITIES.filter(c => !ids.has(c.name.toLowerCase()));
      const merged = [...(data ?? []), ...extra] as typeof data;
      return merged!.sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}

export function useCity(cityId: string | undefined) {
  return useQuery({
    queryKey: ["city", cityId],
    queryFn: async () => {
      if (!cityId) return null;

      // Local-only cities (e.g. India cities prefixed with "local-")
      if (cityId.startsWith("local-")) {
        return (INDIA_CITIES.find(c => c.id === cityId) ?? null) as any;
      }

      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("id", cityId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!cityId,
  });
}

export function useCitySafety(cityId: string | undefined) {
  return useQuery({
    queryKey: ["city-safety", cityId],
    queryFn: async () => {
      if (!cityId) return null;
      // Local-only cities don't have DB safety rows — return curated defaults
      if (cityId.startsWith("local-")) {
        const safetyMap: Record<string, any> = {
          "local-mumbai": { solo_travel_score: 6, night_safety_score: 5, transport_safety_score: 7, scam_risk_score: 5, street_harassment_score: 5, safe_areas: ["Bandra", "Colaba", "Juhu", "Powai"], danger_zones: ["Dharavi (night)", "CST area late night"] },
          "local-delhi":  { solo_travel_score: 5.5, night_safety_score: 5, transport_safety_score: 7.5, scam_risk_score: 5, street_harassment_score: 4.5, safe_areas: ["Connaught Place", "Hauz Khas", "Khan Market", "Lajpat Nagar"], danger_zones: ["Paharganj backstreets (night)", "Old Delhi after 10PM"] },
          "local-jaipur": { solo_travel_score: 6.5, night_safety_score: 6, transport_safety_score: 6.5, scam_risk_score: 5.5, street_harassment_score: 5.5, safe_areas: ["Civil Lines", "C-Scheme", "Pink City (day)", "MI Road"], danger_zones: ["Old City bazaars after 9PM"] },
        };
        return safetyMap[cityId] ?? null;
      }
      const { data, error } = await supabase
        .from("city_safety_details")
        .select("*")
        .eq("city_id", cityId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!cityId,
  });
}

export function useRestaurants(cityId?: string) {
  return useQuery({
    queryKey: ["restaurants", cityId],
    queryFn: async () => {
      let query = supabase.from("restaurants").select("*, cities(name)");
      if (cityId) query = query.eq("city_id", cityId);
      const { data, error } = await query.order("rating", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useTransitRoutes(cityId?: string) {
  return useQuery({
    queryKey: ["transit-routes", cityId],
    queryFn: async () => {
      let query = supabase.from("transit_routes").select("*");
      if (cityId) query = query.eq("city_id", cityId);
      const { data, error } = await query.order("safety_rating", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!cityId,
  });
}

export function useHealthResources(cityId?: string) {
  return useQuery({
    queryKey: ["health-resources", cityId],
    queryFn: async () => {
      let query = supabase.from("health_resources").select("*");
      if (cityId) query = query.eq("city_id", cityId);
      const { data, error } = await query.order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!cityId,
  });
}

export function useEmergencyPhrases(language?: string) {
  return useQuery({
    queryKey: ["emergency-phrases", language],
    queryFn: async () => {
      let query = supabase.from("emergency_phrases").select("*");
      if (language) query = query.eq("language", language);
      const { data, error } = await query.order("category");
      if (error) throw error;
      return data;
    },
  });
}

export function useDressCodes(cityId?: string) {
  return useQuery({
    queryKey: ["dress-codes", cityId],
    queryFn: async () => {
      let query = supabase.from("dress_codes").select("*, cities(name)");
      if (cityId) query = query.eq("city_id", cityId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useLgbtqSafety() {
  return useQuery({
    queryKey: ["lgbtq-safety"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lgbtq_safety")
        .select("*, cities(name, country, safety_score)")
        .order("overall_score", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
