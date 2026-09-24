import { Plane, Clock, MapPin } from "lucide-react";

export default function ResponseResultCards({ result }) {
  if (!result) return null;

  return (
    <div className="mt-8">
      <h4 className="mb-5 text-lg font-bold">Response Time Results</h4>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-5">
          <Plane className="text-blue-600" />
          <p className="mt-3 text-sm text-slate-600">Drone Response</p>
          <h3 className="text-3xl font-bold text-blue-700">{result.droneResponseMin} min</h3>
        </div>
        <div className="rounded-lg bg-slate-100 p-5">
          <Clock className="text-slate-700" />
          <p className="mt-3 text-sm text-slate-600">Patrol Response</p>
          <h3 className="text-3xl font-bold text-slate-800">{result.patrolResponseMin} min</h3>
        </div>
        <div className="rounded-lg bg-green-50 p-5">
          <MapPin className="text-green-700" />
          <p className="mt-3 text-sm text-slate-600">First Arrival</p>
          <h3 className="text-2xl font-bold text-green-700">{result.firstArrival}</h3>
        </div>
      </div>
      <div className="mt-5 rounded-lg border p-5">
        <p className="font-semibold">Time Difference</p>
        <p className="mt-2 text-2xl font-bold">
          {Math.abs(result.timeDifferenceMin).toFixed(2)} minutes
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {result.firstArrival === "Drone"
            ? "Drone arrives earlier than patrol."
            : result.firstArrival === "Patrol"
            ? "Patrol arrives earlier than drone."
            : "Both arrive at approximately the same time."}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Drone flight: {result.flightTimeMin} min + Launch: {result.launchDelayMin} min
        </p>
      </div>
    </div>
  );
}
