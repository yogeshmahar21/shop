const mongoose = require("mongoose");

const ipLimitSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  attempts: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("IpLimit", ipLimitSchema);
