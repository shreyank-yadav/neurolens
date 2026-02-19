const mongoose = require("mongoose");

const riskLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalChecked: Number,
    negativeCount: Number,
    consecutiveNegative: Number,
    highConfidenceNegative: Number,
    riskScore: Number,
    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RiskLog", riskLogSchema);
