const Emotion = require('../models/Emotion');

const submitTextEmotion = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: 'Text is required',
      });
    }

    /*
     * Member 2 AI service will be connected here.
     *
     * Example future result:
     * {
     *   emotion: 'stressed',
     *   confidence: 0.87
     * }
     */

    const emotion = await Emotion.create({
      user: req.user._id,
      date: new Date(),
      source: 'text',
      input: text,
      emotion: null,
      confidence: null,
    });

    res.status(201).json({
      received: true,
      emotion,
    });
  } catch (error) {
    console.error('Text emotion error:', error);

    res.status(500).json({
      message: 'Server error while processing text emotion',
    });
  }
};

const submitVoiceEmotion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Voice file is required',
      });
    }

    const emotion = await Emotion.create({
      user: req.user._id,
      date: new Date(),
      source: 'voice',
      emotion: null,
      confidence: null,
      metadata: {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
      },
    });

    res.status(201).json({
      received: true,
      emotion,
    });
  } catch (error) {
    console.error('Voice emotion error:', error);

    res.status(500).json({
      message: 'Server error while processing voice emotion',
    });
  }
};

const submitFaceEmotion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'Face image is required',
      });
    }

    const emotion = await Emotion.create({
      user: req.user._id,
      date: new Date(),
      source: 'face',
      emotion: null,
      confidence: null,
      metadata: {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
      },
    });

    res.status(201).json({
      received: true,
      emotion,
    });
  } catch (error) {
    console.error('Face emotion error:', error);

    res.status(500).json({
      message: 'Server error while processing face emotion',
    });
  }
};

const submitSelfReport = async (req, res) => {
  try {
    const { emotion: selfReportedEmotion } = req.body;

    if (!selfReportedEmotion) {
      return res.status(400).json({
        message: 'Emotion is required',
      });
    }

    const emotion = await Emotion.create({
      user: req.user._id,
      date: new Date(),
      source: 'self-report',
      emotion: selfReportedEmotion,
      confidence: 1,
    });

    res.status(201).json({
      received: true,
      emotion,
    });
  } catch (error) {
    console.error('Self-report emotion error:', error);

    res.status(500).json({
      message: 'Server error while saving self-reported emotion',
    });
  }
};

const fuseEmotions = async (req, res) => {
  try {
    const {
      date,
      text,
      selfReport,
      voiceResultId,
      faceResultId,
    } = req.body;

    /*
     * Member 2 multimodal AI fusion will eventually be called here.
     *
     * Example:
     *
     * text + voice + face + selfReport
     *              ↓
     *        Emotion AI
     *              ↓
     *       overall emotion
     */

    const emotion = await Emotion.create({
      user: req.user._id,
      date: date ? new Date(date) : new Date(),
      source: 'fused',
      input: text || null,
      emotion: selfReport || null,
      confidence: null,
      metadata: {
        voiceResultId: voiceResultId || null,
        faceResultId: faceResultId || null,
        selfReport: selfReport || null,
      },
    });

    res.status(201).json({
      received: true,
      emotion,
    });
  } catch (error) {
    console.error('Emotion fusion error:', error);

    res.status(500).json({
      message: 'Server error while fusing emotions',
    });
  }
};

const getEmotionHistory = async (req, res) => {
  try {
    const limit = Math.min(
      parseInt(req.query.limit) || 30,
      100
    );

    const emotions = await Emotion.find({
      user: req.user._id,
    })
      .sort({ date: -1 })
      .limit(limit);

    res.status(200).json({
      emotions,
    });
  } catch (error) {
    console.error('Get emotion history error:', error);

    res.status(500).json({
      message: 'Server error while fetching emotion history',
    });
  }
};

module.exports = {
  submitTextEmotion,
  submitVoiceEmotion,
  submitFaceEmotion,
  submitSelfReport,
  fuseEmotions,
  getEmotionHistory,
};