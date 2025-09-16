import { apiRequest } from "@/lib/queryClient";

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface EmergencyService {
  id: string;
  name: string;
  phone: string;
  type: 'police' | 'ambulance' | 'fire' | 'other';
  description?: string;
  distance?: number; // in km
}

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  type: 'medical' | 'police' | 'fire' | 'other';
  status: 'pending' | 'dispatched' | 'in-progress' | 'resolved' | 'cancelled';
  description?: string;
  assignedUnit?: string;
  estimatedArrival?: string;
}

const emergencyService = {
  // Get local emergency services based on user's location
  getLocalServices: async (lat: number, lng: number): Promise<EmergencyService[]> => {
    try {
      // In a real app, this would call your backend which would use a geocoding service
      // For now, we'll return mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      return [
        {
          id: 'police-1',
          name: 'Gombe State Police Command',
          phone: '199',
          type: 'police',
          distance: 1.2,
          description: '24/7 emergency police services'
        },
        {
          id: 'police-2',
          name: 'Gombe Central Police Division',
          phone: '+234 96 221 234',
          type: 'police',
          distance: 2.1,
          description: 'Central police division'
        },
        {
          id: 'hospital-1',
          name: 'Federal Teaching Hospital Gombe',
          phone: '+234 96 220 012',
          type: 'ambulance',
          distance: 1.8,
          description: 'Major teaching hospital with emergency services'
        },
        {
          id: 'hospital-2',
          name: 'Gombe State Specialist Hospital',
          phone: '+234 96 221 567',
          type: 'ambulance',
          distance: 2.3,
          description: 'State specialist hospital'
        },
        {
          id: 'hospital-3',
          name: 'General Hospital Gombe',
          phone: '+234 96 220 890',
          type: 'ambulance',
          distance: 1.5,
          description: 'General hospital with emergency care'
        },
        {
          id: 'fire-1',
          name: 'Gombe State Fire Service',
          phone: '199',
          type: 'fire',
          distance: 2.8,
          description: 'Fire and rescue emergency services'
        },
        {
          id: 'nscdc-1',
          name: 'NSCDC Gombe Command',
          phone: '+234 96 220 890',
          type: 'other',
          distance: 1.5,
          description: 'Nigeria Security and Civil Defence Corps'
        },
        {
          id: 'frsc-1',
          name: 'FRSC Gombe Sector Command',
          phone: '+234 700 2255 3772',
          type: 'other',
          distance: 3.2,
          description: 'Federal Road Safety Corps - Road emergencies'
        },
        {
          id: 'vigilante-1',
          name: 'Gombe Vigilante Group',
          phone: '+234 80 3456 7890',
          type: 'other',
          distance: 1.0,
          description: 'Community security volunteers'
        }
      ];
    } catch (error) {
      console.error('Error fetching emergency services:', error);
      throw new Error('Failed to load emergency services');
    }
  },

  // Get user's emergency contacts
  getEmergencyContacts: async (): Promise<EmergencyContact[]> => {
    try {
      // In a real app, this would be fetched from the user's profile
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        {
          id: '1',
          name: 'Fatima Aliyu',
          phone: '+2348035555555',
          relationship: 'Mother',
          isPrimary: true
        },
        {
          id: '2',
          name: 'Musa Ibrahim',
          phone: '+2348036666666',
          relationship: 'Brother',
          isPrimary: false
        },
        {
          id: '3',
          name: 'Aisha Mohammed',
          phone: '+2348037777777',
          relationship: 'Sister',
          isPrimary: false
        }
      ];
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      throw new Error('Failed to load emergency contacts');
    }
  },

  // Send emergency alert
  sendEmergencyAlert: async (data: {
    type: 'police' | 'ambulance' | 'fire' | 'other';
    location: { latitude: number; longitude: number; };
    description?: string;
    notifyContacts: boolean;
  }): Promise<{ success: boolean; message: string; alertId?: string }> => {
    try {
      // In a real app, this would call your backend API
      console.log('Sending emergency alert:', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API response
      return {
        success: true,
        message: 'Emergency services have been notified',
        alertId: `alert-${Date.now()}`
      };
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      return {
        success: false,
        message: 'Failed to send emergency alert. Please try again.'
      };
    }
  },

  // Get status of an emergency alert
  getAlertStatus: async (alertId: string): Promise<EmergencyAlert> => {
    try {
      // In a real app, this would fetch from your backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate different statuses based on time
      const statuses: Array<EmergencyAlert['status']> = [
        'pending', 'dispatched', 'in-progress', 'resolved'
      ];
      const status = statuses[Math.min(
        Math.floor((Date.now() - parseInt(alertId.split('-')[1])) / 30000), // Change status every 30s
        statuses.length - 1
      )];
      
      return {
        id: alertId,
        timestamp: new Date().toISOString(),
        location: {
          latitude: 10.2890 + (Math.random() * 0.01 - 0.005), // Small random offset
          longitude: 11.1671 + (Math.random() * 0.01 - 0.005),
          address: 'Gombe, Nigeria'
        },
        type: 'police',
        status,
        description: 'Emergency assistance requested',
        assignedUnit: status !== 'pending' ? `Unit-${Math.floor(100 + Math.random() * 900)}` : undefined,
        estimatedArrival: status === 'dispatched' ? '5-10 minutes' : undefined
      };
    } catch (error) {
      console.error('Error getting alert status:', error);
      throw new Error('Failed to get alert status');
    }
  }
};

export default emergencyService;
