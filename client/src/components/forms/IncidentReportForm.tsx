import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIncidentSchema, type InsertIncident, type Incident } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/use-geolocation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Camera, X, Upload, AlertTriangle, Shield } from "lucide-react";

interface IncidentReportFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export default function IncidentReportForm({ onSubmit, onCancel }: IncidentReportFormProps) {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { location, getCurrentLocation, isLoading: locationLoading } = useGeolocation();

  const form = useForm<InsertIncident>({
    resolver: zodResolver(insertIncidentSchema),
    defaultValues: {
      type: "",
      location: "",
      description: "",
      latitude: location?.latitude || 10.2890, // Default to Gombe coordinates
      longitude: location?.longitude || 11.1671,
      severity: "medium",
      status: "active",
      isAnonymous: 1,
    },
  });

  const createIncidentMutation = useMutation({
    mutationFn: async (data: InsertIncident) => {
      // Handle photo upload if present
      const formData = new FormData();
      
      // Add all form data to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      // Add photo if available
      if (selectedPhoto) {
        formData.append('photo', selectedPhoto);
      }

      // Use fetch directly for FormData
      const response = await fetch('/api/incidents', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to submit incident');
      }

      return response.json();
    },
    onMutate: async (newIncident) => {
      // Optimistically add the incident to any cached incidents lists
      const optimistic: any = {
        ...newIncident,
        id: crypto.randomUUID(),
        reportedAt: new Date().toISOString(),
        status: 'pending', // Mark as pending until confirmed by server
      };
      
      // Update the queries optimistically
      queryClient.setQueryData<Incident[]>(
        ['/api/incidents'], 
        (old = []) => [optimistic, ...old]
      );
      
      return { previousIncidents: queryClient.getQueryData(['/api/incidents']) };
    },
    onError: (error, _variables, context) => {
      console.error('Incident submission error:', error);
      
      // Revert optimistic updates
      if (context?.previousIncidents) {
        queryClient.setQueryData(['/api/incidents'], context.previousIncidents);
      }
      
      toast({
        title: "Report Failed",
        description: error.message || "Failed to submit incident report. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      // Update the optimistic update with the real data
      queryClient.setQueryData<Incident[]>(
        ['/api/incidents'], 
        (old = []) => {
          const filtered = old.filter(incident => incident.id !== data.id);
          return [data, ...filtered];
        }
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/security-areas'] });
      
      // Show success message
      toast({
        title: "Incident Reported!",
        description: "Your report has been submitted successfully.",
      });
      
      // Reset form
      form.reset();
      setSelectedPhoto(null);
      setPhotoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Close the form
      onSubmit();
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (data: InsertIncident) => {
    const reportData = {
      ...data,
      latitude: location?.latitude || data.latitude,
      longitude: location?.longitude || data.longitude,
      isAnonymous: isAnonymous ? 1 : 0,
      photo: photoPreview || null,
    };

    // If offline, store locally and schedule background sync
    if (!navigator.onLine && 'serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.controller?.postMessage({
          type: 'STORE_OFFLINE_INCIDENT',
          incident: { ...reportData, id: crypto.randomUUID() },
        });
        const reg = await navigator.serviceWorker.ready;
        if ('sync' in reg) {
          // @ts-expect-error Background Sync type is not in TS DOM by default
          await reg.sync.register('background-sync-incident');
        }
        toast({
          title: 'Saved Offline',
          description: 'Your report will be submitted when you are back online.',
        });
        onSubmit();
        return;
      } catch (_e) {
        // fall through to normal mutation
      }
    }

    createIncidentMutation.mutate(reportData);
  };

  const incidentTypes = [
    { value: "kalare_gang_activity", label: "Kalare Gang Activity", icon: "⚠️" },
    { value: "phone_snatching", label: "Phone Snatching", icon: "📱" },
    { value: "road_accident", label: "Road Accident", icon: "🚗" },
    { value: "theft", label: "Theft", icon: "🔓" },
    { value: "cattle_rustling", label: "Cattle Rustling", icon: "🐄" },
    { value: "farmer_herder_conflict", label: "Farmer-Herder Conflict", icon: "🌾" },
    { value: "domestic_violence", label: "Domestic Violence", icon: "🏠" },
    { value: "armed_robbery", label: "Armed Robbery", icon: "🔫" },
    { value: "market_dispute", label: "Market Dispute", icon: "🏪" },
    { value: "flooding", label: "Flooding", icon: "🌊" },
    { value: "fire_outbreak", label: "Fire Outbreak", icon: "🔥" },
    { value: "suspicious_activity", label: "Suspicious Activity", icon: "👁" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Report Incident</h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onCancel}
          data-testid="button-close-report"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Incident Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incident Type *</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="select-incident-type">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    placeholder="Describe the location"
                    data-testid="input-location"
                  />
                </FormControl>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                  <MapPin className="w-4 h-4" />
                  <span data-testid="text-coordinates">
                    GPS: {location?.latitude?.toFixed(4) || "10.2890"}°N, {location?.longitude?.toFixed(4) || "11.1671"}°E
                  </span>
                  <Button 
                    type="button" 
                    variant="link" 
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    data-testid="button-use-location"
                    className="text-primary hover:underline p-0 h-auto"
                  >
                    {locationLoading ? "Getting location..." : "Use current location"}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Severity */}
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity Level</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="select-severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    value={field.value || ""}
                    rows={3}
                    placeholder="Provide details about the incident..."
                    className="resize-none"
                    data-testid="textarea-description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Photo Upload */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">Photo Evidence (Optional)</Label>
            {photoPreview ? (
              <Card className="border border-border p-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{selectedPhoto?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedPhoto?.size || 0 / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removePhoto}
                    data-testid="button-remove-photo"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Card 
                className="border-2 border-dashed border-border p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload photo</p>
                <p className="text-xs text-muted-foreground mt-1">Max 5MB, JPG/PNG</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handlePhotoUpload}
                  data-testid="input-photo-upload"
                />
              </Card>
            )}
          </div>
          
          {/* Anonymous Reporting */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anonymous" 
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              data-testid="checkbox-anonymous"
            />
            <Label htmlFor="anonymous" className="text-sm">Submit anonymously</Label>
          </div>
          
          {/* Emergency Contact & Safety Info */}
          <Card className="bg-muted/50 border border-border p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-destructive" />
                <span className="font-medium">Emergency Contacts:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Police:</span>
                  <span className="font-mono font-medium">199</span>
                </div>
                <div className="flex justify-between">
                  <span>Operation Hattara:</span>
                  <span className="font-mono font-medium">123</span>
                </div>
                <div className="flex justify-between">
                  <span>Fire Service:</span>
                  <span className="font-mono font-medium">199</span>
                </div>
                <div className="flex justify-between">
                  <span>Medical:</span>
                  <span className="font-mono font-medium">199</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>Operation Hattara active - 28 security vehicles deployed</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Area Safety Information */}
          <Card className="bg-blue-50 border border-blue-200 p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-blue-800 mb-1">Safety Tips:</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• <strong>Kalare Gang Activity:</strong> Avoid Jekadafari, Manawachi, and Bolari areas at night. Travel in groups and report suspicious gatherings immediately.</li>
                  <li>• <strong>Phone Snatching:</strong> Keep phones secure at night, especially in Jekadafari and Manawachi. Use hands-free devices when possible.</li>
                  <li>• Stay alert during market days and evening hours</li>
                  <li>• Keep emergency contacts saved in your phone</li>
                  <li>• Avoid traveling alone on rural roads after dark</li>
                </ul>
              </div>
            </div>
          </Card>
          
          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onCancel}
              data-testid="button-cancel-report"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createIncidentMutation.isPending}
              data-testid="button-submit-report"
            >
              {createIncidentMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
