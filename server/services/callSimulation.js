// services/callSimulation.js

function calculateCallSimulation({
  annualCalls,
  radiusKm,
  coverageCallSharePct,
  eligibleCallSharePct,
  droneAvailabilityPct,
  droneSpeedKmh,
  launchDelayMin,
  patrolResponseMin,
}) {

  // ----------------------------------
  // 1. ESTIMATE CALL VOLUMES
  // ----------------------------------

  // Percentage of ALL calls inside coverage
  const coveredCalls =
    annualCalls * (coverageCallSharePct / 100);

  // Percentage of COVERED calls eligible for a drone
  const eligibleCalls =
    coveredCalls * (eligibleCallSharePct / 100);

  // Percentage of ELIGIBLE calls with drone available
  const availableCalls =
    eligibleCalls * (droneAvailabilityPct / 100);


  // ----------------------------------
  // 2. DISTANCE WHERE DRONE ARRIVES FIRST
  // ----------------------------------

  // Drone response:
  // launchDelay + (distance / speed) * 60
  //
  // Solve for distance when drone time equals patrol time.

  const timeAvailableForFlight =
    patrolResponseMin - launchDelayMin;

  const breakEvenDistanceKm =
    Math.max(
      0,
      (timeAvailableForFlight * droneSpeedKmh) / 60
    );


  // ----------------------------------
  // 3. FIRST-ARRIVAL AREA
  // ----------------------------------

  const effectiveRadiusKm =
    Math.min(radiusKm, breakEvenDistanceKm);

  // Uniform spatial distribution assumption:
  // Area fraction = (effective radius / total radius)^2

  const firstArrivalFraction =
    Math.pow(
      effectiveRadiusKm / radiusKm,
      2
    );

  const firstArrivalWithinCoveragePct =
    firstArrivalFraction * 100;


  // ----------------------------------
  // 4. ESTIMATE FIRST-ARRIVAL CALLS
  // ----------------------------------

  const firstArrivalCalls =
    availableCalls * firstArrivalFraction;

  const firstArrivalAllCallsPct =
    annualCalls > 0
      ? (firstArrivalCalls / annualCalls) * 100
      : 0;


  // ----------------------------------
  // 5. RETURN RESULTS
  // ----------------------------------

  return {

    annualCalls,

    coveredCalls: Math.round(coveredCalls),

    eligibleCalls: Math.round(eligibleCalls),

    availableCalls: Math.round(availableCalls),

    firstArrivalCalls: Math.round(firstArrivalCalls),

    breakEvenDistanceKm: Number(
      breakEvenDistanceKm.toFixed(2)
    ),

    effectiveRadiusKm: Number(
      effectiveRadiusKm.toFixed(2)
    ),

    firstArrivalWithinCoveragePct: Number(
      firstArrivalWithinCoveragePct.toFixed(2)
    ),

    firstArrivalAllCallsPct: Number(
      firstArrivalAllCallsPct.toFixed(2)
    ),

    modelType: "Scenario estimate",

    assumptions: [
      "Call locations are uniformly distributed inside the selected circle.",
      "Patrol response time is constant for every modeled call.",
      "Coverage share is a user estimate, not derived from map area.",
      "Eligibility is conditional on calls being inside coverage.",
      "Drone availability is conditional on covered, eligible calls.",
      "Flight follows a straight-line route at constant speed.",
      "No additional airspace, weather or dispatch delays are modeled.",
      "Drone first arrival does not imply that patrol dispatch is avoided."
    ]

  };

}

module.exports = calculateCallSimulation;