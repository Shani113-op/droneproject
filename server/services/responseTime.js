// Drone vs Patrol Response Time Calculator

function calculateResponseTime({
  distanceKm,
  droneSpeedKmh,
  launchDelayMin,
  patrolResponseMin,
}) {

  // 1. Calculate drone flight duration
  const flightTimeMin =
    (distanceKm / droneSpeedKmh) * 60;

  // 2. Add launch delay
  const droneResponseMin =
    flightTimeMin + launchDelayMin;

  // 3. Compare with patrol
  const timeDifferenceMin =
    patrolResponseMin - droneResponseMin;

  // 4. Determine first arrival
  let firstArrival = "Tie";

  if (timeDifferenceMin > 0.001) {
    firstArrival = "Drone";
  } else if (timeDifferenceMin < -0.001) {
    firstArrival = "Patrol";
  }

  return {
    distanceKm,
    droneSpeedKmh,
    launchDelayMin,
    patrolResponseMin,

    flightTimeMin:
      Number(flightTimeMin.toFixed(2)),

    droneResponseMin:
      Number(droneResponseMin.toFixed(2)),

    timeDifferenceMin:
      Number(timeDifferenceMin.toFixed(2)),

    firstArrival,
  };

}

module.exports = calculateResponseTime;