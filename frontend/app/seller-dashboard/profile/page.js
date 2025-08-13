"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
    const router = useRouter();
    const { user, loading, isLoggedIn } = useAuth();
    const sellerInfo = user;
 
    if (loading) {
        return <p>Loading user info...</p>;
    }

    if (!isLoggedIn || !user) {
        return <p>Please log in to view your profile.</p>;
    }
    // useEffect(
    //    () => {
        // },
        // [user]
        // );
        const handleEdit = (e) => {
        console.log("User info loaded:", user.profilePic);
        router.replace("/seller-dashboard/profile/edit");
    };
    return (
        <div className="max-w-4xl mx-auto pt-21 px-4 mb-14">
            <div className="bg-white rounded-xl  shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r bg-[#9290e1] p-6 text-white flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src={sellerInfo.profilePic || `/random/user.png`}
                            alt="Profile"
                            className="w-30 h-30 rounded-full  object-cover border-4 border-white"
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-[#1c1c1c]">
                                {sellerInfo.name}
                            </h2>
                            <p className="text-sm text-[#1c1c1c]">
                                @{sellerInfo.userName}
                            </p>
                        </div>
                    </div>
                </div>
 
                <div className="p-6 grid md:grid-cols-2 gap-x-6 gap-y-4">
                    {[
                        { label: "Name", field: "name" },
                        { label: "Username", field: "userName" },
                        { label: "Email", field: "email" },
                        {
                            label: "Mobile Number",
                            field: "mobile",
                            render: (info) => (
                                <>
                                    {info.countryCode || "+91 "}&nbsp;&nbsp;
                                    {info.mobile || ""}
                                </>
                            ),
                        },
                        { label: "Specialized In", field: "specializedIn" },
                    ].map(({ label, field, render }) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                {label}
                            </label>
                            <p className="text-gray-800 font-medium">
                                {render
                                    ? render(sellerInfo)
                                    : sellerInfo[field]}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="float-right mr-8 mb-6">
                    <button
                        onClick={handleEdit}
                        className="bg-[#7a76dc] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#6a68c9] transition-colors duration-200"
                    >
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
