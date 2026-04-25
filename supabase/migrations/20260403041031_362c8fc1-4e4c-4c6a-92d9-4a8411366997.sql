
-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ==================== CITIES ====================
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  safety_score NUMERIC(3,1) NOT NULL CHECK (safety_score >= 0 AND safety_score <= 10),
  description TEXT,
  image_url TEXT,
  emergency_police TEXT,
  emergency_ambulance TEXT,
  emergency_fire TEXT,
  emergency_women_helpline TEXT,
  language TEXT NOT NULL,
  currency TEXT NOT NULL,
  timezone TEXT NOT NULL,
  best_time_to_visit TEXT,
  avg_daily_budget_usd NUMERIC(8,2),
  cultural_tips TEXT[],
  dos TEXT[],
  donts TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone" ON public.cities FOR SELECT USING (true);
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON public.cities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== CITY SAFETY DETAILS ====================
CREATE TABLE public.city_safety_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  solo_travel_score NUMERIC(3,1) CHECK (solo_travel_score >= 0 AND solo_travel_score <= 10),
  night_safety_score NUMERIC(3,1) CHECK (night_safety_score >= 0 AND night_safety_score <= 10),
  transport_safety_score NUMERIC(3,1) CHECK (transport_safety_score >= 0 AND transport_safety_score <= 10),
  scam_risk_score NUMERIC(3,1) CHECK (scam_risk_score >= 0 AND scam_risk_score <= 10),
  street_harassment_score NUMERIC(3,1) CHECK (street_harassment_score >= 0 AND street_harassment_score <= 10),
  danger_zones TEXT[],
  safe_areas TEXT[],
  safety_tips TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.city_safety_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "City safety details viewable by everyone" ON public.city_safety_details FOR SELECT USING (true);
CREATE TRIGGER update_city_safety_updated_at BEFORE UPDATE ON public.city_safety_details FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== RESTAURANTS ====================
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cuisine_type TEXT NOT NULL,
  price_range TEXT NOT NULL CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  women_safety_score NUMERIC(3,1) CHECK (women_safety_score >= 0 AND women_safety_score <= 10),
  address TEXT,
  description TEXT,
  dietary_options TEXT[],
  highlight TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Restaurants viewable by everyone" ON public.restaurants FOR SELECT USING (true);
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== TRANSIT ROUTES ====================
CREATE TABLE public.transit_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  route_name TEXT NOT NULL,
  transport_type TEXT NOT NULL,
  safety_rating NUMERIC(3,1) CHECK (safety_rating >= 0 AND safety_rating <= 10),
  women_only BOOLEAN DEFAULT false,
  operating_hours TEXT,
  fare_info TEXT,
  description TEXT,
  tips TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transit_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Transit routes viewable by everyone" ON public.transit_routes FOR SELECT USING (true);
CREATE TRIGGER update_transit_updated_at BEFORE UPDATE ON public.transit_routes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== HEALTH RESOURCES ====================
CREATE TABLE public.health_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pharmacy', 'clinic', 'hospital', 'women_health_center')),
  has_female_doctors BOOLEAN DEFAULT false,
  address TEXT,
  phone TEXT,
  operating_hours TEXT,
  has_reproductive_services BOOLEAN DEFAULT false,
  accepts_travel_insurance BOOLEAN DEFAULT false,
  english_speaking BOOLEAN DEFAULT false,
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.health_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Health resources viewable by everyone" ON public.health_resources FOR SELECT USING (true);
CREATE TRIGGER update_health_updated_at BEFORE UPDATE ON public.health_resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== EMERGENCY PHRASES ====================
CREATE TABLE public.emergency_phrases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL,
  category TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  pronunciation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.emergency_phrases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Emergency phrases viewable by everyone" ON public.emergency_phrases FOR SELECT USING (true);

-- ==================== DRESS CODES ====================
CREATE TABLE public.dress_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  location_type TEXT NOT NULL,
  recommended_attire TEXT NOT NULL,
  cultural_notes TEXT,
  modesty_level TEXT CHECK (modesty_level IN ('relaxed', 'moderate', 'conservative', 'strict')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dress_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dress codes viewable by everyone" ON public.dress_codes FOR SELECT USING (true);

-- ==================== LGBTQ SAFETY ====================
CREATE TABLE public.lgbtq_safety (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE UNIQUE,
  overall_score NUMERIC(3,1) CHECK (overall_score >= 0 AND overall_score <= 10),
  legal_status TEXT,
  social_acceptance TEXT,
  safe_spaces TEXT[],
  warnings TEXT[],
  resources TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lgbtq_safety ENABLE ROW LEVEL SECURITY;
CREATE POLICY "LGBTQ safety viewable by everyone" ON public.lgbtq_safety FOR SELECT USING (true);
CREATE TRIGGER update_lgbtq_updated_at BEFORE UPDATE ON public.lgbtq_safety FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== PROFILES ====================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  home_city TEXT,
  travel_style TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== USER ROLES ====================
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ==================== INDEXES ====================
CREATE INDEX idx_cities_country ON public.cities(country);
CREATE INDEX idx_cities_region ON public.cities(region);
CREATE INDEX idx_restaurants_city ON public.restaurants(city_id);
CREATE INDEX idx_transit_city ON public.transit_routes(city_id);
CREATE INDEX idx_health_city ON public.health_resources(city_id);
CREATE INDEX idx_phrases_language ON public.emergency_phrases(language);
CREATE INDEX idx_dress_codes_city ON public.dress_codes(city_id);
CREATE INDEX idx_city_safety_city ON public.city_safety_details(city_id);
