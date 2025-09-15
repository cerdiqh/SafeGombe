import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TopNavigation from "@/components/layout/TopNavigation";
import Sidebar from "@/components/layout/Sidebar";
import SecurityMap from "@/components/map/SecurityMap";
import IncidentReportForm from "@/components/forms/IncidentReportForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Wifi, WifiOff } from "lucide-react";
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
  const [selectedFilters, setSelectedFilters] = useState({
    incidentTypes: ["terrorism", "banditry", "cattle_rustling", "kalare_gangs"],
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
    queryKey: ['/api/incidents', selectedFilters],
    enabled: isOnline,
  });

  const { data: securityAreas, isLoading: areasLoading } = useQuery<SecurityArea[]>({
    queryKey: ['/api/security-areas'],
    enabled: isOnline,
  });

  const { data: stats } = useQuery<SecurityStats>({
    queryKey: ['/api/stats'],
    enabled: isOnline,
  });

  const handleReportSubmit = () => {
    setIsReportModalOpen(false);
    refetchIncidents();
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation 
        isOnline={isOnline}
        onReportClick={() => setIsReportModalOpen(true)}
      />
      
      {/* Emergency Banner */}
      <div className="bg-destructive text-destructive-foreground p-3">
        <div className="flex items-center justify-center space-x-2">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Operation Hattara Active - Enhanced Security Patrols in Progress</span>
          <span className="text-xs opacity-75">28 vehicles deployed</span>
        </div>
      </div>

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
          <SecurityMap 
            incidents={incidents || []}
            securityAreas={securityAreas || []}
            isLoading={incidentsLoading || areasLoading}
          />
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
        <div className="grid grid-cols-4 h-16">
          <button className="flex flex-col items-center justify-center space-y-1 text-primary">
            <Shield className="w-5 h-5" />
            <span className="text-xs">Map</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary transition-colors">
            <div className="w-5 h-5 flex items-center justify-center">📋</div>
            <span className="text-xs">Incidents</span>
          </button>
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Report</span>
          </button>
          <button className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary transition-colors">
            <Shield className="w-5 h-5" />
            <span className="text-xs">Safety</span>
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
