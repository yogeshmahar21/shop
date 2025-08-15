const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
connectDB();

const app = express();
app.set("trust proxy", true);
app.use("/uploads", express.static("uploads"));
app.use("/upload", express.static("upload"));

const allowedOrigins = [
    "http://localhost:3000",
    "http://192.168.56.1:3000",
    "https://shop-a5rlgegta-yogesh-mahars-projects.vercel.app/",
    "https://shop-frontend-8ij2.onrender.com", // replace with your actual local IP
];
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use("/public", express.static(path.join(__dirname, "public")));

const countryRoutes = require("./routes/countryRoutes");
app.use("/api/countries", countryRoutes);

const softwareRoutes = require("./routes/softwareRoutes");
app.use("/api/software", softwareRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const sellerRoutes = require("./routes/sellerRoutes");
app.use("/api/seller", sellerRoutes);

const otpRoutes = require("./routes/otpRoutes");
app.use("/api/otp", otpRoutes);

const accountRoutes = require("./routes/accountRoutes"); 
app.use("/api/account", accountRoutes);

const modelsRoutes = require("./routes/modelsRoutes"); 
app.use("/api/models", modelsRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Backend server is running");
});

// app.use("/api/users", require("./routes/userRoutes"));
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
