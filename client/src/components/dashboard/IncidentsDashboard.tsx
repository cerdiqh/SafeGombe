import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Shield, 
  Users, 
  TrendingUp,
  Calendar,
  Eye
} from "lucide-react";
import type { Incident, SecurityArea } from "@shared/schema";

interface IncidentsDashboardProps {
  incidents: Incident[];
  securityAreas: SecurityArea[];
  isLoading: boolean;
}

export default function IncidentsDashboard({ incidents, securityAreas, isLoading }: IncidentsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  // Filter incidents based on search and filters
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || incident.type === selectedType;
    const matchesSeverity = selectedSeverity === "all" || incident.severity === selectedSeverity;
    const matchesArea = selectedArea === "all" || incident.location.toLowerCase().includes(selectedArea.toLowerCase());
    
    const now = new Date();
    const incidentDate = new Date(incident.reportedAt);
    let matchesTime = true;
    
    if (timeFilter === "24h") {
      matchesTime = (now.getTime() - incidentDate.getTime()) <= 24 * 60 * 60 * 1000;
    } else if (timeFilter === "7d") {
      matchesTime = (now.getTime() - incidentDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
    } else if (timeFilter === "30d") {
      matchesTime = (now.getTime() - incidentDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
    }
    
    return matchesSearch && matchesType && matchesSeverity && matchesArea && matchesTime;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "road_accident": return "🚗";
      case "theft": return "🔓";
      case "cattle_rustling": return "🐄";
      case "farmer_herder_conflict": return "🌾";
      case "domestic_violence": return "🏠";
      case "armed_robbery": return "🔫";
      case "market_dispute": return "🏪";
      case "flooding": return "🌊";
      case "fire_outbreak": return "🔥";
      case "suspicious_activity": return "👁";
      default: return "⚠️";
    }
  };

  const incidentTypes = [
    { value: "all", label: "All Types" },
    { value: "road_accident", label: "Road Accident" },
    { value: "theft", label: "Theft" },
    { value: "cattle_rustling", label: "Cattle Rustling" },
    { value: "farmer_herder_conflict", label: "Farmer-Herder Conflict" },
    { value: "domestic_violence", label: "Domestic Violence" },
    { value: "armed_robbery", label: "Armed Robbery" },
    { value: "market_dispute", label: "Market Dispute" },
    { value: "flooding", label: "Flooding" },
    { value: "fire_outbreak", label: "Fire Outbreak" },
    { value: "suspicious_activity", label: "Suspicious Activity" },
    { value: "other", label: "Other" },
  ];

  const severityLevels = [
    { value: "all", label: "All Severities" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const timeFilters = [
    { value: "all", label: "All Time" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
  ];

  const areaOptions = [
    { value: "all", label: "All Areas" },
    { value: "bolari", label: "Bolari District" },
    { value: "billiri", label: "Billiri LGA" },
    { value: "gombe central", label: "Gombe Central" },
    { value: "jekadafari", label: "Jekadafari Area" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading incidents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Incident Reports</h2>
          <p className="text-muted-foreground">Real-time security incidents in Gombe State</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Security advisory in effect — verify with official sources for operational details
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Incident Type" />
            </SelectTrigger>
            <SelectContent>
              {incidentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Severity Filter */}
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger>
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              {severityLevels.map((severity) => (
                <SelectItem key={severity.value} value={severity.value}>
                  {severity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Area Filter */}
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger>
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              {areaOptions.map((area) => (
                <SelectItem key={area.value} value={area.value}>
                  {area.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Time Filter */}
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              {timeFilters.map((time) => (
                <SelectItem key={time.value} value={time.value}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-2xl font-bold">{filteredIncidents.length}</p>
              <p className="text-sm text-muted-foreground">Total Incidents</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-warning" />
            <div>
              <p className="text-2xl font-bold">
                {filteredIncidents.filter(i => i.severity === 'high' || i.severity === 'critical').length}
              </p>
              <p className="text-sm text-muted-foreground">High Risk</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">
                {filteredIncidents.filter(i => {
                  const now = new Date();
                  const incidentDate = new Date(i.reportedAt);
                  return (now.getTime() - incidentDate.getTime()) <= 24 * 60 * 60 * 1000;
                }).length}
              </p>
              <p className="text-sm text-muted-foreground">Last 24h</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-success" />
            <div>
              <p className="text-2xl font-bold">{securityAreas.filter(a => a.riskLevel === 'safe' || a.riskLevel === 'low').length}</p>
              <p className="text-sm text-muted-foreground">Safe Zones</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Incidents List */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No incidents found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <Card key={incident.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="text-2xl">{getTypeIcon(incident.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold capitalize">
                            {incident.type.replace('_', ' ')}
                          </h3>
                          <Badge variant={getSeverityColor(incident.severity)}>
                            {incident.severity}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{incident.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(incident.reportedAt).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        {incident.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {incident.description}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>GPS: {incident.latitude.toFixed(4)}°N, {incident.longitude.toFixed(4)}°E</span>
                          {incident.isAnonymous && (
                            <Badge variant="outline" className="text-xs">Anonymous</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card className="p-4">
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Timeline View</h3>
              <p className="text-muted-foreground">Timeline visualization coming soon...</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
