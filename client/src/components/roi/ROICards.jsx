export default function ROICards({ roiResult }) {
  if (!roiResult || !roiResult.roi) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Return on Investment</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 3, 5].map(year => {
          const data = roiResult.roi[year];
          const isPositive = data.roiPercent > 0;
          return (
            <div key={year} className={`rounded-xl border-l-4 p-5 shadow-sm bg-white ${isPositive ? 'border-green-500' : 'border-amber-500'}`}>
              <h4 className="text-lg font-bold text-slate-700">{year} Year ROI</h4>
              <div className={`text-3xl font-black mt-2 ${isPositive ? 'text-green-600' : 'text-amber-600'}`}>
                {data.roiPercent.toFixed(1)}%
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between border-b pb-1">
                  <span>Program Cost</span>
                  <span className="font-semibold">${data.droneProgramCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>Patrol Savings</span>
                  <span className="font-semibold text-green-600">${data.patrolSavings.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Net Benefit</span>
                  <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-amber-600'}`}>
                    ${data.netBenefit.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
