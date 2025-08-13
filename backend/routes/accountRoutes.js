const express = require("express");
const router = express.Router();
const {
  getUserSessions,
  logoutFromDevice,
  logoutFromAllDevices,
} = require("../controllers/accountController");
const { protect } = require("../middleware/authMiddleware");

// 🧠 Protect all these routes with JWT auth middleware
router.get("/sessions", protect, getUserSessions); // Get all logged-in devices
router.delete("/sessions/:id", protect, logoutFromDevice); // Logout from one device
router.delete("/sessions", protect, logoutFromAllDevices); // Logout from all devices

module.exports = router;
