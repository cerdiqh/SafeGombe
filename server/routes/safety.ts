import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';

export function createSafetyRouter() {
  const router = Router();

  // Request a new safe walk
  router.post('/walk', async (req, res) => {
    try {
      const schema = z.object({
        startLocation: z.object({
          lat: z.number(),
          lng: z.number(),
          address: z.string(),
        }),
        endLocation: z.object({
          lat: z.number(),
          lng: z.number(),
          address: z.string(),
        }),
        notes: z.string().optional(),
      });

      const data = schema.parse(req.body);
      
      // In a real app, we would:
      // 1. Find available safety partners
      // 2. Create a safe walk request
      // 3. Notify the safety partner
      
      // For demo purposes, we'll just return a success response
      const safeWalk = {
        id: `walk_${Date.now()}`,
        ...data,
        status: 'requested',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      res.status(201).json(safeWalk);
    } catch (error) {
      console.error('Error creating safe walk:', error);
      res.status(400).json({ 
        message: 'Invalid request data',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Get active safe walks
  router.get('/walks/active', async (req, res) => {
    try {
      // In a real app, this would query the database for active safe walks
      res.json([]);
    } catch (error) {
      console.error('Error fetching active safe walks:', error);
      res.status(500).json({ message: 'Failed to fetch active safe walks' });
    }
  });

  // Update safe walk status
  router.patch('/walk/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['requested', 'in-progress', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      // In a real app, we would update the safe walk status in the database
      // For now, we'll just return a success response
      res.json({ 
        id,
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating safe walk status:', error);
      res.status(500).json({ message: 'Failed to update safe walk status' });
    }
  });

  // Trigger panic alert
  router.post('/panic', async (req, res) => {
    try {
      const schema = z.object({
        location: z.object({
          lat: z.number(),
          lng: z.number(),
          address: z.string(),
        }),
      });

      const { location } = schema.parse(req.body);
      
      // In a real app, we would:
      // 1. Notify emergency contacts
      // 2. Alert nearby safety partners
      // 3. Log the incident
      
      // For demo purposes, we'll just return a success response
      res.status(201).json({
        id: `panic_${Date.now()}`,
        location,
        status: 'alerted',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error handling panic alert:', error);
      res.status(400).json({ 
        message: 'Invalid request data',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Get nearby safety partners
  router.get('/partners/nearby', async (req, res) => {
    try {
      const { lat, lng, radius = 5 } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: 'Missing location parameters' });
      }
      
      // In a real app, we would query the database for nearby safety partners
      // For now, we'll return some mock data
      const mockPartners = [
        {
          id: 'partner_1',
          name: 'Community Safety Volunteer',
          phone: '+234 800 123 4567',
          isAvailable: true,
          lastActive: new Date().toISOString(),
          distance: 0.8, // km
        },
        {
          id: 'partner_2',
          name: 'Local Security Guard',
          phone: '+234 800 234 5678',
          isAvailable: true,
          lastActive: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          distance: 1.2, // km
        },
      ];
      
      res.json(mockPartners);
    } catch (error) {
      console.error('Error fetching nearby safety partners:', error);
      res.status(500).json({ message: 'Failed to fetch nearby safety partners' });
    }
  });

  // Get safety status for an area
  router.get('/status', async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: 'Missing location parameters' });
      }
      
      // In a real app, we would analyze incident data for the area
      // For now, we'll return some mock data
      res.json({
        riskLevel: 'medium',
        recentIncidents: 3,
        safetyTips: [
          'Stay in well-lit areas',
          'Avoid walking alone at night',
          'Keep your phone charged and with you',
        ],
        nearbySafetyResources: [
          { name: 'Police Station', distance: '0.5 km', phone: '+234 800 123 4567' },
          { name: 'Hospital', distance: '1.2 km', phone: '+234 800 234 5678' },
        ],
      });
    } catch (error) {
      console.error('Error fetching safety status:', error);
      res.status(500).json({ message: 'Failed to fetch safety status' });
    }
  });

  return router;
}
