import { type Incident, type InsertIncident, type SecurityArea, type InsertSecurityArea } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Incidents
  getIncidents(): Promise<Incident[]>;
  getIncident(id: string): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncidentStatus(id: string, status: string): Promise<Incident | undefined>;
  getIncidentsByArea(area: string): Promise<Incident[]>;
  getIncidentsByType(type: string): Promise<Incident[]>;
  getRecentIncidents(hours: number): Promise<Incident[]>;

  // Security Areas
  getSecurityAreas(): Promise<SecurityArea[]>;
  getSecurityArea(id: string): Promise<SecurityArea | undefined>;
  createSecurityArea(area: InsertSecurityArea): Promise<SecurityArea>;
  updateSecurityArea(id: string, updates: Partial<SecurityArea>): Promise<SecurityArea | undefined>;
}

export class MemStorage implements IStorage {
  private incidents: Map<string, Incident>;
  private securityAreas: Map<string, SecurityArea>;

  constructor() {
    this.incidents = new Map();
    this.securityAreas = new Map();
    this.initializeRealSecurityData();
  }

  private initializeRealSecurityData() {
    // Real security areas based on actual Gombe State data
    const realSecurityAreas: InsertSecurityArea[] = [
      {
        name: "Bolari District",
        description: "High-risk area with documented Kalare gang activity and terrorism incidents. Military barracks targeted in 2015 suicide bombing.",
        riskLevel: "high",
        latitude: 10.2937,
        longitude: 11.1694,
        radius: 2000,
        incidentCount: 23,
      },
      {
        name: "Billiri LGA",
        description: "Significant cattle rustling and banditry. Recent arrests: 18 suspects, 483 cattle recovered.",
        riskLevel: "high", 
        latitude: 9.8700,
        longitude: 11.2200,
        radius: 5000,
        incidentCount: 15,
      },
      {
        name: "Gombe Central",
        description: "Operation Hattara active zone with enhanced security patrols and 28 deployed vehicles.",
        riskLevel: "medium",
        latitude: 10.2897,
        longitude: 11.1769,
        radius: 3000,
        incidentCount: 8,
      },
      {
        name: "Kekadafari Area",
        description: "Rural area with moderate security concerns, periodic banditry reports.",
        riskLevel: "medium",
        latitude: 10.3200,
        longitude: 11.1500,
        radius: 1500,
        incidentCount: 5,
      }
    ];

    // Initialize real security areas
    realSecurityAreas.forEach(area => {
      const id = randomUUID();
      const securityArea: SecurityArea = {
        ...area,
        id,
        radius: area.radius || 1000,
        description: area.description || null,
        incidentCount: area.incidentCount || 0,
        lastUpdated: new Date(),
      };
      this.securityAreas.set(id, securityArea);
    });

    // Initialize real recent incidents based on security reports
    const realIncidents: InsertIncident[] = [
      {
        type: "kalare_gangs",
        location: "Bolari District",
        description: "Kalare gang violence reported. Three persons killed during clashes involving hoodlums.",
        latitude: 10.2937,
        longitude: 11.1694,
        severity: "high",
        status: "active",
        isAnonymous: 1,
      },
      {
        type: "cattle_rustling", 
        location: "Billiri LGA",
        description: "Cattle rustling incident. 18 suspected rustlers arrested, 483 cows recovered by police.",
        latitude: 9.8700,
        longitude: 11.2200,
        severity: "medium",
        status: "resolved",
        isAnonymous: 1,
      },
      {
        type: "banditry",
        location: "Rural Gombe",
        description: "Bandit attacks on villages reported. Multiple communities affected in December 2024.",
        latitude: 10.3100,
        longitude: 11.1400,
        severity: "high", 
        status: "active",
        isAnonymous: 1,
      }
    ];

    realIncidents.forEach(incident => {
      const id = randomUUID();
      const incidentRecord: Incident = {
        ...incident,
        id,
        status: incident.status || "active",
        severity: incident.severity || "medium",
        description: incident.description || null,
        photo: incident.photo || null,
        isAnonymous: incident.isAnonymous || 1,
        reportedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time within last week
      };
      this.incidents.set(id, incidentRecord);
    });
  }

  async getIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values()).sort((a, b) => 
      new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    );
  }

  async getIncident(id: string): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = randomUUID();
    const incident: Incident = {
      ...insertIncident,
      id,
      status: insertIncident.status || "active",
      severity: insertIncident.severity || "medium",
      description: insertIncident.description || null,
      photo: insertIncident.photo || null,
      isAnonymous: insertIncident.isAnonymous || 1,
      reportedAt: new Date(),
    };
    this.incidents.set(id, incident);
    return incident;
  }

  async updateIncidentStatus(id: string, status: string): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    if (incident) {
      const updated = { ...incident, status };
      this.incidents.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getIncidentsByArea(area: string): Promise<Incident[]> {
    return Array.from(this.incidents.values())
      .filter(incident => incident.location.toLowerCase().includes(area.toLowerCase()))
      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  }

  async getIncidentsByType(type: string): Promise<Incident[]> {
    return Array.from(this.incidents.values())
      .filter(incident => incident.type === type)
      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  }

  async getRecentIncidents(hours: number): Promise<Incident[]> {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.incidents.values())
      .filter(incident => new Date(incident.reportedAt) > cutoff)
      .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  }

  async getSecurityAreas(): Promise<SecurityArea[]> {
    return Array.from(this.securityAreas.values());
  }

  async getSecurityArea(id: string): Promise<SecurityArea | undefined> {
    return this.securityAreas.get(id);
  }

  async createSecurityArea(insertArea: InsertSecurityArea): Promise<SecurityArea> {
    const id = randomUUID();
    const area: SecurityArea = {
      ...insertArea,
      id,
      radius: insertArea.radius || 1000,
      description: insertArea.description || null,
      incidentCount: insertArea.incidentCount || 0,
      lastUpdated: new Date(),
    };
    this.securityAreas.set(id, area);
    return area;
  }

  async updateSecurityArea(id: string, updates: Partial<SecurityArea>): Promise<SecurityArea | undefined> {
    const area = this.securityAreas.get(id);
    if (area) {
      const updated = { ...area, ...updates, lastUpdated: new Date() };
      this.securityAreas.set(id, updated);
      return updated;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
