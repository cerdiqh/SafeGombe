import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Search, Shield, AlertCircle, User, Check } from 'lucide-react';
import { useGeolocation } from "@/hooks/use-geolocation";
import { useToast } from "@/components/ui/use-toast";
import safetyRatingService, { type BusinessSafetyRating } from "@/services/safetyRatingService";

const BusinessCard = ({ business, onClick }: { business: BusinessSafetyRating; onClick: () => void }) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-lg">{business.name}</h3>
            {business.verified && (
              <Badge variant="outline" className="text-xs">
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {business.address}
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
              <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
              <span className="font-medium">{business.rating.toFixed(1)}</span>
              <span className="text-xs text-amber-600 ml-1">({business.reviewCount})</span>
            </div>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{business.category}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
          {business.safetyFeatures.slice(0, 2).map((feature, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {business.safetyFeatures.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{business.safetyFeatures.length - 2}
            </Badge>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const BusinessDetail = ({ business, onBack }: { business: BusinessSafetyRating; onBack: () => void }) => (
  <div className="space-y-6">
    <Button 
      variant="ghost" 
      size="sm" 
      className="px-0 text-blue-600 hover:bg-transparent hover:text-blue-700"
      onClick={onBack}
    >
      ← Back to results
    </Button>
    
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{business.name}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {business.address}
              </div>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 fill-amber-400 mr-1" />
              <span className="font-medium">{business.rating.toFixed(1)}</span>
              <span className="text-xs ml-1">({business.reviewCount})</span>
            </div>
            <span className="text-sm text-muted-foreground mt-1">{business.category}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Safety Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {business.safetyFeatures.map((feature, i) => (
              <div key={i} className="flex items-center p-3 border rounded-lg">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <Button variant="outline" className="w-full">
          <AlertCircle className="h-4 w-4 mr-2" />
          Report a Safety Concern
        </Button>
      </CardContent>
    </Card>
  </div>
);

const BusinessSafetyRatings = () => {
  const { location, error: locationError } = useGeolocation();
  const { toast } = useToast();
  
  const [businesses, setBusinesses] = useState<BusinessSafetyRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessSafetyRating | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!location?.latitude || !location?.longitude) return;
      
      setLoading(true);
      
      try {
        const businesses = await safetyRatingService.getNearbyBusinesses(
          location.latitude,
          location.longitude
        );
        setBusinesses(businesses);
      } catch (error) {
        console.error('Error fetching businesses:', error);
        toast({
          title: 'Error',
          description: 'Failed to load businesses. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusinesses();
  }, [location?.latitude, location?.longitude, toast]);
  
  if (locationError) {
    return (
      <div className="container mx-auto p-4 max-w-4xl text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Location Access Required</h2>
        <p className="text-muted-foreground mb-4">
          We need your location to show nearby businesses with safety ratings.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  if (selectedBusiness) {
    return <BusinessDetail business={selectedBusiness} onBack={() => setSelectedBusiness(null)} />;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Business Safety Ratings</h1>
        <p className="text-muted-foreground">
          Find and rate businesses based on their safety measures
        </p>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search businesses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))
        ) : businesses.length > 0 ? (
          businesses
            .filter(business => 
              business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              business.address.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(business => (
              <BusinessCard 
                key={business.id}
                business={business}
                onClick={() => setSelectedBusiness(business)}
              />
            ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Shield className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium">No businesses found</h3>
            <p className="text-sm text-muted-foreground">
              We couldn't find any businesses with safety ratings in your area.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessSafetyRatings;
