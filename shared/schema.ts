import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  severity: text("severity").notNull().default("medium"),
  status: text("status").notNull().default("active"),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
  photo: text("photo"),
  isAnonymous: integer("is_anonymous").default(1),
});

export const securityAreas = pgTable("security_areas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  riskLevel: text("risk_level").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  radius: real("radius").notNull().default(1000),
  incidentCount: integer("incident_count").default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  reportedAt: true,
});

export const insertSecurityAreaSchema = createInsertSchema(securityAreas).omit({
  id: true,
  lastUpdated: true,
});

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type SecurityArea = typeof securityAreas.$inferSelect;
export type InsertSecurityArea = z.infer<typeof insertSecurityAreaSchema>;

// Incident type enum
export const incidentTypes = [
  "terrorism",
  "banditry", 
  "cattle_rustling",
  "kalare_gangs",
  "kidnapping",
  "armed_robbery",
  "suspicious_activity",
  "other"
] as const;

export const severityLevels = ["low", "medium", "high", "critical"] as const;
export const riskLevels = ["safe", "low", "medium", "high", "critical"] as const;
