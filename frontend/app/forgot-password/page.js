"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Env from "@/config/frontendEnv";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const [isemail, setIsEmail] = useState(false);
    const router = useRouter();
    const emailRef = useRef();
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
       
        localStorage.setItem(
            "forgotpassOutemail",
            JSON.stringify({ email: email })
        );

        e.preventDefault();
        // console.log(email);
        if (!email) {
            emailRef.current?.focus();
            setIsEmail(true);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailRef.current?.focus();
            setIsEmail(true);
            return;
        }
        try {
            setLoading(true);
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000"; // 👈 your actual IP
            const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            const name = data.name || "User";
            if (data.exist) {
                const otpRes = await fetch(`${apiUrl}/api/otp/send-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        name,
                        type: "forgotpasswordout",
                    }),
                });
                const otpData = await otpRes.json();

                if (otpRes.ok) {
                    // 3. Show success toast
                    console.log("otp sent ", otpRes);

                    // 4. Redirect to OTP verification page
                    toast.success(
                        "An OTP has been sent if this email is registered.",
                        {
                            autoClose: 2000,
                            theme: "dark",
                        }
                    );
                    router.push(`/otp-verification?type=forgotpasswordout`);
                } else {
                    toast.error(otpData.message || "Failed to send OTP", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                }
            } else {
                toast.success(
                    "An OTP has been sent if this email is registered.",
                    {
                        autoClose: 2000,
                        theme: "dark",
                    }
                );
                router.push(`/otp-verification?type=forgotpasswordout`);
            }
        } catch (error) {
            console.error("Error in sending OTP:", error);
            toast.error("Something went wrong. Please try again.", {
                autoClose: 2000,
                theme: "dark",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center pt-30 pb-25 ">
            <div className="bg-[#caddff] rounded-3xl flex flex-col items-center shadow-2xl sm:px-5 px-4 min-w-80 sm:min-w-120">
                {/* <div> */}
                <h1 className="text-3xl font-bold text-center pt-10 pb-10">
                    Forgot Password
                </h1>
                {/* </div> */}
                <div className="w-full px-2">
                    <p className="pb-1">Email</p>
                    <input
                        type="email"
                        name="email"
                        ref={emailRef}
                        placeholder="Email Address"
                        required
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmail(false);
                        }}
                        className="w-full p-2 pl-3 bg-[#fafbff] step1input focus:bg-[#f5f9ff] focus:outline-none ring-[.5px] rounded"
                    />
                    {isemail && (
                        <p className="text-red-500 text-sm mt-1">
                            Enter a valid email address.
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleSendOTP}
                    className={`cursor-pointer mb-10 w-full max-w-50 py-2 bg-[#444] text-white rounded
                                ${isemail ? "mt-4" : "mt-9"}
                                `}
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>
            </div>
        </div>
    );
}
