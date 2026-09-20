const DailyLog = require("../models/DailyLog");

// Save or update today's check-in
const submitDailyLog = async (req, res) => {
  try {
    const {
      date,
      sleepHours,
      waterIntakeMl,
      foodCravings,
      physicalSymptoms,
      activityMinutes,
      energyLevel,
      stressLevel,
    } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    // Normalize to start of day
    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    const dailyLog = await DailyLog.findOneAndUpdate(
      {
        user: req.user._id,
        date: logDate,
      },
      {
        user: req.user._id,
        date: logDate,
        sleepHours,
        waterIntakeMl,
        foodCravings: foodCravings || [],
        physicalSymptoms: physicalSymptoms || [],
        activityMinutes,
        energyLevel,
        stressLevel,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Daily check-in saved successfully",
      dailyLog,
    });
  } catch (error) {
    console.error("Submit daily log error:", error);

    res.status(500).json({
      message: "Server error while saving daily log",
    });
  }
};

// Get one day's check-in
const getDailyLog = async (req, res) => {
  try {
    const { date } = req.params;

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    const dailyLog = await DailyLog.findOne({
      user: req.user._id,
      date: logDate,
    });

    if (!dailyLog) {
      return res.status(404).json({
        message: "Daily log not found",
      });
    }

    res.status(200).json({
      dailyLog,
    });
  } catch (error) {
    console.error("Get daily log error:", error);

    res.status(500).json({
      message: "Server error while fetching daily log",
    });
  }
};

// Get history
const getDailyLogHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 30, 100);

    const dailyLogs = await DailyLog.find({
      user: req.user._id,
    })
      .sort({ date: -1 })
      .limit(limit);

    res.status(200).json({
      dailyLogs,
    });
  } catch (error) {
    console.error("Get daily log history error:", error);

    res.status(500).json({
      message: "Server error while fetching daily log history",
    });
  }
};

module.exports = {
  submitDailyLog,
  getDailyLog,
  getDailyLogHistory,
};