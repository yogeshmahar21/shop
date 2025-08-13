"use client";
import { Buffer } from "buffer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Env from "@/config/frontendEnv";


const OTPVerificationPage = () => {
    const searchParams = useSearchParams();
    // const redirectTo = searchParams.get("redirect");
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const email = searchParams.get("email");
    const router = useRouter();
    const [redirectPath, setRedirectPath] = useState("/account");
    const { setIsLoggedIn, user, setUser } = useAuth();
    const [otp, setOtp] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [timer, setTimer] = useState(60);
    const [finalData, setFinalData] = useState(null);
    const [femail ,setFemail] = useState("")
    // 1. Load seller data from localStorage
    // useEffect(() => {
    //     const encodedData = searchParams.get("data");
    //     if (encodedData) {
    //         try {
    //             let base64 = encodedData.replace(/-/g, "+").replace(/_/g, "/");
    //             while (base64.length % 4 !== 0) base64 += "=";
                
    //             const jsonStr = Buffer.from(base64, "base64").toString("utf-8");
    //             const parsedData = JSON.parse(jsonStr);
    //             setFinalData(parsedData);
    //         } catch (err) {
    //             alert('this is encoded eror ')
    //             console.error("❌ Error decoding form data:", err);
    //         }
    //     }
    // }, []);
    // console.log("this is email of the otp passeord page ",email)
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
        if (!email) return;
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
    
   const maskedEmail = email ? maskEmail(email) :  maskEmail(user.email);
    
    // 4. OTP input change
    const handleOtpChange = (e) => {
        setIsValid(true);
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
    
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
        
    //     if (otp === "111111") {
    //         setIsValid(true);
    //         // router.push(redirectTo || "/default-route");
    //         try {
    //             const baseURL = window.location.hostname.includes("localhost")
    //             ? "http://localhost:5000"
    //             : "http://192.168.31.186:5000";
    //            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    //         } catch (err) {
    //             console.error("OTP verification error:", err);
    //         alert("Something went wrong while verifying. Please try again.");
    //         }
    //     } else {
    //         setIsValid(false);
    //     }
    // };
const handleSubmit = async (e) => {
    e.preventDefault();

    const baseURL = window.location.hostname.includes("localhost")
        ? "http://localhost:5000"
        : "http://192.168.31.186:5000";

    try {
        const res = await fetch(`${apiUrl}/api/otp/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();

        if (res.ok) {
            setIsValid(true);
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        } else {
            setIsValid(false);
            alert(data.message || "OTP verification failed");
        }
    } catch (err) {
        console.error("OTP verification error:", err);
        alert("Something went wrong while verifying OTP.");
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

            <div className=" bg-wdhite custom-shadow-otp bg-[#ffffffae] md:bg-[#fafafa] backdrop-blur-[8px] py-8 px-2 absolute sm:py-8 sm:px-4 rounded-lg max-w-100 w-full">
                <h2 className="text-2xl font-bold text-center mb-3">
                    OTP Verification
                </h2>
                <p className="text-center text-sm text-black mb-1">
                    We’ve sent a verification code to
                </p>
                <p className="text-center font-semibold text-[#444] mb-4">
                    {maskedEmail}
                </p>

                <form onSubmit={handleSubmit} className="">
                    <div className="flex justify-center mb-2 mt-6">
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

                    <div className="w-full max-w-100 px-5 ">
                        <button
                            type="submit"
                            className={`cursor-pointer w-full py-2 bg-[#1f1f1f] text-[#e1e1e1] rounded
                                ${!isValid ? "mt-3" : "mt-5"}`}
                        >
                            Verify OTP
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <div className="mt-4 text-sm">
                            <p className="text-sm text-black mb-1">
                                Didn't receive the OTP?
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
