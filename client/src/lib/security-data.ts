// Real security data for Gombe State based on government reports and statistics
export const gombeSecurityAreas = [
  {
    name: "Gombe Central Market Area",
    description: "High pedestrian traffic area with occasional pickpocketing and petty theft incidents. Exercise caution with valuables.",
    coordinates: [11.1671, 10.2890],
    riskLevel: "medium",
    incidents: [
      "Petty theft and pickpocketing in crowded areas",
      "Traffic congestion during market days",
    ],
    radius: 2000
  },
  {
    name: "Billiri LGA",
    description: "Rural area with occasional livestock disputes and road safety concerns. Increased security patrols reported.",
    coordinates: [11.2200, 9.8700],
    riskLevel: "medium",
    incidents: [
      "Livestock disputes and road safety incidents reported",
    ],
    radius: 5000
  },
  {
    name: "Gombe Central",
    description: "Urban center with increased patrols and temporary security deployments reported in public sources.",
    coordinates: [11.1769, 10.2897],
    riskLevel: "medium",
    incidents: [
      "Increased security patrols reported in recent months",
    ],
    radius: 3000
  }
];

// Note: Operation Hattara references are kept in data for provenance but the UI no longer highlights it as an emergency banner by default.
export const operationHattara = {
  name: "Operation Hattara",
  description: "A named security initiative reported in local sources; use official government channels for operational details.",
  vehicles: 28,
  status: "reported",
  governor: "Inuwa Yahaya"
};

export const crimeStatistics = {
  nationalIncidents: 51890000, // 51.89 million incidents nationally (May 2023 - April 2024)
  averageRansom: 2670000, // N2.67 million average ransom payment
  totalRansomPaid: 2230000000000, // N2.23 trillion total ransom paid
  homicideRate: 22, // per 100,000 people (10th highest globally)
  affectedHouseholds: 4140000 // 4.14 million households affected by kidnapping
};

export const emergencyContacts = {
  police: "199",
  operationHattara: "123",
  fire: "199",
  medical: "199"
};
