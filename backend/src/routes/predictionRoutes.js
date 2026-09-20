const express = require('express');

const {
  runPcosScreening,
  getLatestPcosResult,
  getPcosHistory,
} = require('../controllers/predictionController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/pcos', protect, runPcosScreening);

router.get('/pcos/latest', protect, getLatestPcosResult);

router.get('/pcos', protect, getPcosHistory);

module.exports = router;