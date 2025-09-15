import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIncidentSchema, type InsertIncident } from "@shared/schema";
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
import { MapPin, Phone, Camera, X } from "lucide-react";

interface IncidentReportFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export default function IncidentReportForm({ onSubmit, onCancel }: IncidentReportFormProps) {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { location, getCurrentLocation, isLoading: locationLoading } = useGeolocation();

  const form = useForm<InsertIncident>({
    resolver: zodResolver(insertIncidentSchema),
    defaultValues: {
      type: "",
      location: "",
      description: "",
      latitude: location?.latitude || 10.2937, // Default to Gombe coordinates
      longitude: location?.longitude || 11.1694,
      severity: "medium",
      status: "active",
      isAnonymous: 1,
    },
  });

  const createIncidentMutation = useMutation({
    mutationFn: (data: InsertIncident) => apiRequest("POST", "/api/incidents", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Incident Reported",
        description: "Your incident report has been submitted successfully.",
      });
      onSubmit();
    },
    onError: (error) => {
      toast({
        title: "Report Failed",
        description: "Failed to submit incident report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertIncident) => {
    const reportData = {
      ...data,
      latitude: location?.latitude || data.latitude,
      longitude: location?.longitude || data.longitude,
      isAnonymous: isAnonymous ? 1 : 0,
    };
    createIncidentMutation.mutate(reportData);
  };

  const incidentTypes = [
    { value: "terrorism", label: "Terrorism" },
    { value: "banditry", label: "Banditry" },
    { value: "cattle_rustling", label: "Cattle Rustling" },
    { value: "kalare_gangs", label: "Kalare Gang Activity" },
    { value: "kidnapping", label: "Kidnapping" },
    { value: "armed_robbery", label: "Armed Robbery" },
    { value: "suspicious_activity", label: "Suspicious Activity" },
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
                    GPS: {location?.latitude?.toFixed(4) || "10.2937"}°N, {location?.longitude?.toFixed(4) || "11.1694"}°E
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
          
          {/* Photo Upload Placeholder */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">Photo Evidence (Optional)</Label>
            <Card className="border-2 border-dashed border-border p-4 text-center">
              <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload photo</p>
              <input type="file" accept="image/*" className="hidden" />
            </Card>
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
          
          {/* Emergency Contact */}
          <Card className="bg-muted/50 border border-border p-3">
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-destructive" />
              <span className="font-medium">Emergency:</span>
              <span>199 (Police) | 123 (Operation Hattara)</span>
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
