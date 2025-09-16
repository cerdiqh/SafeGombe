import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeWalkRequest } from "./SafeWalkRequest";
import RiskAnalysisDashboard from "./RiskAnalysisDashboard";
import EmergencyServices from "./EmergencyServices";
import BusinessSafetyRatings from "./BusinessSafetyRatings";
import EducationalContent from "./EducationalContent";
import GamificationDashboard from "./GamificationDashboard";
import LanguageSupport from "./LanguageSupport";
import AccessibilitySettings from "./AccessibilitySettings";
import CommunityForum from "./CommunityForum";
import OfflineManager from "./OfflineManager";
import { MapPin, Shield, Users, Bell, AlertTriangle, Activity, Star, BookOpen, Trophy, Languages, Accessibility, MessageSquare, WifiOff } from 'lucide-react';
import { PanicButton } from "./PanicButton";

export default function SafetyDashboard() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Community Safety Network</h1>
        <p className="text-muted-foreground">Stay safe with our community-powered safety features</p>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">
            <Shield className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="features">
            <Star className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="h-4 w-4 mr-2" />
            Community
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Activity className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-500" />
                  Safe Walk
                </CardTitle>
                <CardDescription>Request a safety companion</CardDescription>
              </CardHeader>
              <CardContent>
                <SafeWalkRequest />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-red-500" />
                  Emergency
                </CardTitle>
                <CardDescription>Quick access to emergency services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <PanicButton />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <RiskAnalysisDashboard />
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6">
            <BusinessSafetyRatings />
            <EmergencyServices />
            <EducationalContent />
          </div>
        </TabsContent>
        
        <TabsContent value="community" className="space-y-6">
          <div className="grid gap-6">
            <GamificationDashboard />
            <CommunityForum />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            <LanguageSupport />
            <AccessibilitySettings />
            <OfflineManager />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
