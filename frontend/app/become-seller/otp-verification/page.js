"use client";
import React, { useState, useEffect } from "react";
import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Env from "@/config/frontendEnv";


const OTPVerificationPage = () => {
    const [otp, setOtp] = useState("");
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const [isValid, setIsValid] = useState(true);
    const [timer, setTimer] = useState(60);
    const [finalData, setFinalData] = useState(null);
    const router = useRouter();
    const { user,setUser } = useAuth();
    // 1. Load seller data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem("sellerBasicData");
        if (savedData) {
            setFinalData(JSON.parse(savedData));
        }
    }, []);

    // 2. Timer countdown
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // 3. Mask email
    const maskEmail = (email) => {
        if (!email) return "";
        const [user, domain] = email.split("@");
        if (user.length <= 2) return "*".repeat(user.length) + "@" + domain;
        return (
            user[0] + 
            "*".repeat(user.length - 2) +
            user[user.length - 1] +
            "@" +
            domain
        );
    };

    const maskedEmail = maskEmail(finalData?.email);

    // 4. OTP input change
    const handleOtpChange = (e) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return;
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    // 5. Handle OTP paste
    const handleOtpPaste = (e) => {
        const pastedValue = e.clipboardData.getData("Text").slice(0, 6);
        if (/^\d{4,6}$/.test(pastedValue)) {
            setOtp(pastedValue);
        }
    };

    // 6. Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp === "111111") {
            setIsValid(true);
            const userId = user._id;
            const formData = JSON.parse(
                localStorage.getItem("sellerBasicData")
            );
            console.log('error is here',formData)
            const paymentData = JSON.parse(localStorage.getItem("paymentData"));
            const body = {
                userId,
                userName: formData.userName,
                specializedIn: formData.specializedIn,
                paymentData,
            };
            console.log("paymenty data details ",paymentData)
            try {
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000";
                    const res = await fetch(`${apiUrl}/api/seller/become`, {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    });
                    
                    const data = await res.json();

                if (res.ok) {
                    setUser(data.user)
                    localStorage.removeItem("paymentData");
                    localStorage.removeItem("sellerBasicData");
                    console.log("✅ Seller data saved:", data);
                    router.push("/seller-dashboard");
                } else {
                    console.error("❌ Error saving seller data:", data.message);
                }
            } catch (err) {
                console.error("⚠️ Network error:", err);
            }
        } else {
            setIsValid(false);
        }
    };

    // 7. Resend OTP
    const handleResendOTP = () => {
        setTimer(30); // Restart timer
        console.log("OTP resent");
    };

    return (
        <div className="flex justify-center items-center bg-[#f5f5f5]">
            <img
                className="relative w-full hidden md:flex md:min-h-150 max-w-[1370px]"
                src="/otps.webp"
                alt="background"
            />
            <img
                className="relative min-h-[80vh] object-cover w-full md:hidden flex"
                src="/fotp.avif"
                alt="background"
            />

            <div className="bg-wdhite custom-shadow-otp bg-[#ffffffae] md:bg-[#fafafa] backdrop-blur-[8px]  absolute p-8 rounded-lg max-w-100 sm:w-200">
                <h2 className="text-2xl font-bold text-center mb-3">
                    OTP Verification
                </h2>
                <p className="text-center text-sm text-black mb-1">
                    We&apos;ve sent a verification code to
                </p>
                <p className="text-center font-semibold text-[#444] mb-5">
                    {maskedEmail}
                </p>

                <form onSubmit={handleSubmit} className="">
                    <div className="flex justify-center mb-4">
                        <input
                            type="text"
                            inputMode="numeric" // Show numeric keypad on mobile
                            pattern="[0-9]*"
                            value={otp}
                            onChange={handleOtpChange}
                            onPaste={handleOtpPaste}
                            placeholder="OTP"
                            maxLength={6}
                            className="max-w-70 w-auto h-12 text-center text-xl ring-1 border-gray-300 rounded-lg focus:ring-1 focus:outline-0"
                            style={{
                                letterSpacing: "8px",
                            }}
                        />
                    </div>

                    {!isValid && (
                        <p className="text-[#ff112d] text-center">
                            Invalid OTP, please try again.
                        </p>
                    )}

                    <div className="w-full max-w-100 mt-3">
                        <button
                            type="submit"
                            className="cursor-pointer w-full py-2 bg-[#1f1f1f] text-[#e1e1e1] rounded"
                        >
                            Verify OTP
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <div className="mt-4 text-sm">
                            <p className="text-sm text-black mb-1">
                                Didn&apos;t receive the OTP?
                            </p>
                            {timer > 0 ? (
                                <p className=" text-black">
                                    Resend OTP in{" "}
                                    <span className="font-semibold">
                                        {timer}s
                                    </span>
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendOTP}
                                    className="text-[#001eff] underline cursor-pointer hover:underline"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPVerificationPage;
