// controllers/UserController.js
const bcrypt = require("bcrypt");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
exports.updateProfile = async (req, res) => {
    const userId = req.user.id; // comes from verifyToken middleware
    const {
        name,
        mobile,
        userName,
        profilePic,
        countryCode,
        gender,
        email,
        specializedIn,
    } = req.body;
    const updatedData = {
        name: capitalizeFirstLetter(name),
        mobile,
        userName,
        countryCode,
        gender,
        email,
        specializedIn,
    };
     let newProfilePicPath = null; // ✅ Declare here so it's available in catch

    try {
        const user = await User.findById(userId); // Step 1: Fetch user to get old profilePic

        if (!user) {
            // If file uploaded but user not found, delete the uploaded file
            if (req.file) {
                const uploadedPath = path.join(
                    __dirname,
                    "../upload/profilePics",
                    req.file.filename
                );
                if (fs.existsSync(uploadedPath)) {
                    fs.unlinkSync(uploadedPath);
                }
            }
            return res.status(404).json({ message: "User not found" });
        }
        if (req.file) {
            // Delete old profile pic if it exists
            if (user.profilePic) {
                const oldPath = path.join(
                    __dirname,
                    "../upload/profilePics",
                    path.basename(user.profilePic)
                );
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            const baseURL =
                process.env.NODE_ENV === "development"
                    ? process.env.LOCAL_BASE_URL
                    : process.env.DEV_BASE_URL
            updatedData.profilePic = `${baseURL}/upload/profilePics/${req.file.filename}`;
             newProfilePicPath = path.join(
                __dirname,
                "../upload/profilePics",
                req.file.filename
            );
            console.log("this is base URL ", baseURL);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        }).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
            // alert('err')
        }

        res.status(200).json({ message: "Profile updated", updatedUser });
    } catch (error) {
        if (newProfilePicPath && fs.existsSync(newProfilePicPath)) {
            fs.unlinkSync(newProfilePicPath);
           }
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        console.log("this is current password ", currentPassword);
        console.log("this is current password ", user.password);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Current password is incorrect" });
        }

        // const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Change Password Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Check if email exists (excluding current user)
exports.checkEmail = async (req, res) => {
    const { email, excludeId } = req.query;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: excludeId }, // Exclude the current user's own ID
        });

        if (existingUser) {
            return res.status(200).json({ exists: true });
        }

        return res.status(200).json({ exists: false });
    } catch (error) {
        console.error("Error checking email:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.checkMobile = async (req, res) => {
    const { mobile, countryCode, excludeId } = req.query;
    console.log("all data is this ; ", countryCode, mobile, excludeId);
    try {
        if (!mobile || !countryCode) {
            return res
                .status(400)
                .json({ message: "Mobile and country code are required." });
        }

        const existingUser = await User.findOne({
            mobile,
            countryCode,
            _id: { $ne: excludeId }, // Exclude current user
        });
    

        if (existingUser) {
            return res.status(200).json({ exists: true });
        }

        return res.status(200).json({ exists: false });
    } catch (error) {
        console.error("Error checking mobile:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// controllers/userController.js
exports.checkUsername = async (req, res) => {
    const { userName, excludeId } = req.query;

    if (!userName) {
        return res.status(400).json({ message: "Username is required" });
    }

    const query = { userName: userName.toLowerCase() };
    if (excludeId) {
        query._id = { $ne: excludeId }; // exclude current user
    }

    const existingUser = await User.findOne(query);
    return res.json({ exists: !!existingUser });
};

exports.becomeSeller = async (req, res) => {
    const userId = req.user.id;

    const {
        userName,
        specialized,
        payoutMethod,
        bankDetails,
        upiId,
        paypalEmail,
    } = req.body;

    if (!payoutMethod) {
        return res.status(400).json({ message: "Payout method is required" });
    }

    const sellerInfo = {
        payoutMethod,
        bankDetails: payoutMethod === "bank" ? bankDetails : undefined,
        upiId: payoutMethod === "upi" ? upiId : undefined,
        paypalEmail: payoutMethod === "paypal" ? paypalEmail : undefined,
    };

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                isSeller: true,
                userName,
                specialized,
                sellerInfo,
            },
            { new: true }
        ).select("-password");

        res.status(200).json({ message: "Seller setup complete", updatedUser });
    } catch (error) {
        console.error("Error in becomeSeller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
