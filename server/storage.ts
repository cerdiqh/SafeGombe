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
    // Gombe LGA (Main City) Areas
    const realSecurityAreas: InsertSecurityArea[] = [
      {
        name: "Bolari",
        description: "Central business district with markets and government buildings. Moderate security presence.",
        riskLevel: "medium",
        latitude: 10.2937,
        longitude: 11.1694,
        radius: 1500,
        incidentCount: 8,
      },
      {
        name: "Jekadafari",
        description: "Residential and commercial area with markets and schools. Standard urban security considerations.",
        riskLevel: "medium",
        latitude: 10.2900,
        longitude: 11.1800,
        radius: 1200,
        incidentCount: 5,
      },
      {
        name: "Pantami",
        description: "Home to Federal University and student accommodations. Increased police patrols at night.",
        riskLevel: "low",
        latitude: 10.2700,
        longitude: 11.1700,
        radius: 1800,
        incidentCount: 3,
      },
      {
        name: "Herwagana",
        description: "Residential neighborhood with local markets. Generally peaceful with community watch.",
        riskLevel: "low",
        latitude: 10.3000,
        longitude: 11.1900,
        radius: 1000,
        incidentCount: 2,
      },
      {
        name: "Nasarawo",
        description: "Residential area with mixed housing. Standard security presence.",
        riskLevel: "low",
        latitude: 10.2800,
        longitude: 11.1750,
        radius: 1000,
        incidentCount: 1,
      },
      {
        name: "Tudun Wada",
        description: "Densely populated residential area. Exercise caution at night.",
        riskLevel: "medium",
        latitude: 10.2850,
        longitude: 11.1850,
        radius: 1500,
        incidentCount: 6,
      },
      {
        name: "Arawa",
        description: "Residential area with local markets. Generally peaceful.",
        riskLevel: "low",
        latitude: 10.2950,
        longitude: 11.1650,
        radius: 1200,
        incidentCount: 2,
      },
      {
        name: "GRA",
        description: "Government Reserved Area with official residences and offices. High security presence.",
        riskLevel: "low",
        latitude: 10.3000,
        longitude: 11.2000,
        radius: 2000,
        incidentCount: 1,
      },
      {
        name: "Tudun Hatsi",
        description: "Residential area with local markets. Community policing in effect.",
        riskLevel: "low",
        latitude: 10.2750,
        longitude: 11.1800,
        radius: 1000,
        incidentCount: 2,
      },
      {
        name: "Sabon Layi",
        description: "Mixed residential and commercial area. Standard security considerations.",
        riskLevel: "medium",
        latitude: 10.2800,
        longitude: 11.1900,
        radius: 1200,
        incidentCount: 4,
      }
    ];

    // No additional areas - focusing only on Gombe LGA main city areas
    const additionalAreas: InsertSecurityArea[] = [];

    realSecurityAreas.push(...additionalAreas);

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

    // Recent security incidents in Gombe State (2024)
    const realIncidents: InsertIncident[] = [
      {
        type: "theft",
        location: "Pantami Market",
        description: "Petty theft reported at market. Police investigation ongoing. No injuries reported.",
        latitude: 10.2700,
        longitude: 11.1700,
        severity: "low",
        status: "resolved",
        isAnonymous: 1,
      },
      {
        type: "traffic_incident", 
        location: "Gombe-Bauchi Road",
        description: "Minor traffic accident near Dukku junction. No casualties. Traffic flow restored.",
        latitude: 10.8167,
        longitude: 10.7667,
        severity: "low",
        status: "resolved",
        isAnonymous: 1,
      },
      {
        type: "public_disturbance",
        location: "Jekadafari Roundabout",
        description: "Peaceful protest by market traders. Situation under control with police presence.",
        latitude: 10.2900,
        longitude: 11.1800,
        severity: "low", 
        status: "resolved",
        isAnonymous: 1,
      },
      {
        type: "suspicious_activity",
        location: "Federal Low-Cost Estate",
        description: "Report of suspicious individuals. Security personnel conducted search, no threat found.",
        latitude: 10.3000,
        longitude: 11.2000,
        severity: "low",
        status: "resolved",
        isAnonymous: 1,
      },
      {
        type: "community_alert",
        location: "Kwami LGA",
        description: "Community security meeting held to discuss neighborhood watch initiatives.",
        latitude: 10.4500,
        longitude: 11.2000,
        severity: "info",
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
