const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// 👇 Import separated upload middlewares
const { imageUpload, audioUpload } = require("../config/multer");

const {
  saveEmotion,
  saveVoiceEmotion,
  getEmotionHistory,
  getRiskScore
} = require("../controllers/emotionController");


// =================================
// FACE EMOTION ROUTE
// =================================
router.post(
  "/save",
  protect,
  imageUpload.single("image"),   // image key
  saveEmotion
);


// =================================
// VOICE EMOTION ROUTE
// =================================
router.post(
  "/voice",
  protect,
  audioUpload.single("file"),    // file key
  saveVoiceEmotion
);


// =================================
// HISTORY + RISK
// =================================
router.get("/history", protect, getEmotionHistory);
router.get("/risk", protect, getRiskScore);


module.exports = router;
