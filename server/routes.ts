import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIncidentSchema } from "@shared/schema";
import { z } from "zod";

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
      const incident = await storage.getIncident(req.params.id);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incident" });
    }
  });

  // Create new incident
  app.post("/api/incidents", async (req, res) => {
    try {
      const validatedData = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(validatedData);
      res.status(201).json(incident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid incident data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create incident" });
    }
  });

  // Update incident status
  app.patch("/api/incidents/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const incident = await storage.updateIncidentStatus(req.params.id, status);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      
      res.json(incident);
    } catch (error) {
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
