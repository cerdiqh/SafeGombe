// Real security data for Gombe State based on government reports and statistics
export const gombeSecurityAreas = [
  {
    name: "Bolari District",
    description: "High-risk area with documented Kalare gang activity and terrorism incidents. Military barracks targeted in 2015 suicide bombing.",
    coordinates: [11.1694, 10.2937],
    riskLevel: "high",
    incidents: [
      "2015: Suicide bombing at military barracks",
      "2024: Three killed in Kalare gang clashes",
      "Ongoing: Gang violence and terrorism threats"
    ],
    radius: 2000
  },
  {
    name: "Billiri LGA",
    description: "Significant cattle rustling and banditry. Recent arrests: 18 suspects, 483 cattle recovered.",
    coordinates: [11.2200, 9.8700],
    riskLevel: "high",
    incidents: [
      "Recent: 18 suspected cattle rustlers arrested",
      "Recent: 483 cows recovered by police",
      "Ongoing: Banditry and cattle rustling activities"
    ],
    radius: 5000
  },
  {
    name: "Gombe Central",
    description: "Operation Hattara active zone with enhanced security patrols and 28 deployed vehicles.",
    coordinates: [11.1769, 10.2897],
    riskLevel: "medium",
    incidents: [
      "Operation Hattara deployment active",
      "28 security vehicles patrolling",
      "Enhanced police presence"
    ],
    radius: 3000
  }
];

export const operationHattara = {
  name: "Operation Hattara",
  description: "Special security taskforce meaning 'be careful' in English, aimed at reinvigorating internal security in Gombe state through crime prevention.",
  vehicles: 28,
  status: "active",
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
