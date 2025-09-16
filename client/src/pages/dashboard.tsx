import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TopNavigation from "@/components/layout/TopNavigation";
import Sidebar from "@/components/layout/Sidebar";
import SecurityMap from "@/components/map/SecurityMap";
import IncidentReportForm from "@/components/forms/IncidentReportForm";
import IncidentsDashboard from "@/components/dashboard/IncidentsDashboard";
import SafetyAreas from "@/components/dashboard/SafetyAreas";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Plus, Wifi, WifiOff, Map, List, BarChart3, AlertTriangle } from "lucide-react";
import type { Incident, SecurityArea } from "@shared/schema";

interface SecurityStats {
  totalIncidents: number;
  activeIncidents: number;
  recentIncidents: number;
  weeklyIncidents: number;
  safeZones: number;
  highRiskAreas: number;
}

export default function Dashboard() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState("map");
  const [selectedFilters, setSelectedFilters] = useState({
    incidentTypes: ["road_accident", "theft", "cattle_rustling", "farmer_herder_conflict"],
    area: "",
    timePeriod: "24"
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker for offline functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed'));
    }
  }, []);

  const { data: incidents, isLoading: incidentsLoading, refetch: refetchIncidents } = useQuery<Incident[]>({
    queryKey: ['/api/incidents', { area: selectedFilters.area, hours: parseInt(selectedFilters.timePeriod, 10) }],
  });

  const { data: securityAreas, isLoading: areasLoading } = useQuery<SecurityArea[]>({
    queryKey: ['/api/security-areas'],
  });

  const { data: stats } = useQuery<SecurityStats>({
    queryKey: ['/api/stats'],
  });

  const handleReportSubmit = () => {
    setIsReportModalOpen(false);
    // Force refresh of all data
    refetchIncidents();
    // Switch to incidents tab to show the new report
    setActiveTab("incidents");
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation 
        isOnline={isOnline}
        onReportClick={() => setIsReportModalOpen(true)}
      />
      
  {/* Emergency banner removed — operational/deployment statements are now displayed within the map legend and area panels. */}

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-20 right-4 bg-warning text-warning-foreground px-3 py-2 rounded-md shadow-lg z-50 flex items-center space-x-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm">Offline Mode</span>
        </div>
      )}

      <div className="flex min-h-screen">
        <Sidebar 
          stats={stats}
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />
        
        <main className="flex-1 flex flex-col min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-border bg-background">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="map" className="flex items-center space-x-2">
                  <Map className="w-4 h-4" />
                  <span>Security Map</span>
                </TabsTrigger>
                <TabsTrigger value="incidents" className="flex items-center space-x-2">
                  <List className="w-4 h-4" />
                  <span>Incidents</span>
                </TabsTrigger>
                <TabsTrigger value="safety" className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Safety Areas</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="map" className="flex-1 m-0">
              <SecurityMap 
                incidents={incidents || []}
                securityAreas={securityAreas || []}
                isLoading={incidentsLoading || areasLoading}
              />
            </TabsContent>
            
            <TabsContent value="incidents" className="flex-1 m-0 overflow-auto">
              <IncidentsDashboard 
                incidents={incidents || []}
                securityAreas={securityAreas || []}
                isLoading={incidentsLoading || areasLoading}
              />
            </TabsContent>
            
            <TabsContent value="safety" className="flex-1 m-0 overflow-auto">
              <div className="p-6 space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">Safety Features</h2>
                  <p className="text-muted-foreground">Access all safety tools and emergency services</p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
                  <Button asChild className="h-20 flex-col space-y-2">
                    <a href="/safety">
                      <Shield className="h-6 w-6" />
                      <span>Emergency Services</span>
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                    <a href="/safety">
                      <AlertTriangle className="h-6 w-6" />
                      <span>Risk Analysis</span>
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                    <a href="/safety">
                      <Map className="h-6 w-6" />
                      <span>Safe Walk</span>
                    </a>
                  </Button>
                </div>
                
                <SafetyAreas 
                  securityAreas={securityAreas || []}
                  isLoading={areasLoading}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="flex-1 m-0 overflow-auto">
              <AnalyticsDashboard 
                incidents={incidents || []}
                securityAreas={securityAreas || []}
                isLoading={incidentsLoading || areasLoading}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Mobile FAB */}
      <Button
        data-testid="button-mobile-report"
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40"
        onClick={() => setIsReportModalOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-20">
        <div className="grid grid-cols-5 h-16">
          <button 
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              activeTab === "map" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Map className="w-5 h-5" />
            <span className="text-xs">Map</span>
          </button>
          <button 
            onClick={() => setActiveTab("incidents")}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              activeTab === "incidents" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <List className="w-5 h-5" />
            <span className="text-xs">Incidents</span>
          </button>
          <button 
            onClick={() => setActiveTab("safety")}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              activeTab === "safety" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs">Safety</span>
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              activeTab === "analytics" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Analytics</span>
          </button>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Report</span>
          </button>
        </div>
      </nav>

      {/* Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <IncidentReportForm 
            onSubmit={handleReportSubmit}
            onCancel={() => setIsReportModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
