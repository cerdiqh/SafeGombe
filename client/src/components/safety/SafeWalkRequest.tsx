import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGeolocation } from "@/hooks/use-geolocation";
import { safetyService } from "@/services/safetyService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

const safeWalkSchema = z.object({
  startLocation: z.string().min(1, "Starting location is required"),
  endLocation: z.string().min(1, "Destination is required"),
  notes: z.string().optional(),
});

type SafeWalkFormValues = z.infer<typeof safeWalkSchema>;

export function SafeWalkRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'matching' | 'active' | 'completed'>('form');
  const { location, error: locationError } = useGeolocation();
  const { toast } = useToast();

  const form = useForm<SafeWalkFormValues>({
    resolver: zodResolver(safeWalkSchema),
    defaultValues: {
      startLocation: '',
      endLocation: '',
      notes: '',
    },
  });

  const handleGetCurrentLocation = (field: 'startLocation' | 'endLocation') => {
    if (locationError) {
      toast({
        title: "Location Error",
        description: "Could not determine your location. Please enable location services.",
        variant: "destructive",
      });
      return;
    }

    // Use reverse geocoding to get the address
    const getAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const address = data.display_name || 'Current Location';
        form.setValue(field, address);
      } catch (error) {
        console.error('Error getting address:', error);
        form.setValue(field, 'My Current Location');
      }
    };

    getAddress();
  };

  const onSubmit = async (data: SafeWalkFormValues) => {
    setIsLoading(true);
    try {
      // Show matching screen
      setCurrentStep('matching');
      
      // Simulate finding a safety partner (in a real app, this would be an API call)
      setTimeout(async () => {
        try {
          // In a real app, this would be an actual API call
          // await safetyService.requestSafeWalk({
          //   startLocation: {
          //     lat: location.latitude,
          //     lng: location.longitude,
          //     address: data.startLocation,
          //   },
          //   endLocation: {
          //     lat: location.latitude + 0.01, // Example: slightly different coordinates
          //     lng: location.longitude + 0.01,
          //     address: data.endLocation,
          //   },
          //   notes: data.notes,
          // });
          
          // For demo purposes, just show the active state
          setCurrentStep('active');
          
          // Don't auto-complete - wait for user to click "I've Arrived Safely"
          
        } catch (error) {
          console.error('Error requesting safe walk:', error);
          toast({
            title: "Request Failed",
            description: "Could not find a safety partner. Please try again later.",
            variant: "destructive",
          });
          setCurrentStep('form');
        } finally {
          setIsLoading(false);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  if (currentStep === 'matching') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Finding a Safety Partner</h3>
        <p className="text-muted-foreground">Please wait while we connect you with a nearby safety partner...</p>
      </div>
    );
  }

  if (currentStep === 'active') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Safe Walk in Progress</h3>
        <p className="text-muted-foreground mb-6">Your safety partner is on the way to meet you.</p>
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">From:</span>
            <span className="text-muted-foreground">{form.watch('startLocation')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">To:</span>
            <span className="text-muted-foreground">{form.watch('endLocation')}</span>
          </div>
        </div>
        <Button 
          variant="default" 
          className="mt-6 w-full bg-green-600 hover:bg-green-700"
          onClick={() => {
            setCurrentStep('completed');
            toast({
              title: "Safe Walk Completed",
              description: "You've reached your destination safely!",
            });
            // Reset form after user confirms completion
            setTimeout(() => {
              setCurrentStep('form');
              form.reset();
            }, 3000);
          }}
        >
          I've Arrived Safely
        </Button>
      </div>
    );
  }

  if (currentStep === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Safe Walk Completed</h3>
        <p className="text-muted-foreground">You've reached your destination safely!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Request a Safe Walk</h3>
        <p className="text-sm text-muted-foreground">
          A safety partner will accompany you to your destination
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="startLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starting Location</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="Enter your current location" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => handleGetCurrentLocation('startLocation')}
                    title="Use my current location"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input placeholder="Where are you going?" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => handleGetCurrentLocation('endLocation')}
                    title="Use my current location"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Any special instructions?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding a Partner...
              </>
            ) : (
              'Request Safe Walk'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
