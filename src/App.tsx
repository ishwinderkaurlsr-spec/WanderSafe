import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import AppShell from "@/components/AppShell";
import SOSPage from "@/pages/safety/SOSPage";
import LocationSharingPage from "@/pages/safety/LocationSharingPage";
import TransportDirectoryPage from "@/pages/safety/TransportDirectoryPage";
import SafeRoutesPage from "@/pages/safety/SafeRoutesPage";
import FakeCallPage from "@/pages/safety/FakeCallPage";
import IncidentReportPage from "@/pages/safety/IncidentReportPage";
import ExplorePage from "@/pages/explore/ExplorePage";
import CityBriefingPage from "@/pages/explore/CityBriefingPage";
import LGBTQSafetyPage from "@/pages/explore/LGBTQSafetyPage";
import OfflinePacksPage from "@/pages/explore/OfflinePacksPage";
import TranslatePage from "@/pages/translate/TranslatePage";
import ConversationTranslatorPage from "@/pages/translate/ConversationTranslatorPage";
import CameraTranslatorPage from "@/pages/translate/CameraTranslatorPage";
import EmergencyPhrasesPage from "@/pages/translate/EmergencyPhrasesPage";
import PhraseBuilderPage from "@/pages/translate/PhraseBuilderPage";
import HealthPage from "@/pages/health/HealthPage";
import HealthLocatorPage from "@/pages/health/HealthLocatorPage";
import ReproductiveRightsPage from "@/pages/health/ReproductiveRightsPage";
import RestroomFinderPage from "@/pages/health/RestroomFinderPage";
import InsuranceAdvisorPage from "@/pages/health/InsuranceAdvisorPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import AuthPage from "@/pages/auth/AuthPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import NotFound from "@/pages/NotFound";
import RestaurantFinderPage from "@/pages/food/RestaurantFinderPage";
import FoodAdvisorPage from "@/pages/food/FoodAdvisorPage";
import AllergyCardPage from "@/pages/food/AllergyCardPage";
import MealSharingPage from "@/pages/food/MealSharingPage";
import PackingAssistantPage from "@/pages/wardrobe/PackingAssistantPage";
import OutfitAdvisorPage from "@/pages/wardrobe/OutfitAdvisorPage";
import DressCodeRefPage from "@/pages/wardrobe/DressCodeRefPage";
import CapsuleWardrobePage from "@/pages/wardrobe/CapsuleWardrobePage";
import TransitNavigatorPage from "@/pages/transport/TransitNavigatorPage";
import RideVerificationPage from "@/pages/transport/RideVerificationPage";
import JourneyPlannerPage from "@/pages/transport/JourneyPlannerPage";
import FairPriceCheckerPage from "@/pages/transport/FairPriceCheckerPage";
import TransitPassGuidePage from "@/pages/transport/TransitPassGuidePage";
import WomenOnlyTransportPage from "@/pages/transport/WomenOnlyTransportPage";
import DestinationExplorerPage from "@/pages/places/DestinationExplorerPage";
import SafetyHeatmapPage from "@/pages/places/SafetyHeatmapPage";
import TravelStoriesPage from "@/pages/places/TravelStoriesPage";
import SocialMatchingPage from "@/pages/social/SocialMatchingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/safety" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route element={<AppShell />}>
              <Route path="/safety" element={<SOSPage />} />
              <Route path="/safety/location" element={<LocationSharingPage />} />
              <Route path="/safety/transport" element={<TransportDirectoryPage />} />
              <Route path="/safety/routes" element={<SafeRoutesPage />} />
              <Route path="/safety/fake-call" element={<FakeCallPage />} />
              <Route path="/safety/incident" element={<IncidentReportPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/explore/city/:cityId" element={<CityBriefingPage />} />
              <Route path="/explore/lgbtq" element={<LGBTQSafetyPage />} />
              <Route path="/explore/offline" element={<OfflinePacksPage />} />
              <Route path="/explore/fair-prices" element={<FairPriceCheckerPage />} />
              <Route path="/explore/restaurants" element={<RestaurantFinderPage />} />
              <Route path="/explore/food-advisor" element={<FoodAdvisorPage />} />
              <Route path="/explore/allergy-card" element={<AllergyCardPage />} />
              <Route path="/explore/meal-sharing" element={<MealSharingPage />} />
              <Route path="/explore/destinations" element={<DestinationExplorerPage />} />
              <Route path="/explore/heatmap" element={<SafetyHeatmapPage />} />
              <Route path="/explore/stories" element={<TravelStoriesPage />} />
              <Route path="/explore/dress-codes" element={<DressCodeRefPage />} />
              <Route path="/translate" element={<TranslatePage />} />
              <Route path="/translate/conversation" element={<ConversationTranslatorPage />} />
              <Route path="/translate/camera" element={<CameraTranslatorPage />} />
              <Route path="/translate/phrases" element={<EmergencyPhrasesPage />} />
              <Route path="/translate/my-phrases" element={<PhraseBuilderPage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/health/locator" element={<HealthLocatorPage />} />
              <Route path="/health/reproductive" element={<ReproductiveRightsPage />} />
              <Route path="/health/restrooms" element={<RestroomFinderPage />} />
              <Route path="/health/insurance" element={<InsuranceAdvisorPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/packing" element={<PackingAssistantPage />} />
              <Route path="/profile/outfit" element={<OutfitAdvisorPage />} />
              <Route path="/profile/capsule" element={<CapsuleWardrobePage />} />
              <Route path="/profile/social" element={<SocialMatchingPage />} />
              <Route path="/safety/transit" element={<TransitNavigatorPage />} />
              <Route path="/safety/ride-verify" element={<RideVerificationPage />} />
              <Route path="/safety/journey" element={<JourneyPlannerPage />} />
              <Route path="/safety/fair-prices" element={<FairPriceCheckerPage />} />
              <Route path="/safety/transit-pass" element={<TransitPassGuidePage />} />
              <Route path="/safety/women-transport" element={<WomenOnlyTransportPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
