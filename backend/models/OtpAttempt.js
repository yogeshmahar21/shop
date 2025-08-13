const mongoose = require("mongoose");

const otpAttemptSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 1800 }, // auto-delete after 30 min
  attempts: { type: Number, default: 1 },
});

module.exports = mongoose.model("OtpAttempt", otpAttemptSchema);
