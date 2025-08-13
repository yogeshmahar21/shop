const SibApiV3Sdk = require("sib-api-v3-sdk");
const fs = require("fs");
const path = require("path");
const UAParser = require("ua-parser-js");
require("dotenv").config();

const sendOtpEmail = async (
    email,
    name,
    otp,
    ip,
    userAgent,
    location,
    type
) => {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    const parser = new UAParser(userAgent);
    const os = parser.getOS(); // { name: 'Android', version: '10' }
    const browser = parser.getBrowser(); // { name: 'Chrome', version: '114.0' }
    const device = `${os.name || "Unknown"} ${os.version || ""} (${browser.name || "Unknown"} ${browser.version || ""})`;

    let templateFileName = "signupOTP.html";
    if (type === "signup") {
        templateFileName = "signupOTP.html";
    } else if (type === "forgotpasswordout") {
        templateFileName = "forgotPasswordOTP.html";
    } else if (type === "accountupdate") {
        templateFileName = "profileupdateOTP.html";
    } else if (type === "selleraccountupdate") {
        templateFileName = "profileupdateOTP.html";
    } else if (type === "forgotPassLogined") {
        templateFileName = "loginedforgotpassOTP.html";
    } else if (type === "becomeSeller") {
        templateFileName = "becomeSellerOTP.html";
    }

    const templatePath = path.join(
        __dirname,
        "emailTemplates",
        templateFileName
    );
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    htmlContent = htmlContent
        .replace(/{{name}}/g, capitalizedName || "User")
        .replace(/{{otp}}/g, otp)
        .replace(/{{ip}}/g, ip || "Unknown IP")
        .replace(/{{device}}/g, device)
        .replace(/{{location}}/g, location || "Unknown Location");

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const subjectMap = {
        signup: "Email verification code",
        forgotpasswordout: "Forgot password code",
        accountupdate: "Verify Your New Email Address",
        selleraccountupdate: "Verify Your New Email Address",
        forgotPassLogined: "Forgot password code",
        becomeSeller: "Verify Seller Account",
    };

    const subject = `${subjectMap[type] || "Your OTP Code"}: ${otp}`;

    const sendSmtpEmail = {
        to: [{ email }],
        sender: { name: "Mahar boyz", email: "kbloveyou53@gmail.com" },
        subject,
        htmlContent,
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ OTP sent to email");
    } catch (error) {
        console.error("❌ Failed to send OTP:", error);
    }
};

module.exports = sendOtpEmail;
