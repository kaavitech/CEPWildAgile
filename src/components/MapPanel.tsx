import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import L, { type LatLngExpression, type Icon } from "leaflet";
import { useMemo } from "react";
import type { EcoCentre, RoutePoint } from "@/lib/mockData";
import "leaflet/dist/leaflet.css";

const markerIcon: Icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const hospitalIcon: Icon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dc2626'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/%3E%3C/svg%3E",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

const petrolIcon: Icon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23eab308'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/%3E%3C/svg%3E",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

type MapPanelProps = {
  ecoCentre: EcoCentre;
  route?: {
    startPoint: { lat: number; lng: number; name: string };
    endPoint: { lat: number; lng: number; name: string };
    waypoints: RoutePoint[];
  };
};

const MapPanel = ({ ecoCentre, route }: MapPanelProps) => {
  const positions = useMemo(() => {
    const ecoPoint = {
      position: [ecoCentre.location.lat, ecoCentre.location.lng] as LatLngExpression,
      label: ecoCentre.name,
      description: ecoCentre.location.address,
    };
    const hospital = {
      position: [
        ecoCentre.nearestHospital.coords.lat,
        ecoCentre.nearestHospital.coords.lng,
      ] as LatLngExpression,
      label: ecoCentre.nearestHospital.name,
      description: `${ecoCentre.nearestHospital.phone} · ${ecoCentre.nearestHospital.distance_km} km`,
    };
    return { ecoPoint, hospital };
  }, [ecoCentre]);

  const routePoints = useMemo(() => {
    if (!route) return null;
    return [
      [route.startPoint.lat, route.startPoint.lng] as LatLngExpression,
      ...route.waypoints.map(wp => [wp.lat, wp.lng] as LatLngExpression),
      [route.endPoint.lat, route.endPoint.lng] as LatLngExpression,
    ];
  }, [route]);

  const center = route 
    ? [route.startPoint.lat, route.startPoint.lng] as LatLngExpression
    : positions.ecoPoint.position;

  return (
    <MapContainer
      center={center}
      zoom={route ? 10 : 11}
      scrollWheelZoom={false}
      className="h-64 w-full rounded-lg border border-border"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Route line */}
      {routePoints && (
        <Polyline
          positions={routePoints}
          color="#3b82f6"
          weight={3}
          opacity={0.7}
        />
      )}

      {/* Start point */}
      {route && (
        <Marker position={[route.startPoint.lat, route.startPoint.lng]} icon={markerIcon}>
          <Popup>
            <p className="font-semibold">Start: {route.startPoint.name}</p>
          </Popup>
        </Marker>
      )}

      {/* Waypoints */}
      {route?.waypoints.map((point, idx) => (
        <Marker
          key={idx}
          position={[point.lat, point.lng]}
          icon={point.type === 'hospital' ? hospitalIcon : petrolIcon}
        >
          <Popup>
            <p className="font-semibold">{point.name}</p>
            <p className="text-xs">{point.type === 'hospital' ? 'Hospital' : 'Petrol Station'}</p>
          </Popup>
        </Marker>
      ))}

      {/* End point / Eco Centre */}
      <Marker position={route ? [route.endPoint.lat, route.endPoint.lng] : positions.ecoPoint.position} icon={markerIcon}>
        <Popup>
          <p className="font-semibold">{route ? `End: ${route.endPoint.name}` : positions.ecoPoint.label}</p>
          <p className="text-xs">{route ? route.endPoint.name : positions.ecoPoint.description}</p>
        </Popup>
      </Marker>

      {/* Nearest Hospital (if no route) */}
      {!route && (
        <Marker position={positions.hospital.position} icon={hospitalIcon}>
          <Popup>
            <p className="font-semibold">{positions.hospital.label}</p>
            <p className="text-xs">{positions.hospital.description}</p>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapPanel;

