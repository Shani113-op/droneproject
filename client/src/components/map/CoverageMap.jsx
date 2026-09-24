import { MapContainer, TileLayer, Circle, CircleMarker, Popup } from "react-leaflet";
import MapUpdater from "./MapUpdater";

export default function CoverageMap({ location, locationName, radius, locationSelected }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm lg:col-span-2">
      <div className="border-b p-5">
        <h3 className="text-lg font-semibold">Drone Coverage Map</h3>
        <p className="text-sm text-slate-500">Theoretical circular coverage only</p>
      </div>
      <div className="h-[450px]">
        <MapContainer center={location} zoom={11} scrollWheelZoom={true} className="h-full w-full">
          <MapUpdater center={location} />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Circle
            center={location}
            radius={radius * 1000}
            pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.15 }}
          />
          <CircleMarker
            center={location}
            radius={8}
            pathOptions={{ color: "#ffffff", fillColor: "#2563eb", fillOpacity: 1 }}
          >
            <Popup>
              <div>
                <strong>{locationSelected ? "Selected Location" : "Demo Location"}</strong>
                <p>{locationName}</p>
                <p>Coverage Radius: {radius} km</p>
              </div>
            </Popup>
          </CircleMarker>
        </MapContainer>
      </div>
    </div>
  );
}
