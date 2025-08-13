const crypto = require("crypto");
const Otp = require("../models/Otp");
const path = require("path");
const sendOtpEmail = require("../utils/sendEmailOTP");
const axios = require("axios");
const UAParser = require("ua-parser-js");
const OtpAttempt = require("../models/OtpAttempt");
const IpLimit = require("../models/IpLimit"); // ✅ Import this
const bcrypt = require("bcryptjs");
const TempUser = require("../models/TempUser"); // adjust path as needed
const User = require("../models/User"); // adjust path as needed

function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    const rawIp = forwarded
        ? forwarded.split(",")[0]
        : req.socket.remoteAddress;
    return rawIp.startsWith("::ffff:") ? rawIp.replace("::ffff:", "") : rawIp;
}

function getDeviceInfo(userAgent) {
    const parser = new UAParser(userAgent);
    const os = parser.getOS(); // { name: 'Android', version: '10' }
    const browser = parser.getBrowser(); // { name: 'Chrome', version: '136.0.0.0' }
    return `${os.name} ${os.version} (${browser.name} ${browser.version})`;
}

async function getLocationFromIp(ip) {
    try {
        // Handle IPv6-style local IP (e.g., ::ffff:192.168.0.1)
        const cleanIp = ip.replace("::ffff:", "");

        // Don't call API if IP is local
        const isLocal =
            cleanIp.startsWith("192.") ||
            cleanIp.startsWith("127.") ||
            cleanIp === "::1";
        if (isLocal) return "Local Network";

        const { data } = await axios.get(`http://ip-api.com/json/${cleanIp}`);
        if (data.status === "success") {
            return `${data.city}, ${data.regionName}, ${data.country}`;
        }
        return "Unknown";
    } catch (err) {
        return "Unknown";
    }
}

exports.resendOtp = async (req, res) => {
    const { email, name, type } = req.body;
    const now = new Date();

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    const ip = getClientIp(req);
    const location = await getLocationFromIp(ip);
    const deviceInfo = getDeviceInfo(req.headers["user-agent"]);

    const ipLimitWindow = 90 * 60 * 1000; // 1 hour
    const ipLimitMax = 25;

    try {
        // ✅ IP Rate Limit Check
        let ipRecord = await IpLimit.findOne({ ip });
        if (ipRecord) {
            const timeSince = now - ipRecord.createdAt;
            if (timeSince > ipLimitWindow) {
                ipRecord.attempts = 1;
                ipRecord.createdAt = now;
            } else {
                if (ipRecord.attempts >= ipLimitMax) {
                    return res.status(429).json({
                        message:
                            "Too many OTP requests from your network. Try again after an hour.",
                    });
                }
                ipRecord.attempts += 1;
            }
            await ipRecord.save();
        } else {
            await IpLimit.create({ ip, attempts: 1, createdAt: now });
        }

        const existingRecord = await Otp.findOne({ email });

        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const tomorrowMidnight = new Date(todayMidnight);
        tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

        // ⛔️ If blocked due to failed attempts
        if (existingRecord?.blockedUntil && existingRecord.blockedUntil > now) {
            return res.status(429).json({
                message: `Too many attempts. Try again after ${existingRecord.blockedUntil.toLocaleTimeString()}`,
                blocked: true,
            });
        }
        // ⛔️ Cooldown: 1 min wait
        if (
            existingRecord?.lastSentAt &&
            now - new Date(existingRecord.lastSentAt) < 5 * 1000
        ) {
            return res.status(429).json({
                message: "Please wait a minute before requesting another OTP.",
            });
        }
        // ⛔️ Daily OTP limit
        if (existingRecord) {
            if (
                !existingRecord.otpCountResetAt ||
                existingRecord.otpCountResetAt < todayMidnight
            ) {
                existingRecord.otpCountToday = 0;
                existingRecord.otpCountResetAt = tomorrowMidnight;
            }

            if (existingRecord.otpCountToday >= 5) {
                return res.status(429).json({
                    message:
                        "Daily OTP request limit reached. Try again tomorrow.",
                    redirect: "/auth/signup",
                });
            }
        }

        await Otp.findOneAndUpdate(
            { email },
            {
                otp: hashedOtp,
                expiresAt,
                $inc: { otpCountToday: 1 },
                otpCountResetAt:
                    existingRecord?.otpCountResetAt || tomorrowMidnight,
                attempts: 0, // reset on resend
                blockedUntil: null,
                lastSentAt: now,
            },
            { upsert: true, new: true }
        );
        // if (type === "signup") {
        //     await TempUser.findOneAndDelete({ email });
        // }
        // ✅ Send OTP
        await sendOtpEmail(
            email,
            name,
            otp,
            req.ip,
            deviceInfo,
            location,
            type
        );

        return res.status(200).json({ message: "OTP resent successfully" });
    } catch (err) {
        console.error("Resend OTP Error:", err);
        return res.status(500).json({
            message: "Failed to resend OTP",
            redirect: "/auth/signup",
        });
    }
};

exports.sendOtp = async (req, res) => {
    const { email, name, type, password } = req.body;
    //   const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const ip = getClientIp(req); // ✅ Clean, real IP
    const location = await getLocationFromIp(ip);
    const deviceInfo = getDeviceInfo(req.headers["user-agent"]);

    const ipLimitWindow = 90 * 60 * 1000; // 1 hour
    const ipLimitMax = 25;

    try {
        let ipRecord = await IpLimit.findOne({ ip });
        const now = new Date();

        if (ipRecord) {
            const timeSince = now - ipRecord.createdAt;

            if (timeSince > ipLimitWindow) {
                // Reset window
                ipRecord.attempts = 1;
                ipRecord.createdAt = now;
            } else {
                if (ipRecord.attempts >= ipLimitMax) {
                    return res.status(429).json({
                        message:
                            "Too many OTP requests from your network. Try again after an hour.",
                    });
                }
                ipRecord.attempts += 1;
            }
            await ipRecord.save();
        } else {
            // First time from this IP
            await IpLimit.create({ ip, attempts: 1, createdAt: now });
        }

        const existingRecord = await Otp.findOne({ email });
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const tomorrowMidnight = new Date(todayMidnight);
        tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
        if (
            existingRecord?.blockedUntil &&
            existingRecord.blockedUntil > new Date()
        ) {
            return res.status(429).json({
                message: `Too many attempts. Try again after ${existingRecord.blockedUntil.toLocaleTimeString()}`,
                blocked: true,
            });
        }
        if (
            existingRecord?.lastSentAt &&
            new Date() - new Date(existingRecord.lastSentAt) < 6000
        ) {
            return res.status(429).json({
                message: "Please wait a minute before requesting another OTP.",
            });
        }
        // ⛔️ Daily limit (max 5 OTPs)
        if (existingRecord) {
            // Reset daily count if date has passed
            if (
                !existingRecord.otpCountResetAt ||
                existingRecord.otpCountResetAt < todayMidnight
            ) {
                existingRecord.otpCountToday = 0;
                existingRecord.otpCountResetAt = tomorrowMidnight;
            }

            if (existingRecord.otpCountToday >= 5) {
                return res.status(429).json({
                    message:
                        "Daily OTP request limit reached. Try again tomorrow.",
                    redirect: "/auth/signup",
                });
            }
        }
        await Otp.findOneAndUpdate(
            { email },
            {
                otp: hashedOtp,
                expiresAt,
                $inc: { otpCountToday: 1 },
                otpCountResetAt:
                    existingRecord?.otpCountResetAt || tomorrowMidnight,
                attempts: 0, // reset attempts on resend
                blockedUntil: null,
                lastSentAt: new Date(), // ✅ <-- THIS is required
            },
            { upsert: true, new: true }
        );
        if (type === "signup") {
            const hashedPassword = await bcrypt.hash(password, 10);
            await TempUser.findOneAndUpdate(
                { email },
                {
                    name,
                    email,
                    password:hashedPassword,
                },
                { upsert: true, new: true }
            );
        }
        await sendOtpEmail(
            email,
            name,
            otp,
            req.ip,
            deviceInfo,
            location,
            type
        ); // Send plain OTP to email
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("OTP Send Error:", error);
        res.status(500).json({ message: "Failed to send OTP", error });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp,type } = req.body;
    const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log(type)
    try {
        // const ipAttempt = await OtpAttempt.findOne({ ip });

        // if (ipAttempt && ipAttempt.attempts >= 10) {
        //     return res.status(429).json({
        //         message:
        //             "⚠️ Too many OTP attempts from your network. Try again later.",
        //         redirect: "/auth/signup",
        //     });
        // }
        const record = await Otp.findOne({ email });

        // console.log("hadhed imput ")
        if (!record) {
            await OtpAttempt.findOneAndUpdate(
                { ip },
                {
                    $inc: { attempts: 1 },
                    $setOnInsert: { createdAt: new Date() },
                },
                { upsert: true }
            );
            return res
                .status(400)
                .json({ message: "OTP not found", redirect: "/auth/signup" });
        }
        // Blocked due to previous abuse
        if (record.blockedUntil && record.blockedUntil > new Date()) {
            return res.status(429).json({
                message: `Too many attempts. Try again after ${record.blockedUntil.toLocaleTimeString()}`,
                redirect: "/auth/signup",
            });
        }
        // Expired OTP
        if (record.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({
                message: "OTP expired",
                redirect: "/auth/signup", // ✅ front-end should handle this
            });
        }
        // Incorrect OTP
        if (record.otp !== hashedInput) {
            // record.attempts += 1;
            record.attempts = (record.attempts || 0) + 1; // Block for 15 minutes after 5 failed attempts
            if (record.attempts >= 5) {
                record.blockedUntil = new Date(Date.now() + 30 * 60 * 1000);
                await record.save();
                return res.status(429).json({
                    message: "Too many incorrect attempts. Try again later.",
                    redirect: "/auth/signup",
                });
            }

            await record.save();
            await OtpAttempt.findOneAndUpdate(
                { ip },
                {
                    $inc: { attempts: 1 },
                    $setOnInsert: { createdAt: new Date() },
                },
                { upsert: true }
            );
            return res.status(400).json({
                message: `Invalid OTP. ${6 - record.attempts} attempt(s) left.`,
            });
        }
        if(type === 'signup'){

            const tempUser = await TempUser.findOne({ email });
            if (!tempUser) {
                return res.status(404).json({
                    message: "Signup session expired.  temp user not Please signup again.",
                    redirect: "/auth/signup",
                });
            }
            // await TempUser.deleteOne({ email });
        }
            
        // ✅ Create real User account
        // await User.create({
        //     name: tempUser.name,
        //     email: tempUser.email,
        //     password: tempUser.password, // already hashed
        // });
        await Otp.deleteOne({ email });
        await OtpAttempt.deleteOne({ ip }); // ✅ Cleanup if verified
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: "OTP verification failed", error });
    }
};
