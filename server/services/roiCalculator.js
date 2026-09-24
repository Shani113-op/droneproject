const { calculateCosts } = require('./costCalculator');

const calculateROIForYears = (costs, years) => {
  const totalDroneProgramCost = costs.oneTimeCost + (costs.annualOperatingCost * years);
  const totalStatusQuoCost = costs.annualStatusQuoCost * years;
  const totalPatrolSavings = costs.annualPatrolSavings * years;
  
  const remainingPatrolCost = totalStatusQuoCost - totalPatrolSavings;
  const totalCostWithDFR = totalDroneProgramCost + remainingPatrolCost;
  
  const netBenefit = totalStatusQuoCost - totalCostWithDFR;
  
  // Return ROI. Avoid division by zero if cost is zero (though unlikely in practice)
  const roiPercent = totalDroneProgramCost > 0 
    ? (netBenefit / totalDroneProgramCost) * 100 
    : 0;

  return {
    years,
    droneProgramCost: totalDroneProgramCost,
    statusQuoCost: totalStatusQuoCost,
    patrolSavings: totalPatrolSavings,
    remainingPatrolCost,
    totalCostWithDFR,
    netBenefit,
    roiPercent
  };
};

const calculateROI = (inputs) => {
  const costs = calculateCosts(inputs);
  
  const year1 = calculateROIForYears(costs, 1);
  const year3 = calculateROIForYears(costs, 3);
  const year5 = calculateROIForYears(costs, 5);

  return {
    costs,
    roi: {
      1: year1,
      3: year3,
      5: year5
    }
  };
};

module.exports = {
  calculateROI
};
