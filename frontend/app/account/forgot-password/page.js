"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import Env from "@/config/frontendEnv";

export default function ForgotPasswordPage() {
    const { user } = useAuth();
    const apiUrl = Env.LOCAL_URL || Env.IP_URL;
    const [email, setEmail] = useState("");
    const [isemail, setIsEmail] = useState(false);
    const router = useRouter();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000";
            const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
            });
            const data = await res.json();
            const name = data.name || "User";
            console.log("name is ", user.email);
            if (data.exist) {
                const otpRes = await fetch(`${apiUrl}/api/otp/send-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        name,
                        type: "forgotPassLogined",
                    }),
                });
                const otpData = await otpRes.json();

                if (otpRes.ok) {
                    // 3. Show success toast
                    console.log("otp sent ", otpRes);

                    // 4. Redirect to OTP verification page
                    toast.success(
                        "An OTP has been sent to your email address",
                        {
                            autoClose: 2000,
                            theme: "dark",
                        }
                    );
                    localStorage.setItem(
                        "forgotPassLogined",
                        JSON.stringify({ email: user.email })
                    );
                    router.push(
                        `/otp-verification?redirect=/account&type=forgotPassLogined`
                    );
                } else {
                    window.location.href = "/account";
                    toast.error(otpData.message || "Failed to send OTP", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                }
            } else {
                toast.error("Email not found.", {
                    autoClose: 2000,
                    theme: "dark",
                });
                // router.push(
                //     `/otp-verification?email=${encodeURIComponent(email)}&type=forgotPassWithoutLogin`
                // );
            }
        } catch {
            console.error("Error in sending OTP:", error);
            toast.error("Something went wrong. Please try again.", {
                autoClose: 2000,
                theme: "dark",
            });
        }
        // if (res.ok) {
        //     router.push("/otp-verification?redirect=/account/forgot-password/reset");
        // }
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
                        placeholder="Email Address"
                        required
                        value={user.email}
                        onChange={(e) => {
                            // setEmail(e.target.value);
                            setIsEmail(false);
                        }}
                        className="w-full p-2 pl-3 bg-[#fafbff] step1input focus:bg-[#f5f9ff] focus:outline-none ring-[.5px] rounded"
                    />
                    {isemail && (
                        <p className="text-red-500 text-sm mt-1">
                            Enter your registered email address.
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
                    Send OTP
                </button>
            </div>
        </div>
    );
}
