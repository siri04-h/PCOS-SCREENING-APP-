const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema(
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

    symptoms: {
      type: [String],
      default: [],
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

symptomSchema.index({
  user: 1,
  date: -1,
});

module.exports = mongoose.model('Symptom', symptomSchema);