const { calculateROI } = require('../services/roiCalculator');
const assumptions = require('../config/assumptions');

const getAssumptions = (req, res, next) => {
  try {
    res.json(assumptions);
  } catch (error) {
    next(error);
  }
};

const calculate = (req, res, next) => {
  try {
    const inputs = req.body;
    
    // Basic validation
    if (inputs.annualCalls < 0 || inputs.numberOfDrones < 0) {
      return res.status(400).json({ error: "Invalid inputs provided." });
    }

    const results = calculateROI(inputs);
    res.json({ result: results });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssumptions,
  calculate
};
