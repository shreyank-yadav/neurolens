const mongoose = require("mongoose");

const stressLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentWeekNegative: {
      type: Number,
      required: true,
    },
    previousWeekNegative: {
      type: Number,
      required: true,
    },
    moodDropPercentage: {
      type: Number,
      required: true,
    },
    stressIndex: {
      type: Number,
      required: true,
    },
    stressLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StressLog", stressLogSchema);
