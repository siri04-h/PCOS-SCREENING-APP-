const mongoose = require("mongoose");

const healthProfileSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
    },
    heightCm: {
      type: Number,
    },
    weightKg: {
      type: Number,
    },
    avgCycleLength: {
      type: Number,
    },
    avgPeriodLength: {
      type: Number,
    },
    pcosFamilyHistory: {
      type: String,
      enum: ["yes", "no", "unsure"],
      default: "unsure",
    },
    knownConditions: {
      type: [String],
      default: [],
    },
    symptomsChecklist: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    onboarded: {
      type: Boolean,
      default: false,
    },

    healthProfile: {
      type: healthProfileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);