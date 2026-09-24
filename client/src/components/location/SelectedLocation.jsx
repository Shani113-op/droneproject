import { MapPin } from "lucide-react";

export default function SelectedLocation({ location, locationName, locationSelected }) {
  return (
    <div className="mt-5 rounded-lg bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <MapPin size={20} className="mt-1 shrink-0 text-blue-600" />
        <div>
          <p className="text-xs text-slate-500">Selected Location</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{locationName}</p>
          <p className="mt-2 text-xs text-slate-500">
            Latitude: {location[0].toFixed(6)} {" | "} Longitude: {location[1].toFixed(6)}
          </p>
          {!locationSelected && (
            <p className="mt-2 text-xs text-amber-600">
              Demonstration location. Search for your department to begin.
            </p>
          )}
          {locationSelected && (
            <p className="mt-2 text-xs text-green-600">
              Location found. Verify that this is your intended drone launch site.
            </p>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">Geocoding: © OpenStreetMap contributors (Nominatim).</p>
    </div>
  );
}
