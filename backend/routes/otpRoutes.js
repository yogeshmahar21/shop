const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, resendOtp } = require("../controllers/otpController");

router.post("/send-otp", sendOtp);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
 