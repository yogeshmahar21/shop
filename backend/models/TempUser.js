const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String, // hashed password
    createdAt: { type: Date, default: Date.now, expires: 20  }, // auto-delete
});

module.exports = mongoose.model("TempUser", tempUserSchema);
