import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Phone, AlertTriangle, Ambulance, ShieldAlert, Plus, MapPin, User, X, Check, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/use-geolocation";
import emergencyService, { type EmergencyService, type EmergencyContact, type EmergencyAlert } from "@/services/emergencyService";

type EmergencyType = 'police' | 'ambulance' | 'fire' | 'other';

const EmergencyTypeConfig = {
  police: {
    title: 'Police',
    icon: <ShieldAlert className="h-5 w-5 text-blue-600" />,
    color: 'bg-blue-100 text-blue-800',
  },
  ambulance: {
    title: 'Ambulance',
    icon: <Ambulance className="h-5 w-5 text-red-600" />,
    color: 'bg-red-100 text-red-800',
  },
  fire: {
    title: 'Fire Service',
    icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
    color: 'bg-orange-100 text-orange-800',
  },
  other: {
    title: 'Other Emergency',
    icon: <AlertTriangle className="h-5 w-5 text-purple-600" />,
    color: 'bg-purple-100 text-purple-800',
  },
};

const EmergencyServices = () => {
  const { location, error: locationError } = useGeolocation();
  const { toast } = useToast();
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState({
    services: true,
    contacts: true,
  });
  const [activeTab, setActiveTab] = useState('quick');
  const [emergencyType, setEmergencyType] = useState<EmergencyType>('police');
  const [description, setDescription] = useState('');
  const [notifyContacts, setNotifyContacts] = useState(true);
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  const [alertStatus, setAlertStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // Load emergency services and contacts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use default Gombe coordinates if location is not available
        const lat = location?.latitude || 10.2890;
        const lng = location?.longitude || 11.1671;
        
        const [servicesData, contactsData] = await Promise.all([
          emergencyService.getLocalServices(lat, lng),
          emergencyService.getEmergencyContacts(),
        ]);
        setServices(servicesData);
        setContacts(contactsData);
        setLoading({ services: false, contacts: false });
      } catch (error) {
        console.error('Error loading emergency data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load emergency services and contacts',
          variant: 'destructive',
        });
        setLoading({ services: false, contacts: false });
      }
    };

    loadData();
  }, [location, toast]);

  // Poll for alert status if there's an active alert
  useEffect(() => {
    if (!activeAlert || activeAlert.status === 'resolved' || activeAlert.status === 'cancelled') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const updatedAlert = await emergencyService.getAlertStatus(activeAlert.id);
        setActiveAlert(updatedAlert);
        
        if (updatedAlert.status === 'resolved') {
          toast({
            title: 'Emergency Resolved',
            description: 'The emergency has been resolved by the response team.',
          });
        }
      } catch (error) {
        console.error('Error updating alert status:', error);
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [activeAlert, toast]);

  const handleEmergencyCall = (phone: string) => {
    if (window.confirm(`Call ${phone}?`)) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleEmergencyAlert = async () => {
    if (!location) {
      toast({
        title: 'Location Error',
        description: 'Unable to determine your location. Please enable location services and try again.',
        variant: 'destructive',
      });
      return;
    }

    setAlertStatus('sending');
    
    try {
      // Map ambulance to ambulance for the API
      const alertType = emergencyType === 'ambulance' ? 'ambulance' : emergencyType;
      
      const result = await emergencyService.sendEmergencyAlert({
        type: alertType,
        location: {
          latitude: location?.latitude || 10.2890,
          longitude: location?.longitude || 11.1671,
        },
        description,
        notifyContacts,
      });

      if (result.success && result.alertId) {
        const alert = await emergencyService.getAlertStatus(result.alertId);
        setActiveAlert(alert);
        setAlertStatus('sent');
        
        toast({
          title: 'Help is on the way!',
          description: 'Emergency services have been notified and are on their way to your location.',
        });
      } else {
        throw new Error(result.message || 'Failed to send alert');
      }
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      setAlertStatus('error');
      toast({
        title: 'Error',
        description: 'Failed to send emergency alert. Please try again or call emergency services directly.',
        variant: 'destructive',
      });
    }
  };

  const renderServiceCard = (service: EmergencyService) => {
    const config = EmergencyTypeConfig[service.type] || EmergencyTypeConfig.other;
    
    return (
      <Card key={service.id} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full ${config.color} mt-1`}>
                {config.icon}
              </div>
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
                {service.distance && (
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {service.distance.toFixed(1)} km away
                  </div>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:bg-blue-50"
              onClick={() => handleEmergencyCall(service.phone)}
            >
              <Phone className="h-4 w-4 mr-1" />
              {service.phone}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContactCard = (contact: EmergencyContact) => (
    <Card key={contact.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-gray-100">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium">{contact.name}</h3>
              <p className="text-sm text-muted-foreground">{contact.relationship}</p>
            </div>
            {contact.isPrimary && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Primary
              </span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-blue-600 hover:bg-blue-50"
            onClick={() => handleEmergencyCall(contact.phone)}
          >
            <Phone className="h-4 w-4 mr-1" />
            Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderAlertStatus = (alert: EmergencyAlert) => {
    const statusConfig = {
      pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      dispatched: { text: 'Help is on the way!', color: 'bg-blue-100 text-blue-800' },
      'in-progress': { text: 'Assistance in progress', color: 'bg-blue-100 text-blue-800' },
      resolved: { text: 'Resolved', color: 'bg-green-100 text-green-800' },
      cancelled: { text: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
    }[alert.status];

    return (
      <Card className="border-blue-200 bg-blue-50 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-full ${statusConfig.color} bg-opacity-50`}>
                {alert.status === 'resolved' ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <h3 className="font-medium">
                {statusConfig.text}
                {alert.assignedUnit && ` • ${alert.assignedUnit}`}
              </h3>
            </div>
            {alert.estimatedArrival && (
              <span className="text-sm text-blue-700">
                ETA: {alert.estimatedArrival}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Location: </span>
              <span className="ml-1">{alert.location.address || 'Your current location'}</span>
            </div>
            {alert.description && (
              <div className="flex items-start text-sm">
                <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Details: </span>
                <span className="ml-1">{alert.description}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t border-blue-100 bg-white">
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            onClick={() => setActiveAlert(null)}
          >
            <X className="h-4 w-4 mr-1" />
            Close
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Emergency Services</h2>
        <p className="text-muted-foreground">
          Quick access to emergency services and your emergency contacts
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="quick">Quick Alert</TabsTrigger>
          <TabsTrigger value="services">Services Directory</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-6">
          {activeAlert ? (
            renderAlertStatus(activeAlert)
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Send Emergency Alert</CardTitle>
                <CardDescription>
                  Send your location and request immediate assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency-type">Emergency Type</Label>
                  <Select 
                    value={emergencyType} 
                    onValueChange={(value) => setEmergencyType(value as EmergencyType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EmergencyTypeConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center">
                            <span className="mr-2">{config.icon}</span>
                            {config.title}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details (Optional)</Label>
                  <Input 
                    id="description"
                    placeholder="Briefly describe the emergency..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="notify-contacts">Notify Emergency Contacts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send an alert to your emergency contacts
                    </p>
                  </div>
                  <Switch 
                    id="notify-contacts" 
                    checked={notifyContacts}
                    onCheckedChange={setNotifyContacts}
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleEmergencyAlert}
                    disabled={alertStatus === 'sending'}
                  >
                    {alertStatus === 'sending' ? (
                      'Sending Alert...'
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Send Emergency Alert
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h3 className="font-medium text-lg mb-4">Your Emergency Contacts</h3>
            {loading.contacts ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map(renderContactCard)}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Emergency Contact
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <User className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <h4 className="font-medium">No emergency contacts</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Add emergency contacts to notify them in case of an emergency
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Emergency Contact
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-4">Nearby Emergency Services</h3>
            {loading.services ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="space-y-4">
                {services
                  .sort((a, b) => (a.distance || 0) - (b.distance || 0))
                  .map(renderServiceCard)}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <AlertTriangle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <h4 className="font-medium">No services found</h4>
                <p className="text-sm text-muted-foreground">
                  We couldn't find any emergency services in your area.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmergencyServices;
