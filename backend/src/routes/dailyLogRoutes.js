const express = require('express');

const {
  submitDailyLog,
  getDailyLog,
  getDailyLogHistory,
} = require('../controllers/dailyLogController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, submitDailyLog);

router.get('/', protect, getDailyLogHistory);

router.get('/:date', protect, getDailyLog);

module.exports = router;