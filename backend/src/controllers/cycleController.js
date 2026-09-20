const Cycle = require('../models/Cycle');

const logPeriod = async (req, res) => {
  try {
    const { startDate, endDate, flow, symptoms } = req.body;

    if (!startDate) {
      return res.status(400).json({
        message: 'Start date is required',
      });
    }

    const cycle = await Cycle.findOneAndUpdate(
      {
        user: req.user._id,
        startDate: new Date(startDate),
      },
      {
        user: req.user._id,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        flow,
        symptoms: symptoms || [],
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(201).json({ cycle });
  } catch (error) {
    console.error('Log period error:', error);

    res.status(500).json({
      message: 'Server error while logging period',
    });
  }
};

const getCycles = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const query = { user: req.user._id };

    if (req.query.before) {
      query.startDate = { $lt: new Date(req.query.before) };
    }

    const cycles = await Cycle.find(query)
      .sort({ startDate: -1 })
      .limit(limit);

    // Add lengthDays for frontend
    const formattedCycles = cycles.map((cycle) => {
      const start = new Date(cycle.startDate);
      const end = cycle.endDate ? new Date(cycle.endDate) : start;

      const lengthDays =
        Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

      return {
        ...cycle.toObject(),
        lengthDays,
      };
    });

    res.status(200).json({
      cycles: formattedCycles,
    });
  } catch (error) {
    console.error('Get cycles error:', error);
    res.status(500).json({
      message: 'Server error while fetching cycles',
    });
  }
};

const updateCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cycle) {
      return res.status(404).json({
        message: 'Cycle not found',
      });
    }

    const { startDate, endDate, flow, symptoms } = req.body;

    if (startDate !== undefined) cycle.startDate = startDate;
    if (endDate !== undefined) cycle.endDate = endDate;
    if (flow !== undefined) cycle.flow = flow;
    if (symptoms !== undefined) cycle.symptoms = symptoms;

    await cycle.save();

    res.status(200).json({ cycle });
  } catch (error) {
    console.error('Update cycle error:', error);
    res.status(500).json({
      message: 'Server error while updating cycle',
    });
  }
};

const getCycleSummary = async (req, res) => {
  try {
    const cycles = await Cycle.find({
      user: req.user._id,
    }).sort({ startDate: -1 });

    if (cycles.length === 0) {
      return res.status(200).json({
        currentCycleDay: null,
        predictedNextPeriod: null,
        avgCycleLength: null,
        avgPeriodLength: null,
      });
    }

    const cycleLengths = [];

    for (let i = 0; i < cycles.length - 1; i++) {
      const currentStart = new Date(cycles[i].startDate);
      const previousStart = new Date(cycles[i + 1].startDate);

      const diff =
        Math.round(
          (currentStart - previousStart) /
            (1000 * 60 * 60 * 24)
        );

      if (diff > 0) cycleLengths.push(diff);
    }

    const periodLengths = cycles
      .filter((c) => c.startDate && c.endDate)
      .map((c) => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);

        return (
          Math.round(
            (end - start) /
              (1000 * 60 * 60 * 24)
          ) + 1
        );
      });

    const avgCycleLength =
      cycleLengths.length > 0
        ? Math.round(
            cycleLengths.reduce((a, b) => a + b, 0) /
              cycleLengths.length
          )
        : 28;

    const avgPeriodLength =
      periodLengths.length > 0
        ? Math.round(
            periodLengths.reduce((a, b) => a + b, 0) /
              periodLengths.length
          )
        : 5;

    const latestStart = new Date(cycles[0].startDate);
    const today = new Date();

    latestStart.setHours(12, 0, 0, 0);
    today.setHours(12, 0, 0, 0);

    const currentCycleDay =
      Math.floor(
        (today - latestStart) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    const nextPeriod = new Date(latestStart);
    nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength);

    const predictedNextPeriod =
      `${nextPeriod.getFullYear()}-${String(nextPeriod.getMonth() + 1).padStart(2, '0')}-${String(nextPeriod.getDate()).padStart(2, '0')}`;

    res.status(200).json({
      currentCycleDay,
      predictedNextPeriod,
      avgCycleLength,
      avgPeriodLength,
    });
  } catch (error) {
    console.error('Cycle summary error:', error);
    res.status(500).json({
      message: 'Server error while calculating cycle summary',
    });
  }
};

module.exports = {
  logPeriod,
  getCycles,
  updateCycle,
  getCycleSummary,
};