export default function CostInputs({ inputs, onChange, assumptions, simulationSynced }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Program Economics & Assumptions</h3>
        <p className="mt-2 text-sm text-slate-500">Edit planning estimates below to match local vendor quotes and department costs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Core Inputs */}
        <div className="col-span-full mb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4 rounded-lg bg-slate-50 p-4 border border-slate-200">
          <div>
            <label className="text-sm font-medium">Number of Drones</label>
            <input type="number" min="0" value={inputs.numberOfDrones || ''} onChange={(e) => onChange('numberOfDrones', e.target.value)} className="mt-1 w-full rounded-lg border p-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Number of Docks</label>
            <input type="number" min="0" value={inputs.numberOfDockingStations || ''} onChange={(e) => onChange('numberOfDockingStations', e.target.value)} className="mt-1 w-full rounded-lg border p-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium flex items-center gap-1">
              Annual Calls
              {simulationSynced && <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded">Synced</span>}
            </label>
            <input type="number" value={inputs.annualCalls || ''} readOnly={simulationSynced} onChange={(e) => onChange('annualCalls', e.target.value)} className={`mt-1 w-full rounded-lg border p-2 text-sm ${simulationSynced ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
          </div>
          <div>
            <label className="text-sm font-medium flex items-center gap-1">
              Drone First Share (%)
              {simulationSynced && <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded">Synced</span>}
            </label>
            <input type="number" value={inputs.droneFirstShare || ''} readOnly={simulationSynced} onChange={(e) => onChange('droneFirstShare', e.target.value)} className={`mt-1 w-full rounded-lg border p-2 text-sm ${simulationSynced ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
          </div>
        </div>

        {/* Dynamic Inputs from Assumptions */}
        {Object.entries(assumptions).map(([key, assumption]) => {
          if (['patrolResponsePriority1'].includes(key)) return null; // Skip non-cost assumptions

          return (
            <div key={key}>
              <label className="text-sm font-medium flex items-center justify-between">
                {assumption.label}
                {assumption.type === 'estimate' && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded ml-2" title={assumption.note}>Estimate</span>}
                {assumption.type === 'sourced' && <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded ml-2" title={assumption.source}>Sourced</span>}
              </label>
              <div className="relative mt-1">
                {assumption.unit === 'USD' && <span className="absolute left-3 top-2 text-sm text-gray-500">$</span>}
                <input
                  type="number"
                  min="0"
                  value={inputs[key] ?? ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  className={`w-full rounded-lg border p-2 text-sm ${assumption.unit === 'USD' ? 'pl-7' : ''}`}
                />
                {assumption.unit === '%' && <span className="absolute right-3 top-2 text-sm text-gray-500">%</span>}
              </div>
              <p className="mt-1 text-[10px] text-gray-500">{assumption.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
