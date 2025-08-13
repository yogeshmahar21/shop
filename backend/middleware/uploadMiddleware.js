const multer = require("multer");
const path = require("path");

// Set storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/profilePics"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }); 

module.exports = upload;
