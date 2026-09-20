const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema(
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

    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    waterIntakeMl: {
      type: Number,
      min: 0,
    },

    foodCravings: {
      type: [String],
      default: [],
    },

    activityMinutes: {
      type: Number,
      min: 0,
    },

    energyLevel: {
      type: Number,
      min: 1,
      max: 5,
    },

    stressLevel: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

dailyLogSchema.index(
  { user: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model('DailyLog', dailyLogSchema);