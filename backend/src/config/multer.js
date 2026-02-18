const multer = require("multer");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Image filter
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Audio filter
const audioFilter = (req, file, cb) => {
  if (
    file.mimetype === "audio/wav" ||
    file.mimetype === "audio/x-wav" ||
    file.mimetype === "audio/wave"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only WAV audio files are allowed"), false);
  }
};

// Export two upload middlewares
exports.imageUpload = multer({
  storage,
  fileFilter: imageFilter
});

exports.audioUpload = multer({
  storage,
  fileFilter: audioFilter
});
