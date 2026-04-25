export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cities: {
        Row: {
          avg_daily_budget_usd: number | null
          best_time_to_visit: string | null
          country: string
          created_at: string
          cultural_tips: string[] | null
          currency: string
          description: string | null
          donts: string[] | null
          dos: string[] | null
          emergency_ambulance: string | null
          emergency_fire: string | null
          emergency_police: string | null
          emergency_women_helpline: string | null
          id: string
          image_url: string | null
          language: string
          latitude: number
          longitude: number
          name: string
          region: string
          safety_score: number
          timezone: string
          updated_at: string
        }
        Insert: {
          avg_daily_budget_usd?: number | null
          best_time_to_visit?: string | null
          country: string
          created_at?: string
          cultural_tips?: string[] | null
          currency: string
          description?: string | null
          donts?: string[] | null
          dos?: string[] | null
          emergency_ambulance?: string | null
          emergency_fire?: string | null
          emergency_police?: string | null
          emergency_women_helpline?: string | null
          id?: string
          image_url?: string | null
          language: string
          latitude: number
          longitude: number
          name: string
          region: string
          safety_score: number
          timezone: string
          updated_at?: string
        }
        Update: {
          avg_daily_budget_usd?: number | null
          best_time_to_visit?: string | null
          country?: string
          created_at?: string
          cultural_tips?: string[] | null
          currency?: string
          description?: string | null
          donts?: string[] | null
          dos?: string[] | null
          emergency_ambulance?: string | null
          emergency_fire?: string | null
          emergency_police?: string | null
          emergency_women_helpline?: string | null
          id?: string
          image_url?: string | null
          language?: string
          latitude?: number
          longitude?: number
          name?: string
          region?: string
          safety_score?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      city_safety_details: {
        Row: {
          city_id: string
          created_at: string
          danger_zones: string[] | null
          id: string
          night_safety_score: number | null
          safe_areas: string[] | null
          safety_tips: string[] | null
          scam_risk_score: number | null
          solo_travel_score: number | null
          street_harassment_score: number | null
          transport_safety_score: number | null
          updated_at: string
        }
        Insert: {
          city_id: string
          created_at?: string
          danger_zones?: string[] | null
          id?: string
          night_safety_score?: number | null
          safe_areas?: string[] | null
          safety_tips?: string[] | null
          scam_risk_score?: number | null
          solo_travel_score?: number | null
          street_harassment_score?: number | null
          transport_safety_score?: number | null
          updated_at?: string
        }
        Update: {
          city_id?: string
          created_at?: string
          danger_zones?: string[] | null
          id?: string
          night_safety_score?: number | null
          safe_areas?: string[] | null
          safety_tips?: string[] | null
          scam_risk_score?: number | null
          solo_travel_score?: number | null
          street_harassment_score?: number | null
          transport_safety_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "city_safety_details_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      dress_codes: {
        Row: {
          city_id: string
          created_at: string
          cultural_notes: string | null
          id: string
          location_type: string
          modesty_level: string | null
          recommended_attire: string
        }
        Insert: {
          city_id: string
          created_at?: string
          cultural_notes?: string | null
          id?: string
          location_type: string
          modesty_level?: string | null
          recommended_attire: string
        }
        Update: {
          city_id?: string
          created_at?: string
          cultural_notes?: string | null
          id?: string
          location_type?: string
          modesty_level?: string | null
          recommended_attire?: string
        }
        Relationships: [
          {
            foreignKeyName: "dress_codes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_phrases: {
        Row: {
          category: string
          created_at: string
          id: string
          language: string
          original_text: string
          pronunciation: string | null
          translated_text: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          language: string
          original_text: string
          pronunciation?: string | null
          translated_text: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          language?: string
          original_text?: string
          pronunciation?: string | null
          translated_text?: string
        }
        Relationships: []
      }
      health_resources: {
        Row: {
          accepts_travel_insurance: boolean | null
          address: string | null
          city_id: string
          created_at: string
          description: string | null
          english_speaking: boolean | null
          has_female_doctors: boolean | null
          has_reproductive_services: boolean | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          operating_hours: string | null
          phone: string | null
          type: string
          updated_at: string
        }
        Insert: {
          accepts_travel_insurance?: boolean | null
          address?: string | null
          city_id: string
          created_at?: string
          description?: string | null
          english_speaking?: boolean | null
          has_female_doctors?: boolean | null
          has_reproductive_services?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          operating_hours?: string | null
          phone?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          accepts_travel_insurance?: boolean | null
          address?: string | null
          city_id?: string
          created_at?: string
          description?: string | null
          english_speaking?: boolean | null
          has_female_doctors?: boolean | null
          has_reproductive_services?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          phone?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_resources_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      lgbtq_safety: {
        Row: {
          city_id: string
          created_at: string
          id: string
          legal_status: string | null
          overall_score: number | null
          resources: string[] | null
          safe_spaces: string[] | null
          social_acceptance: string | null
          updated_at: string
          warnings: string[] | null
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          legal_status?: string | null
          overall_score?: number | null
          resources?: string[] | null
          safe_spaces?: string[] | null
          social_acceptance?: string | null
          updated_at?: string
          warnings?: string[] | null
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          legal_status?: string | null
          overall_score?: number | null
          resources?: string[] | null
          safe_spaces?: string[] | null
          social_acceptance?: string | null
          updated_at?: string
          warnings?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "lgbtq_safety_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: true
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          home_city: string | null
          id: string
          preferred_language: string | null
          travel_style: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          home_city?: string | null
          id?: string
          preferred_language?: string | null
          travel_style?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          home_city?: string | null
          id?: string
          preferred_language?: string | null
          travel_style?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string | null
          city_id: string
          created_at: string
          cuisine_type: string
          description: string | null
          dietary_options: string[] | null
          highlight: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          price_range: string
          rating: number | null
          updated_at: string
          women_safety_score: number | null
        }
        Insert: {
          address?: string | null
          city_id: string
          created_at?: string
          cuisine_type: string
          description?: string | null
          dietary_options?: string[] | null
          highlight?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          price_range: string
          rating?: number | null
          updated_at?: string
          women_safety_score?: number | null
        }
        Update: {
          address?: string | null
          city_id?: string
          created_at?: string
          cuisine_type?: string
          description?: string | null
          dietary_options?: string[] | null
          highlight?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          price_range?: string
          rating?: number | null
          updated_at?: string
          women_safety_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      transit_routes: {
        Row: {
          city_id: string
          created_at: string
          description: string | null
          fare_info: string | null
          id: string
          operating_hours: string | null
          route_name: string
          safety_rating: number | null
          tips: string[] | null
          transport_type: string
          updated_at: string
          women_only: boolean | null
        }
        Insert: {
          city_id: string
          created_at?: string
          description?: string | null
          fare_info?: string | null
          id?: string
          operating_hours?: string | null
          route_name: string
          safety_rating?: number | null
          tips?: string[] | null
          transport_type: string
          updated_at?: string
          women_only?: boolean | null
        }
        Update: {
          city_id?: string
          created_at?: string
          description?: string | null
          fare_info?: string | null
          id?: string
          operating_hours?: string | null
          route_name?: string
          safety_rating?: number | null
          tips?: string[] | null
          transport_type?: string
          updated_at?: string
          women_only?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "transit_routes_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
