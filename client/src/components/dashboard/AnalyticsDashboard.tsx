import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Shield,
  Users,
  Calendar,
  PieChart,
  Activity
} from "lucide-react";
import IncidentAnalysis from "@/components/ai/IncidentAnalysis";
import type { Incident, SecurityArea } from "@shared/schema";

interface AnalyticsDashboardProps {
  incidents: Incident[];
  securityAreas: SecurityArea[];
  isLoading: boolean;
}

export default function AnalyticsDashboard({ incidents, securityAreas, isLoading }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedArea, setSelectedArea] = useState("all");

  // Calculate analytics data
  const getAnalyticsData = () => {
    const now = new Date();
    const timeRanges = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "all": Infinity
    };

    const cutoffTime = now.getTime() - (timeRanges[timeRange as keyof typeof timeRanges] || timeRanges["7d"]);
    
    let filteredIncidents = incidents.filter(incident => 
      new Date(incident.reportedAt).getTime() > cutoffTime
    );

    if (selectedArea !== "all") {
      filteredIncidents = filteredIncidents.filter(incident =>
        incident.location.toLowerCase().includes(selectedArea.toLowerCase())
      );
    }

    // Incident type distribution
    const typeDistribution = filteredIncidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Severity distribution
    const severityDistribution = filteredIncidents.reduce((acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Hourly distribution (last 24 hours)
    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => {
      const hourStart = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
      
      const count = filteredIncidents.filter(incident => {
        const incidentTime = new Date(incident.reportedAt);
        return incidentTime >= hourStart && incidentTime < hourEnd;
      }).length;

      return {
        hour: i,
        count,
        label: `${i.toString().padStart(2, '0')}:00`
      };
    });

    // Area statistics
    const areaStats = securityAreas.map(area => {
      const areaIncidents = filteredIncidents.filter(incident =>
        incident.location.toLowerCase().includes(area.name.toLowerCase())
      );
      
      return {
        ...area,
        recentIncidents: areaIncidents.length,
        avgSeverity: areaIncidents.length > 0 
          ? areaIncidents.reduce((sum, incident) => {
              const severityValue = { low: 1, medium: 2, high: 3, critical: 4 }[incident.severity] || 2;
              return sum + severityValue;
            }, 0) / areaIncidents.length
          : 0
      };
    });

    return {
      totalIncidents: filteredIncidents.length,
      typeDistribution,
      severityDistribution,
      hourlyDistribution,
      areaStats,
      recentIncidents: filteredIncidents.slice(0, 5),
      trends: {
        incidents: filteredIncidents.length,
        highRisk: filteredIncidents.filter(i => i.severity === 'high' || i.severity === 'critical').length,
        resolved: filteredIncidents.filter(i => i.status === 'resolved').length
      }
    };
  };

  const analyticsData = getAnalyticsData();

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-800";
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Analytics</h2>
          <p className="text-muted-foreground">Comprehensive analysis of security incidents in Gombe State</p>
        </div>
        
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {securityAreas.map((area) => (
                <SelectItem key={area.id} value={area.name.toLowerCase()}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{analyticsData.totalIncidents}</p>
              <p className="text-sm text-muted-foreground">Total Incidents</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-2xl font-bold">{analyticsData.trends.highRisk}</p>
              <p className="text-sm text-muted-foreground">High Risk</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{analyticsData.trends.resolved}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{securityAreas.length}</p>
              <p className="text-sm text-muted-foreground">Monitored Areas</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="types">Incident Types</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incident Types Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Incident Types Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.typeDistribution).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getTypeIcon(type)}</span>
                      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(count / analyticsData.totalIncidents) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Severity Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Severity Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.severityDistribution).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <span className={`text-sm capitalize ${getSeverityColor(severity)}`}>
                      {severity} Risk
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            severity === 'critical' ? 'bg-red-800' :
                            severity === 'high' ? 'bg-red-600' :
                            severity === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ 
                            width: `${(count / analyticsData.totalIncidents) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Incidents */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Incidents
            </h3>
            <div className="space-y-3">
              {analyticsData.recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getTypeIcon(incident.type)}</span>
                    <div>
                      <p className="font-medium capitalize">{incident.type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">{incident.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={incident.severity === 'high' || incident.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {incident.severity}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(incident.reportedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Incident Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analyticsData.typeDistribution).map(([type, count]) => (
              <Card key={type} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(type)}</span>
                    <div>
                      <h4 className="font-semibold capitalize">{type.replace('_', ' ')}</h4>
                      <p className="text-sm text-muted-foreground">{count} incidents</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{count}</p>
                    <p className="text-xs text-muted-foreground">
                      {((count / analyticsData.totalIncidents) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(count / analyticsData.totalIncidents) * 100}%` }}
                  ></div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Areas Tab */}
        <TabsContent value="areas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsData.areaStats.map((area) => (
              <Card key={area.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">{area.name}</h4>
                      <p className="text-sm text-muted-foreground">{area.recentIncidents} recent incidents</p>
                    </div>
                  </div>
                  <Badge variant={area.riskLevel === 'high' || area.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                    {area.riskLevel}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Level:</span>
                    <span className="capitalize">{area.riskLevel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Incidents:</span>
                    <span>{area.incidentCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Recent Activity:</span>
                    <span>{area.recentIncidents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Severity:</span>
                    <span>{area.avgSeverity.toFixed(1)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Hourly Incident Distribution (Last 24 Hours)
            </h3>
            <div className="space-y-2">
              {analyticsData.hourlyDistribution.map((hour) => (
                <div key={hour.hour} className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-muted-foreground">{hour.label}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.max(5, (hour.count / Math.max(...analyticsData.hourlyDistribution.map(h => h.count))) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-sm text-right">{hour.count}</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai" className="space-y-4">
          <IncidentAnalysis 
            incidents={incidents}
            securityAreas={securityAreas}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
