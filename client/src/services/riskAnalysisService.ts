import { apiRequest } from "@/lib/queryClient";

export interface RiskPrediction {
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  factors: {
    timeOfDay: string;
    dayOfWeek: string;
    historicalIncidents: number;
    recentActivity: number;
    areaSafetyScore: number;
  };
  recommendations: string[];
}

export interface SafetyTip {
  id: string;
  title: string;
  description: string;
  category: 'general' | 'travel' | 'emergency' | 'cyber';
  severity: 'info' | 'warning' | 'danger';
}

export const riskAnalysisService = {
  // Get risk prediction for a specific location
  getRiskPrediction: async (lat: number, lng: number): Promise<RiskPrediction> => {
    try {
      // In a real app, this would be an API call to your backend
      // For now, we'll return mock data
      const mockPrediction: RiskPrediction = {
        riskLevel: 'medium',
        confidence: 0.75,
        factors: {
          timeOfDay: new Date().getHours() >= 18 || new Date().getHours() < 6 ? 'night' : 'day',
          dayOfWeek: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()],
          historicalIncidents: Math.floor(Math.random() * 10) + 1,
          recentActivity: Math.floor(Math.random() * 5) + 1,
          areaSafetyScore: Math.floor(Math.random() * 5) + 5, // 5-10
        },
        recommendations: [
          'Stay in well-lit areas and main roads',
          'Travel in groups when possible, especially at night',
          'Keep your phone charged and emergency contacts ready',
          'Avoid displaying valuable items in public',
          'Be aware of your surroundings at all times',
        ],
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockPrediction;
    } catch (error) {
      console.error('Error getting risk prediction:', error);
      throw new Error('Failed to get risk prediction');
    }
  },

  // Get safety tips based on location and time
  getSafetyTips: async (): Promise<SafetyTip[]> => {
    const tips: SafetyTip[] = [
      {
        id: 'tip-1',
        title: 'Stay Alert in Public',
        description: 'Always be aware of your surroundings, especially in crowded markets and transport hubs in Gombe.',
        category: 'general',
        severity: 'info',
      },
      {
        id: 'tip-2',
        title: 'Share Your Location',
        description: 'Inform family or friends about your travel plans, especially when going to remote areas of Gombe State.',
        category: 'travel',
        severity: 'info',
      },
      {
        id: 'tip-3',
        title: 'Emergency Contacts',
        description: 'Save Gombe State emergency numbers: Police (199), Fire Service (199), Medical Emergency (199).',
        category: 'emergency',
        severity: 'warning',
      },
      {
        id: 'tip-4',
        title: 'Safe Travel Routes',
        description: 'Use main highways like Gombe-Bauchi and Gombe-Yola roads. Avoid isolated rural paths.',
        category: 'travel',
        severity: 'warning',
      },
      {
        id: 'tip-5',
        title: 'Secure Communications',
        description: 'Be cautious with mobile money transactions and avoid sharing personal information in public.',
        category: 'cyber',
        severity: 'danger',
      },
      {
        id: 'tip-6',
        title: 'Market Safety',
        description: 'Keep valuables secure when visiting Gombe Central Market or other busy commercial areas.',
        category: 'general',
        severity: 'info',
      },
      {
        id: 'tip-7',
        title: 'Transport Safety',
        description: 'Use registered commercial vehicles and avoid traveling alone on intercity routes after dark.',
        category: 'travel',
        severity: 'warning',
      },
    ];

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return tips;
  },

  // Get historical incident data for an area
  getHistoricalData: async (lat: number, lng: number, daysBack: number = 30) => {
    try {
      // In a real app, this would be an API call to your backend
      const mockData = {
        totalIncidents: Math.floor(Math.random() * 50) + 10,
        byType: {
          theft: Math.floor(Math.random() * 15) + 3,
          'road_accident': Math.floor(Math.random() * 12) + 2,
          'farmer_herder_conflict': Math.floor(Math.random() * 8) + 1,
          'market_dispute': Math.floor(Math.random() * 6) + 1,
          'cattle_rustling': Math.floor(Math.random() * 5) + 1,
          'flooding': Math.floor(Math.random() * 4) + 1,
          other: Math.floor(Math.random() * 10) + 2,
        },
        trend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)),
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      return mockData;
    } catch (error) {
      console.error('Error getting historical data:', error);
      throw new Error('Failed to get historical data');
    }
  },

  // Get real-time alerts for an area
  getRealTimeAlerts: async (lat: number, lng: number, radiusKm: number = 5) => {
    try {
      // In a real app, this would be an API call to your backend
      const mockAlerts = [
        {
          id: 'alert-1',
          type: 'incident',
          title: 'Road Accident',
          description: 'Traffic accident reported on Gombe-Bauchi highway, expect delays',
          location: 'Gombe-Bauchi Highway',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          severity: 'medium',
        },
        {
          id: 'alert-2',
          type: 'alert',
          title: 'Weather Alert',
          description: 'Heavy rainfall expected, flooding possible in low-lying areas',
          location: 'Gombe Central',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          severity: 'medium',
        },
        {
          id: 'alert-3',
          type: 'incident',
          title: 'Market Congestion',
          description: 'Heavy crowd at Central Market, exercise caution with belongings',
          location: 'Gombe Central Market',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          severity: 'low',
        },
      ];

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockAlerts;
    } catch (error) {
      console.error('Error getting real-time alerts:', error);
      throw new Error('Failed to get real-time alerts');
    }
  },
};
