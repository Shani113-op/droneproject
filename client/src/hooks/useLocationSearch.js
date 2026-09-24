import { useState } from 'react';
import { searchLocation } from '../services/api';

export function useLocationSearch() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!address.trim()) {
      setError("Please enter a police department address.");
      return null;
    }
    setLoading(true);
    setError("");
    try {
      const data = await searchLocation(address.trim());
      const latitude = Number(data.latitude);
      const longitude = Number(data.longitude);
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 ||
        Math.abs(longitude) > 180
      ) {
        throw new Error("Location provider returned invalid coordinates.");
      }
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
      setLoading(false);
      return null;
    }
  };

  return { address, setAddress, loading, error, search };
}
