import { useState, useEffect } from "react";
import ResponseResultCards from "./ResponseResultCards";
import { useResponseTime } from "../../hooks/useResponseTime";

export default function ResponseTimeAnalysis({
  radius,
  defaultDroneSpeedKmh,
  defaultLaunchDelayMin,
  defaultPatrolResponseMin,
  setAppResponseResult
}) {
  const [distanceKm, setDistanceKm] = useState(radius);
  const [droneSpeedKmh, setDroneSpeedKmh] = useState(defaultDroneSpeedKmh);
  const [launchDelayMin, setLaunchDelayMin] = useState(defaultLaunchDelayMin);
  const [patrolResponseMin, setPatrolResponseMin] = useState(defaultPatrolResponseMin);

  const { calculating, responseResult, setResponseResult, responseError, calculate } = useResponseTime();

  const handleCalculate = async () => {
    await calculate({ distanceKm, droneSpeedKmh, launchDelayMin, patrolResponseMin });
  };

  // Sync result up to app level for metrics grid using useEffect to prevent render loop
  useEffect(() => {
    if (responseResult !== null) {
      setAppResponseResult(responseResult);
    }
  }, [responseResult, setAppResponseResult]);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Drone vs Patrol Response Time</h3>
        <p className="mt-2 text-sm text-slate-500">
          Compare estimated drone arrival with a patrol response-time benchmark.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Emergency Distance (km)</label>
          <input
            type="number"
            min="0"
            max={radius}
            step="0.1"
            value={distanceKm}
            onChange={(e) => {
              setDistanceKm(Number(e.target.value));
              setResponseResult(null);
            }}
            className="mt-2 w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-slate-500">Straight-line distance from launch site. Coverage radius: {radius} km.</p>
        </div>
        <div>
          <label className="text-sm font-medium">Drone Speed (km/h)</label>
          <input
            type="number"
            min="1"
            max="200"
            step="1"
            value={droneSpeedKmh}
            onChange={(e) => {
              setDroneSpeedKmh(Number(e.target.value));
              setResponseResult(null);
            }}
            className="mt-2 w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-slate-500">Illustrative assumption. Replace with a sourced aircraft cruise speed.</p>
        </div>
        <div>
          <label className="text-sm font-medium">Launch Delay (minutes)</label>
          <input
            type="number"
            min="0"
            max="60"
            step="0.1"
            value={launchDelayMin}
            onChange={(e) => {
              setLaunchDelayMin(Number(e.target.value));
              setResponseResult(null);
            }}
            className="mt-2 w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-slate-500">Estimated time from receiving a call until takeoff.</p>
        </div>
        <div>
          <label className="text-sm font-medium">Patrol Response (minutes)</label>
          <input
            type="number"
            min="0.1"
            max="180"
            step="0.1"
            value={patrolResponseMin}
            onChange={(e) => {
              setPatrolResponseMin(Number(e.target.value));
              setResponseResult(null);
            }}
            className="mt-2 w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-slate-500">Default: Chula Vista PD, 2022, Priority 1 comparison.</p>
        </div>
      </div>
      <button
        onClick={handleCalculate}
        disabled={
          calculating ||
          distanceKm < 0 || distanceKm > radius ||
          !Number.isFinite(distanceKm) || !Number.isFinite(droneSpeedKmh) ||
          !Number.isFinite(launchDelayMin) || !Number.isFinite(patrolResponseMin)
        }
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {calculating ? "Calculating..." : "Calculate Response Time"}
      </button>
      {responseError && <p role="alert" className="mt-4 text-sm text-red-600">{responseError}</p>}
      <ResponseResultCards result={responseResult} />
      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <p className="text-sm font-semibold">Methodology and limitations</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Drone response = launch delay + (straight-line distance / drone speed) × 60.
          Speed and launch delay are illustrative assumptions. Patrol response defaults to a
          published 2022 Chula Vista Priority 1 benchmark, not a local department forecast.
          Airspace and weather delays are excluded.
        </p>
        <a
          href="https://popcenter.asu.edu/sites/g/files/litvpz3631/files/drones_as_first_responders_chula_vista_pd_2022.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-xs text-blue-600 underline"
        >
          View patrol response-time source
        </a>
      </div>
    </div>
  );
}
