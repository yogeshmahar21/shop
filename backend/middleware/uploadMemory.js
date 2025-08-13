const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // limit to 50MB per file (adjust if needed)
  },
});

module.exports = upload;
