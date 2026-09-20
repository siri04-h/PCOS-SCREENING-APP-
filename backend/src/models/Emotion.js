const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },

    source: {
      type: String,
      enum: [
        'text',
        'voice',
        'face',
        'self-report',
        'fused',
      ],
      required: true,
    },

    input: {
      type: String,
      default: null,
    },

    emotion: {
      type: String,
      default: null,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },

    resultId: {
      type: String,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

EmotionSchema = emotionSchema;

emotionSchema.index({
  user: 1,
  date: -1,
});

module.exports = mongoose.model('Emotion', emotionSchema);