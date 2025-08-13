"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, CreditCard, ClipboardList } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

import Env from "@/config/frontendEnv";

export default function BecomeSellerPage() {
    const router = useRouter();
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const { user } = useAuth();
    const [numberValid, setNumberValid] = useState(true);
    const [userNameValid, setUserNameValid] = useState(true);
    const usernameRef = useRef(null);
    const mobileNORef = useRef(null);
    const takenUsernames = [
        "yogesh-bha",
        "yogesh-bhai",
        "jane123",
        "admin-user",
        "test.user",
    ];
    const [formData, setFormData] = useState({
        name: "",
        userName: "",
        email: "",
        mobile: "",
        specializedIn: "",
        country: "",
    });
    const steps = [
        { icon: <User size={20} />, label: "Profile" },
        { icon: <CreditCard size={20} />, label: "Bank" },
        { icon: <ClipboardList size={20} />, label: "Property" },
    ];
    useEffect(() => {
        const saved = localStorage.getItem("sellerBasicData");
        const parsed = saved ? JSON.parse(saved) : {};

        setFormData({
            name: parsed.fullName || user?.name || "",
            userName: parsed.userName || "",
            email: user?.email || "",
            mobile: parsed.mobile || user?.mobile || "",
            specializedIn: parsed.specializedIn || "",
            countryCode: parsed.countryCode || user.countryCode || "",
        });
    }, [user]);
    const sanitizeUsername = (value) => {
        const lower = value.toLowerCase();
        return lower.replace(/[^a-z0-9_-]/g, "");
    };
    const handleUsernameChange = (e) => {
        const cleaned = sanitizeUsername(e.target.value);
        if (!takenUsernames.includes(cleaned)) {
            setUserNameValid(true);
        }

        const updated = { ...formData, userName: cleaned };
        setFormData(updated);
        localStorage.setItem("sellerBasicData", JSON.stringify(updated));
    };

    const handleSpecializedChange = (e) => {
        const rawValue = e.target.value;

        // Allow only letters, numbers, and spaces
        const cleanedValue = rawValue.replace(/[^a-zA-Z0-9 ]/g, "");

        // Capitalize first letter, rest lowercase
        const formattedValue =
            cleanedValue.charAt(0).toUpperCase() +
            cleanedValue.slice(1).toLowerCase();

        const updatedData = {
            ...formData,
            specializedIn: formattedValue,
        };
        setFormData(updatedData);
        localStorage.setItem("sellerBasicData", JSON.stringify(updatedData));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const baseURL = window.location.hostname.includes("localhost")
        ? "http://localhost:5000"
        : "http://192.168.31.186:5000"; // 👈 your actual IP
        if (takenUsernames.includes(formData.userName)) {
            setUserNameValid(false);
            usernameRef.current?.focus();
            return;
        }
        if (formData.mobile.length < 10 || formData.mobile.length > 15) {
            setNumberValid(false);
            mobileNORef.current?.focus();
            return;
        }
        try {
            const res = await fetch(
                `${apiUrl}/api/seller/check-username?username=${encodeURIComponent(
                    formData.userName
                )}`
            );
            const data = await res.json();
            if (data.exists) {
                setUserNameValid(false);
                usernameRef.current?.focus();
                return;
            }
        } catch (err) {
            console.error("Error:", err);
            return false;
        }
        setUserNameValid(true);
        setNumberValid(true);
        localStorage.setItem("sellerBasicData", JSON.stringify(formData));
        router.replace("/become-seller/payment-details");
    };

    return (
        <section className="max-w-4xl mx-auto pt-20 px-3">
            <h1 className="text-2xl font-bold mb-6 ml-5">
                Be Part of Our Vision
            </h1>

            {/* Progress Bar */}
            <ol className="flex items-center justify-center w-full mb-10 sm:px-8 px-4">
                {steps.map((s, index) => {
                    const isActive = index === 0;
                    return (
                        <li
                            key={index}
                            className={`flex items-center w-full ${
                                index !== steps.length - 1
                                    ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block"
                                    : "w-auto max-w-10"
                            } after:border-gray-200`}
                        >
                            <span
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#b2d1fc] lg:h-12 lg:w-12 shrink-0 ${
                                    isActive
                                        ? "bg-[#d2e5ff] text-black"
                                        : "bg-gray-100 text-gray-400 "
                                }`}
                            >
                                {s.icon}
                            </span>
                        </li>
                    );
                })}
            </ol>

            {/* Step 1 Form */}
            <div className="max-w-500 mx-auto mb-12">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 grid sm:grid-cols-2">
                        <div className="w-full max-w-150 px-4">
                            <p className="pb-1">Name</p>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.name}
                                // onChange={handleTextChange}
                                placeholder="Full Name"
                                required
                                readOnly
                                className="w-full p-2 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded"
                            />
                        </div>

                        <div
                            className={`w-full max-w-150 px-4 ${
                                userNameValid ? " " : " mb-0"
                            }`}
                        >
                            <p className="pb-1">Username *(a-z, 0-9, - _ .)</p>
                            <input
                                type="text"
                                ref={usernameRef}
                                name="userName"
                                value={formData.userName}
                                onChange={handleUsernameChange}
                                placeholder="Username"
                                required
                                className="w-full p-2 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded"
                            />
                            {!userNameValid && (
                                <p className="text-[#ff112d] py-0 mt-0.5 pl-1">
                                    Username already exists! Try a different one.
                                </p>
                            )}
                        </div>

                        <div className="w-full max-w-150 px-4">
                            <p className="pb-1">Email</p>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                // onChange={handleTextChange}
                                placeholder="Email Address"
                                required
                                readOnly
                                className="w-full p-2 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded"
                            />
                        </div>

                        <div
                            className={`w-full max-w-150 px-4 ${
                                numberValid ? " " : " mb-0"
                            }`}
                        >
                            <p className="pb-1">Mobile no.</p>
                            <div className="flex">
                                <div className="px-4 py-2 border-r-0 rounded-l-md bg-[#fafbff] ring-[.5px] text-gray-700 ">
                                    {formData.countryCode}
                                </div>
                                <input
                                    type="text"
                                    name="mobile"
                                    ref={mobileNORef}
                                    value={formData.mobile}
                                    // onChange={handleTextChange}
                                    placeholder="Mobile no."
                                    required
                                    readOnly
                                    className={`w-full p-2 pl-3 bg-[#fafbff] step1input focus:outline-none outline-none ring-[.5px] rounded-r-md  `}
                                    inputMode="numeric" // Optimizes for numeric input on mobile devices
                                    pattern="[0-9]*" // Allows only numbers (including for form validation)
                                    onInput={(e) => {
                                        // This ensures that only numeric characters are allowed
                                        e.target.value = e.target.value.replace(
                                            /[^0-9]/g,
                                            ""
                                        );
                                    }}
                                    title="Only numeric characters are allowed"
                                />
                            </div>
                            {!numberValid && (
                                <p className="text-[#ff112d] py-0 mt-0.5 pl-1">
                                    Invalid Mobile Number
                                </p>
                            )}
                        </div>

                        <div className="w-full max-w-150 px-4">
                            <p className="pb-1">Specialized in</p>
                            <input
                                type="text"
                                name="specializedIn"
                                value={formData.specializedIn}
                                onChange={handleSpecializedChange}
                                placeholder="Specialized work"
                                required
                                className="w-full p-2 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded"
                            />
                        </div>
                    </div>

                    <div className="max-w-210 mx-4 mt-10 flex justify-center">
                        <button
                            type="submit"
                            className="cursor-pointer w-full max-w-50 py-2 bg-[#444] text-white rounded"
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
