import { useState } from "react";
import SimulationResults from "./SimulationResults";
import { useCallSimulation } from "../../hooks/useCallSimulation";

export default function CallSimulation({
  radius,
  defaultDroneSpeedKmh,
  defaultLaunchDelayMin,
  defaultPatrolResponseMin,
  defaultAnnualCalls,
  defaultCoverageCallSharePct,
  defaultEligibleCallSharePct,
  defaultDroneAvailabilityPct,
  setAppSimulationResult
}) {
  const [annualCalls, setAnnualCalls] = useState(defaultAnnualCalls);
  const [coverageCallSharePct, setCoverageCallSharePct] = useState(defaultCoverageCallSharePct);
  const [eligibleCallSharePct, setEligibleCallSharePct] = useState(defaultEligibleCallSharePct);
  const [droneAvailabilityPct, setDroneAvailabilityPct] = useState(defaultDroneAvailabilityPct);

  const { simulating, simulationResult, simulationError, simulate } = useCallSimulation();

  const currentSimulationSignature = JSON.stringify([
    Number(annualCalls), radius, Number(coverageCallSharePct), Number(eligibleCallSharePct),
    Number(droneAvailabilityPct), defaultDroneSpeedKmh, defaultLaunchDelayMin, defaultPatrolResponseMin
  ]);

  const visibleSimulation = simulationResult?.inputSignature === currentSimulationSignature ? simulationResult : null;

  const validSimulationInputs =
    [annualCalls, coverageCallSharePct, eligibleCallSharePct, droneAvailabilityPct].every(val => String(val).trim() !== "") &&
    Number.isInteger(Number(annualCalls)) && Number(annualCalls) >= 0 && Number(annualCalls) <= 10000000 &&
    [coverageCallSharePct, eligibleCallSharePct, droneAvailabilityPct].every(val => Number(val) >= 0 && Number(val) <= 100);

  const handleCalculate = async () => {
    const result = await simulate({
      annualCalls: Number(annualCalls),
      radiusKm: radius,
      coverageCallSharePct: Number(coverageCallSharePct),
      eligibleCallSharePct: Number(eligibleCallSharePct),
      droneAvailabilityPct: Number(droneAvailabilityPct),
      droneSpeedKmh: defaultDroneSpeedKmh,
      launchDelayMin: defaultLaunchDelayMin,
      patrolResponseMin: defaultPatrolResponseMin,
    });
    if (result && setAppSimulationResult) {
      setAppSimulationResult(result);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Drone First-Arrival Analysis</h3>
        <p className="mt-2 text-sm text-slate-500">Estimate the percentage of emergency calls a drone could reach before police patrol.</p>
        <p className="mt-2 text-xs text-amber-700">Scenario estimates only. Replace example inputs with verified department data.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Annual Emergency Calls</label>
          <input
            type="number"
            min="0"
            max="10000000"
            step="1"
            value={annualCalls}
            onChange={(e) => setAnnualCalls(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-slate-500">Example only. Enter actual annual emergency-call volume.</p>
        </div>
        <div>
          <label className="text-sm font-medium">Calls Within Coverage (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={coverageCallSharePct}
            onChange={(e) => setCoverageCallSharePct(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-slate-500">Estimated percentage of all calls located within the drone coverage circle.</p>
        </div>
        <div>
          <label className="text-sm font-medium">Drone-Eligible Calls (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={eligibleCallSharePct}
            onChange={(e) => setEligibleCallSharePct(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-slate-500">Percentage of covered calls suitable for drone deployment.</p>
        </div>
        <div>
          <label className="text-sm font-medium">Drone Availability (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={droneAvailabilityPct}
            onChange={(e) => setDroneAvailabilityPct(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-slate-500">Percentage of covered, eligible calls with a drone available for dispatch.</p>
        </div>
      </div>
      <button
        onClick={handleCalculate}
        disabled={simulating || !validSimulationInputs}
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {simulating ? "Calculating..." : "Calculate First-Arrival Percentage"}
      </button>
      {simulationError && <p role="alert" className="mt-4 text-sm text-red-600">{simulationError}</p>}
      
      <SimulationResults result={visibleSimulation} />

      <div className="mt-6 rounded-lg bg-slate-50 p-5">
        <h4 className="text-sm font-semibold">Methodology and Assumptions</h4>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          The model assumes call locations are uniformly distributed inside the coverage circle and uses a constant patrol response-time baseline.
          Coverage, eligibility and availability percentages are editable estimates, not measured department data.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          This calculation excludes weather, airspace, dispatch variation, overlapping missions and actual emergency-call geography.
          A drone arriving first does not automatically eliminate the need for police officers.
        </p>
      </div>
    </div>
  );
}
