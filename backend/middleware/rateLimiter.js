// middlewares/rateLimiter.js
const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs:  15 * 60 * 1000, // ⏰ 15 minutes
  max: 12, // ⛔ Limit each IP to 5 login requests per windowMs
  message: {
    message: "Too many login attempts, please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
