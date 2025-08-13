"use client";
import { useState,useEffect } from "react";

export default function AccountSettingsPage() {
    const [sessions, setSessions] = useState([]);
    const [currentUserAgent, setCurrentUserAgent] = useState("");
    // GET /api/account/sessions
    useEffect(() => {
        setCurrentUserAgent(navigator.userAgent);
        fetchSessions();
    }, []);
    const baseURL = process.env.NODE_ENV === "development"
  ? "http://localhost:5000"
  : "https://api.yourdomain.com";

    const fetchSessions = async () => {
        try {
            const res = await fetch(`${baseURL}/api/account/sessions`, {
                credentials: "include",
            });
            const data = await res.json();
            setSessions(data);
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
        }
    };
    const handleLogoutFromDevice = async (id) => {
        const confirm = window.confirm("Logout from this device?");
        if (!confirm) return;
        await fetch(`/api/account/sessions/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        fetchSessions();
    };

    const handleLogoutAll = async () => {
        const confirm = window.confirm("Logout from ALL devices?");
        if (!confirm) return;
        await fetch(`/api/account/sessions`, {
            method: "DELETE",
            credentials: "include",
        });
        fetchSessions();
    };

    const handleDeactivate = () => {
        if (
            window.confirm(
                "Are you sure you want to delete your account? This cannot be undone."
            )
        ) {
            alert("Account deleted");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 text-center">
                Account Settings
            </h2>

            <div className="space-y-6">
                {/* Logout buttons */}
                <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow">
                    <span className="text-gray-700 font-medium">
                        Logout from this device
                    </span>
                    <button
                        onClick={() =>
                            sessions.forEach((s) => {
                                if (s.userAgent === currentUserAgent)
                                    handleLogoutFromDevice(s.id);
                            })
                        }
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow">
                    <span className="text-gray-700 font-medium">
                        Logout from all devices
                    </span>
                    <button
                        onClick={handleLogoutAll}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Logout All
                    </button>
                </div>

                {/* Devices list */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Logged In Devices
                    </h3>
                    <ul className="space-y-4">
                        {sessions.map((session) => (
                            <li
                                key={session.id}
                                className="border-b pb-4 last:border-none"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            {session.userAgent} - {session.ip}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                session.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    {session.userAgent === currentUserAgent && (
                                        <span className="text-green-600 font-semibold text-sm">
                                            Current
                                        </span>
                                    )}
                                    <button
                                        onClick={() =>
                                            handleLogoutFromDevice(session.id)
                                        }
                                        className="text-red-500 text-sm underline"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Danger zone */}
                <div className="bg-red-50 p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-red-600 mb-3">
                        Danger Zone
                    </h3>
                    <p className="text-gray-700 mb-4">
                        Deleting your account will permanently erase your data.
                        This action cannot be undone.
                    </p>
                    <button
                        onClick={handleDeactivate}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition"
                    >
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
}
