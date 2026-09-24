import { useState } from 'react';
import { calculateResponseTime as apiCalculateResponseTime } from '../services/api';

export function useResponseTime() {
  const [calculating, setCalculating] = useState(false);
  const [responseResult, setResponseResult] = useState(null);
  const [responseError, setResponseError] = useState("");

  const calculate = async (payload) => {
    setCalculating(true);
    setResponseError("");
    setResponseResult(null);
    try {
      const result = await apiCalculateResponseTime(payload);
      setResponseResult(result);
    } catch (err) {
      setResponseError(err.message);
    } finally {
      setCalculating(false);
    }
  };

  return { calculating, responseResult, setResponseResult, responseError, calculate };
}
