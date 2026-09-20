const mongoose = require('mongoose');

const shapFeatureSchema = new mongoose.Schema(
  {
    feature: {
      type: String,
      required: true,
    },

    contribution: {
      type: Number,
      required: true,
    },

    direction: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral',
    },
  },
  {
    _id: false,
  }
);

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    riskLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      required: true,
    },

    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    shap: {
      type: [shapFeatureSchema],
      default: [],
    },

    modelVersion: {
      type: String,
      default: '1.0.0',
    },

    source: {
      type: String,
      enum: ['fastapi', 'manual', 'mock'],
      default: 'fastapi',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prediction', predictionSchema);