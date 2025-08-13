const jwt = require("jsonwebtoken");

// Generate Access Token (short-lived)
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "20m", // ⏱ uses .env
    });
};

// Generate Refresh Token (long-lived)
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d", // ⏱ uses .env
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
