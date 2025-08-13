const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true, // Store hashed refresh token
    },
    expiresAt: {
        type: Date,
        required: true, // For expiration logic
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    ip: {
        type: String,
        default: "unknown", // Optional: track IP address
    },
    userAgent: {
        type: String,
        default: "unknown", // Optional: track browser/device
    },
});

// ✅ Automatically delete expired tokens using MongoDB TTL
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
