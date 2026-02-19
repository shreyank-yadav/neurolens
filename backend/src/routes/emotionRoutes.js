const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { imageUpload, audioUpload } = require("../config/multer");

const {
  saveEmotion,
  saveVoiceEmotion,
  getEmotionHistory,
  getRiskScore,
  getRiskHistory,
  getStressScore,
  getDashboardData   // 👈 ADD THIS
} = require("../controllers/emotionController");


// =================================
// FACE EMOTION ROUTE
// =================================
router.post(
  "/save",
  protect,
  imageUpload.single("image"),
  saveEmotion
);


// =================================
// VOICE EMOTION ROUTE
// =================================
router.post(
  "/voice",
  protect,
  audioUpload.single("file"),
  saveVoiceEmotion
);


// =================================
// HISTORY ROUTE
// =================================
router.get("/history", protect, getEmotionHistory);


// =================================
// RISK ROUTES
// =================================
router.get("/risk", protect, getRiskScore);
router.get("/risk-history", protect, getRiskHistory);


// =================================
// STRESS ROUTE
// =================================
router.get("/stress", protect, getStressScore);


// =================================
// DASHBOARD ROUTE  ✅ ADD THIS
// =================================
router.get("/dashboard", protect, getDashboardData);


module.exports = router;
