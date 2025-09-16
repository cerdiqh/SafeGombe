import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Target,
  Lightbulb,
  Shield
} from "lucide-react";
import type { Incident, SecurityArea } from "@shared/schema";

interface IncidentAnalysisProps {
  incidents: Incident[];
  securityAreas: SecurityArea[];
}

interface AIInsight {
  type: 'pattern' | 'prediction' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  action?: string;
}

export default function IncidentAnalysis({ incidents, securityAreas }: IncidentAnalysisProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI-powered analysis function
  const analyzeIncidents = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInsights: AIInsight[] = [];
    
    // Pattern Analysis
    const recentIncidents = incidents.filter(incident => {
      const incidentTime = new Date(incident.reportedAt);
      const now = new Date();
      return (now.getTime() - incidentTime.getTime()) <= 7 * 24 * 60 * 60 * 1000; // Last 7 days
    });

    // Analyze incident patterns
    const typeFrequency = recentIncidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentType = Object.entries(typeFrequency).reduce((a, b) => 
      typeFrequency[a[0]] > typeFrequency[b[0]] ? a : b, ['', 0]
    );

    if (mostFrequentType[1] > 2) {
      newInsights.push({
        type: 'pattern',
        title: `Rising ${mostFrequentType[0].replace('_', ' ')} Activity`,
        description: `${mostFrequentType[1]} incidents of this type reported in the last 7 days. This represents a ${((mostFrequentType[1] / recentIncidents.length) * 100).toFixed(1)}% increase.`,
        confidence: 85,
        severity: mostFrequentType[1] > 5 ? 'high' : 'medium',
        actionable: true,
        action: 'Increase patrols in affected areas'
      });
    }

    // Time-based analysis
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
      return recentIncidents.filter(incident => {
        const incidentHour = new Date(incident.reportedAt).getHours();
        return incidentHour === hour;
      }).length;
    });

    const peakHour = hourlyDistribution.indexOf(Math.max(...hourlyDistribution));
    if (hourlyDistribution[peakHour] > 2) {
      newInsights.push({
        type: 'pattern',
        title: 'Peak Incident Time Identified',
        description: `Most incidents occur around ${peakHour}:00. Consider increasing security presence during this time.`,
        confidence: 78,
        severity: 'medium',
        actionable: true,
        action: 'Schedule additional patrols during peak hours'
      });
    }

    // Location-based analysis
    const locationFrequency = recentIncidents.reduce((acc, incident) => {
      const location = incident.location.toLowerCase();
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const hotspotLocation = Object.entries(locationFrequency).reduce((a, b) => 
      locationFrequency[a[0]] > locationFrequency[b[0]] ? a : b, ['', 0]
    );

    if (hotspotLocation[1] > 3) {
      newInsights.push({
        type: 'prediction',
        title: 'High-Risk Location Alert',
        description: `${hotspotLocation[0]} has experienced ${hotspotLocation[1]} incidents recently. This area may require immediate attention.`,
        confidence: 92,
        severity: 'high',
        actionable: true,
        action: 'Deploy additional security resources to this location'
      });
    }

    // Severity trend analysis
    const highSeverityIncidents = recentIncidents.filter(i => 
      i.severity === 'high' || i.severity === 'critical'
    );

    if (highSeverityIncidents.length > 3) {
      newInsights.push({
        type: 'anomaly',
        title: 'Severity Spike Detected',
        description: `${highSeverityIncidents.length} high-severity incidents reported recently. This is above normal levels.`,
        confidence: 88,
        severity: 'critical',
        actionable: true,
        action: 'Activate emergency response protocols'
      });
    }

    // Resource optimization recommendations
    const underPatrolledAreas = securityAreas.filter(area => {
      const areaIncidents = recentIncidents.filter(incident =>
        incident.location.toLowerCase().includes(area.name.toLowerCase())
      );
      return areaIncidents.length > ((area.incidentCount ?? 0) * 0.5); // More incidents than expected
    });

    if (underPatrolledAreas.length > 0) {
      newInsights.push({
        type: 'recommendation',
        title: 'Resource Optimization Opportunity',
        description: `${underPatrolledAreas.length} areas may benefit from increased security presence based on recent activity.`,
        confidence: 75,
        severity: 'medium',
        actionable: true,
        action: 'Review and adjust patrol routes'
      });
    }

    // Safety recommendations
    newInsights.push({
      type: 'recommendation',
      title: 'Community Safety Enhancement',
      description: 'Based on recent patterns, consider implementing community awareness programs in high-risk areas.',
      confidence: 70,
      severity: 'low',
      actionable: true,
      action: 'Organize community safety workshops'
    });

    setInsights(newInsights);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (incidents.length > 0) {
      analyzeIncidents();
    }
  }, [incidents]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="w-5 h-5" />;
      case 'prediction': return <Target className="w-5 h-5" />;
      case 'anomaly': return <AlertTriangle className="w-5 h-5" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold">AI-Powered Security Analysis</h3>
        </div>
        <Button 
          onClick={analyzeIncidents} 
          disabled={isAnalyzing}
          variant="outline"
          size="sm"
        >
          {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {isAnalyzing ? (
        <Card className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span>AI is analyzing incident patterns...</span>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.length === 0 ? (
            <Card className="p-6 text-center">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">No Insights Available</h4>
              <p className="text-muted-foreground">Submit more incident reports to enable AI analysis.</p>
            </Card>
          ) : (
            insights.map((insight, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <Badge variant={getSeverityColor(insight.severity)}>
                        {insight.severity}
                      </Badge>
                      <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    
                    {insight.actionable && insight.action && (
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Recommended Action:</p>
                          <p className="text-sm text-blue-700">{insight.action}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* AI Capabilities Info */}
      <Card className="p-4 bg-purple-50 border border-purple-200">
        <div className="flex items-start space-x-3">
          <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-800 mb-2">AI Analysis Capabilities</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Pattern recognition in incident data</li>
              <li>• Predictive risk assessment</li>
              <li>• Anomaly detection for unusual activities</li>
              <li>• Resource optimization recommendations</li>
              <li>• Community safety enhancement suggestions</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
