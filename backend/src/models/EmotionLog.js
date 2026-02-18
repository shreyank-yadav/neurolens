const mongoose = require("mongoose");

const emotionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emotion: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmotionLog", emotionLogSchema);
