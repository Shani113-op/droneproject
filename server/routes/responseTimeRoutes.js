
const express = require('express');
const router = express.Router();
const responseTimeController = require('../controllers/responseTimeController');

router.post("/", responseTimeController.calculateResponseTime);

module.exports = router;
