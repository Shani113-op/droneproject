const API_BASE_URL = import.meta.env.VITE_API_URL || "https://drone-roi-api.onrender.com";

const request = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
};

export const searchLocation = async (address) => {
  return await request(`/api/location?q=${encodeURIComponent(address)}`);
};

export const calculateResponseTime = async (payload) => {
  const data = await request(`/api/response-time`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.result;
};

export const calculateCallSimulation = async (payload) => {
  const data = await request(`/api/call-simulation`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.result;
};

export const fetchAssumptions = async () => {
  return await request(`/api/roi/assumptions`);
};

export const calculateROI = async (payload) => {
  const data = await request(`/api/roi/calculate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.result;
};

export const sendEmailReport = async (payload) => {
  return await request(`/api/report/email`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

