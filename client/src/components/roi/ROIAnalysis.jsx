import { useEffect, useState } from "react";
import CostInputs from "./CostInputs";
import ROICards from "./ROICards";
import { fetchAssumptions, calculateROI } from "../../services/api";

export default function ROIAnalysis({ simulationResult, setReportData }) {
  const [assumptions, setAssumptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [inputs, setInputs] = useState({});
  const [roiResult, setRoiResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const loadAssumptions = async () => {
      try {
        const data = await fetchAssumptions();
        setAssumptions(data);
        
        // Initialize inputs with default values
        const initialInputs = {};
        for (const key in data) {
          initialInputs[key] = data[key].value;
        }
        initialInputs.numberOfDrones = 1;
        initialInputs.numberOfDockingStations = 1;
        setInputs(initialInputs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadAssumptions();
  }, []);

  // Sync with simulation result
  useEffect(() => {
    if (simulationResult && !loading) {
      setInputs(prev => ({
        ...prev,
        annualCalls: simulationResult.annualCalls,
        droneFirstShare: simulationResult.firstArrivalAllCallsPct
      }));
    }
  }, [simulationResult, loading]);

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const result = await calculateROI(inputs);
      setRoiResult(result);
      
      // Lift report data up for the email component
      if (setReportData) {
        setReportData(prev => ({
          ...prev,
          annualCalls: inputs.annualCalls,
          droneFirstShare: inputs.droneFirstShare,
          roi5YearCost: result.roi[5].droneProgramCost,
          roi5YearSavings: result.roi[5].patrolSavings,
          roi5YearBenefit: result.roi[5].netBenefit,
          roi5YearPercent: result.roi[5].roiPercent
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCalculating(false);
    }
  };

  const handleChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: Number(value) }));
  };

  if (loading) return <div className="p-6 text-center">Loading assumptions...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <CostInputs 
        inputs={inputs} 
        onChange={handleChange} 
        assumptions={assumptions} 
        simulationSynced={!!simulationResult}
      />
      <button
        onClick={handleCalculate}
        disabled={calculating}
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {calculating ? "Calculating ROI..." : "Calculate ROI"}
      </button>
      
      {roiResult && <ROICards roiResult={roiResult} />}
    </div>
  );
}
