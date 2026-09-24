module.exports = {
  // Sourced benchmarks
  patrolResponsePriority1: {
    key: "patrolResponsePriority1",
    value: 8.6,
    unit: "minutes",
    type: "sourced",
    label: "Patrol Response Time (Priority 1)",
    source: "Chula Vista PD, 2022",
    sourceUrl: "https://popcenter.asu.edu/sites/g/files/litvpz3631/files/drones_as_first_responders_chula_vista_pd_2022.pdf",
    note: "Benchmark priority 1 response. Not universally applicable to all departments."
  },
  
  // Planning estimates
  droneHardwareCost: {
    key: "droneHardwareCost",
    value: 35000,
    unit: "USD",
    type: "estimate",
    label: "Drone Hardware Cost",
    source: "Planning Estimate",
    note: "Per unit cost. Replace with vendor quote."
  },
  dockingStationCost: {
    key: "dockingStationCost",
    value: 45000,
    unit: "USD",
    type: "estimate",
    label: "Docking Station Cost",
    source: "Planning Estimate",
    note: "Per unit cost. Replace with vendor quote."
  },
  implementationCost: {
    key: "implementationCost",
    value: 20000,
    unit: "USD",
    type: "estimate",
    label: "Implementation Cost",
    source: "Planning Estimate",
    note: "One-time setup and integration."
  },
  trainingCost: {
    key: "trainingCost",
    value: 15000,
    unit: "USD",
    type: "estimate",
    label: "Training Cost",
    source: "Planning Estimate",
    note: "Initial staff training."
  },

  annualSoftwareCost: {
    key: "annualSoftwareCost",
    value: 25000,
    unit: "USD",
    type: "estimate",
    label: "Annual Software License",
    source: "Planning Estimate",
    note: "Yearly fleet management software."
  },
  annualMaintenanceCostPerDrone: {
    key: "annualMaintenanceCostPerDrone",
    value: 5000,
    unit: "USD",
    type: "estimate",
    label: "Annual Maintenance per Drone",
    source: "Planning Estimate",
    note: "Yearly maintenance and parts."
  },
  annualConnectivityCost: {
    key: "annualConnectivityCost",
    value: 3000,
    unit: "USD",
    type: "estimate",
    label: "Annual Connectivity",
    source: "Planning Estimate",
    note: "Cellular data and communications."
  },
  annualInsuranceCost: {
    key: "annualInsuranceCost",
    value: 8000,
    unit: "USD",
    type: "estimate",
    label: "Annual Insurance",
    source: "Planning Estimate",
    note: "Liability and hull insurance."
  },
  annualStaffingCost: {
    key: "annualStaffingCost",
    value: 120000,
    unit: "USD",
    type: "estimate",
    label: "Annual Staffing",
    source: "Planning Estimate",
    note: "Dedicated remote pilot in command (RPIC) staffing."
  },

  averagePatrolCostPerCall: {
    key: "averagePatrolCostPerCall",
    value: 45,
    unit: "USD",
    type: "estimate",
    label: "Average Patrol Cost per Call",
    source: "Planning Estimate",
    note: "Replace with department-specific cost."
  },
  droneClearanceRate: {
    key: "droneClearanceRate",
    value: 25,
    unit: "%",
    type: "estimate",
    label: "Drone Clearance Rate",
    source: "Planning Estimate",
    note: "Percentage of drone-first arrivals that cancel/avoid a patrol dispatch."
  }
};
