
const config = require('../config/config');

const cache = new Map();
let lastRequestTime = 0;

exports.geocodeAddress = async (address) => {
  if (
    typeof address !== "string" ||
    address.trim().length < 5 ||
    address.length > 200
  ) {
    const err = new Error("Please enter a valid address.");
    err.status = 400;
    throw err;
  }

  const query = address.trim();
  const cacheKey = query.toLowerCase();

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (Date.now() - lastRequestTime < 1100) {
    const err = new Error("Please wait two seconds and try again.");
    err.status = 429;
    throw err;
  }

  const contactEmail = config.geocoderContactEmail;

  if (!contactEmail) {
    const err = new Error("Geocoding contact email is not configured.");
    err.status = 500;
    throw err;
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");

  lastRequestTime = Date.now();

  const response = await fetch(url, {
    headers: {
      "User-Agent": "DroneROISimulator/1.0 (contact: " + contactEmail + ")",
      "Accept": "application/json"
    },
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    const err = new Error("Location provider is unavailable.");
    err.status = 502;
    throw err;
  }

  const data = await response.json();

  if (data.length === 0) {
    const err = new Error("Location not found. Try a more specific address.");
    err.status = 404;
    throw err;
  }

  const location = data[0];

  const result = {
    address: location.display_name,
    latitude: Number(location.lat),
    longitude: Number(location.lon),
    source: "OpenStreetMap Nominatim"
  };

  if (cache.size >= 100) {
    cache.delete(cache.keys().next().value);
  }

  cache.set(cacheKey, result);

  return result;
};
