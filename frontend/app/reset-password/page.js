"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Env from "@/config/frontendEnv";


export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
     const forgotpassOutinfo = JSON.parse(
        localStorage.getItem("forgotpassOutemail") || "{}"
    );
    const email = forgotpassOutinfo.email   
    const { user } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        const strongPasswordRegex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/;

        if (!strongPasswordRegex.test(password)) {
            setError(
                "Password should have a capital letter, a number, and a special character (like !@#). "
            );
            return;
        }
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000";

            const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                // alert("✅ Password reset successfully! Please login.");
                toast.success(data.message, { autoClose: 2000, theme: "dark" });
                if(user){
                    // alert('user is existing ')
                    router.push("/account");
                }
                else {
                    // alert('no user was found')
                    router.push("/auth/login");
                }

            } else {
                toast.error("Failed to reset password.", {
                    autoClose: 2000,
                    theme: "dark",
                });
            }
        } catch (err) {
            console.error("Reset error:", err);
            toast.error("Something went wrong. Please try again.", {
                autoClose: 2000,
                theme: "dark",
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    🔒 Reset Password
                </h2>
                {email && (
                    <p className="text-center text-sm mb-4 text-gray-500">
                        Resetting password for <strong> {email || user.email}</strong>
                    </p>
                )}
                <form onSubmit={handleSubmit}>
                    {/* Password */}
                    <div className="mb-4 relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            className="w-full border px-4 py-2 rounded-md"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 cursor-pointer text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4 relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className="w-full border px-4 py-2 rounded-md"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setError("");
                            }}
                        />
                        <span
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-3 cursor-pointer text-gray-600"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm mb-3">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#1f1f1f] text-white py-2 rounded hover:bg-[#2b2b2b] cursor-pointer"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}
