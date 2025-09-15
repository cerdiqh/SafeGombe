import { Shield, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopNavigationProps {
  isOnline: boolean;
  onReportClick: () => void;
}

export default function TopNavigation({ isOnline, onReportClick }: TopNavigationProps) {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="text-primary w-8 h-8 mr-3" />
              <h1 className="text-xl font-bold text-foreground">GombeSafe</h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#report" className="text-foreground hover:text-primary transition-colors">
              Report Incident
            </a>
            <a href="#areas" className="text-foreground hover:text-primary transition-colors">
              Safety Areas
            </a>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <>
                    <div className="w-3 h-3 bg-success rounded-full" />
                    <span className="text-sm text-muted-foreground">Online</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-warning rounded-full" />
                    <span className="text-sm text-muted-foreground">Offline</span>
                  </>
                )}
              </div>
              
              <Button 
                data-testid="button-report-incident"
                onClick={onReportClick}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">+</span>
                  <span>Report Incident</span>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button className="text-foreground hover:text-primary">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
