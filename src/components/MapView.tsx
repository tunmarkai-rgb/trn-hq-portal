import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
const goldIcon = new L.DivIcon({
  html: `<div style="width:12px;height:12px;border-radius:50%;background:hsl(43,100%,50%);border:2px solid hsl(43,100%,38%);box-shadow:0 0 8px hsl(43,100%,50%,0.5);"></div>`,
  className: "",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

interface Member {
  full_name: string | null;
  city: string | null;
  country: string | null;
  agency: string | null;
  latitude: number | null;
  longitude: number | null;
  niche: string[] | null;
}

const MapView = ({ members }: { members: Member[] }) => {
  return (
    <MapContainer
      center={[25, 30]}
      zoom={2}
      style={{ height: "100%", width: "100%", background: "hsl(220,25%,7%)" }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />
      {members.map((m, i) =>
        m.latitude && m.longitude ? (
          <Marker key={i} position={[m.latitude, m.longitude]} icon={goldIcon}>
            <Popup className="dark-popup">
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#e5e5e5", background: "hsl(220,25%,10%)", padding: "8px 12px", borderRadius: "8px", minWidth: "140px" }}>
                <strong style={{ color: "#fff", fontSize: "13px" }}>{m.full_name || "Member"}</strong>
                <br />
                <span style={{ color: "hsl(220,10%,50%)" }}>{[m.city, m.country].filter(Boolean).join(", ")}</span>
                {m.agency && <><br /><span style={{ color: "hsl(43,100%,50%)", fontSize: "11px" }}>{m.agency}</span></>}
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default MapView;
