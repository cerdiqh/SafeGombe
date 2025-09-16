import { apiRequest } from "@/lib/queryClient";

export interface BusinessSafetyRating {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number;
  reviewCount: number;
  lastUpdated: string;
  safetyFeatures: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  hours?: {
    [key: string]: string;
  };
  verified: boolean;
}

export interface SafetyReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  businessId: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
  safetyFeaturesNoted: string[];
}

const safetyRatingService = {
  // Get businesses with safety ratings near a location
  getNearbyBusinesses: async (
    lat: number,
    lng: number,
    radiusKm: number = 5,
    category?: string,
    minRating: number = 0
  ): Promise<BusinessSafetyRating[]> => {
    try {
      // In a real app, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for demonstration
      const mockBusinesses: BusinessSafetyRating[] = [
        {
          id: 'biz-1',
          name: 'City Mall Gombe',
          address: 'Gombe Bypass, Gombe',
          category: 'Shopping Mall',
          rating: 4.2,
          reviewCount: 42,
          lastUpdated: '2025-09-10T14:30:00Z',
          safetyFeatures: ['Security Guards', 'CCTV', 'Well-lit Parking', 'First Aid'],
          location: {
            latitude: 10.2900 + (Math.random() * 0.01 - 0.005),
            longitude: 11.1700 + (Math.random() * 0.01 - 0.005),
          },
          contact: {
            phone: '+2348030000001',
            website: 'https://citymallgombe.com',
          },
          hours: {
            monday: '8:00 AM - 10:00 PM',
            tuesday: '8:00 AM - 10:00 PM',
            wednesday: '8:00 AM - 10:00 PM',
            thursday: '8:00 AM - 10:00 PM',
            friday: '8:00 AM - 11:00 PM',
            saturday: '9:00 AM - 11:00 PM',
            sunday: '10:00 AM - 10:00 PM',
          },
          verified: true,
        },
        {
          id: 'biz-2',
          name: 'Grand Central Restaurant',
          address: 'Tudun Wada, Gombe',
          category: 'Restaurant',
          rating: 4.5,
          reviewCount: 28,
          lastUpdated: '2025-09-12T09:15:00Z',
          safetyFeatures: ['Security Guards', 'Well-lit Parking', 'Fire Extinguishers'],
          location: {
            latitude: 10.2890 + (Math.random() * 0.01 - 0.005),
            longitude: 11.1680 + (Math.random() * 0.01 - 0.005),
          },
          contact: {
            phone: '+2348030000002',
          },
          verified: true,
        },
        {
          id: 'biz-3',
          name: 'Gombe Main Market',
          address: 'Gombe Central, Gombe',
          category: 'Market',
          rating: 3.8,
          reviewCount: 65,
          lastUpdated: '2025-09-08T16:45:00Z',
          safetyFeatures: ['Security Patrols', 'CCTV'],
          location: {
            latitude: 10.2910 + (Math.random() * 0.01 - 0.005),
            longitude: 11.1720 + (Math.random() * 0.01 - 0.005),
          },
          verified: true,
        },
        {
          id: 'biz-4',
          name: 'Paradise Hotel',
          address: 'GRA, Gombe',
          category: 'Hotel',
          rating: 4.0,
          reviewCount: 37,
          lastUpdated: '2025-09-11T11:20:00Z',
          safetyFeatures: ['24/7 Security', 'CCTV', 'Safe Deposit Boxes', 'Well-lit Parking'],
          location: {
            latitude: 10.2880 + (Math.random() * 0.01 - 0.005),
            longitude: 11.1690 + (Math.random() * 0.01 - 0.005),
          },
          contact: {
            phone: '+2348030000003',
            email: 'info@paradisehotelgombe.com',
          },
          verified: true,
        },
        {
          id: 'biz-5',
          name: 'Unity Park',
          address: 'Gombe Town',
          category: 'Park',
          rating: 4.7,
          reviewCount: 19,
          lastUpdated: '2025-09-13T08:30:00Z',
          safetyFeatures: ['Security Patrols', 'Well-lit Paths', 'Emergency Call Boxes'],
          location: {
            latitude: 10.2905 + (Math.random() * 0.01 - 0.005),
            longitude: 11.1710 + (Math.random() * 0.01 - 0.005),
          },
          verified: false,
        },
      ];

      // Filter by category and minRating if provided
      return mockBusinesses.filter(business => {
        const matchesCategory = !category || business.category.toLowerCase() === category.toLowerCase();
        const matchesRating = business.rating >= minRating;
        return matchesCategory && matchesRating;
      });
    } catch (error) {
      console.error('Error fetching nearby businesses:', error);
      throw new Error('Failed to load business safety ratings');
    }
  },

  // Get detailed safety rating for a specific business
  getBusinessSafetyRating: async (businessId: string): Promise<BusinessSafetyRating> => {
    try {
      // In a real app, this would fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock data - in a real app, this would come from an API
      const mockBusinesses: Record<string, BusinessSafetyRating> = {
        'biz-1': {
          id: 'biz-1',
          name: 'City Mall Gombe',
          address: 'Gombe Bypass, Gombe',
          category: 'Shopping Mall',
          rating: 4.2,
          reviewCount: 42,
          lastUpdated: '2025-09-10T14:30:00Z',
          safetyFeatures: ['Security Guards', 'CCTV', 'Well-lit Parking', 'First Aid'],
          location: {
            latitude: 10.2900,
            longitude: 11.1700,
          },
          contact: {
            phone: '+2348030000001',
            website: 'https://citymallgombe.com',
          },
          hours: {
            monday: '8:00 AM - 10:00 PM',
            tuesday: '8:00 AM - 10:00 PM',
            wednesday: '8:00 AM - 10:00 PM',
            thursday: '8:00 AM - 10:00 PM',
            friday: '8:00 AM - 11:00 PM',
            saturday: '9:00 AM - 11:00 PM',
            sunday: '10:00 AM - 10:00 PM',
          },
          verified: true,
        },
        // Add other mock businesses...
      };

      const business = mockBusinesses[businessId];
      if (!business) {
        throw new Error('Business not found');
      }
      
      return business;
    } catch (error) {
      console.error(`Error fetching business ${businessId}:`, error);
      throw new Error('Failed to load business details');
    }
  },

  // Get safety reviews for a business
  getBusinessReviews: async (businessId: string): Promise<SafetyReview[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Mock reviews
      const mockReviews: SafetyReview[] = [
        {
          id: 'rev-1',
          userId: 'user-1',
          userName: 'Amina M.',
          userAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
          businessId,
          rating: 5,
          comment: 'Very safe environment with visible security personnel and good lighting in the parking area.',
          date: '2025-09-05T10:30:00Z',
          verifiedPurchase: true,
          helpfulCount: 8,
          safetyFeaturesNoted: ['Security Guards', 'Well-lit Parking'],
        },
        {
          id: 'rev-2',
          userId: 'user-2',
          userName: 'Ibrahim K.',
          businessId,
          rating: 4,
          comment: 'Good safety measures but could use more CCTV cameras in the back areas.',
          date: '2025-08-28T15:45:00Z',
          verifiedPurchase: true,
          helpfulCount: 3,
          safetyFeaturesNoted: ['CCTV'],
        },
        {
          id: 'rev-3',
          userId: 'user-3',
          userName: 'Fatima A.',
          userAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
          businessId,
          rating: 5,
          comment: 'I always feel safe here. The security team is very responsive.',
          date: '2025-08-20T18:20:00Z',
          verifiedPurchase: true,
          helpfulCount: 12,
          safetyFeaturesNoted: ['Security Guards', 'First Aid'],
        },
      ];

      return mockReviews;
    } catch (error) {
      console.error(`Error fetching reviews for business ${businessId}:`, error);
      throw new Error('Failed to load business reviews');
    }
  },

  // Submit a safety review for a business
  submitReview: async (review: Omit<SafetyReview, 'id' | 'date' | 'helpfulCount'>): Promise<{ success: boolean; message: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would submit to your backend
      console.log('Submitting review:', review);
      
      return {
        success: true,
        message: 'Thank you for your review! Your feedback helps keep our community safe.'
      };
    } catch (error) {
      console.error('Error submitting review:', error);
      return {
        success: false,
        message: 'Failed to submit review. Please try again later.'
      };
    }
  },

  // Report a safety concern about a business
  reportSafetyConcern: async (data: {
    businessId: string;
    concern: string;
    description: string;
    contactEmail?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would submit to your backend
      console.log('Safety concern reported:', data);
      
      return {
        success: true,
        message: 'Thank you for reporting this safety concern. Our team will review it shortly.'
      };
    } catch (error) {
      console.error('Error reporting safety concern:', error);
      return {
        success: false,
        message: 'Failed to submit safety concern. Please try again later.'
      };
    }
  },
};

export default safetyRatingService;
