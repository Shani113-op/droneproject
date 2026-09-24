const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/email', reportController.sendReport);

module.exports = router;
