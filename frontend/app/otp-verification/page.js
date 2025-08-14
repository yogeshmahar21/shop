"use client";
import { Buffer } from "buffer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-toastify";
import Env from "@/config/frontendEnv";


const OTPVerificationPage = () => {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect");
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    // console.log("redirecintt this ", redirectTo);
    const router = useRouter();
    const redirectPath = searchParams.get("redirect") || "/account";
    const { setIsLoggedIn, user, setUser } = useAuth();
    const [otp, setOtp] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [timer, setTimer] = useState(5);
    const [finalData, setFinalData] = useState(null);
    const [isBlocked, setIsBlocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [femail, setFemail] = useState("");
    // 1. Load seller data from localStorage
    // const email = searchParams.get("email");
    const getType = searchParams.get("type");
    const signupinfo = JSON.parse(localStorage.getItem("signupData") || "{}");
    const sellerinfo = JSON.parse(
        localStorage.getItem("sellerBasicData") || "{}"
    );
    const forgotpassOutinfo = JSON.parse(
        localStorage.getItem("forgotpassOutemail") || "{}"
    );
    const paymentinfo = JSON.parse(localStorage.getItem("paymentData") || "{}");
    const forgotlogininfo = JSON.parse(
        localStorage.getItem("forgotPassLogined") || "{}"
    );
    const profileUpdateinfo = JSON.parse(
        localStorage.getItem("accountupdate") || "{}"
    );
    const sellerUpdateinfo = JSON.parse(
        localStorage.getItem("sellerupdateData") || "{}"
    );
    // useEffect(() => {
    // });
    useEffect(() => {
        console.log('seller sata 1213123 ',sellerUpdateinfo)
        if (getType === "signup") setFinalData(signupinfo);
        else if (getType === "becomeSeller") setFinalData(sellerinfo);
        else if (getType === "forgotpasswordout")
            setFinalData(forgotpassOutinfo);
        else if (getType === "forgotPassLogined") setFinalData(forgotlogininfo);
        else if (getType === "accountupdate") setFinalData(profileUpdateinfo);
        else if (getType === "selleraccountupdate")
            setFinalData(sellerUpdateinfo);

        // else if (getType === "accountupdate") setFinalData(accountinfo); // or whatever applies
        // Set a timeout: 20 minutes (in ms)
        const timeout = setTimeout(
            () => {
                if (getType === "becomeSeller") {
                    localStorage.removeItem("sellerBasicData"); // clear data
                    localStorage.removeItem("paymentData"); // clear data
                    router.replace("/become-seller"); // Redirect if no data
                    alert("Session expired! Please try again.");
                    return;
                }
                if (getType === "selleraccountupdate") {
                    localStorage.removeItem("sellerupdateData"); // clear data
                    router.replace("/seller-dashboard"); // Redirect if no data
                    alert("Session expired! Please try again.");
                    return;
                }
                if (getType === "signup") {
                    localStorage.removeItem("signupData");
                    router.replace("/auth/signup"); // Redirect if no data
                    alert("Session expired! Please try again.");
                    return;
                }
                if (getType === "forgotpasswordout") {
                    localStorage.removeItem("forgotpassOutemail");
                    router.replace("/auth/signup"); // Redirect if no data
                    alert("Session expired! Please try again.");
                    return;
                }
                if (getType === "forgotPassLogined") {
                    localStorage.removeItem("forgotPassLogined");
                    router.replace("/account"); // Redirect if no data
                    alert("Session expired! Please try again.");
                    return;
                }
                if (getType === "accountupdate") {
                    localStorage.removeItem("accountupdate");
                    router.replace("/account"); // Redirect if no data
                    alert("Session expired! Please try again.");
                    return;
                }
            },
            20 * 60 * 1000
        ); // 20 minutes

        // Cleanup timeout on unmount
        return () => clearTimeout(timeout);
    }, [router]);
    // 2. Timer countdown

    // 3. Mask email
    const maskEmail = (email) => {
        if (!email) return;
        const [user, domain] = email.split("@");
        if (user.length <= 2) return "*".repeat(user.length) + "@" + domain;
        return (
            user[0] +
            "*".repeat(user.length - 2) +
            user[user.length - 1] +
            "@" +
            domain
        );
    };
    const maskedEmail = finalData?.email ? maskEmail(finalData.email) : "";

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // 4. OTP input change
    const handleOtpChange = (e) => {
        setIsValid(true);
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return;
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    // 5. Handle OTP paste
    const handleOtpPaste = (e) => {
        const pastedValue = e.clipboardData.getData("Text").slice(0, 6);
        if (/^\d{4,6}$/.test(pastedValue)) {
            setOtp(pastedValue);
        }
    };

    // 6. Handle form submit

    const handleSubmit = async (e) => {
        // localStorage.removeItem('signupData')
        e.preventDefault();
        if (getType === "signup") {
            if (otp === "") {
                return setIsValid(false);
            }
            try {
                //   throw new Error("This is a test error");
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000"; // 👈 your actual IP

                const verifyRes = await fetch(`${apiUrl}/api/otp/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: finalData.email,
                        otp: otp,
                        type: 'signup',
                    }),
                });

                const verifyData = await verifyRes.json();

                if (!verifyRes.ok) {
                    toast.error(
                        verifyData.message || "Invalid or expired OTP",
                        {
                            autoClose: 2500,
                            theme: "dark",
                        }
                    );
                    if (verifyData.redirect) {
                        setTimeout(() => {
                            window.location.href = verifyData.redirect;
                        }, 2000);
                    }

                    return;
                }
                const res = await fetch(`${apiUrl}/api/auth/register`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: finalData.name,
                        email: finalData.email,
                        isSeller: finalData.isSeller || false,
                        mobile: finalData.mobile,
                        countryCode: finalData.countryCode || "+91",
                    }),
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.removeItem("signupData");
                    toast.success("🎉 Signup successful!", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                    setIsLoggedIn(true);
                    setUser(data);
                    router.replace(redirectPath);
                } else {
                    toast.error(data.message || "Signup failed", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                }
            } catch (error) {
                const msg =
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong";

                // Show alert and check for rate limit block
                if (msg.includes("Too many")) {
                    toast.error("❌ Too many attempts. Try again later", {
                        autoClose: 3000,
                        theme: "dark",
                    });

                    // Redirect to signup page after short delay
                    setTimeout(() => {
                        window.location.href = "/auth/signup";
                    }, 2000);

                    return; // Stop further execution
                }

                toast.error(msg, {
                    autoClose: 2500,
                    theme: "dark",
                });
            }
        }

        if (getType === "forgotpasswordout") {
            if (otp === "") {
                return setIsValid(false);
            }
            try {
                //   throw new Error("This is a test error");
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000"; // 👈 your actual IP

                const verifyRes = await fetch(`${apiUrl}/api/otp/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: finalData.email,
                        otp: otp,
                    }),
                });

                const verifyData = await verifyRes.json();

                if (!verifyRes.ok) {
                    toast.error(
                        verifyData.message || "Invalid or expired OTP",
                        {
                            autoClose: 2500,
                            theme: "dark",
                        }
                    );
                    if (verifyData.redirect) {
                        setTimeout(() => {
                            router.replace("/auth/login");
                        }, 1000);
                    }

                    return;
                }

                router.replace(`/reset-password?redirect=/auth/login`);
            } catch (error) {
                const msg =
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong";

                // Show alert and check for rate limit block
                if (msg.includes("Too many")) {
                    toast.error("❌ Too many attempts. Try again later", {
                        autoClose: 3000,
                        theme: "dark",
                    });

                    // Redirect to signup page after short delay
                    setTimeout(() => {
                        window.location.href = "/auth/signup";
                    }, 2000);

                    return; // Stop further execution
                }

                toast.error(msg, {
                    autoClose: 2500,
                    theme: "dark",
                });
            }
        }

        if (getType === "forgotPassLogined") {
            if (otp === "") {
                return setIsValid(false);
            }
            try {
                //   throw new Error("This is a test error");
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000"; // 👈 your actual IP

                const verifyRes = await fetch(`${apiUrl}/api/otp/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: finalData.email,
                        otp: otp,
                    }),
                });

                const verifyData = await verifyRes.json();

                if (!verifyRes.ok) {
                    toast.error(
                        verifyData.message || "Invalid or expired OTP",
                        {
                            autoClose: 2500,
                            theme: "dark",
                        }
                    );
                    if (verifyData.redirect) {
                        setTimeout(() => {
                            router.replace("/account");
                        }, 1000);
                    }

                    return;
                }

                router.replace(
                    `/reset-password?email=${encodeURIComponent(finalData.email)}&redirect=/account`
                );
            } catch (error) {
                const msg =
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong";

                // Show alert and check for rate limit block
                if (msg.includes("Too many")) {
                    toast.error("❌ Too many attempts. Try again later", {
                        autoClose: 3000,
                        theme: "dark",
                    });

                    // Redirect to signup page after short delay
                    setTimeout(() => {
                        window.location.href = "/auth/signup";
                    }, 2000);

                    return; // Stop further execution
                }

                toast.error(msg, {
                    autoClose: 2500,
                    theme: "dark",
                });
            }
        }

        if (getType === "accountupdate") {
            if (otp === "") {
                return setIsValid(false);
            }
            try {
                //   throw new Error("This is a test error");
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000"; // 👈 your actual IP

                const verifyRes = await fetch(`${apiUrl}/api/otp/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: finalData.email,
                        otp: otp,
                    }),
                });

                const verifyData = await verifyRes.json();

                if (!verifyRes.ok) {
                    toast.error(
                        verifyData.message || "Invalid or expired OTP",
                        {
                            autoClose: 2500,
                            theme: "dark",
                        }
                    );
                    if (verifyData.redirect) {
                        setTimeout(() => {
                            window.location.href = "/account";
                        }, 2000);
                    }

                    return;
                }
                const res = await fetch(`${apiUrl}/api/user/update-profile`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(finalData),
                });
                const data = await res.json();
                if (res.ok) {
                    toast.success("Profile updated successfully!", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                    setUser(data.updatedUser);
                    router.replace("/account");
                } else {
                    toast.error(data.message || "Failed to update profile.", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                }
            } catch (error) {
                const msg =
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong";

                // Show alert and check for rate limit block
                if (msg.includes("Too many")) {
                    toast.error("❌ Too many attempts. Try again later", {
                        autoClose: 3000,
                        theme: "dark",
                    });

                    // Redirect to signup page after short delay
                    setTimeout(() => {
                        window.location.href = "/account";
                    }, 2000);

                    return; // Stop further execution
                }

                toast.error(msg, {
                    autoClose: 2500,
                    theme: "dark",
                });
            }
            // alert("account update ");
        }
        if (getType === "selleraccountupdate") {
            if (otp === "") {
                return setIsValid(false);
            }
            try {
                //   throw new Error("This is a test error");
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000"; // 👈 your actual IP

                const verifyRes = await fetch(`${apiUrl}/api/otp/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: finalData.email,
                        otp: otp,
                    }),
                });

                const verifyData = await verifyRes.json();

                if (!verifyRes.ok) {
                    toast.error(
                        verifyData.message || "Invalid or expired OTP",
                        {
                            autoClose: 2500,
                            theme: "dark",
                        }
                    );
                    if (verifyData.redirect) {
                        setTimeout(() => {
                            window.location.href = "/seller-dashboard";
                        }, 2000);
                    }

                    return;
                }
                const payload = new FormData();
                payload.append("name", finalData.name);
                payload.append("userName", finalData.userName);
                payload.append("email", finalData.email);
                payload.append("mobile", finalData.mobile);
                payload.append("specializedIn", finalData.specializedIn);
                payload.append("countryCode", finalData.countryCode || "+91");
                payload.append("gender", finalData.gender || "Male");
                if (finalData.profileFile) {
                    payload.append("profilePic", finalData.profileFile); // 👈 must match backend multer field name
                }

                const res = await fetch(
                    `${apiUrl}/api/user/update-profile`,
                    {
                        method: "PUT",
                        credentials: "include",
                        body: payload, // 👈 send FormData
                    }
                );
                const data = await res.json();
                if (res.ok) {
                    toast.success("Profile updated successfully!", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                    setUser(data.updatedUser);
                    router.replace("/seller-dashboard/profile");
                } else {
                    toast.error(data.message || "Failed to update profile.", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                }
            } catch (error) {
                const msg =
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong";

                // Show alert and check for rate limit block
                if (msg.includes("Too many")) {
                    toast.error("❌ Too many attempts. Try again later", {
                        autoClose: 3000,
                        theme: "dark",
                    });

                    // Redirect to signup page after short delay
                    setTimeout(() => {
                        window.location.href = "/seller-dashboard";
                    }, 2000);

                    return; // Stop further execution
                }

                toast.error(msg, {
                    autoClose: 2500,
                    theme: "dark",
                });
            }
            // alert("account update ");
        }

        if (getType === "becomeSeller") {
            if (otp === "") {
                return setIsValid(false);
            }
            const userId = user._id;
            // const formData = JSON.parse(
            //     localStorage.getItem("sellerBasicData")
            // );
            console.log("error is here", finalData);
            // const paymentData = JSON.parse(localStorage.getItem("paymentData"));
            const body = {
                userId,
                userName: finalData.userName,
                specializedIn: finalData.specializedIn,
                paymentinfo,
            };
            console.log("paymenty data details ", paymentinfo);
            try {
                //   throw new Error("This is a test error");
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000"; // 👈 your actual IP

                const verifyRes = await fetch(`${apiUrl}/api/otp/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: finalData.email,
                        otp: otp,
                    }),
                });

                const verifyData = await verifyRes.json();

                if (!verifyRes.ok) {
                    toast.error(
                        verifyData.message || "Invalid or expired OTP",
                        {
                            autoClose: 2500,
                            theme: "dark",
                        }
                    );
                    if (verifyData.redirect) {
                        setTimeout(() => {
                            window.location.href =
                                "/beocme-seller/final-confirmation";
                        }, 2000);
                    }

                    return;
                }
                const res = await fetch(`${apiUrl}/api/seller/become`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });

                const data = await res.json();

                if (res.ok) {
                    setUser(data.user);
                    toast.success("Registered Successfully", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                    localStorage.removeItem("paymentData");
                    localStorage.removeItem("sellerBasicData");
                    console.log("✅ Seller data saved:", data);
                    router.replace("/seller-dashboard");
                } else {
                    toast.error(
                        data.message || "Failed to register as seller.",
                        {
                            autoClose: 2500,
                            theme: "dark",
                        }
                    );
                    console.error("❌ Error saving seller data:", data.message);
                }
            } catch (error) {
                const msg =
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong";

                // Show alert and check for rate limit block
                if (msg.includes("Too many")) {
                    toast.error("❌ Too many attempts. Try again later", {
                        autoClose: 3000,
                        theme: "dark",
                    });

                    // Redirect to signup page after short delay
                    setTimeout(() => {
                        window.location.href = "/account";
                    }, 2000);

                    return; // Stop further execution
                }

                toast.error(msg, {
                    autoClose: 2500,
                    theme: "dark",
                });
            }
        }

        // if (otp === "11ss1111") {
        //     setIsValid(true);
        //     // router.replace(redirectTo || "/default-route");
        //     if (user) {
        //         try {
        //             const baseURL = window.location.hostname.includes(
        //                 "localhost"
        //             )
        //                 ? "http://localhost:5000"
        //                 : "http://192.168.31.186:5000";

        //             console.log("endcode sdad", finalData);
        //             // 👇 Send updated email to backend
        //             const res = await fetch(
        //                 `${baseURL}/api/user/update-profile`,
        //                 {
        //                     method: "PUT",
        //                     credentials: "include",
        //                     headers: {
        //                         "Content-Type": "application/json",
        //                     },
        //                     body: JSON.stringify(finalData),
        //                 }
        //             );

        //             const data = await res.json();
        //             if (res.ok) {
        //                 // 👇 Optional: update AuthContext user
        //                 setUser(data.updatedUser);
        //                 alert("✅ Email updated successfully!");
        //                 router.replace(redirectTo || "/account");
        //             } else {
        //                 alert(data.message || "Failed to update email.");
        //             }
        //         } catch (err) {
        //             alert("Error updating email. Please try again.");
        //             console.log("error to updating the data ", err);
        //         }
        //     } else {
        //         //    code for register user
        //     }
        // } else {
        //     // setIsValid(false);
        //     // alert('add type plz in thsi [page]')
        // }
    };

    // 7. Resend OTP
    const handleResendOTP = async (e) => {
        e.preventDefault();
        if (timer > 0 || isBlocked || loading) {
            console.log(timer, isBlocked, loading);
            alert("return");
            return;
        }
        setLoading(true);
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000";

            const res = await fetch(`${apiUrl}/api/otp/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: finalData.email,
                    name: finalData.name,
                    type: getType,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setTimer(6); // reset timer
                console.log("OTP resent");
                toast.success(" OTP sent successfully", {
                    autoClose: 2000,
                    theme: "dark",
                });
            } else {
                toast.error(data.message || "Failed to resend OTP", {
                    autoClose: 2500,
                    theme: "dark",
                });
                console.log("reditecterd padea ", data);
                if (data.redirect) {
                    if (getType === "accountupdate") {
                        window.location.href = "/account";
                    } else if (getType === "forgotPassLogined") {
                        window.location.href = "/account";
                    } else if (getType === "signup") {
                        window.location.href = "/auth/signup";
                    } else if (getType === "forgotPassWithoutLogin") {
                        window.location.href = "/auth/signup";
                    }
                }
                if (res.status === 429) setIsBlocked(true);
            }
        } catch (err) {
            toast.error(" Server error", {
                autoClose: 2000,
                theme: "dark",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center bg-[#f5f5f5]">
            <img
                className="relative w-full hidden md:flex md:min-h-150 max-w-[1370px]"
                src="/otps.webp"
                alt="background"
            />
            <img
                className="relative min-h-[80vh] object-cover w-full md:hidden flex"
                src="/fotp.avif"
                alt="background"
            />

            <div className=" bg-wdhite custom-shadow-otp bg-[#ffffffae] md:bg-[#fafafa] backdrop-blur-[8px] py-8 px-2 absolute sm:py-8 sm:px-4 rounded-lg max-w-100 w-full">
                <h2 className="text-2xl font-bold text-center mb-3">
                    OTP Verification
                </h2>
                <p className="text-center text-sm text-black mb-0">
                    We&apos;ve sent a verification code to
                </p>
                <p className="text-center font-semibold text-[#444] mb-4">
                    {maskedEmail}
                </p>
                <form onSubmit={handleSubmit} className="">
                    <div className="flex justify-center mb-2 mt-6">
                        <input
                            type="text"
                            inputMode="numeric" // Show numeric keypad on mobile
                            pattern="[0-9]*"
                            value={otp}
                            onChange={handleOtpChange}
                            onPaste={handleOtpPaste}
                            placeholder="OTP"
                            maxLength={6}
                            className="max-w-70 w-auto h-12 text-center text-xl ring-1 border-gray-300 rounded-lg focus:ring-1 focus:outline-0"
                            style={{
                                letterSpacing: "8px",
                            }}
                        />
                    </div>

                    {!isValid && (
                        <p className="text-[#ff112d] text-center">
                            Invalid OTP, please try again.
                        </p>
                    )}
                    {getType === "forgotPassWithoutLogin" && (
                        <p className="text-center text-[#2f7a1c] text-[12px] m-0 px-2">
                            *If this email is not registered, you will not
                            receive any OTP.
                        </p>
                    )}

                    <div className="w-full max-w-100 px-5 ">
                        <button
                            type="submit"
                            className={`cursor-pointer w-full py-2 bg-[#1f1f1f] text-[#e1e1e1] rounded
                                ${!isValid ? "mt-3" : "mt-5"}`}
                        >
                            Verify OTP
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <div className="mt-4 text-sm">
                            <p className="text-sm text-black mb-1">
                                Didn't receive the OTP?
                            </p>
                            {timer > 0 ? (
                                <p className=" text-black">
                                    Resend OTP in{" "}
                                    <span className="font-semibold">
                                        {timer}s
                                    </span>
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendOTP}
                                    className="text-[#001eff] underline cursor-pointer hover:underline"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPVerificationPage;
