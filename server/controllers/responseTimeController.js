
const calculateResponseTime = require('../services/responseTime');

exports.calculateResponseTime = (req, res, next) => {
  try {
    const {
      distanceKm,
      droneSpeedKmh,
      launchDelayMin,
      patrolResponseMin,
    } = req.body || {};

    const inputs = [distanceKm, droneSpeedKmh, launchDelayMin, patrolResponseMin];

    if (inputs.some(value => typeof value !== "number" || !Number.isFinite(value))) {
      return res.status(400).json({ error: "All inputs must be valid numbers." });
    }

    if (
      distanceKm < 0 || distanceKm > 100 ||
      droneSpeedKmh < 1 || droneSpeedKmh > 200 ||
      launchDelayMin < 0 || launchDelayMin > 60 ||
      patrolResponseMin <= 0 || patrolResponseMin > 180
    ) {
      return res.status(400).json({ error: "One or more values are outside the allowed range." });
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
        formula: "Drone response = launch delay + (distance / speed) * 60",
        distance: "Straight-line scenario distance; not a verified flight route.",
        limitation: "Excludes weather, airspace delays, dispatch variation and route obstacles.",
        assumptionStatus: "Drone speed and launch delay are illustrative user-editable values.",
        patrolSource: "Chula Vista Police Department, 2022 Priority 1 comparison",
        patrolSourceUrl: "https://popcenter.asu.edu/sites/g/files/litvpz3631/files/drones_as_first_responders_chula_vista_pd_2022.pdf"
      }
    });

  } catch (error) {
    console.error("Response time error:", error);
    return res.status(500).json({ error: "Response time calculation failed." });
  }
};
