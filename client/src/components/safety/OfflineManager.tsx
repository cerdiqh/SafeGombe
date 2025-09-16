import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  HardDrive, 
  RotateCcw, 
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  MapPin,
  Shield
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface OfflineData {
  incidents: number;
  safetyTips: number;
  emergencyContacts: number;
  businessRatings: number;
  mapData: number;
  lastSync: string;
}

interface QueuedAction {
  id: string;
  type: 'incident_report' | 'safe_walk_request' | 'panic_alert' | 'business_rating';
  data: any;
  timestamp: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
}

const mockOfflineData: OfflineData = {
  incidents: 156,
  safetyTips: 45,
  emergencyContacts: 12,
  businessRatings: 89,
  mapData: 78,
  lastSync: '2024-02-15T10:30:00Z'
};

const mockQueuedActions: QueuedAction[] = [
  {
    id: 'action-1',
    type: 'incident_report',
    data: { type: 'suspicious_activity', location: 'Gombe Central' },
    timestamp: '2024-02-15T09:15:00Z',
    retryCount: 0,
    status: 'pending'
  },
  {
    id: 'action-2',
    type: 'safe_walk_request',
    data: { from: 'Home', to: 'Market' },
    timestamp: '2024-02-15T08:45:00Z',
    retryCount: 1,
    status: 'failed'
  }
];

export default function OfflineManager() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData>(mockOfflineData);
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>(mockQueuedActions);
  const [autoSync, setAutoSync] = useState(true);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageQuota, setStorageQuota] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Internet connection restored. Syncing queued data...",
      });
      if (autoSync) {
        syncQueuedActions();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Offline Mode",
        description: "No internet connection. App will continue to work offline.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check storage usage
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        setStorageUsed(estimate.usage || 0);
        setStorageQuota(estimate.quota || 0);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSync, toast]);

  const syncQueuedActions = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    setSyncProgress(0);

    const pendingActions = queuedActions.filter(action => 
      action.status === 'pending' || action.status === 'failed'
    );

    for (let i = 0; i < pendingActions.length; i++) {
      const action = pendingActions[i];
      
      try {
        // Update status to syncing
        setQueuedActions(prev => prev.map(a => 
          a.id === action.id ? { ...a, status: 'syncing' } : a
        ));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mark as completed
        setQueuedActions(prev => prev.map(a => 
          a.id === action.id ? { ...a, status: 'completed' } : a
        ));

        setSyncProgress(((i + 1) / pendingActions.length) * 100);
      } catch (error) {
        // Mark as failed and increment retry count
        setQueuedActions(prev => prev.map(a => 
          a.id === action.id ? { 
            ...a, 
            status: 'failed', 
            retryCount: a.retryCount + 1 
          } : a
        ));
      }
    }

    setIsSyncing(false);
    setSyncProgress(100);

    // Update last sync time
    setOfflineData(prev => ({
      ...prev,
      lastSync: new Date().toISOString()
    }));

    toast({
      title: "Sync Complete",
      description: `Synced ${pendingActions.length} queued actions.`,
    });
  };

  const downloadOfflineData = async () => {
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Cannot download data while offline.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);

    const dataTypes = ['incidents', 'safetyTips', 'emergencyContacts', 'businessRatings', 'mapData'];
    
    for (let i = 0; i < dataTypes.length; i++) {
      // Simulate downloading data
      await new Promise(resolve => setTimeout(resolve, 800));
      setSyncProgress(((i + 1) / dataTypes.length) * 100);
    }

    setIsSyncing(false);
    
    // Update offline data counts
    setOfflineData(prev => ({
      incidents: prev.incidents + 25,
      safetyTips: prev.safetyTips + 10,
      emergencyContacts: prev.emergencyContacts + 3,
      businessRatings: prev.businessRatings + 15,
      mapData: prev.mapData + 20,
      lastSync: new Date().toISOString()
    }));

    toast({
      title: "Download Complete",
      description: "Latest data downloaded for offline use.",
    });
  };

  const clearOfflineData = () => {
    setOfflineData({
      incidents: 0,
      safetyTips: 0,
      emergencyContacts: 0,
      businessRatings: 0,
      mapData: 0,
      lastSync: new Date().toISOString()
    });

    toast({
      title: "Data Cleared",
      description: "Offline data has been cleared to free up storage.",
    });
  };

  const retryFailedActions = () => {
    if (isOnline) {
      syncQueuedActions();
    } else {
      toast({
        title: "No Internet Connection",
        description: "Cannot retry actions while offline.",
        variant: "destructive",
      });
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'incident_report': return <AlertCircle className="h-4 w-4" />;
      case 'safe_walk_request': return <MapPin className="h-4 w-4" />;
      case 'panic_alert': return <Shield className="h-4 w-4" />;
      case 'business_rating': return <Database className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const storagePercentage = storageQuota > 0 ? (storageUsed / storageQuota) * 100 : 0;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          {isOnline ? (
            <Wifi className="h-8 w-8 mr-3 text-green-600" />
          ) : (
            <WifiOff className="h-8 w-8 mr-3 text-red-600" />
          )}
          Offline Manager
        </h1>
        <p className="text-muted-foreground">
          Manage offline data and sync queued actions when connection is restored
        </p>
      </div>

      {/* Connection Status */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-green-700">Online</span>
                  <span className="text-sm text-muted-foreground">
                    Last sync: {new Date(offlineData.lastSync).toLocaleString()}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium text-red-700">Offline</span>
                  <span className="text-sm text-muted-foreground">
                    Working in offline mode
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm">Auto-sync</span>
              <Switch
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Offline Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="h-5 w-5 mr-2" />
              Offline Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{offlineData.incidents}</div>
                <div className="text-xs text-muted-foreground">Incidents</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{offlineData.safetyTips}</div>
                <div className="text-xs text-muted-foreground">Safety Tips</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{offlineData.emergencyContacts}</div>
                <div className="text-xs text-muted-foreground">Contacts</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{offlineData.businessRatings}</div>
                <div className="text-xs text-muted-foreground">Businesses</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Used</span>
                <span>{(storageUsed / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <Progress value={storagePercentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                {storagePercentage.toFixed(1)}% of available storage
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={downloadOfflineData} 
                disabled={!isOnline || isSyncing}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Data
              </Button>
              <Button 
                onClick={clearOfflineData} 
                variant="outline"
                className="flex-1"
              >
                Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sync Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 mr-2" />
                Sync Queue
              </div>
              <Badge variant="outline">
                {queuedActions.filter(a => a.status === 'pending' || a.status === 'failed').length} pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSyncing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Syncing...</span>
                  <span>{Math.round(syncProgress)}%</span>
                </div>
                <Progress value={syncProgress} className="h-2" />
              </div>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {queuedActions.length > 0 ? (
                queuedActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getActionIcon(action.type)}
                      <div>
                        <div className="font-medium text-sm">
                          {action.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(action.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(action.status)}>
                      {action.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-sm">All actions synced</div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={syncQueuedActions} 
                disabled={!isOnline || isSyncing}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
              <Button 
                onClick={retryFailedActions} 
                variant="outline"
                disabled={!queuedActions.some(a => a.status === 'failed')}
                className="flex-1"
              >
                Retry Failed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offline Features */}
      <Card>
        <CardHeader>
          <CardTitle>Available Offline Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                Incident Reporting
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Report incidents offline. Data will be synced when connection is restored.
              </p>
              <Badge variant="outline" className="text-xs text-green-600">
                ✓ Available Offline
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-green-500" />
                Safe Walk Requests
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Request safe walks offline. Requests will be processed when online.
              </p>
              <Badge variant="outline" className="text-xs text-green-600">
                ✓ Available Offline
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-red-500" />
                Emergency Contacts
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Access emergency contact information even without internet.
              </p>
              <Badge variant="outline" className="text-xs text-green-600">
                ✓ Available Offline
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <Database className="h-4 w-4 mr-2 text-purple-500" />
              Safety Tips & Education
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Access downloaded safety tips and educational content offline.
              </p>
              <Badge variant="outline" className="text-xs text-green-600">
                ✓ Available Offline
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
