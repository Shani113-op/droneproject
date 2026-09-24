
const calculateCallSimulation = require('../services/callSimulation');

exports.calculateCallSimulation = (req, res, next) => {
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
      annualCalls, radiusKm, coverageCallSharePct, eligibleCallSharePct,
      droneAvailabilityPct, droneSpeedKmh, launchDelayMin, patrolResponseMin,
    ];

    if (values.some(value => typeof value !== "number" || !Number.isFinite(value))) {
      return res.status(400).json({ error: "All inputs must be valid numbers." });
    }

    if (
      !Number.isInteger(annualCalls) || annualCalls < 0 || annualCalls > 10000000 ||
      radiusKm <= 0 || radiusKm > 100 ||
      droneSpeedKmh < 1 || droneSpeedKmh > 200 ||
      launchDelayMin < 0 || launchDelayMin > 60 ||
      patrolResponseMin <= 0 || patrolResponseMin > 180 ||
      [coverageCallSharePct, eligibleCallSharePct, droneAvailabilityPct].some((value) => value < 0 || value > 100)
    ) {
      return res.status(400).json({ error: "One or more inputs are outside the allowed range." });
    }

    const result = calculateCallSimulation({
      annualCalls, radiusKm, coverageCallSharePct, eligibleCallSharePct,
      droneAvailabilityPct, droneSpeedKmh, launchDelayMin, patrolResponseMin,
    });

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Call simulation error:", error);
    return res.status(500).json({ error: "Call simulation failed." });
  }
};
