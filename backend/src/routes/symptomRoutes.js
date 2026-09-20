const express = require('express');

const {
  logSymptoms,
  getSymptomHistory,
} = require('../controllers/symptomController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, logSymptoms);

router.get('/', protect, getSymptomHistory);

module.exports = router;