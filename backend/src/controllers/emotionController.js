const EmotionLog = require("../models/EmotionLog");
const axios = require("axios");

// Save Emotion (Now calls AI service)
exports.saveEmotion = async (req, res) => {
  try {
    // Call AI Service
    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/detect-face",
      {
        dummy_input: "test"
      }
    );

    const { emotion, confidence } = aiResponse.data;

    // Save to DB
    const newLog = await EmotionLog.create({
      userId: req.user.id,
      emotion,
      confidence,
    });

    res.status(201).json({
      message: "Emotion detected & saved successfully",
      data: newLog,
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "AI Service Error" });
  }
};



// Get Emotion History
exports.getEmotionHistory = async (req, res) => {
  try {
    const logs = await EmotionLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      count: logs.length,
      data: logs,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



// Calculate Risk Score
exports.getRiskScore = async (req, res) => {
  try {
    const logs = await EmotionLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    let negativeCount = 0;

    logs.forEach(log => {
      if (log.emotion === "sad" || log.emotion === "angry") {
        negativeCount++;
      }
    });

    let riskLevel = "Low";

    if (negativeCount >= 3) {
      riskLevel = "High";
    } else if (negativeCount >= 1) {
      riskLevel = "Moderate";
    }

    res.json({
      lastFiveRecords: logs.length,
      negativeCount,
      riskLevel
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
