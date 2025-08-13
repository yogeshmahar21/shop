// models/IpLoginAttempt.js
const mongoose = require("mongoose");

const ipLoginAttemptSchema = new mongoose.Schema({
    ip: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
    lastAttempt: { type: Date, default: Date.now,expires: 3600 }, // ⏱️ auto-delete after 1 hour
    createdAt: { type: Date, default: Date.now, expires: 7200 }, // ⏱️ auto-delete after 2 hours
});

module.exports = mongoose.model("IpLoginAttempt", ipLoginAttemptSchema);
