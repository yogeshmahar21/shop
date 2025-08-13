const { decode } = require("jsonwebtoken");
const User = require("../models/User");
const TempUser = require("../models/TempUser");
const bcrypt = require("bcrypt");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendEmailOTP");
const otpStore = {}; // You can replace this with a DB or Redis
const LoginAttempt = require("../models/LoginAttempt");
const RefreshToken = require("../models/RefreshToken");
const IpLoginAttempt = require("../models/IpLoginAttempt");
const ms = require("ms");

function capitalizeFirstLetter(str) {
    if (!str) return "";
    ``;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const refreshTokenExpireMs = ms(process.env.REFRESH_TOKEN_EXPIRE || "7d");
const accessTokenExpireMs = ms(process.env.ACCESS_TOKEN_EXPIRE || "20m");

const MAX_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10);
const BLOCK_TIME = parseInt(process.env.LOGIN_BLOCK_TIME, 10);
const MAX_ATTEMPTS_PER_IP = parseInt(process.env.MAX_LOGIN_ATTEMPTS_PER_IP, 10);
const IP_BLOCK_TIME = parseInt(process.env.IP_LOGIN_BLOCK_TIME, 10);



// At the top of your authController.js or in a separate utils file
const generateUniqueUsername = async (name) => {
    const base = name.toLowerCase().replace(/\s+/g, "");
    let username;
    let isUnique = false;

    while (!isUnique) {
        const random = Math.floor(1000 + Math.random() * 9000);
        username = `${base}${random}`;

        const existingUser = await User.findOne({ userName: username });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return username;
};

// @desc    Register user
exports.registerUser = async (req, res) => {
    let { name, email, isSeller, mobile, countryCode } = req.body;
    console.log("temp mao ", name, email, isSeller, mobile, countryCode);
    try {
         const userAgent = req.headers["user-agent"];
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const tempUser = await TempUser.findOne({ email });
        if (!tempUser) {
            return res.status(400).json({
                message: "Signup session expired. Please signup again.",
                redirect: "/auth/signup",
            });
        }
        // console.log("tem user is ths ", tempUser);
        const existingUserEmail = await User.findOne({ email });
        const existingUserMobile = await User.findOne({ mobile });
        if (existingUserMobile) {
            return res
                .status(400)
                .json({ message: "This mobile no. already is in use." });
        }
        if (existingUserEmail) {
            return res
                .status(400)
                .json({ message: "User already exists with this email." });
        }
        name = capitalizeFirstLetter(name);
        const randomImage = `/random/user${Math.floor(
            Math.random() * 13 + 1
        )}.jpg`;
        const userName = await generateUniqueUsername(name);
        const user = await User.create({
            name,
            email,
            userName,
            password: tempUser.password,
            isSeller: isSeller || false,
            profilePic: randomImage,
            mobile,
            countryCode,
        });
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);


        await RefreshToken.create({
            userId: user._id,
            token: hashedRefreshToken,
            ip,
            userAgent,
            expiresAt: new Date(Date.now() + refreshTokenExpireMs),
        });

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:  accessTokenExpireMs, // 20 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: refreshTokenExpireMs, // 7 days
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isSeller: user.isSeller,
            profilePic: user.profilePic,
            mobile: user.mobile,
            countryCode: user.countryCode,
            userName: user.userName,
            specializedIn: user.specializedIn,
        });
    } catch (err) {
        console.log("this is error ", err);
        res.status(500).json({
            message: "Registration failed Please try again.",
            err,
        });
    }
};

// @desc    Login user
exports.checkNumberEmail = async (req, res) => {
    let { name, email, password, isSeller, mobile, countryCode } = req.body;

    try {
        const existingUserEmail = await User.findOne({ email });
        const existingUserMobile = await User.findOne({ mobile });
        if (existingUserMobile) {
            return res
                .status(400)
                .json({ message: "This mobile no. already is in use." });
        }
        if (existingUserEmail) {
            return res
                .status(400)
                .json({ message: "User already exists with this email." });
        }
        return res
            .status(200)
            .json({ message: "Email and mobile are available." });
    } catch (err) {
        console.log("this is error ", err);
        res.status(500).json({
            message: "Failed to signup try again later.",
            err,
        });
    }
};
exports.loginUser = async (req, res) => {
    const { email, password, forceLogin } = req.body;
    console.log("user", email, password);
    // const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // const userAgent = req.headers["user-agent"];
    // console.log('token is ',refreshTokenExpireMs, accessTokenExpireMs);
    try {
        const userAgent = req.headers["user-agent"];
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        // ✅ 1. IP Login Attempt Protection
        const ipAttempt = await IpLoginAttempt.findOne({ ip });
        if (
            ipAttempt &&
            ipAttempt.count >= MAX_ATTEMPTS_PER_IP &&
            Date.now() - ipAttempt.lastAttempt < IP_BLOCK_TIME
        ) {
            const wait = Math.ceil(
                (IP_BLOCK_TIME - (Date.now() - ipAttempt.lastAttempt)) / 60000
            );
            return res.status(429).json({
                message: `Access temporarily blocked due to multiple failed attempts. Try again after ${wait} minute(s).`,
            });
        }

        const attempt = await LoginAttempt.findOne({ email });

        if (
            attempt &&
            attempt.count >= MAX_ATTEMPTS &&
            Date.now() - attempt.lastAttempt < BLOCK_TIME
        ) {
            const timeLeft = Math.ceil(
                (BLOCK_TIME - (Date.now() - attempt.lastAttempt)) / 60000
            );
            return res.status(429).json({
                message: `Too many failed attempts. Please wait ${timeLeft} minute(s) before trying again.`,
            });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            await recordFailedAttempt(email,ip);
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        await LoginAttempt.deleteOne({ email });
        await IpLoginAttempt.deleteOne({ ip });

        const sessionCount = await RefreshToken.countDocuments({
            userId: user._id,
        });

        if (sessionCount >= 5 && !forceLogin) {
            return res.status(409).json({
                message: "You are already logged in on 5 devices.",
                sessionLimit: true,
            });
        }

        // 🔄 If session limit exceeded and forceLogin is true, remove oldest session
        if (sessionCount >= 5 && forceLogin) {
            const oldestSession = await RefreshToken.findOne({
                userId: user._id,
            }).sort({ createdAt: 1 }); // sort by oldest
            if (oldestSession) await oldestSession.deleteOne();
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);


        await RefreshToken.create({
            userId: user._id,
            token: hashedRefreshToken,
            ip,
            userAgent,
            expiresAt: new Date(Date.now() + refreshTokenExpireMs), // 7 days
        });

        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:  accessTokenExpireMs, // 20 minutes
            path: "/", // 👈 ADD THIS
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:refreshTokenExpireMs, // 7 days
            path: "/api/auth/refresh-token", // 👈 ADD THIS
            // path: "/api/", // 👈 ADD THIS
        });
        // console.log("this is access token inlogin ", accessToken);
        // console.log("this is refresh token inlogin ", refreshToken);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            mobile: user.mobile,
            countryCode: user.countryCode,
            gender: user.gender,
            isSeller: user.isSeller,
            userName: user.userName,
            specializedIn: user.specializedIn,
        });
    } catch (err) {
        console.error("❌ Login error:",err.message);
        res.status(500).json({ message: "Login failed ", error: err.message });
    }
};
// Helper to track failed attempts
async function recordFailedAttempt(email, ip) {
    // 🔒 Email-based attempt tracking
    const emailAttempt = await LoginAttempt.findOne({ email });
    if (!emailAttempt) {
        await LoginAttempt.create({ email, count: 1, lastAttempt: Date.now() });
    } else {
        emailAttempt.count += 1;
        emailAttempt.lastAttempt = Date.now();
        await emailAttempt.save();
    }

    // 🔒 IP-based attempt tracking
    const ipAttempt = await IpLoginAttempt.findOne({ ip });
    if (!ipAttempt) {
        await IpLoginAttempt.create({ ip, count: 1, lastAttempt: Date.now() });
    } else {
        ipAttempt.count += 1;
        ipAttempt.lastAttempt = Date.now();
        await ipAttempt.save();
    }
}
// @access Public

// exports.logoutUser = async (req, res) => {
//     try {
//         const refreshToken = req.cookie.refreshToken;

//         if (refreshToken) {
//             // Decode the token to find the user ID (do NOT throw on error)
//             const decoded = jwt.decode(refreshToken);
//             if (decoded && decoded.id) {
//                 // Remove all refresh tokens for this user (or just one if you support device-based)
//                 await RefreshToken.deleteMany({ userId: decoded.id });
//             }
//         }

//         res.clearCookie("token", {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict",
//             path: "/",
//         });

//         res.clearCookie("refreshToken", {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict",
//             path: "/api/auth/refresh-token",
//         });

//         return res.status(200).json({ message: "Logged out" });
//     } catch (err) {
//         console.error("❌ Logout error:", err.message);
//         return res
//             .status(500)
//             .json({ message: "Logout failed", error: err.message });
//     }
// };
// Logout from all devices (delete all refresh tokens for user)
exports.logoutFromAllDevices = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken; // ✅ correctly access refresh token
        console.log("🔑 This is refresh token in logout all:", req.cookies);

        if (!refreshToken) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const decoded = jwt.decode(refreshToken); // ✅ now this is safe

        // console.log("thsi is decoded in logout all ", decoded);
        if (!decoded || !decoded.id) {
            return res.status(403).json({ message: "Invalid token" });
        }

        await RefreshToken.deleteMany({ userId: decoded.id }); // 🔥 Clear all sessions

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh-token",
        });

        return res.status(200).json({ message: "Logged out from all devices" });
    } catch (err) {
        console.error("❌ Logout all error:", err.message);
        return res
            .status(500)
            .json({ message: "Logout all failed", error: err.message });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log("this is refresh token in logout ", req.cookies);
        const logoutAll = req.query.all === "true"; // /logout?all=true → logs out from all devices
        if (refreshToken) {
            let decoded;

            try {
                decoded = jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_SECRET
                );
            } catch (err) {
                console.warn(
                    "⚠️ Refresh token invalid during logout (still clearing cookies)"
                );
            }

            if (decoded && decoded.id) {
                if (logoutAll) {
                    // 🔐 Global logout: Remove all sessions for this user
                    await RefreshToken.deleteMany({ userId: decoded.id });
                } else {
                    // 🔐 Device-specific logout
                    const ip =
                        req.headers["x-forwarded-for"] ||
                        req.socket.remoteAddress ||
                        req.ip;
                    const userAgent = req.get("user-agent");
                    await RefreshToken.deleteOne({
                        userId: decoded.id,
                        ip,
                        userAgent,
                    });
                }
            }
        }

        // 🧹 Clear both access and refresh tokens from cookies
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh-token",
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("❌ Logout error:", err.message);
        return res
            .status(500)
            .json({ message: "Logout failed", error: err.message });
    }
};

// check user logged in or not
exports.checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("❌ checkAuth error:", error.name, error.message); // Logs TokenExpiredError etc.

        // Optional: differentiate token errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired" });
        }

        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

exports.refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const storedTokens = await RefreshToken.find({ userId: decoded.id });
        if (!storedTokens.length) {
            return res
                .status(403)
                .json({ message: "Refresh token not recognized" });
        }

        const currentIp =
            req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const currentUserAgent = req.get("User-Agent");

        let valid = false;
        for (const record of storedTokens) {
            const match = await bcrypt.compare(token, record.token);
            const ipMatches = record.ip === currentIp;
            const uaMatches = record.userAgent === currentUserAgent;

            if (match && ipMatches && uaMatches) {
                valid = record;
                break;
            }
        }

        if (!valid) {
            return res.status(403).json({ message: "Refresh token invalid" });
        }

        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id); // ⬅️ Rotation
        const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

        await RefreshToken.deleteOne({ _id: valid._id });

        await RefreshToken.create({
            userId: decoded.id,
            token: hashedNewRefreshToken,
            ip: req.ip,
            userAgent: req.get("User-Agent"),
            expiresAt: new Date(Date.now() + refreshTokenExpireMs),
        });

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:  accessTokenExpireMs, // 20 minutes
            path: "/",
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: refreshTokenExpireMs, // 7 days
            path: "/api/auth/refresh-token",
        });
        const user = await User.findById(decoded.id).select("-password");
        // res.status(200).json({
        //     message: "Token refreshed",
        // token: newAccessToken,
        //     user,
        // });
        // console.log("this is NEW ACCESS TOKEN access token ", newAccessToken);
        // console.log(
        //     "this is  nEW REFRESH TOKEN refresh token ",
        //     newRefreshToken
        // );
        res.status(200).json({ message: "Token refreshed", user });
    } catch (err) {
        console.log("🔴 Refresh token error:", err.name); // Add this for visibility
        if (err.name === "TokenExpiredError") {
            // Clear expired cookies
            res.clearCookie("token");
            res.clearCookie("refreshToken", {
                path: "/api/auth/refresh-token",
            });

            return res.status(403).json({
                message: "Refresh token expired. Please log in again.",
            });
        }

        return res
            .status(403)
            .json({ message: "Invalid or expired refresh token" });
    }
};

exports.autoCleanup = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            let decoded;
            try {
                decoded = jwt.decode(refreshToken); // use decode, not verify (token is expired)
            } catch (err) {
                console.warn("⚠️ Cannot decode expired refresh token");
            }

            if (decoded && decoded.id) {
                const ip = req.ip;
                const userAgent = req.get("user-agent");

                // Only remove the token matching current device
                await RefreshToken.deleteOne({
                    userId: decoded.id,
                    ip,
                    userAgent,
                });
            }
        }

        // ✅ Clear cookies
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/api/auth/refresh-token",
        });

        return res.status(200).json({ message: "Expired token cleaned up" });
    } catch (err) {
        console.error("❌ Auto cleanup error:", err.message);
        return res
            .status(500)
            .json({ message: "Cleanup failed", error: err.message });
    }
};

// GET /api/auth/profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("thisis forgot memail", email);
    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("user not fouund in db");
            return res.status(200).json({
                message: "An OTP has been sent if this email is registered.",
                exist: false,
                name: "User",
            });
        }
        return res.status(200).json({
            message: "An OTP has been sent if this email is registered.",
            exist: true,
            name: user.name || "User",
        });

        // return res.status(200).json({
        //     message: "An OTP has been sent if email is registered. ",
        // });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong try again later.",
            exist: false,
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res
                .status(400)
                .json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res
            .status(200)
            .json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// exports.refreshToken = (req, res) => {
//   const token = req.cookies.refreshToken;
//   if (!token) return res.status(401).send("No refresh token.");

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//     const newAccessToken = generateAccessToken(decoded.id);
//     res
//       .cookie("accessToken", newAccessToken, {
//         httpOnly: true, secure: true, sameSite: "Strict", maxAge: 15 * 60 * 1000
//       })
//       .sendStatus(200);
//   } catch (err) {
//     res.status(401).send("Refresh token invalid.");
//   }
// };
// exports.getUserByEmail = async (req, res) => {
//     const { email } = req.query;
//     try {
//         if (!email)
//             return res.status(400).json({ message: "Email is required" });

//         const user = await User.findOne({ email }).select("-password");
//         if (!user) return res.status(404).json({ message: "User not found" });

//         res.status(200).json(user);
//     } catch (err) {
//         res.status(500).json({
//             message: "Error fetching user",
//             error: err.message,
//         });
//     }
// };
