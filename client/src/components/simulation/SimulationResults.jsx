export default function SimulationResults({ result }) {
  if (!result) return null;

  return (
    <div className="mt-8">
      <h4 className="mb-5 text-lg font-bold">First-Arrival Results</h4>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-blue-50 p-5">
          <p className="text-sm text-slate-600">Calls Within Coverage</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-700">{result.coveredCalls.toLocaleString()}</h3>
          <p className="mt-2 text-xs text-slate-500">Estimated calls per year</p>
        </div>
        <div className="rounded-lg bg-slate-100 p-5">
          <p className="text-sm text-slate-600">Drone-Eligible Calls</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">{result.eligibleCalls.toLocaleString()}</h3>
          <p className="mt-2 text-xs text-slate-500">Estimated calls per year</p>
        </div>
        <div className="rounded-lg bg-green-50 p-5">
          <p className="text-sm text-slate-600">Drone Arrives First</p>
          <h3 className="mt-2 text-3xl font-bold text-green-700">{result.firstArrivalCalls.toLocaleString()}</h3>
          <p className="mt-2 text-xs text-slate-500">Estimated calls per year</p>
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-slate-900 p-6 text-white">
        <p className="text-sm text-slate-300">Drone-First Share of All Emergency Calls</p>
        <h2 className="mt-3 text-5xl font-bold text-green-400">{result.firstArrivalAllCallsPct}%</h2>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full rounded-full bg-green-400" style={{ width: `${result.firstArrivalAllCallsPct}%` }} />
        </div>
        <p className="mt-4 text-xs text-slate-400">Percentage of the department's total annual emergency-call volume.</p>
      </div>
      <div className="mt-5 rounded-lg border p-5">
        <h4 className="font-semibold">Additional Analysis</h4>
        <p className="mt-3 text-sm text-slate-600">Drone Available: <strong>{result.availableCalls.toLocaleString()}</strong> estimated calls/year</p>
        <p className="mt-3 text-sm text-slate-600">First-arrival share within coverage: <strong>{result.firstArrivalWithinCoveragePct}%</strong></p>
        <p className="mt-3 text-sm text-slate-600">Break-even flight distance: <strong>{result.breakEvenDistanceKm} km</strong></p>
        <p className="mt-3 text-xs text-slate-500">
          The within-coverage percentage assumes an eligible call, drone availability and uniform call locations.
          The all-call percentage also accounts for estimated coverage, eligibility and availability.
        </p>
      </div>
    </div>
  );
}
