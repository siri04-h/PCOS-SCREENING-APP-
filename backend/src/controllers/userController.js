const User = require("../models/User");

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error while fetching profile",
    });
  }
};

const updateHealthProfile = async (req, res) => {
  try {
    console.log("Health Profile Request:", req.body);
    console.log("Logged-in User:", req.user);
    const {
      age,
      heightCm,
      weightKg,
      avgCycleLength,
      avgPeriodLength,
      pcosFamilyHistory,
      knownConditions,
      symptomsChecklist,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        healthProfile: {
          age,
          heightCm,
          weightKg,
          avgCycleLength,
          avgPeriodLength,
          pcosFamilyHistory,
          knownConditions,
          symptomsChecklist,
        },
        onboarded: true,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      message: "Health profile updated successfully",
      healthProfile: user.healthProfile,
      user,
    });
  } catch (error) {
    console.error("Update health profile error:", error);

    res.status(500).json({
      message: "Server error while updating health profile",
    });
  }
};

module.exports = {
  getMe,
  updateHealthProfile,
};