const EmotionLog = require("../models/EmotionLog");
const RiskLog = require("../models/RiskLog");
const StressLog = require("../models/StressLog");

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");


// ================= SAVE FACE EMOTION =================
exports.saveEmotion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/detect-face",
      formData,
      { headers: formData.getHeaders() }
    );

    const { emotion, confidence } = aiResponse.data;

    const newLog = await EmotionLog.create({
      userId: req.user.id,
      emotion,
      confidence,
    });

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


// ================= SAVE VOICE EMOTION =================
exports.saveVoiceEmotion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/detect-voice",
      form,
      { headers: form.getHeaders() }
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
    console.error("Voice AI Error:", error.response?.data || error.message);
    res.status(500).json({ message: "AI Voice Service Error" });
  }
};


// ================= GET EMOTION HISTORY =================
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


// ================= RISK ENGINE =================
exports.getRiskScore = async (req, res) => {
  try {
    const logs = await EmotionLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(7);

    if (logs.length === 0) {
      return res.json({
        riskLevel: "Low",
        message: "No emotional data available",
      });
    }

    const negativeEmotions = ["sad", "angry", "fear", "disgust"];

    let negativeCount = 0;
    let highConfidenceNegative = 0;
    let consecutiveNegative = 0;

    for (let log of logs) {
      if (negativeEmotions.includes(log.emotion)) {
        negativeCount++;

        if (log.confidence >= 0.7) {
          highConfidenceNegative++;
        }

        consecutiveNegative++;
      } else {
        break;
      }
    }

    let riskScore =
      negativeCount * 2 +
      highConfidenceNegative * 3 +
      consecutiveNegative * 4;

    let riskLevel = "Low";

    if (riskScore >= 15) {
      riskLevel = "High";
    } else if (riskScore >= 7) {
      riskLevel = "Moderate";
    }

    await RiskLog.create({
      userId: req.user.id,
      totalChecked: logs.length,
      negativeCount,
      consecutiveNegative,
      highConfidenceNegative,
      riskScore,
      riskLevel,
    });

    res.json({
      totalChecked: logs.length,
      negativeCount,
      consecutiveNegative,
      highConfidenceNegative,
      riskScore,
      riskLevel,
    });

  } catch (error) {
    res.status(500).json({
      message: "Risk calculation error",
      error,
    });
  }
};


// ================= RISK HISTORY =================
exports.getRiskHistory = async (req, res) => {
  try {
    const risks = await RiskLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      totalRecords: risks.length,
      data: risks,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching risk history",
      error,
    });
  }
};


// ================= STRESS ENGINE =================
exports.getStressScore = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);

    const negativeEmotions = ["sad", "angry", "fear", "disgust"];

    const currentWeekLogs = await EmotionLog.find({
      userId: req.user.id,
      createdAt: { $gte: sevenDaysAgo },
    });

    const previousWeekLogs = await EmotionLog.find({
      userId: req.user.id,
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
    });

    const currentWeekNegative = currentWeekLogs.filter(log =>
      negativeEmotions.includes(log.emotion)
    ).length;

    const previousWeekNegative = previousWeekLogs.filter(log =>
      negativeEmotions.includes(log.emotion)
    ).length;

    let moodDropPercentage = 0;

    if (previousWeekNegative > 0) {
      moodDropPercentage =
        ((currentWeekNegative - previousWeekNegative) /
          previousWeekNegative) *
        100;
    }

    let stressIndex =
      currentWeekNegative * 2 +
      moodDropPercentage * 0.5;

    if (stressIndex < 0) stressIndex = 0;

    let stressLevel = "Low";

    if (stressIndex >= 15) {
      stressLevel = "High";
    } else if (stressIndex >= 7) {
      stressLevel = "Moderate";
    }

    await StressLog.create({
      userId: req.user.id,
      currentWeekNegative,
      previousWeekNegative,
      moodDropPercentage,
      stressIndex,
      stressLevel,
    });

    res.json({
      currentWeekNegative,
      previousWeekNegative,
      moodDropPercentage: moodDropPercentage.toFixed(2),
      stressIndex: stressIndex.toFixed(2),
      stressLevel,
    });

  } catch (error) {
    res.status(500).json({
      message: "Stress calculation error",
      error,
    });
  }
};



// unified dashboard api
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const latestEmotion = await EmotionLog.findOne({ userId })
      .sort({ createdAt: -1 });

    const latestRisk = await RiskLog.findOne({ userId })
      .sort({ createdAt: -1 });

    const latestStress = await StressLog.findOne({ userId })
      .sort({ createdAt: -1 });

    const totalLogs = await EmotionLog.countDocuments({ userId });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const negativeEmotions = ["sad", "angry", "fear", "disgust"];

    const last7DaysLogs = await EmotionLog.find({
      userId,
      createdAt: { $gte: sevenDaysAgo },
      emotion: { $in: negativeEmotions }
    });

    res.json({
      latestEmotion,
      latestRisk,
      latestStress,
      totalLogs,
      last7DaysNegative: last7DaysLogs.length
    });

  } catch (error) {
    res.status(500).json({ message: "Dashboard error", error });
  }
};

