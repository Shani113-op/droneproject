import { calculateCoverageArea } from "../../utils/calculations";

export default function CoverageSettings({ radius, setRadius }) {
  const coverageArea = calculateCoverageArea(radius);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-semibold">Coverage Settings</h3>
      <label htmlFor="radius" className="text-sm font-medium">
        Drone Radius: {radius} km
      </label>
      <input
        id="radius"
        type="range"
        min="1"
        max="10"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        className="mt-4 w-full cursor-pointer"
      />
      <div className="mt-8 rounded-lg bg-blue-50 p-5">
        <p className="text-sm text-slate-600">Theoretical Coverage Area</p>
        <h2 className="mt-2 text-3xl font-bold text-blue-700">{coverageArea.toFixed(2)} km²</h2>
      </div>
      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">Coverage Information</p>
        <p className="mt-2 text-sm text-slate-500">Radius: {radius} km</p>
        <p className="mt-1 text-sm text-slate-500">Area: {coverageArea.toFixed(2)} km²</p>
      </div>
      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        Demonstration only. The circular area is a geometric estimate, not verified operational coverage.
        Actual coverage depends on aircraft capabilities, airspace restrictions, weather, battery life and regulations.
      </p>
    </div>
  );
}
