const express = require('express');
const multer = require('multer');

const {
  submitTextEmotion,
  submitVoiceEmotion,
  submitFaceEmotion,
  submitSelfReport,
  fuseEmotions,
  getEmotionHistory,
} = require('../controllers/emotionController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post('/text', protect, submitTextEmotion);

router.post(
  '/voice',
  protect,
  upload.single('audio'),
  submitVoiceEmotion
);

router.post(
  '/face',
  protect,
  upload.single('image'),
  submitFaceEmotion
);

router.post(
  '/self-report',
  protect,
  submitSelfReport
);

router.post(
  '/fuse',
  protect,
  fuseEmotions
);

router.get(
  '/',
  protect,
  getEmotionHistory
);

module.exports = router;