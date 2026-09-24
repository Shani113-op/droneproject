const express = require('express');
const router = express.Router();
const roiController = require('../controllers/roiController');

router.get('/assumptions', roiController.getAssumptions);
router.post('/calculate', roiController.calculate);

module.exports = router;
