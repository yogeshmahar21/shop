const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { updateProfile,changePassword,checkEmail,checkMobile, checkUsername } = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");



router.put("/update-profile", protect, upload.single("profilePic"), updateProfile);
router.post("/change-password", protect, changePassword);
router.get("/check-email", checkEmail);
router.get("/check-mobile", checkMobile);
router.get("/check-username", checkUsername);
module.exports = router;
