"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    CreditCard,
    Check,
    ClipboardList,
    FileCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import Env from "@/config/frontendEnv";

export default function ConfirmationPage() {
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const { isLoggedIn, user } = useAuth();
    const router = useRouter();
    const [profileData, setProfileData] = useState(null);
    const [bankData, setBankData] = useState(null);
    const steps = [
        { icon: <User size={20} />, label: "Profile" },
        { icon: <CreditCard size={20} />, label: "Bank" },
        { icon: <FileCheck size={20} />, label: "Property" },
    ];
    useEffect(() => {
        const profile = localStorage.getItem("sellerBasicData");
        const bank = localStorage.getItem("paymentData");
        console.log("first");
        console.log(profile);
        if (profile) setProfileData(JSON.parse(profile));
        if (bank) setBankData(JSON.parse(bank));
    }, []);
 
    const handleConfirm = async (e) => {
        e.preventDefault();
        if (isLoggedIn === true) {
            try {
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000"; // 👈 your actual IP
                // if (res.ok) {
                    // tell me what to write here to send otp on email
                    const otpRes = await fetch(`${apiUrl}/api/otp/send-otp`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: profileData.email,
                            name: profileData.name,
                            type: "becomeSeller", // 👈 pass it here
                        }),
                    });
                    const otpData = await otpRes.json();
                    if (otpRes.ok) {
                        // 3. Show success toast
                        console.log("otp sent ", otpRes);
                        toast.success("An OTP has been sent to your email", {
                            autoClose: 2500,
                            theme: "dark",
                        });

                        // 4. Redirect to OTP verification page
                        // startTransition(() => {
                            router.replace(
                                `/otp-verification?&type=becomeSeller&redirect=/seller-dashboard`
                            );
                        // });
                    } else {
                        toast.error(otpData.message || "Failed to send OTP", {
                            autoClose: 2500,
                            theme: "dark",
                        });
                    }
                  
            } catch (error) {
                console.log(error);
                toast.error("Failed to register seller Please try again.", {
                    autoClose: 2500,
                    theme: "dark",
                });
            }
        }
    };

    const handleEditProfile = () => {
        router.push("/become-seller");
    };

    const handleEditBank = () => {
        router.push("/become-seller/payment-details");
    };

    if (!profileData || !bankData) {
        return <p className="text-center pt-20">Loading...</p>;
    }

    return (
        <section className="max-w-3xl mx-auto pt-20 px-7 mb-10">
            <h1 className="text-3xl font-bold text-center mb-8">
                📝 Confirm Your Information
            </h1>
            <ol className="flex items-center justify-center w-full mb-10 sm:px-8 px-4">
                {steps.map((s, index) => {
                    const currentStep = 3;
                    const stepIndex = index + 1;
                    const isCompleted = stepIndex < currentStep;
                    const isActive = stepIndex === currentStep;

                    return (
                        <li
                            key={index}
                            className={`flex items-center w-full ${
                                index !== steps.length - 1
                                    ? `after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block ${
                                          stepIndex < currentStep
                                              ? "after:border-green-500"
                                              : "after:border-gray-200"
                                      }`
                                    : "w-auto max-w-10"
                            }`}
                        >
                            <span
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#b2d1fc] lg:h-12 lg:w-12 shrink-0 ${
                                    isCompleted
                                        ? "bg-green-500 text-white"
                                        : isActive
                                          ? "bg-[#d2e5ff] text-black"
                                          : "bg-gray-100 text-gray-400"
                                }`}
                            >
                                {isCompleted ? <Check size={20} /> : s.icon}
                            </span>
                        </li>
                    );
                })}
            </ol>
            {/* Profile Summary */}
            <div className="bg-white border rounded-lg p-6 mb-6 shadow">
                <h2 className="text-xl font-semibold mb-4">👤 Profile Info</h2>
                <p>
                    <strong>Full Name:</strong> {profileData.name}
                </p>
                <p>
                    <strong>Email:</strong> {profileData.email}
                </p>
                <p>
                    <strong>Phone:</strong> {profileData.mobile}
                </p>
                {/* Add other fields from Step 1 if any */}
                <button
                    onClick={handleEditProfile}
                    className="mt-4 text-blue-600 hover:underline cursor-pointer"
                >
                    Edit Profile Info
                </button>
            </div>

            {/* Bank Details Summary */}
            <div className="bg-white border rounded-lg p-6 mb-10 shadow">
                <h2 className="text-xl font-semibold mb-4">💰 Payment Info</h2>
                <p>
                    <strong>Payment Method:</strong> {bankData.paymentMethod}
                </p>

                {bankData.paymentMethod === "bank" && (
                    <>
                        <p>
                            <strong>Account Holder:</strong>{" "}
                            {bankData.accountName}
                        </p>
                        <p>
                            <strong>Account Number:</strong>{" "}
                            {bankData.accountNumber}
                        </p>
                        <p>
                            <strong>IFSC / Routing Number:</strong>{" "}
                            {bankData.routingNumber}
                        </p>
                    </>
                )}

                {bankData.paymentMethod === "upi" && (
                    <p>
                        <strong>UPI ID:</strong> {bankData.upiId}
                    </p>
                )}

                {bankData.paymentMethod === "paypal" && (
                    <p>
                        <strong>PayPal Email:</strong> {bankData.paypalEmail}
                    </p>
                )}

                <button
                    onClick={handleEditBank}
                    className="mt-4 text-blue-600 hover:underline cursor-pointer"
                >
                    Edit Payment Info
                </button>
            </div>

            {/* Confirm Button */}
            <div className="text-center">
                <button
                    onClick={handleConfirm}
                    className="bg-green-600 text-white cursor-pointer px-6 py-3 rounded hover:bg-green-700"
                >
                    Confirm & Send OTP
                </button>
            </div>
        </section>
    );
}
