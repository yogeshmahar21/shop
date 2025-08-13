const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            unique: true,
            sparse: true,
            default:"",
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        isSeller: {
            type: Boolean,
            default: false,
        },
        mobile: {
            type: String,
            default: "", // or `null`
        },
        profilePic: {
            type: String,
            default: "", // or you can provide a default image URL
        },
        gender: {
            type: String,
            default: "",
        },
        countryCode: {
            type: String,
            default: "",
        },
        specializedIn: { 
            type: String,
            default:"",
         },
        sellerInfo: {
            payoutMethod: {
                type: String,
                enum: ["bank", "upi", "paypal"],
            },
            bankDetails: {
                accountHolderName: String,
                accountNumber: String,
                ifscCode: String,
            },
            upiId: String,
            paypalEmail: String,
        },
    },
    { timestamps: true }
);

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);   
//     next();
// });

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
