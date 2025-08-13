"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    UserCircle,
    Home,
    PlusCircle,
    BarChart,
    ClipboardCheck,
    CreditCard,
    Settings,
    Bell,
    ShieldCheck,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import SimpleLoader from "@/components/SimpleLoader";
import DotLoader from "@/components/Dotloader";

export default function SellerDashboard() {
    const router = useRouter();
    const [sellerName, setSellerName] = useState("Seller");
    const { user } = useAuth();
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("sellerBasicData"));
        if (data?.fullName) setSellerName(data.fullName);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/");
    };

    const dashboardItems = [
        {
            icon: <UserCircle size={20} />,
            label: "Profile",
            hrefLink: "/seller-dashboard/profile",
        },
        {
            icon: <PlusCircle size={20} />,
            label: "Add New Models",
            hrefLink: "/seller-dashboard/add-new-model",
        },
        {
            icon: <Home size={20} />,
            label: "Listed Models",
            hrefLink: "/seller-dashboard/listing",
        },
        {
            icon: <BarChart size={20} />,
            label: "Sales/Booking Stats",
            hrefLink: "/seller-dashboard/sales-stats",
        },
        {
            icon: <ClipboardCheck size={20} />,
            label: "Recent Orders/Bookings",
            hrefLink: "/seller-dashboard/recent-purchases",
        },
        {
            icon: <CreditCard size={20} />,
            label: "Payment Details",
            hrefLink: "/seller-dashboard/manage-account",
        },
        {
            icon: <Bell size={20} />,
            label: "Announcements/Notifications",
            hrefLink: "/seller-dashboard/notifications",
        },
        {
            icon: <Settings size={20} />,
            label: "Settings",
            hrefLink: "/seller-dashboard/settings",
        },
        // { icon: <ShieldCheck size={20} />, label: "KYC/Verification Status" },
    ];
// if(!user) return <div className="h-fit pt-50"><DotLoader/></div>
// if(user) return <div className="h-[100vh] flex justify-center items-center bg-[#00000038] absolute w-full"><DotLoader/></div>
// if(user) return <div className="pt-50"><SimpleLoader/></div>
    return (
        <section className="max-w-5xl mb-13 mx-auto px-4 pt-18 md:pt-21">
            <h1 className="md:text-3xl text-xl font-bold mb-6">
                Welcome, {user?.name || `...`} 👋
            </h1>

            <div className="grid md:grid-cols-2 lg:grisd-cols-3 gap-6">
                {dashboardItems.map((item, idx) => (
                    <div key={idx}>
                        <Link href={item.hrefLink}>
                            <div className="flex items-center p-4 hover:bg-[#7a76dc] hover:text-[#fff] custom-shadow-seller-dash rounded hover:shadow-md cursor-pointer transition">
                                <div className="p-2 bg-blue-100 text-black rounded-full mr-4">
                                    {item.icon}
                                </div>
                                <span className="font-medium ">
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    </div>
                ))}

                {/* Logout */}
            </div>
        </section>
    );
}
