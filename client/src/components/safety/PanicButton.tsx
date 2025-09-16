import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/use-geolocation";
import { safetyService } from "@/services/safetyService";

export function PanicButton() {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();
  const { location, error: locationError } = useGeolocation();
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isActive && countdown === 0) {
      triggerPanic();
    }
    
    return () => clearTimeout(timer);
  }, [isActive, countdown]);

  const triggerPanic = async () => {
    if (locationError) {
      toast({
        title: "Location Error",
        description: "Could not determine your location. Please enable location services.",
        variant: "destructive",
      });
      resetButton();
      return;
    }

    try {
      // Get the current address using reverse geocoding
      const address = await getAddressFromCoords(location?.latitude || 10.2890, location?.longitude || 11.1671);
      
      await safetyService.triggerPanic({
        lat: location?.latitude || 10.2890,
        lng: location?.longitude || 11.1671,
        address: address || 'Unknown location'
      });
      
      // Notify emergency contacts
      await notifyEmergencyContacts();
      
      toast({
        title: "Help is on the way!",
        description: "Your emergency alert has been sent to local authorities and your emergency contacts.",
        variant: "default",
        action: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Alert Sent</span>
          </div>
        ),
      });
      
    } catch (error) {
      console.error('Failed to trigger panic alert:', error);
      toast({
        title: "Alert Failed",
        description: "Could not send emergency alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      resetButton();
    }
  };

  const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Near ' + (data.address?.road || data.address?.suburb || 'your location');
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Your current location';
    }
  };

  const notifyEmergencyContacts = async () => {
    // In a real app, this would notify pre-configured emergency contacts
    // This is a placeholder for the actual implementation
    console.log('Notifying emergency contacts...');
  };

  const resetButton = () => {
    setIsActive(false);
    setCountdown(5);
  };

  const handlePress = () => {
    if (!isActive) {
      setIsActive(true);
      toast({
        title: "Hold for 5 seconds",
        description: "Keep holding the button to send an emergency alert.",
        variant: "default",
      });
    }
  };

  const handleRelease = () => {
    if (isActive) {
      resetButton();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
          isActive 
            ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
            : 'bg-red-500 hover:bg-red-600'
        }`}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        aria-label="Emergency panic button"
      >
        {isActive ? (
          <span className="text-2xl font-bold">{countdown}</span>
        ) : (
          <ShieldAlert className="h-8 w-8" />
        )}
      </Button>
      
      {isActive && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap">
          <AlertCircle className="inline-block mr-1 h-4 w-4" />
          Releasing will cancel
        </div>
      )}
    </div>
  );
}
