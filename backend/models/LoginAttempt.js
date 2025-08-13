const mongoose = require("mongoose");

const loginAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true , unique: true },
  count: { type: Number, default: 0 },
  lastAttempt: { type: Date, default: Date.now, expires: 900 }, // ⏱️ auto-delete after 30 mins
   createdAt: { type: Date, default: Date.now, expires: 1800 }, // ⏱️ auto-delete after 30 mins
});

module.exports = mongoose.model("LoginAttempt", loginAttemptSchema);