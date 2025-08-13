// utils/axiosInstance.js
import axios from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 🔐 If refresh token is invalid or expired
        if (
            error.response?.status === 403 &&
            originalRequest.url.includes("/refresh-token")
        ) {
            console.warn("🔒 Refresh token expired. Logging out.");
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }

        // 🔁 If access token expired (401), try to refresh it
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;
            try {
                console.log("⏳ Trying to refresh access token...");
                await axiosInstance.get(`/api/auth/refresh-token`);
                console.log("✅ Token refreshed successfully");
                isRefreshing = false;
                processQueue(null);
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error("❌ Failed to refresh token:", err.message);
                isRefreshing = false;
                processQueue(err, null);
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
