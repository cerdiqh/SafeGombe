import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Phone, 
  Users, 
  Clock,
  Navigation,
  Info
} from "lucide-react";
import type { SecurityArea } from "@shared/schema";

interface SafetyAreasProps {
  securityAreas: SecurityArea[];
  isLoading: boolean;
}

export default function SafetyAreas({ securityAreas, isLoading }: SafetyAreasProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateRiskMutation = useMutation({
    mutationFn: async ({ id, riskLevel }: { id: string; riskLevel: SecurityArea["riskLevel"] }) => {
      await apiRequest("PATCH", `/api/security-areas/${id}`, { riskLevel });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security-areas"], exact: false });
    },
  });

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      case "safe": return "default";
      default: return "outline";
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical": return "🚨";
      case "high": return "⚠️";
      case "medium": return "🟡";
      case "low": return "🟢";
      case "safe": return "🛡️";
      default: return "📍";
    }
  };

  const emergencyContacts = [
    { name: "Police", number: "199", icon: "🚔" },
    { name: "Operation Hattara", number: "123", icon: "🛡️" },
    { name: "Fire Service", number: "199", icon: "🚒" },
    { name: "Medical Emergency", number: "199", icon: "🏥" },
  ];

  const safetyTips = [
    "Avoid high-risk areas during evening hours",
    "Stay alert in rural areas and isolated locations",
    "Report suspicious activities immediately",
    "Keep emergency contacts saved in your phone",
    "Travel in groups when possible",
    "Inform family/friends of your travel plans",
    "Avoid displaying valuable items openly",
    "Use well-lit and populated routes"
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading safety information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Safety Areas & Information</h2>
          <p className="text-muted-foreground">Security zones and safety guidelines for Gombe State</p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Shield className="w-3 h-3 mr-1" />
          Operation Hattara Active
        </Badge>
      </div>

      <Tabs defaultValue="areas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="areas">Security Areas</TabsTrigger>
          <TabsTrigger value="contacts">Emergency</TabsTrigger>
          <TabsTrigger value="tips">Safety Tips</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        {/* Security Areas Tab */}
        <TabsContent value="areas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityAreas.map((area) => (
              <Card 
                key={area.id} 
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedArea === area.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getRiskIcon(area.riskLevel)}</span>
                    <div>
                      <h3 className="font-semibold">{area.name}</h3>
                      <Badge variant={getRiskColor(area.riskLevel)} className="text-xs">
                        {area.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{area.incidentCount} incidents</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(area.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {area.description && (
                  <p className="text-sm text-muted-foreground mb-3">{area.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{area.latitude.toFixed(4)}°N, {area.longitude.toFixed(4)}°E</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Navigation className="w-4 h-4" />
                    <span>Radius: {(area.radius / 1000).toFixed(1)}km</span>
                  </div>
                </div>

                {selectedArea === area.id && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Safety Recommendations:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {area.riskLevel === 'high' || area.riskLevel === 'critical' ? (
                          <>
                            <li>• Avoid this area if possible</li>
                            <li>• Travel with security escort if necessary</li>
                            <li>• Report any suspicious activity immediately</li>
                            <li>• Stay alert and maintain situational awareness</li>
                          </>
                        ) : area.riskLevel === 'medium' ? (
                          <>
                            <li>• Exercise caution when visiting</li>
                            <li>• Avoid isolated areas</li>
                            <li>• Travel during daylight hours when possible</li>
                            <li>• Keep emergency contacts handy</li>
                          </>
                        ) : (
                          <>
                            <li>• Generally safe for normal activities</li>
                            <li>• Maintain basic security awareness</li>
                            <li>• Report any unusual activities</li>
                          </>
                        )}
                      </ul>
                      <div className="pt-3">
                        <div className="text-xs mb-2">Set Risk Level:</div>
                        <div className="flex flex-wrap gap-2">
                          {(["safe","low","medium","high","critical"] as const).map((level) => (
                            <Button
                              key={level}
                              size="sm"
                              variant={area.riskLevel === level ? "default" : "outline"}
                              onClick={() => updateRiskMutation.mutate({ id: area.id, riskLevel: level })}
                              disabled={updateRiskMutation.isPending}
                            >
                              {level}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="contacts" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Emergency Contacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact) => (
                <Card key={contact.name} className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{contact.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-mono font-bold text-primary">{contact.number}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border border-blue-200">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Operation Hattara</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Special security taskforce meaning "be careful" in English, aimed at reinvigorating internal security in Gombe state.
                </p>
                <div className="text-sm text-blue-600">
                  <p><strong>Status:</strong> Active</p>
                  <p><strong>Vehicles Deployed:</strong> 28</p>
                  <p><strong>Governor:</strong> Inuwa Yahaya</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Safety Tips Tab */}
        <TabsContent value="tips" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              General Safety Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-yellow-50 border border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">High-Risk Areas to Avoid</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Jekadafari - High Kalare gang activity and phone snatching at night</li>
                  <li>• Manawachi - Kalare gang violence and phone theft hotspot</li>
                  <li>• Bolari District - Gang activity and violence</li>
                  <li>• Billiri LGA - Farmer-herder conflicts and cattle rustling</li>
                  <li>• Rural roads during evening hours - Avoid traveling alone</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {securityAreas.filter(a => a.riskLevel === 'safe' || a.riskLevel === 'low').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Safe Zones</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {securityAreas.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length}
                  </p>
                  <p className="text-sm text-muted-foreground">High-Risk Areas</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">28</p>
                  <p className="text-sm text-muted-foreground">Security Vehicles</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current Security Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Operation Hattara</span>
                </div>
                <Badge variant="default" className="bg-green-600">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Security Patrols</span>
                </div>
                <Badge variant="outline">28 Vehicles Deployed</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Alert Level</span>
                </div>
                <Badge variant="secondary">Heightened</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
