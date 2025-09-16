import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIncidentSchema } from "@shared/schema";
import { z } from "zod";
import { createSafetyRouter } from "./routes/safety";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all incidents
  app.get("/api/incidents", async (req, res) => {
    try {
      const { area, type, hours } = req.query;
      
      let incidents;
      if (area) {
        incidents = await storage.getIncidentsByArea(area as string);
      } else if (type) {
        incidents = await storage.getIncidentsByType(type as string);
      } else if (hours) {
        incidents = await storage.getRecentIncidents(parseInt(hours as string));
      } else {
        incidents = await storage.getIncidents();
      }
      
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  // Get single incident
  app.get("/api/incidents/:id", async (req, res) => {
    try {
      // Gracefully handle accidental '/api/incidents/[object Object]' requests
      if (req.params.id === "[object Object]") {
        const incidents = await storage.getIncidents();
        return res.json(incidents);
      }

      const incident = await storage.getIncident(req.params.id);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incident" });
    }
  });

  // Mount safety routes
  app.use("/api/safety", createSafetyRouter());

  // Create new incident with file upload support
  app.post("/api/incidents", async (req, res) => {
    // Handle multipart/form-data
    if (req.is('multipart/form-data')) {
      try {
        const formidable = await import('formidable');
        const form = new formidable.IncomingForm();
        
        const formData = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
          form.parse(req, (err: any, fields: any, files: any) => {
            if (err) {
              console.error('Error parsing form data:', err);
              reject(err);
              return;
            }
            resolve({ fields, files });
          });
        });

        // Convert string fields to their appropriate types
        const incidentData = {
          type: formData.fields.type?.[0],
          location: formData.fields.location?.[0],
          description: formData.fields.description?.[0],
          latitude: formData.fields.latitude ? parseFloat(formData.fields.latitude[0]) : undefined,
          longitude: formData.fields.longitude ? parseFloat(formData.fields.longitude[0]) : undefined,
          severity: formData.fields.severity?.[0] || 'medium',
          status: 'active',
          isAnonymous: formData.fields.isAnonymous?.[0] === 'true' ? 1 : 0,
          photo: formData.files.photo ? formData.files.photo[0] : null
        };

        // Validate the data
        const validatedData = insertIncidentSchema.parse(incidentData);
        const incident = await storage.createIncident(validatedData);
        
        // Emit real-time update to connected clients
        if (req.app.get('io')) {
          req.app.get('io').emit('newIncident', incident);
        }
        
        return res.status(201).json(incident);
      } catch (error: unknown) {
        console.error('Error creating incident:', error);
        if (error instanceof z.ZodError) {
          return res.status(400).json({ 
            message: 'Validation error', 
            errors: error.errors 
          });
        }
        return res.status(500).json({ message: 'Failed to create incident' });
      }
    }
    
    // Handle JSON requests (fallback)
    try {
      const data = req.body;
      const validatedData = insertIncidentSchema.parse({
        ...data,
        isAnonymous: data.isAnonymous ? 1 : 0,
      });
      
      const incident = await storage.createIncident(validatedData);
      
      // Emit real-time update to connected clients
      if (req.app.get('io')) {
        req.app.get('io').emit('newIncident', incident);
      }
      
      res.status(201).json(incident);
    } catch (error) {
      console.error('Error creating incident:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid incident data',
          errors: error.errors 
        });
      }
      res.status(500).json({ message: 'Failed to create incident' });
    }
  });

  // Update security area risk level or fields
  app.patch("/api/security-areas/:id", async (req, res) => {
    try {
      const updateSchema = z.object({
        riskLevel: z.enum(["safe", "low", "medium", "high", "critical"]).optional(),
        description: z.string().nullable().optional(),
        incidentCount: z.number().int().nonnegative().optional(),
      });
      const updates = updateSchema.parse(req.body);
      const updated = await storage.updateSecurityArea(req.params.id, updates);
      if (!updated) {
        return res.status(404).json({ message: "Security area not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid area update", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update security area" });
    }
  });

  // Update incident status
  app.patch("/api/incidents/:id/status", async (req, res) => {
    try {
      const statusSchema = z.object({ status: z.enum(["active", "resolved"]) });
      const { status } = statusSchema.parse(req.body);
      
      const incident = await storage.updateIncidentStatus(req.params.id, status);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      
      res.json(incident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update incident" });
    }
  });

  // Get security areas
  app.get("/api/security-areas", async (req, res) => {
    try {
      const areas = await storage.getSecurityAreas();
      res.json(areas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch security areas" });
    }
  });

  // Get security statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const allIncidents = await storage.getIncidents();
      const recentIncidents = await storage.getRecentIncidents(24);
      const weeklyIncidents = await storage.getRecentIncidents(168); // 7 days
      const securityAreas = await storage.getSecurityAreas();
      
      const activeIncidents = allIncidents.filter(i => i.status === "active").length;
      const safeZones = securityAreas.filter(a => a.riskLevel === "safe" || a.riskLevel === "low").length;
      
      const stats = {
        totalIncidents: allIncidents.length,
        activeIncidents,
        recentIncidents: recentIncidents.length,
        weeklyIncidents: weeklyIncidents.length,
        safeZones,
        highRiskAreas: securityAreas.filter(a => a.riskLevel === "high" || a.riskLevel === "critical").length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
