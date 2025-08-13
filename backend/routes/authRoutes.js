const express = require('express');
const router = express.Router();
const { registerUser, loginUser,refreshToken,getUserProfile,logoutFromAllDevices, logoutUser,autoCleanup ,checkAuth,getUserByEmail,forgotPassword ,resetPassword, checkNumberEmail } = require('../controllers/authController');
// const { verifyAccessToken } = require("../middleware/authMiddleware");
const { protect } = require("../middleware/authMiddleware");
const sendOtpEmail = require('../utils/sendEmailOTP');
const crypto = require('crypto');
const { loginLimiter }  = require("../middleware/rateLimiter")
let otpStore = {}; // Temporary store (use DB/Redis in production)

// router.get("/by-email", getUserByEmail);
router.post('/register', registerUser);
router.post('/check-email-mobile', checkNumberEmail);
// router.post('/login',loginLimiter, loginUser);
router.post('/login', loginUser);
router.post("/logout", logoutUser);
router.post("/logout-all", logoutFromAllDevices);

router.get("/check-auth", checkAuth); 
router.get("/refresh-token", refreshToken);
router.get("/auto-cleanup", autoCleanup);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword );
// router.get("/refresh", refreshToken);

router.get("/profile", protect, getUserProfile);
// route: GET /api/users/me
router.get("/me", protect, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});

// router.post("/logout", logout);
// router.get("/profile", verifyAccessToken, getProfile);


module.exports = router;
