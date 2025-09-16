import { apiRequest } from "@/lib/queryClient";

export interface SafetyPartner {
  id: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  lastActive: Date;
}

export interface SafeWalkRequest {
  id: string;
  requesterId: string;
  startLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  endLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'requested' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export const safetyService = {
  // Safe Walk features
  requestSafeWalk: async (data: Omit<SafeWalkRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    return apiRequest<SafeWalkRequest>('POST', '/api/safety/walk', data);
  },

  getActiveSafeWalks: async () => {
    return apiRequest<SafeWalkRequest[]>('GET', '/api/safety/walks/active');
  },

  updateSafeWalkStatus: async (walkId: string, status: SafeWalkRequest['status']) => {
    return apiRequest<SafeWalkRequest>('PATCH', `/api/safety/walk/${walkId}/status`, { status });
  },

  // Panic Button features
  triggerPanic: async (location: { lat: number; lng: number; address: string }) => {
    return apiRequest('POST', '/api/safety/panic', { location });
  },

  // Safety Partners
  getNearbySafetyPartners: async (location: { lat: number; lng: number }, radiusKm: number = 5) => {
    return apiRequest<SafetyPartner[]>(
      'GET',
      `/api/safety/partners/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radiusKm}`
    );
  },

  // Safety Status
  getAreaSafetyStatus: async (location: { lat: number; lng: number }) => {
    return apiRequest<{
      riskLevel: 'low' | 'medium' | 'high';
      recentIncidents: number;
      safetyTips: string[];
    }>('GET', `/api/safety/status?lat=${location.lat}&lng=${location.lng}`);
  },
};
