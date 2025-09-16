import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Minus, Navigation, MapPin, AlertTriangle, Shield } from "lucide-react";
import type { Incident, SecurityArea } from "@shared/schema";

// Import Mapbox GL JS
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface SecurityMapProps {
  incidents: Incident[];
  securityAreas: SecurityArea[];
  isLoading: boolean;
}

export default function SecurityMap({ incidents, securityAreas, isLoading }: SecurityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Mapbox GL JS map
  useEffect(() => {
    if (!mapRef.current) return;

    // Set Mapbox access token (you'll need to add this to your environment)
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [11.1694, 10.2937], // Gombe State coordinates
      zoom: 10,
      maxZoom: 18,
      minZoom: 8
    });

    mapInstanceRef.current = map;

    map.on('load', () => {
      setMapLoaded(true);
      initializeMapLayers(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map data when incidents or security areas change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    updateMapData(mapInstanceRef.current, incidents, securityAreas);
  }, [incidents, securityAreas, mapLoaded]);

  const initializeMapLayers = (map: mapboxgl.Map) => {
    // Add heat map layer for incidents
    if (!map.getSource('incidents-heat')) {
      map.addSource('incidents-heat', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'incidents-heat',
        type: 'heatmap',
        source: 'incidents-heat',
        maxzoom: 15,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'severityWeight'],
            0, 0,
            1, 1,
            2, 2,
            3, 3
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 255, 0, 0)',
            0.1, 'rgba(255, 255, 0, 0.5)',
            0.3, 'rgba(255, 165, 0, 0.7)',
            0.5, 'rgba(255, 0, 0, 0.8)',
            0.7, 'rgba(255, 0, 0, 0.9)',
            1, 'rgba(139, 0, 0, 1)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            15, 20
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,
            15, 0
          ]
        }
      });
    }

    // Add incident markers
    if (!map.getSource('incidents-points')) {
      map.addSource('incidents-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'incidents-points',
        type: 'circle',
        source: 'incidents-points',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 4,
            15, 8
          ],
          'circle-color': [
            'match',
            ['get', 'severity'],
            'critical', '#8B0000',
            'high', '#DC2626',
            'medium', '#F59E0B',
            'low', '#10B981',
            '#6B7280'
          ],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2,
          'circle-opacity': 0.8
        }
      });
    }

    // Add security areas
    if (!map.getSource('security-areas')) {
      map.addSource('security-areas', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'security-areas-fill',
        type: 'fill',
        source: 'security-areas',
        paint: {
          'fill-color': [
            'match',
            ['get', 'riskLevel'],
            'critical', 'rgba(139, 0, 0, 0.3)',
            'high', 'rgba(220, 38, 38, 0.3)',
            'medium', 'rgba(245, 158, 11, 0.3)',
            'low', 'rgba(16, 185, 129, 0.3)',
            'safe', 'rgba(34, 197, 94, 0.3)',
            'rgba(107, 114, 128, 0.3)'
          ],
          'fill-outline-color': [
            'match',
            ['get', 'riskLevel'],
            'critical', '#8B0000',
            'high', '#DC2626',
            'medium', '#F59E0B',
            'low', '#10B981',
            'safe', '#22C55E',
            '#6B7280'
          ]
        }
      });

      map.addLayer({
        id: 'security-areas-stroke',
        type: 'line',
        source: 'security-areas',
        paint: {
          'line-color': [
            'match',
            ['get', 'riskLevel'],
            'critical', '#8B0000',
            'high', '#DC2626',
            'medium', '#F59E0B',
            'low', '#10B981',
            'safe', '#22C55E',
            '#6B7280'
          ],
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });
    }

    // Add click handlers for incidents
    map.on('click', 'incidents-points', (e) => {
      const feature = e.features?.[0];
      if (!feature) return;

      // Ensure geometry is a Point and properties exist
      const geom = feature.geometry as any;
      if (!geom || geom.type !== 'Point' || !Array.isArray(geom.coordinates)) return;

      const coordinates = (geom.coordinates as number[]).slice() as [number, number];
      const incidentProps = feature.properties as any | null;
      if (!incidentProps) return;

      const typeText = typeof incidentProps.type === 'string' ? incidentProps.type.replace('_', ' ').toUpperCase() : 'Incident';
      const locationText = typeof incidentProps.location === 'string' ? incidentProps.location : '';
      const severityText = typeof incidentProps.severity === 'string' ? incidentProps.severity : 'unknown';
      const descriptionText = typeof incidentProps.description === 'string' ? incidentProps.description : '';
      const reportedAtText = incidentProps.reportedAt ? new Date(incidentProps.reportedAt).toLocaleString() : '';

      // Create popup
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <div class="p-3">
            <h3 class="font-semibold text-sm">${typeText}</h3>
            <p class="text-xs text-gray-600 mt-1">${locationText}</p>
            <p class="text-xs font-medium mt-1" style="color: ${
              severityText === 'high' || severityText === 'critical' 
                ? '#DC2626' 
                : severityText === 'medium' 
                  ? '#F59E0B' 
                  : '#10B981'
            }">
              ${severityText.toUpperCase()} RISK
            </p>
            ${descriptionText ? `<p class="text-xs text-gray-500 mt-2">${descriptionText}</p>` : ''}
            <p class="text-xs text-gray-400 mt-2">Reported: ${reportedAtText}</p>
          </div>
        `)
        .addTo(map);
    });

    // Change cursor on hover
    map.on('mouseenter', 'incidents-points', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'incidents-points', () => {
      map.getCanvas().style.cursor = '';
    });
  };

  const updateMapData = (map: mapboxgl.Map, incidents: Incident[], securityAreas: SecurityArea[]) => {
    // Update incidents heat map and points
    const incidentFeatures = incidents.map(incident => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [incident.longitude, incident.latitude]
      },
      properties: {
        severityWeight: incident.severity === 'critical' ? 3 : incident.severity === 'high' ? 2 : incident.severity === 'medium' ? 1 : 0,
        type: incident.type,
        location: incident.location,
        description: incident.description,
        reportedAt: incident.reportedAt,
        severity: incident.severity
      }
    }));

    const incidentsSource = map.getSource('incidents-heat') as mapboxgl.GeoJSONSource;
    const incidentsPointsSource = map.getSource('incidents-points') as mapboxgl.GeoJSONSource;
    
    if (incidentsSource && incidentsPointsSource) {
      incidentsSource.setData({
        type: 'FeatureCollection',
        features: incidentFeatures
      });
      incidentsPointsSource.setData({
        type: 'FeatureCollection',
        features: incidentFeatures
      });
    }

    // Update security areas
    const areaFeatures = securityAreas.map(area => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [area.longitude - area.radius/111000, area.latitude - area.radius/111000],
          [area.longitude + area.radius/111000, area.latitude - area.radius/111000],
          [area.longitude + area.radius/111000, area.latitude + area.radius/111000],
          [area.longitude - area.radius/111000, area.latitude + area.radius/111000],
          [area.longitude - area.radius/111000, area.latitude - area.radius/111000]
        ]]
      },
      properties: {
        name: area.name,
        riskLevel: area.riskLevel,
        description: area.description,
        incidentCount: area.incidentCount
      }
    }));

    const areasSource = map.getSource('security-areas') as mapboxgl.GeoJSONSource;
    if (areasSource) {
      areasSource.setData({
        type: 'FeatureCollection',
        features: areaFeatures
      });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleLocate = () => {
    if (mapInstanceRef.current && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        mapInstanceRef.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15
        });
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading security data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <div 
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />

          {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2 z-10">
            <Button 
              variant="outline" 
              size="icon"
              className="bg-card border border-border shadow-sm"
          onClick={handleZoomIn}
              data-testid="button-zoom-in"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-card border border-border shadow-sm"
          onClick={handleZoomOut}
              data-testid="button-zoom-out"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-card border border-border shadow-sm"
          onClick={handleLocate}
              data-testid="button-locate"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

      {/* Enhanced Legend */}
      <Card className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-4 shadow-lg z-10 max-w-xs">
        <h4 className="text-sm font-semibold mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          GombeSafe Threat Levels
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-800 rounded-full"></div>
            <span className="text-xs">Critical Risk</span>
          </div>
              <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-xs">High Risk</span>
              </div>
              <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Low Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs">Safe Zone</span>
              </div>
            </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <AlertTriangle className="w-3 h-3" />
            <span>Heat map shows incident density</span>
          </div>
        </div>
          </Card>

      {/* Area Information Panel */}
      <Card className="absolute top-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg z-10 max-w-sm">
        <h4 className="text-sm font-semibold mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          High-Risk Areas
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-orange-600 font-medium">Central Market:</span>
            <span>Crowded areas, petty theft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-600 font-medium">Billiri LGA:</span>
            <span>Kalare gang activity, cattle rustling</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-600 font-medium">Gombe Central:</span>
            <span>Increased patrols reported (verify with official sources)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
