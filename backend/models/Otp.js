const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
   attempts: { type: Number, default: 0 }, // ✅ Track OTP attempts
  blockedUntil: { type: Date, default: null }, // ✅ Optional: add lockout
  lastSentAt: { type: Date }, // ✅ Add this here
  otpCountToday: { type: Number, default: 0 },
otpCountResetAt: { type: Date }, // When the daily counter resets

});

module.exports = mongoose.model("Otp", otpSchema);
