"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
// import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import Env from "@/config/frontendEnv";

const AccountPage = () => {
    const router = useRouter();
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const { setIsLoggedIn, user, setUser } = useAuth();
    // console.log("thsi is uer of account page ", user);
    const goToSellerDashboard = () => {
        // console.log("first error ", user);
        if (user && user.isSeller) {
            router.push("/seller-dashboard");
        } else {
            if (
                window.confirm(
                    "You're not a seller yet. Start selling by registering now — would you like to continue?"
                )
            ) {
                router.push(`/become-seller`);
            }
        }
    };

    if (!user) return <p className="pt-30 pl-20 pb-20">Loading...</p>;
    const LogoutAllDecvices = async (e) => {
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000";

            const res = await axios.post(
                `${apiUrl}/api/auth/logout-all`,
                {},
                {
                    withCredentials: true,
                }
            );
            // alert("befroe status ==== 2000 ");
            if (res.status === 200) {
                toast.success("Logged out from all devices.", {
                    autoClose: 2500,
                    theme: "dark",
                });
                setIsLoggedIn(false);
                setUser(null);
                localStorage.setItem("auth-change", "logout");
                localStorage.removeItem("auth-change");

                router.replace("/");
                // Optional: redirect
                // window.location.href = "/login";
            }
            // console.log("Logout all response status ==== 200 ", res.data);
        } catch (err) {
            console.error("❌ Logout all failed:", err.message);
            toast.error("Failed to logout from all devices.", {
                autoClose: 2500,
                theme: "dark",
            });
        }
    };
    const handleLogout = async (e) => {
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000"; // 👈 your actual IP
            await axios.post(
                `${apiUrl}/api/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
            setIsLoggedIn(false);
            setUser(null);
            localStorage.setItem("auth-change", "logout");
            localStorage.removeItem("auth-change");

            // localStorage.removeItem();
            // router.push("/");
            router.replace("/");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <div className=" bg-gray-100 pt-16 md:pt-25 pb-15 max-w-[1370px] mx-auto">
            <div className="flex lg:flex-row flex-col items-center justify-center lg:items-start m-auto w-full gap-5 ">
                <div className="max-w-xl w-full  bg-white rounded-lg shadow-md p-6 relative">
                    {/* Edit Button */}
                    {user.isSeller ? (
                        <div>{/* Content for sellers goes here */}</div>
                    ) : (
                        <button
                            className="absolute cursor-pointer top-4 right-4 bg-gray-100 text-sm flex items-center gap-1 text-gray-800 px-3 py-1.5 rounded hover:bg-gray-200 transition"
                            onClick={() => {
                                window.location.href = "/account/edit";
                            }}
                        >
                            <FaEdit className="text-sm" /> Edit Profile
                        </button>
                    )}

                    {/* Profile Image */}
                    <div className="flex justify-center mb-6">
                        <img
                            src={user.profilePic}
                            //  src={`http://localhost:5000${user.profilePic}`} // 👈 full URL
                            alt="User"
                            className="h-28 w-28 rounded-full object-cover shadow-md border"
                        />
                    </div>

                    {/* Profile Info */}
                    <h2 className="text-xl font-semibold text-center mb-4">
                        Personal Information
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <label className="text-gray-600 text-sm">
                                Full Name
                            </label>
                            <p className="text-gray-900 font-medium">
                                {user.name}
                            </p>
                        </div>

                        <div>
                            <label className="text-gray-600 text-sm">
                                Gender
                            </label>
                            <p className="text-gray-900 font-medium">
                                {user.gender}&nbsp;
                            </p>
                        </div>

                        <div>
                            <label className="text-gray-600 text-sm">
                                Mobile Number
                            </label>
                            <p className="text-gray-900 font-medium">
                                {user.countryCode}&nbsp;{user.mobile}
                            </p>
                        </div>

                        <div>
                            <label className="text-gray-600 text-sm">
                                Email Address
                            </label>
                            <p className="text-gray-900 font-medium">
                                {user.email}
                            </p>
                        </div>
                        <div className="pt-4 flex justify-between items-center">
                            {/* <Link href="#" className="underline text-[#1560fc]">Professional dashboard</Link> */}
                            <button
                                onClick={goToSellerDashboard}
                                className="underline text-[#1560fc] cursor-pointer"
                            >
                                Go to Seller Dashboard
                            </button>
                            {/* </div> */}
                            {/* <div className="pt-4 flex justify-end">/ */}
                            <div className="flex text-center">
                                <button
                                    className="bg-red-500 mr-2 text-white px-3 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                                <button
                                    className="bg-red-500 mr-2 text-white px-3 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                                    onClick={LogoutAllDecvices}
                                >
                                    Logout all
                                </button>
                                <Link
                                    className="bg-[#4b75ff] text-white px-3  py-2 rounded-md hover:bg-[#2b47ff] cursor-pointer"
                                    href="/account/update-password"
                                >
                                    Update Password
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-xl flex flex-col gap-5">
                    {/* Orders */}
                    <div className="bg-white rounded-lg  max-w-xl w-full shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">
                            Your Orders
                        </h3>
                        <p className="text-gray-600 mb-4">
                            View and manage your model purchases and downloads.
                        </p>
                        <Link
                            href="/account/downloads"
                            className="text-blue-600 hover:underline"
                        >
                            Go to Orders
                        </Link>
                        {/* </div> */}
                    </div>

                    {/* Wishlist */}
                    <div className="bg-white max-w-xl w-full rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Wishlist</h3>
                        <p className="text-gray-600 mb-4">
                            Check saved models that you want to buy later.
                        </p>
                        <Link
                            href="/account/wishlist"
                            className="text-blue-600 hover:underline"
                        >
                            View Wishlist
                        </Link>
                    </div>

                    {/* Payment & Billing */}
                    <div className="bg-white max-w-xl w-full rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">
                            Payment / Billing Info
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Update your saved cards and view billing history.
                        </p>
                        <Link
                            href="/account/billing"
                            className="text-blue-600 hover:underline"
                        >
                            Manage Billing
                        </Link>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-white max-w-xl w-full rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-2">Settings</h3>
                        <p className="text-gray-600 mb-4">
                            Manage your account preferences and security
                            settings.
                        </p>
                        <Link
                            href="/account/settings"
                            className="text-blue-600 hover:underline"
                        >
                            Go to Settings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
