import { ExclamationTriangleIcon, ChartBarIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SecurityStats {
  totalIncidents: number;
  activeIncidents: number;
  recentIncidents: number;
  weeklyIncidents: number;
  safeZones: number;
  highRiskAreas: number;
}

interface Filters {
  incidentTypes: string[];
  area: string;
  timePeriod: string;
}

interface SidebarProps {
  stats?: SecurityStats;
  selectedFilters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function Sidebar({ stats, selectedFilters, onFiltersChange }: SidebarProps) {
  // Comprehensive Gombe areas list (LGAs and notable towns)
  const areaOptions = [
    // LGAs
    "Akko LGA",
    "Balanga LGA",
    "Billiri LGA",
    "Dukku LGA",
    "Funakaye LGA",
    "Gombe LGA",
    "Kaltungo LGA",
    "Kwami LGA",
    "Nafada LGA",
    "Shongom LGA",
    "Yamaltu/Deba LGA",
    // Shongom LGA towns
    "Boh",
    "Burak",
    "Filiya",
    "Bango",
    "Bangunji",
    "Bikutture",
    "Bikwala",
    "Bishiwai",
    "Dilange (Dutse)",
    "Kalo",
    "Kulan",
    "Laluwa",
    "Najeji",
    "Suli",
    "Yelchen-Yelchen",
    // Yamaltu/Deba LGA towns
    "Deba",
    "Dangar",
    "Dumbu",
    "Jannawo",
    "Kakkau",
    "Kanawa",
    "Kunnuwal",
    "Kuri",
    "Lambam",
    "Lano",
    "Nasarawo",
    "Nono M. Isa",
    "Poli",
    "Saruje W.",
    "Wajari",
    "Jodoma",
    // Kwami LGA towns
    "Mallam Sidi",
    "Kwami",
    "Jore",
    "Jabla",
    "Banishuwa",
    "Bojude",
    "Bomala",
    "Bula",
    "Bunu",
    "Dawo",
    "Diango",
    "Gabuku",
    "Gadam",
    "Gamadadi",
    "H. Dinawa",
    "Habuja",
    // Nafada LGA towns
    "Nafada",
    "Langa",
    "Mada",
    "Maru",
    "Papa",
    "Shole",
    "Shonganawo",
    "Suka",
    "Tondi",
    "Wokollu",
    "Zindir",
    "Zangoma Kyari",
    "Kiyayo",
    "Kuka",
    "Lafiyawo",
    // Gombe LGA notable areas
    "Gombe (rural)",
    "Arawa",
    "Doma",
    "Gabukku",
    "Inna",
    "Manawashi",
    "Pantami",
    "Ajiya",
    "Bajoga",
    // Kaltungo LGA towns
    "Kaltungo",
    "Awak",
    "Bagaruwa",
    "Bwara",
    "Daura",
    "Dodonruwa",
    "Dundaye",
    "Garin Bako",
    "Garin Barau",
    "B/kaltin",
    "Okshenda",
    // Akko LGA towns
    "Gona",
    "Kumo",
    "Pindiga",
    "Garin",
    "Garba Jalingo",
    "Jauro Tukur",
    "Kembu",
    "Panda",
    "Lergo",
    "Mararraban-Tumu",
    // Balanga LGA towns
    "Talasse",
    "Bambam",
    "Bangu",
    "Cham-Mwona",
    "Chum-Kindiyo",
    "Daduya Hill",
    "Dala-Waja",
    "Degri Dong",
    "Gasi",
    "Gelengu",
    "Kulani",
    "Nyuwar",
    "Refele",
    // Billiri LGA towns
    "Billiri-Tangale",
    "Ayabu",
    "Banganje",
    "Bare",
    "Billiri",
    "Kalmai",
    "Kulkul",
    "Laberpit",
    "Lakalkal",
    "Lamugu",
    "Landongor",
    "Lanshi Daji",
    "Pade Kungu",
    // Dukku LGA towns
    "Dukku",
    "Jamani Kaigamari",
    "Gombe Abba",
    "Hashidu",
    "Bawa",
    "Balikaje",
    "Bomala",
    "Daminya",
    "Dawiya",
    "Du",
    "Jangira",
    "Kokkobe",
    "Kuni Walowa",
    "Wuro Bali",
    "Wuro Tara",
    "Yaufa",
    "Zego/Kunde",
    // Funakaye LGA towns
    "Funakaye",
    "Ashaka",
    "Badadi",
    "Bage",
    "Bulturi",
    "Gulwari",
    "Lambo Dashi",
    "W. Nai",
    "Yayaru",
    "Zadawa",
    "Abuku",
    "Baba Zur",
    "Bajoga"
  ];
  const handleIncidentTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...selectedFilters.incidentTypes, type]
      : selectedFilters.incidentTypes.filter(t => t !== type);
    
    onFiltersChange({
      ...selectedFilters,
      incidentTypes: newTypes
    });
  };

  const incidentTypeConfig = [
    { id: "road_accident", label: "Road Accident", severity: "HIGH", color: "destructive" },
    { id: "theft", label: "Theft", severity: "MED", color: "warning" },
    { id: "cattle_rustling", label: "Cattle Rustling", severity: "MED", color: "warning" },
    { id: "farmer_herder_conflict", label: "Farmer-Herder Conflict", severity: "HIGH", color: "destructive" },
    { id: "domestic_violence", label: "Domestic Violence", severity: "HIGH", color: "destructive" },
    { id: "armed_robbery", label: "Armed Robbery", severity: "HIGH", color: "destructive" },
    { id: "market_dispute", label: "Market Dispute", severity: "LOW", color: "info" },
    { id: "flooding", label: "Flooding", severity: "MED", color: "warning" },
    { id: "fire_outbreak", label: "Fire Outbreak", severity: "HIGH", color: "destructive" },
    { id: "suspicious_activity", label: "Suspicious Activity", severity: "LOW", color: "info" },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-80 bg-card border-r border-border">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Stats Overview */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold mb-4">Security Overview</h2>
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Incidents</p>
                  <p className="text-2xl font-bold text-destructive" data-testid="text-active-incidents">
                    {stats?.activeIncidents || 0}
                  </p>
                </div>
                <ExclamationTriangleIcon className="w-6 h-6 text-destructive" />
              </div>
            </Card>
            
            <Card className="bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-warning" data-testid="text-weekly-incidents">
                    {stats?.weeklyIncidents || 0}
                  </p>
                </div>
                <ChartBarIcon className="w-6 h-6 text-warning" />
              </div>
            </Card>
            
            <Card className="bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Safe Zones</p>
                  <p className="text-2xl font-bold text-success" data-testid="text-safe-zones">
                    {stats?.safeZones || 0}
                  </p>
                </div>
                <ShieldCheckIcon className="w-6 h-6 text-success" />
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border">
          <h3 className="text-md font-semibold mb-4">Filter Incidents</h3>
          
          {/* Incident Type Filter */}
          <div className="mb-4">
            <Label className="block text-sm font-medium text-foreground mb-2">Incident Type</Label>
            <div className="space-y-2">
              {incidentTypeConfig.map((config) => (
                <div key={config.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={config.id}
                    checked={selectedFilters.incidentTypes.includes(config.id)}
                    onCheckedChange={(checked) => handleIncidentTypeChange(config.id, checked as boolean)}
                  />
                  <Label htmlFor={config.id} className="flex-1 text-sm">
                    {config.label}
                  </Label>
                  <span className={`text-xs px-2 py-1 rounded ${
                    config.color === 'destructive' ? 'bg-destructive text-destructive-foreground' : 
                    config.color === 'warning' ? 'bg-warning text-warning-foreground' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {config.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Area Filter */}
          <div className="mb-4">
            <Label className="block text-sm font-medium text-foreground mb-2">Area</Label>
            <Select 
              value={selectedFilters.area} 
              onValueChange={(value) => onFiltersChange({...selectedFilters, area: value === "all" ? "" : value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areaOptions.map((name) => (
                  <SelectItem key={name} value={name.toLowerCase()}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Time Period Filter */}
          <div className="mb-4">
            <Label className="block text-sm font-medium text-foreground mb-2">Time Period</Label>
            <Select 
              value={selectedFilters.timePeriod} 
              onValueChange={(value) => onFiltersChange({...selectedFilters, timePeriod: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">Last 24 Hours</SelectItem>
                <SelectItem value="168">Last Week</SelectItem>
                <SelectItem value="720">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* High-Risk Areas Alert */}
        <div className="p-6">
          <Card className="bg-destructive/10 border-destructive/20 p-4">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-destructive mt-1" />
              <div>
                <h4 className="font-semibold text-destructive">High-Risk Areas</h4>
                <p className="text-sm text-muted-foreground mt-1">Based on recent security data</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Billiri LGA - Farmer-herder conflicts</li>
                  <li>• Kaltungo LGA - Cattle rustling incidents</li>
                  <li>• Rural roads - Traffic accidents frequent</li>
                  <li>• Market areas - Theft reports</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </aside>
  );
}
