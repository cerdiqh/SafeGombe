import { Shield, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

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
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Shield className="text-primary w-8 h-8 mr-3" />
              <h1 className="text-xl font-bold text-foreground">GombeSafe</h1>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/safety" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                <ShieldAlert className="h-4 w-4 mr-1.5" />
                Safety Network
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/safety">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center">
                <ShieldAlert className="h-4 w-4 mr-1.5" />
                Safety Hub
              </Button>
            </Link>
            <Button 
              data-testid="button-report-incident"
              onClick={onReportClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">+</span>
                <span className="hidden sm:inline">Report Incident</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
      <div className={cn(
        "w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500",
        !isOnline && "bg-gray-400"
      )} />
    </nav>
  );
}
