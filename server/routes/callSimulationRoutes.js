
const express = require('express');
const router = express.Router();
const callSimulationController = require('../controllers/callSimulationController');

router.post("/", callSimulationController.calculateCallSimulation);

module.exports = router;
