import { useStations } from "@/hooks/use-stations";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function StationsMap() {
  const { data: stations, isLoading } = useStations();

  // Centrage par défaut (Médiouna)
  const center = [33.5, -7.5];

  if (isLoading) return <div>Chargement de la carte...</div>;
  if (!stations || stations.length === 0)
    return <div>Aucune station à afficher sur la carte.</div>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {stations.map((station: any) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              Statut : {station.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
