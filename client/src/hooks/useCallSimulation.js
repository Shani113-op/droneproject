import { useState } from 'react';
import { calculateCallSimulation as apiCalculateCallSimulation } from '../services/api';

export function useCallSimulation() {
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationError, setSimulationError] = useState("");

  const simulate = async (payload) => {
    setSimulating(true);
    setSimulationError("");
    setSimulationResult(null);
    try {
      const result = await apiCalculateCallSimulation(payload);
      const inputSignature = JSON.stringify(Object.values(payload));
      const finalResult = { ...result, inputSignature };
      setSimulationResult(finalResult);
      return finalResult;
    } catch (err) {
      setSimulationError(err.message);
    } finally {
      setSimulating(false);
    }
  };

  return { simulating, simulationResult, simulationError, simulate };
}
