const express = require('express');

const {
  logPeriod,
  getCycles,
  updateCycle,
  getCycleSummary,
} = require('../controllers/cycleController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, logPeriod);

router.get('/', protect, getCycles);

router.get('/summary', protect, getCycleSummary);

router.put('/:id', protect, updateCycle);

module.exports = router;