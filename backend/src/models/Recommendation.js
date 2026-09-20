const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    basedOn: {
      type: [String],
      default: [],
    },

    type: {
      type: String,
      enum: [
        'sleep',
        'activity',
        'stress',
        'nutrition',
        'general',
      ],
      default: 'general',
    },

    source: {
      type: String,
      enum: ['member4', 'system', 'mock'],
      default: 'mock',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'Recommendation',
  recommendationSchema
);