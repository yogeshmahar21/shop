// GET /api/account/sessions
const RefreshToken = require("../models/RefreshToken");

exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id; // comes from your auth middleware
    const sessions = await RefreshToken.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(sessions.map(session => ({
      id: session._id,
      ip: session.ip,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    })));
  } catch (err) {
    console.error("❌ Failed to fetch sessions:", err.message);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

// DELETE /api/account/sessions/:id
exports.logoutFromDevice = async (req, res) => {
  const userId = req.user.id;
  const sessionId = req.params.id;

  const session = await RefreshToken.findOne({ _id: sessionId, userId });
  if (!session) return res.status(404).json({ message: "Session not found" });

  await session.deleteOne();
  res.status(200).json({ message: "Logged out from device" });
};

// DELETE /api/account/sessions
exports.logoutFromAllDevices = async (req, res) => {
  const userId = req.user.id;
  await RefreshToken.deleteMany({ userId });
  res.clearCookie("token", { path: "/" });
  res.clearCookie("refreshToken", { path: "/api/auth/refresh-token" });
  res.status(200).json({ message: "Logged out from all devices" });
};

