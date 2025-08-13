"use client";
import { useState, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Env from "@/config/frontendEnv";

export default function UpdatePassword() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const router = useRouter();
    const { user } = useAuth();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // States for toggling password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // References to input fields to manage focus
    const currentPasswordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const handleChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const validateForm = () => {
        const { currentPassword, newPassword, confirmPassword } = formData;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return "All fields are required.";
        }
        if (newPassword.length < 8) {
            return "New password must be at least 6 characters.";
        }
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/;
        if (!strongPasswordRegex.test(newPassword)) {
            // passwordRef.current?.focus();
            // setMustRequiredPassword(false);
            return "Password should have a capital letter, a number, and a special character (like !@#).";
        }
        if (!strongPasswordRegex.test(confirmPassword)) {
            // passwordRef.current?.focus();
            // setMustRequiredPassword(false);
            return "Password should have a capital letter, a number, and a special character (like !@#).";
        }
        if (newPassword !== confirmPassword) {
            return "New password and confirm password must match.";
        }
        if (newPassword === currentPassword) {
            return "New password must be different from your current password.";
        }
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000";

            const res = await fetch(`${apiUrl}/api/user/change-password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const result = await res.json();
            if (res.ok) {
                console.log("this is update password ", user);
                setSuccess("✅ Password updated successfully!");

                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                router.push("/account");
            } else {
                setError(result.message || "❌ Failed to update password.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("⚠️ An error occurred. Please try again.");
        }
    };

    // Function to toggle password visibility and keep the cursor position
    const togglePasswordVisibility = (field, setShowField, inputRef) => {
        const inputElement = inputRef.current;

        // Store the cursor position
        const cursorPosition = inputElement.selectionStart;

        setShowField((prevState) => {
            const newState = !prevState;

            // Set the input type to either 'password' or 'text'
            inputElement.type = newState ? "text" : "password";

            // Restore the cursor position after type change
            inputElement.setSelectionRange(cursorPosition, cursorPosition);

            // Focus the input field to prevent losing focus
            inputElement.focus();

            return newState;
        });
    };

    return (
        <div className="bg-gray-100 pt-22 pb-16 max-w-[1370px] mx-auto">
            <div className="flex lg:flex-row flex-col items-center justify-center lg:items-start m-auto w-full gap-5 px-3">
                <div className="max-w-xl w-full bg-[#caddff] rounded-lg shadow-2xl py-9 px-4 sm:px-8">
                    <h2 className="text-2xl font-semibold text-center mb-4">
                        Update Password
                    </h2>

                    {error && (
                        <div className="bg-red-100 text-red-600 p-2 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 text-green-600 p-2 rounded-md mb-4">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label className="text-sm">Current Password</label>
                            <div className="relative">
                                <input
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    ref={currentPasswordRef}
                                    placeholder="Current Password"
                                    className="mt-1 w-full bg-[#fafbff] pl-4 pr-8.5 py-2 border rounded-md focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    className="absolute right-[0px] top-6 transform -translate-y-1/2 pr-2.5 pl-2 py-[13px] cursor-pointer"
                                    onClick={() =>
                                        togglePasswordVisibility(
                                            "currentPassword",
                                            setShowCurrentPassword,
                                            currentPasswordRef
                                        )
                                    }
                                >
                                    {showCurrentPassword ? (
                                        <FaEyeSlash className="text-gray-600" />
                                    ) : (
                                        <FaEye className="text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className=" text-sm">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    ref={newPasswordRef}
                                    placeholder="New Password"
                                    className="mt-1 w-full bg-[#fafbff] pl-4 pr-8.5 py-2 border rounded-md focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    className="absolute right-[0px] top-6 transform -translate-y-1/2 pr-2.5 pl-2 py-[13px] cursor-pointer"
                                    onClick={() =>
                                        togglePasswordVisibility(
                                            "newPassword",
                                            setShowNewPassword,
                                            newPasswordRef
                                        )
                                    }
                                >
                                    {showNewPassword ? (
                                        <FaEyeSlash className="text-gray-600" />
                                    ) : (
                                        <FaEye className="text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className=" text-sm">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    ref={confirmPasswordRef}
                                    placeholder="Confirm New Password"
                                    className="mt-1 bg-[#fafbff] w-full pl-4 pr-8.5 py-2 border rounded-md focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                />
                                <button
                                    type="button"
                                    className="absolute right-[0px] top-6 transform -translate-y-1/2 pr-2.5 pl-2 py-[13px] cursor-pointer"
                                    onClick={() =>
                                        togglePasswordVisibility(
                                            "confirmPassword",
                                            setShowConfirmPassword,
                                            confirmPasswordRef
                                        )
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className="text-gray-600" />
                                    ) : (
                                        <FaEye className="text-gray-600" />
                                    )}
                                </button>
                            </div>
                            <div className="mt-2 ml-1">
                                <Link
                                    href="/account/forgot-password"
                                    className="underline text-[#1560fc]"
                                >
                                    {" "}
                                    Forgot password?
                                </Link>
                                <p className="text-[12px]">
                                    (Forgot password requires OTP
                                    verification.){" "}
                                </p>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="  w-full max-w-50 bg-[#444] text-white rounded px-3 py-2  hover:bg-[#3b3b3b] cursor-pointer"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
