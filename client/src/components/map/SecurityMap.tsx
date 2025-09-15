import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Minus, Navigation } from "lucide-react";
import type { Incident, SecurityArea } from "@shared/schema";

interface SecurityMapProps {
  incidents: Incident[];
  securityAreas: SecurityArea[];
  isLoading: boolean;
}

export default function SecurityMap({ incidents, securityAreas, isLoading }: SecurityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  // This would be where Mapbox GL JS initialization would happen
  useEffect(() => {
    if (!mapRef.current) return;

    // TODO: Initialize Mapbox GL JS map
    // const map = new mapboxgl.Map({
    //   container: mapRef.current,
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: [11.1694, 10.2937], // Gombe State coordinates
    //   zoom: 10
    // });

    console.log('Map would be initialized here with Mapbox GL JS');
    console.log('Incidents to display:', incidents);
    console.log('Security areas to display:', securityAreas);

    return () => {
      // TODO: Cleanup map
      console.log('Map cleanup would happen here');
    };
  }, [incidents, securityAreas]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-700";
      case "high": return "bg-destructive";
      case "medium": return "bg-warning";
      case "low": return "bg-secondary";
      default: return "bg-muted";
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical": return "border-red-700";
      case "high": return "border-destructive";
      case "medium": return "border-warning";
      case "low": return "border-secondary";
      case "safe": return "border-success";
      default: return "border-muted";
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading security data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <div 
        ref={mapRef}
        className="w-full h-full map-container"
        style={{ minHeight: '500px' }}
      >
        {/* Map Placeholder with incident overlays - In production this would be Mapbox GL */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
          {/* Simulated satellite imagery background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-green-200 via-yellow-100 to-brown-200"></div>
          </div>
          
          {/* Incident Markers */}
          {incidents.map((incident, index) => (
            <div 
              key={incident.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
              style={{
                top: `${30 + (index * 15) % 40}%`,
                left: `${40 + (index * 20) % 30}%`
              }}
              data-testid={`incident-marker-${incident.id}`}
            >
              <div className="relative">
                <div className={`w-16 h-16 ${getSeverityColor(incident.severity)}/30 rounded-full animate-pulse`}></div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 ${getSeverityColor(incident.severity)} rounded-full border-2 border-white shadow-lg incident-marker ${incident.severity}`}>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs">
                    ⚠
                  </div>
                </div>
                
                {/* Popup */}
                <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-card border border-border rounded-lg p-3 shadow-lg min-w-48 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <p className="text-sm font-medium" data-testid={`incident-location-${incident.id}`}>
                    {incident.location}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize" data-testid={`incident-type-${incident.id}`}>
                    {incident.type.replace('_', ' ')}
                  </p>
                  <p className={`text-sm capitalize ${
                    incident.severity === 'high' || incident.severity === 'critical' 
                      ? 'text-destructive' 
                      : incident.severity === 'medium' 
                        ? 'text-warning' 
                        : 'text-secondary'
                  }`}>
                    {incident.severity} Risk
                  </p>
                  {incident.description && (
                    <p className="text-xs text-muted-foreground mt-1">{incident.description}</p>
                  )}
                </Card>
              </div>
            </div>
          ))}

          {/* Security Area Indicators */}
          {securityAreas.map((area, index) => (
            <div 
              key={area.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${25 + (index * 25) % 50}%`,
                left: `${35 + (index * 30) % 40}%`
              }}
              data-testid={`security-area-${area.id}`}
            >
              <div className={`w-4 h-4 bg-background border-2 ${getRiskColor(area.riskLevel)} rounded-full shadow-sm`}>
                <div className="w-full h-full flex items-center justify-center text-xs">
                  {area.riskLevel === 'safe' ? '🛡' : area.riskLevel === 'high' ? '⚠' : '📍'}
                </div>
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button 
              variant="outline" 
              size="icon"
              className="bg-card border border-border shadow-sm"
              data-testid="button-zoom-in"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-card border border-border shadow-sm"
              data-testid="button-zoom-out"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-card border border-border shadow-sm"
              data-testid="button-locate"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* Legend */}
          <Card className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
            <h4 className="text-sm font-semibold mb-2">Threat Levels</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span className="text-xs">High Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-xs">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-xs">Safe Zone</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
