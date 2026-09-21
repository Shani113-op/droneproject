require("dotenv").config();

const express = require("express");
const cors = require("cors");
const calculateResponseTime =
  require("./services/responseTime");

  const calculateCallSimulation =
  require("./services/callSimulation");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Cache results to avoid repeated geocoding requests.
const cache = new Map();

let lastRequestTime = 0;

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "Drone ROI Backend Running"
  });
});

// Address search API
app.get("/api/location", async (req, res) => {

  try {

    const address = req.query.q;

    if (
      typeof address !== "string" ||
      address.trim().length < 5 ||
      address.length > 200
    ) {
      return res.status(400).json({
        error: "Please enter a valid address."
      });
    }

    const query = address.trim();
    const cacheKey = query.toLowerCase();

    // Return cached results when available.
    if (cache.has(cacheKey)) {
      return res.json(cache.get(cacheKey));
    }

    // Respect public Nominatim request limits.
    if (Date.now() - lastRequestTime < 1100) {
      res.set("Retry-After", "2");

      return res.status(429).json({
        error: "Please wait two seconds and try again."
      });
    }

    const contactEmail =
      process.env.GEOCODER_CONTACT_EMAIL;

    if (!contactEmail) {
      return res.status(500).json({
        error: "Geocoding contact email is not configured."
      });
    }

    const url = new URL(
      "https://nominatim.openstreetmap.org/search"
    );

    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");

    lastRequestTime = Date.now();

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          `DroneROISimulator/1.0 (contact: ${contactEmail})`,
        "Accept": "application/json"
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return res.status(502).json({
        error: "Location provider is unavailable."
      });
    }

    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({
        error: "Location not found. Try a more specific address."
      });
    }

    const location = data[0];

    const result = {
      address: location.display_name,
      latitude: Number(location.lat),
      longitude: Number(location.lon),
      source: "OpenStreetMap Nominatim"
    };

    // Basic bounded cache for this development prototype.
    if (cache.size >= 100) {
      cache.delete(cache.keys().next().value);
    }

    cache.set(cacheKey, result);

    return res.json(result);

  } catch (error) {

    console.error("Geocoding error:", error);

    return res.status(500).json({
      error: "Unable to search the address right now."
    });

  }

});

// ----------------------------------------------
// DRONE RESPONSE TIME API
// ----------------------------------------------

app.post("/api/response-time", (req, res) => {

  try {

    const {
      distanceKm,
      droneSpeedKmh,
      launchDelayMin,
      patrolResponseMin,
    } = req.body || {};

    const inputs = [
      distanceKm,
      droneSpeedKmh,
      launchDelayMin,
      patrolResponseMin,
    ];

    // All inputs must be actual finite numbers.
    if (
      inputs.some(
        (value) =>
          typeof value !== "number" ||
          !Number.isFinite(value)
      )
    ) {
      return res.status(400).json({
        error: "All inputs must be valid numbers."
      });
    }

    // Validate reasonable calculator boundaries.
    if (
      distanceKm < 0 ||
      distanceKm > 100 ||
      droneSpeedKmh < 1 ||
      droneSpeedKmh > 200 ||
      launchDelayMin < 0 ||
      launchDelayMin > 60 ||
      patrolResponseMin <= 0 ||
      patrolResponseMin > 180
    ) {
      return res.status(400).json({
        error: "One or more values are outside the allowed range."
      });
    }

    const result = calculateResponseTime({
      distanceKm,
      droneSpeedKmh,
      launchDelayMin,
      patrolResponseMin,
    });

    return res.json({
      success: true,
      result,

      methodology: {
        formula:
          "Drone response = launch delay + (distance / speed) * 60",

        distance:
          "Straight-line scenario distance; not a verified flight route.",

        limitation:
          "Excludes weather, airspace delays, dispatch variation and route obstacles.",

        assumptionStatus:
          "Drone speed and launch delay are illustrative user-editable values.",

        patrolSource:
          "Chula Vista Police Department, 2022 Priority 1 comparison",

        patrolSourceUrl:
          "https://popcenter.asu.edu/sites/g/files/litvpz3631/files/drones_as_first_responders_chula_vista_pd_2022.pdf"
      }
    });

  } catch (error) {

    console.error("Response time error:", error);

    return res.status(500).json({
      error: "Response time calculation failed."
    });

  }

});

// ----------------------------------
// FIRST ARRIVAL SIMULATION API
// ----------------------------------

app.post("/api/call-simulation", (req, res) => {

  try {

    const {
      annualCalls,
      radiusKm,
      coverageCallSharePct,
      eligibleCallSharePct,
      droneAvailabilityPct,
      droneSpeedKmh,
      launchDelayMin,
      patrolResponseMin,
    } = req.body || {};

    const values = [
      annualCalls,
      radiusKm,
      coverageCallSharePct,
      eligibleCallSharePct,
      droneAvailabilityPct,
      droneSpeedKmh,
      launchDelayMin,
      patrolResponseMin,
    ];

    // Validate numerical inputs
    if (
      values.some(
        (value) =>
          typeof value !== "number" ||
          !Number.isFinite(value)
      )
    ) {
      return res.status(400).json({
        error: "All inputs must be valid numbers."
      });
    }

    // Validate boundaries
    if (
      !Number.isInteger(annualCalls) ||
      annualCalls < 0 ||
      annualCalls > 10000000 ||
      radiusKm <= 0 ||
      radiusKm > 100 ||
      droneSpeedKmh < 1 ||
      droneSpeedKmh > 200 ||
      launchDelayMin < 0 ||
      launchDelayMin > 60 ||
      patrolResponseMin <= 0 ||
      patrolResponseMin > 180 ||
      [
        coverageCallSharePct,
        eligibleCallSharePct,
        droneAvailabilityPct
      ].some((value) => value < 0 || value > 100)
    ) {

      return res.status(400).json({
        error: "One or more inputs are outside the allowed range."
      });

    }

    const result = calculateCallSimulation({
      annualCalls,
      radiusKm,
      coverageCallSharePct,
      eligibleCallSharePct,
      droneAvailabilityPct,
      droneSpeedKmh,
      launchDelayMin,
      patrolResponseMin,
    });

    return res.json({
      success: true,
      result,
    });

  } catch (error) {

    console.error("Call simulation error:", error);

    return res.status(500).json({
      error: "Call simulation failed."
    });

  }

});

// Start server
app.listen(PORT, () => {
  console.log(
    `Backend running on http://localhost:${PORT}`
  );
});