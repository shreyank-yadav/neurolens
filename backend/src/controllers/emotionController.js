const EmotionLog = require("../models/EmotionLog");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

// ================= SAVE EMOTION (REAL IMAGE PIPELINE) =================
exports.saveEmotion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Create form-data for AI service
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    // Send image to AI service
    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/detect-face",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const { emotion, confidence } = aiResponse.data;

    // Save to database
    const newLog = await EmotionLog.create({
      userId: req.user.id,
      emotion,
      confidence,
    });

    // Delete uploaded image from backend
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: "Emotion detected from real image & saved",
      data: newLog,
    });

  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    res.status(500).json({ message: "AI Service Error" });
  }
};

// ================= GET HISTORY =================
exports.getEmotionHistory = async (req, res) => {
  try {
    const logs = await EmotionLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      count: logs.length,
      data: logs,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// ================= RISK SCORE =================
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
    res.status(500).json({ message: "Server error" });
  }
};



// ==============================
// VOICE EMOTION SAVE
// ==============================
exports.saveVoiceEmotion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    const FormData = require("form-data");
    const fs = require("fs");
    const axios = require("axios");
    const EmotionLog = require("../models/EmotionLog");

    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/detect-voice",
      form,
      {
        headers: form.getHeaders(),
      }
    );

    const { emotion, confidence } = aiResponse.data;

    const newLog = await EmotionLog.create({
      userId: req.user.id,
      emotion,
      confidence,
    });

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: "Voice emotion detected & saved",
      data: newLog,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI Voice Service Error" });
  }
};
