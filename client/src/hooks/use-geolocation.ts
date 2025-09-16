import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      // Keep default Gombe location if geolocation is not supported
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        setIsLoading(false);
      },
      (error) => {
        // On error, keep the default Gombe location and just log the error
        console.warn('Geolocation error, using default Gombe location:', error.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false, // Less strict for better compatibility
        timeout: 10000, // Longer timeout
        maximumAge: 300000, // Accept cached location up to 5 minutes old
      }
    );
  };

  useEffect(() => {
    // Set default Gombe location immediately, then try to get actual location
    setLocation({
      latitude: 10.2890, // Default to Gombe State coordinates
      longitude: 11.1671,
      error: null,
    });
    
    // Try to get actual location
    getCurrentLocation();
  }, []);

  return {
    location,
    getCurrentLocation,
    isLoading,
    error: location.error,
  };
}
