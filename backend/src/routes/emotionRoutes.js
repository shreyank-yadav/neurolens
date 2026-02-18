const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { saveEmotion, getEmotionHistory , getRiskScore } = require("../controllers/emotionController");


router.post("/save", protect, saveEmotion);
router.get("/history", protect, getEmotionHistory);
router.get("/risk", protect, getRiskScore);


module.exports = router;
