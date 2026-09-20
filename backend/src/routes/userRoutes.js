const express = require('express');

const {
  getMe,
  updateHealthProfile,
} = require('../controllers/userController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, getMe);

router.put(
  '/me/health-profile',
  protect,
  updateHealthProfile
);

module.exports = router;