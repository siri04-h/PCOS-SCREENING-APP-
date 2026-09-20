const Symptom = require('../models/Symptom');

const logSymptoms = async (req, res) => {
  try {
    const {
      date,
      symptoms,
      notes,
    } = req.body;

    if (!date) {
      return res.status(400).json({
        message: 'Date is required',
      });
    }

    const symptomLog = await Symptom.create({
      user: req.user._id,
      date: new Date(date),
      symptoms: symptoms || [],
      notes,
    });

    res.status(201).json({
      symptomLog,
    });
  } catch (error) {
    console.error('Log symptoms error:', error);

    res.status(500).json({
      message: 'Server error while saving symptoms',
    });
  }
};

const getSymptomHistory = async (req, res) => {
  try {
    const limit = Math.min(
      parseInt(req.query.limit) || 30,
      100
    );

    const symptomLogs = await Symptom.find({
      user: req.user._id,
    })
      .sort({ date: -1 })
      .limit(limit);

    res.status(200).json({
      symptomLogs,
    });
  } catch (error) {
    console.error('Get symptom history error:', error);

    res.status(500).json({
      message: 'Server error while fetching symptoms',
    });
  }
};

module.exports = {
  logSymptoms,
  getSymptomHistory,
};