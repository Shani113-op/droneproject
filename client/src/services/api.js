const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const searchLocation = async (address) => {
  const response = await fetch(`${API_URL}/api/location?q=${encodeURIComponent(address)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Unable to find the location.");
  return data;
};

export const calculateResponseTime = async (payload) => {
  const response = await fetch(`${API_URL}/api/response-time`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Calculation failed.");
  return data.result;
};

export const calculateCallSimulation = async (payload) => {
  const response = await fetch(`${API_URL}/api/call-simulation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Simulation failed.");
  return data.result;
};

export const fetchAssumptions = async () => {
  const response = await fetch(`${API_URL}/api/roi/assumptions`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to load assumptions.");
  return data;
};

export const calculateROI = async (payload) => {
  const response = await fetch(`${API_URL}/api/roi/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "ROI calculation failed.");
  return data.result;
};

export const sendEmailReport = async (payload) => {
  const response = await fetch(`${API_URL}/api/report/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to send email.");
  return data;
};

