"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
// import axios from "../utils/axiosInstance";
import axios from "axios";
const AuthContext = createContext();
import Env from "@/config/frontendEnv";

import { toast } from "react-toastify";

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); //
    const lastRefresh = useRef(0); // ✅ Add it here
    const refreshIntervalRef = useRef(null);
    const hasAddedFocusListener = useRef(false);

    const checkAuth = async () => {
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000";
            const res = await axios.get(`${apiUrl}/api/auth/check-auth`, {
                withCredentials: true,
            });
            setUser(res.data.user);
            setIsLoggedIn(true);
            console.log("✅ Auth check success ", res.data.user);
        } catch (err) {
            console.log(
                "🔴 Auth check failed front:",
                err?.response?.data?.message || err.message
            );
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false); // 👈 auth check done
        }
    };

    const refreshAccessToken = async () => {
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000";
            const res = await axios.get(`${apiUrl}/api/auth/refresh-token`, {
                withCredentials: true,
            });
            console.log("🔄 Access token refreshed");
            // if (res.status === 200) {
            //     console.log("🔁 Refresh token response status ==== 200 ", res.data);
            //     // Only fetch user again if not logged in
            //     // if (!isLoggedIn) await checkAuth();
            // }
            return true; // ✅ Indicate success
        } catch (error) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message || error.message;

            console.log("❌ Refresh token failed 2222:", message);
            if (status === 401) {
                console.log(
                    "🔒 Refresh token expired or invalid, logging out..."
                );
                setIsLoggedIn(false);
                setUser(null);

                // 🧹 Optional: Clear the interval
                if (refreshIntervalRef.current) {
                    clearInterval(refreshIntervalRef.current);
                    refreshIntervalRef.current = null;
                }
            }
            if (status === 403) {
                // console.log(
                //     "🔒 Refresh token expired or invalid, logging out..."
                // );
                toast.error("Session expired. Please log in again.", {
                    autoClose: 2500,
                    theme: "dark",
                });
                // alert('Session expired. Please log in again.')
                setIsLoggedIn(false);
                setUser(null);

                // 🧹 Optional: Clear the interval
                if (refreshIntervalRef.current) {
                    clearInterval(refreshIntervalRef.current);
                    refreshIntervalRef.current = null;
                }
                try {
                    const baseURL = window.location.hostname.includes(
                        "localhost"
                    )
                        ? "http://localhost:5000"
                        : "http://192.168.31.186:5000";

                    await axios.get(`${apiUrl}/api/auth/auto-cleanup`, {
                        withCredentials: true,
                    });

                    console.log("🧹 Expired token + cookies cleaned up");
                } catch (cleanupErr) {
                    console.log(
                        "❌ Auto-cleanup failed 1111 :",
                        cleanupErr.message
                    );
                }
            }
            return false; // ✅ Indicate failure
        } finally {
            // just in case this was the first check
            if (loading) setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            refreshAccessToken().then((success) => {
                if (success) {
                    sessionStorage.removeItem("reloadedAfterExpire"); // Optional
                    checkAuth();
                } else {
                    console.log(
                        "🔒 Refresh token failed — not checking session."
                    );
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!isLoggedIn || refreshIntervalRef.current) return;

        refreshIntervalRef.current = setInterval(() => {
            refreshAccessToken();
        }, 50 * 1000); // or 28.5 * 60 * 1000 in prod

        return () => {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        };
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn || hasAddedFocusListener.current) return;

        const handleFocus = () => {
            const now = Date.now();
            if (now - lastRefresh.current > 5 * 60 * 1000) {
                console.log("👁️ Tab focused - refreshing token...");
                lastRefresh.current = now;
                refreshAccessToken();
            }
        };

        window.addEventListener("focus", handleFocus);
        hasAddedFocusListener.current = true;

        return () => {
            window.removeEventListener("focus", handleFocus);
            hasAddedFocusListener.current = false;
        };
    }, [isLoggedIn]);
    // 4️⃣ Sync login/logout across tabs
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "auth-change") {
                const action = event.newValue;
                if (action === "login") {
                    console.log("📥 Detected login in another tab");
                    checkAuth();
                } else if (action === "logout") {
                    console.log("📤 Detected logout in another tab");
                    setIsLoggedIn(false);
                    setUser(null);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);
    return (
        <AuthContext.Provider
            value={{ isLoggedIn, setIsLoggedIn, user, setUser, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
