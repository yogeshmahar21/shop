const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username || username.trim() === "") {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findOne({ userName: username.toLowerCase() });

        if (user) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking username:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.becomeSeller = async (req, res) => {
    try {
        const { userId, userName, specializedIn, paymentinfo } = req.body;
        if (!userId || !userName || !specializedIn || !paymentinfo) {
            // return res.status(400).json({ message: "Missing fields" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        user.userName = userName;
        user.specializedIn = specializedIn;
        user.isSeller = true;
        const payoutMethod = paymentinfo.paymentMethod;
        const sellerInfo = {
            payoutMethod,
        };
        if (payoutMethod === "bank") {
            sellerInfo.bankDetails = {
                accountHolderName: paymentinfo.accountName,
                accountNumber: paymentinfo.accountNumber,
                ifscCode: paymentinfo.routingNumber,
            };
        } else if (payoutMethod === "upi") {
            sellerInfo.upiId = paymentinfo.upiId;
        } else if (payoutMethod === "paypal") {
            sellerInfo.paypalEmail = paymentinfo.paypalEmail;
        }

        user.sellerInfo = sellerInfo;

        await user.save();

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error updating seller info:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


exports.checkPayment = async (req, res) => {
    try {
        const { upiId, paypalEmail, accountNumber } = req.query;

        let query = {
            $or: [],
        };

        if (upiId) {
            query.$or.push({ "sellerInfo.upiId": upiId });
        }

        if (paypalEmail) {
            query.$or.push({ "sellerInfo.paypalEmail": paypalEmail });
        }

        if (accountNumber) {
            query.$or.push({ "sellerInfo.bankDetails.accountNumber": accountNumber });
        }

        if (query.$or.length === 0) {
            return res.status(400).json({ message: "At least one field required" });
        }

        const user = await User.findOne(query);

        if (user) {
            return res.json({ exists: true });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking payment info:", error);
        return res.status(500).json({ message: "Server error" });
    }
};