const assumptions = require('../config/assumptions');

const calculateCosts = (inputs) => {
  // Extract inputs or use defaults from assumptions
  const numDrones = inputs.numberOfDrones || 1;
  const numDocks = inputs.numberOfDockingStations || 1;
  
  const droneHardware = (inputs.droneHardwareCost ?? assumptions.droneHardwareCost.value) * numDrones;
  const dockingStation = (inputs.dockingStationCost ?? assumptions.dockingStationCost.value) * numDocks;
  const implementation = inputs.implementationCost ?? assumptions.implementationCost.value;
  const training = inputs.trainingCost ?? assumptions.trainingCost.value;

  const oneTimeCost = droneHardware + dockingStation + implementation + training;

  const annualSoftware = inputs.annualSoftwareCost ?? assumptions.annualSoftwareCost.value;
  const annualMaintenance = (inputs.annualMaintenanceCostPerDrone ?? assumptions.annualMaintenanceCostPerDrone.value) * numDrones;
  const annualConnectivity = inputs.annualConnectivityCost ?? assumptions.annualConnectivityCost.value;
  const annualInsurance = inputs.annualInsuranceCost ?? assumptions.annualInsuranceCost.value;
  const annualStaffing = inputs.annualStaffingCost ?? assumptions.annualStaffingCost.value;

  const annualOperatingCost = annualSoftware + annualMaintenance + annualConnectivity + annualInsurance + annualStaffing;

  const annualCalls = inputs.annualCalls || 0;
  const avgPatrolCost = inputs.averagePatrolCostPerCall ?? assumptions.averagePatrolCostPerCall.value;
  
  const annualStatusQuoCost = annualCalls * avgPatrolCost;

  const droneFirstSharePct = inputs.droneFirstShare || 0;
  const droneClearanceRatePct = inputs.droneClearanceRate ?? assumptions.droneClearanceRate.value;

  const droneFirstCalls = annualCalls * (droneFirstSharePct / 100);
  const avoidedPatrolCalls = droneFirstCalls * (droneClearanceRatePct / 100);
  
  const annualPatrolSavings = avoidedPatrolCalls * avgPatrolCost;

  return {
    oneTimeCost,
    annualOperatingCost,
    annualStatusQuoCost,
    droneFirstCalls,
    avoidedPatrolCalls,
    annualPatrolSavings,
    breakdown: {
      droneHardware,
      dockingStation,
      implementation,
      training,
      annualSoftware,
      annualMaintenance,
      annualConnectivity,
      annualInsurance,
      annualStaffing
    }
  };
};

module.exports = {
  calculateCosts
};
