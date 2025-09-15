import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import type { Incident } from "@shared/schema";

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
}

export default function IncidentCard({ incident, onClick }: IncidentCardProps) {
  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return "border-destructive";
      case "medium":
        return "border-warning";
      case "low":
        return "border-secondary";
      default:
        return "border-muted";
    }
  };

  return (
    <Card 
      className={`p-3 border-l-4 ${getSeverityColor(incident.severity)} cursor-pointer hover:bg-muted/50 transition-colors`}
      onClick={onClick}
      data-testid={`incident-card-${incident.id}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-sm mb-1" data-testid={`incident-title-${incident.id}`}>
            {incident.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3" />
            <span data-testid={`incident-location-${incident.id}`}>{incident.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span data-testid={`incident-time-${incident.id}`}>
              {formatDistanceToNow(new Date(incident.reportedAt), { addSuffix: true })}
            </span>
          </div>
          
          {incident.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2" data-testid={`incident-description-${incident.id}`}>
              {incident.description}
            </p>
          )}
        </div>
        
        <Badge 
          variant={getSeverityVariant(incident.severity)}
          className="text-xs"
          data-testid={`incident-severity-${incident.id}`}
        >
          {incident.severity.toUpperCase()}
        </Badge>
      </div>
    </Card>
  );
}
