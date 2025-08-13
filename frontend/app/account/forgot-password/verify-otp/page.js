"use client";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState,useRef, useEffect } from "react";
import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OTPVerificationPage = () => {
    const [otp, setOtp] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [showPassword, setshowPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(60);
    const [finalData, setFinalData] = useState(null);
    const [validPassword, setValidPassword] = useState(true);
    const [passwordlength, setPasswordLength] = useState(true);
    const [mustrequiredpassword, setMustRequiredPassword] = useState(true);
    const [password, setPassword] = useState("");
        const PasswordRef = useRef(null);
        const ConfirmPasswordRef = useRef(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    // 1. Load seller data from localStorage
    useEffect(() => {
        const userEmail = localStorage.getItem("userEmail");
        // console.log(savedData)
        if (userEmail) { 
            setFinalData(userEmail);
        }
    }, []);

    // 2. Timer countdown
    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

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

    const maskedEmail = maskEmail(finalData);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setValidPassword(false);
            return;
        }
        if (password.length < 8) {
            setPasswordLength(false);
            return;
        }
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

        if (!strongPasswordRegex.test(password)) {
            setMustRequiredPassword(false);
            return;
        }
        if (otp === "111111") {
            setIsValid(true);
            console.log("OTP validated successfully!");
            router.push("/account");
        } else {
            setIsValid(false);
        }
    };

    // 7. Resend OTP
    const handleResendOTP = () => {
        setTimer(30); // Restart timer
        console.log("OTP resent");
    };
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

            <div className=" top-18 bg-wdhite custom-shadow-otp bg-[#ffffffae] md:bg-[#fafafa] backdrop-blur-[8px] py-8 px-2 absolute sm:py-8 sm:px-4 rounded-lg max-w-100 w-full">
                <h2 className="text-2xl font-bold text-center mb-3">
                    OTP Verification
                </h2>
                <p className="text-center text-sm text-black mb-1">
                    We’ve sent a verification code to
                </p>
                <p className="text-center font-semibold text-[#444] mb-4">
                    {maskedEmail}
                </p>

                <form onSubmit={handleSubmit} className="">
                    <div className="flex justify-center flex-col px-5">
                        <p className="pb-0.5">Password</p>
                        <div>

                        <input
                             type={showPassword ? "text" : "password"}
                             name="password"
                             placeholder="Password"
                             required
                             value={password} ref={PasswordRef}
                             onChange={(e) => {
                                 setPassword(e.target.value);
                                 setValidPassword(true);
                                 setPasswordLength(true);
                                 setMustRequiredPassword(true);
                                }}
                                className="w-full p-2 pl-3 sm:pr-9 pr-10 bg-[#fafbff] step1input focus:bg-[#f5f9ff] focus:outline-none ring-[.5px] rounded"
                                />
                        <button
                            type="button"
                            className="absolute sm:right-12 right-10.5 mt-5 cursor-pointer transform -translate-y-1/2"
                            onClick={() =>
                                togglePasswordVisibility(
                                    "password",
                                    setshowPassword,
                                    PasswordRef
                                )
                            }
                            >
                            {showPassword ? (
                                <FaEyeSlash className="text-gray-600" />
                            ) : (
                                <FaEye className="text-gray-600" />
                            )}
                        </button>
                            </div>
                        <p className="pb-0.5 mt-3">Confirm Password </p>
                        <div>

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                            value={confirmPassword}
                            ref={ConfirmPasswordRef}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setValidPassword(true);
                                setPasswordLength(true);
                                setMustRequiredPassword(true);
                            }}
                            className="w-full mb-1 p-2 pl-3 sm:pr-9 pr-10 bg-[#fafbff] step1input focus:bg-[#f5f9ff] focus:outline-none ring-[.5px] rounded"
                            />
                              <button
                            type="button"
                            className="absolute sm:right-12 right-10.5 mt-5 cursor-pointer transform -translate-y-1/2"
                            onClick={() =>
                                togglePasswordVisibility(
                                    "password",
                                    setshowConfirmPassword,
                                    ConfirmPasswordRef
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
                        {!validPassword && (
                            <p className="text-[#ff112d] text-center">
                                Password must match.
                            </p>
                        )}
                        {!passwordlength && (
                            <p className="text-[#ff112d] text-center">
                                At least 8 characters in password.
                            </p>
                        )}
                        {!mustrequiredpassword && (
                            <p className="text-[#ff112d] text-center">
                                Password must include uppercase, lowercase,
                                number & special character.
                            </p>
                        )}
                    </div>
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
