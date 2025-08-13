"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setshowPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [isValid, setIsValid] = useState(true);
    //   const [showPassword, setshowPassword] = useState(false);
    const PasswordRef = useRef(null);
    const ConfirmPasswordRef = useRef(null);
    // const [confirmPassword, setConfirmPassword] = useState("");
    //   const [showConfirmPassword, setshowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(60);
    const [finalData, setFinalData] = useState(null);
    const [validPassword, setValidPassword] = useState(true);
    const [passwordlength, setPasswordLength] = useState(true);
    const [mustrequiredpassword, setMustRequiredPassword] = useState(true);
    const [password, setPassword] = useState("");
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
    const handleSubmit = (e) => {
        e.preventDefault();

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
        // ✅ Save or send to server
        localStorage.setItem("userPassword", newPassword);

        router.push("/account"); 
        
    };

    return (
        <div className="">
            <div className="m-auto py-70 w-full flex justify-center items-center ">
                <div className="max-w-md mx-auto mt-10 p-6 bg-[#caddff] shadow-xl rounded-lg top-18 py-8 px-2 absolute sm:py-8 sm:px-4 w-full">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Reset Password{" "}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex justify-center flex-col px-5">
                            <p className="pb-0.5">Password</p>
                            <div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    ref={PasswordRef}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setValidPassword(true);
                                        setPasswordLength(true);
                                        setMustRequiredPassword(true);
                                    }}
                                    className="w-full p-2 pl-3 sm:pr-9 pr-10 bg-[#fafbff] relative step1input focus:bg-[#f5f9ff] focus:outline-none ring-[.5px] rounded"
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
                            <p className="pb-0.5 mt-4">Confirm Password </p>
                            <div>
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
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
                        <div className="w-full max-w-100 px-5 mt-5 flex justify-center">
                            <button
                                type="submit"
                                className="bg-[#373737] text-white px-4 py-2 cursor-pointer rounded hover:bg-[#2f2f2f]"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
