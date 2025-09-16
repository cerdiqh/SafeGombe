import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, Info, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { riskAnalysisService, type RiskPrediction, type SafetyTip } from "@/services/riskAnalysisService";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Skeleton } from "@/components/ui/skeleton";

const RiskLevelIndicator = ({ level }: { level: 'low' | 'medium' | 'high' }) => {
  const getLevelDetails = () => {
    switch (level) {
      case 'low':
        return {
          color: 'bg-green-500',
          icon: <ShieldCheck className="h-5 w-5 text-green-600" />,
          label: 'Low Risk',
          description: 'Area is generally safe with minimal risks.'
        };
      case 'medium':
        return {
          color: 'bg-yellow-500',
          icon: <Shield className="h-5 w-5 text-yellow-600" />,
          label: 'Medium Risk',
          description: 'Exercise normal caution in this area.'
        };
      case 'high':
        return {
          color: 'bg-red-500',
          icon: <ShieldAlert className="h-5 w-5 text-red-600" />,
          label: 'High Risk',
          description: 'Be extra cautious in this area.'
        };
      default:
        return {
          color: 'bg-gray-500',
          icon: <Info className="h-5 w-5 text-gray-600" />,
          label: 'Unknown',
          description: 'Risk level not available.'
        };
    }
  };

  const { color, icon, label, description } = getLevelDetails();

  return (
    <div className="flex items-center space-x-4">
      <div className={`h-12 w-12 rounded-full ${color} flex items-center justify-center text-white`}>
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const SafetyTipCard = ({ tip }: { tip: SafetyTip }) => {
  const getSeverityIcon = () => {
    switch (tip.severity) {
      case 'danger':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 border rounded-lg">
      <div className="mt-0.5">{getSeverityIcon()}</div>
      <div>
        <h4 className="font-medium">{tip.title}</h4>
        <p className="text-sm text-muted-foreground">{tip.description}</p>
      </div>
    </div>
  );
};

export default function RiskAnalysisDashboard() {
  const { location, error: locationError } = useGeolocation();
  const [riskPrediction, setRiskPrediction] = useState<RiskPrediction | null>(null);
  const [safetyTips, setSafetyTips] = useState<SafetyTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use default Gombe coordinates if location is not available
        const lat = location?.latitude || 10.2890; // Gombe State coordinates
        const lng = location?.longitude || 11.1671;

        const [prediction, tips] = await Promise.all([
          riskAnalysisService.getRiskPrediction(lat, lng),
          riskAnalysisService.getSafetyTips(),
        ]);
        
        setRiskPrediction(prediction);
        setSafetyTips(tips);
        setError(null); // Clear any previous errors
      } catch (err: unknown) {
        console.error('Error fetching risk analysis:', err);
        setError(err instanceof Error ? err.message : 'Failed to load risk analysis data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
        <p className="text-muted-foreground">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Area Safety Assessment</CardTitle>
          <CardDescription>
            Risk analysis for your current location
          </CardDescription>
        </CardHeader>
        <CardContent>
          {riskPrediction ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <RiskLevelIndicator level={riskPrediction.riskLevel} />
                <div className="mt-4 md:mt-0 text-right">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-2xl font-bold">
                    {Math.round(riskPrediction.confidence * 100)}%
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Time of Day</p>
                  <p className="font-medium capitalize">
                    {riskPrediction.factors.timeOfDay}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Day of Week</p>
                  <p className="font-medium capitalize">
                    {riskPrediction.factors.dayOfWeek}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Area Safety Score</p>
                  <p className="font-medium">
                    {riskPrediction.factors.areaSafetyScore}/10
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Safety Recommendations</h4>
                <ul className="space-y-2">
                  {riskPrediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>No risk prediction available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Tips</CardTitle>
          <CardDescription>
            Important safety information for your area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safetyTips.map((tip) => (
              <SafetyTipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
