"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Env from "@/config/frontendEnv";

export default function LoginPage() {
    // At the top of your LoginPage or SignupPage
    const apiUrl = Env.LOCAL_URL || Env.IP_URL;
    const searchParams = useSearchParams();
    // const redirectPath = searchParams.get("redirect") || "/";
    const [redirectPath, setRedirectPath] = useState("/account");
    //  const searchParams = useSearchParams();
    // const redirectPath = searchParams.get("redirect") || "/";
    const { setIsLoggedIn, setUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("jimmyandtone207@gmail.com");
    const [password, setPassword] = useState("Yogesh@53");
    const [message, setMessage] = useState("");
    const [validLogin, setValidLogin] = useState(true);
    const [enterEmail, setEnterEmail] = useState(true);
    const [enterPassword, setEnterPassword] = useState(true);
    const router = useRouter();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    useEffect(() => {
        const redirect = searchParams.get("redirect") || "/account";
        if (redirect) {
            setRedirectPath(redirect);
        }
    }, [searchParams]);

    const handleLoginClick = async (e, forceLogin = false) => {
        e.preventDefault();
        
        setMessage("");

        if (!email) {
            emailRef.current?.focus();
            setEnterEmail(false);
            return;
        }
        if (!password) {
            passwordRef.current?.focus();
            setEnterPassword(false);
            return;
        }

        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000";
            console.log(`api url  ${apiUrl}`);
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                credentials: "include", // ✅ so cookies get set
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, forceLogin }), // ⬅️ include forceLogin
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data);
                setIsLoggedIn(true);
                // ✅ Sync login across tabs
                localStorage.setItem("auth-change", "login");
                localStorage.removeItem("auth-change");

                toast.success("Login successful ✅", {
                    autoClose: 2500,
                    theme: "dark",
                });
                router.replace(redirectPath);
            } else if (res.status === 409 && data.sessionLimit) {
                // 🚨 Already logged in on 5 devices
                const confirm = window.confirm(
                    "You are already logged in on 5 devices. Click OK to remove the oldest session and continue logging in."
                );
                if (confirm) {
                    // 🔄 Try again with forceLogin true
                    handleLoginClick(e, true);
                } else {
                    toast.info("Login cancelled", { theme: "dark" });
                }
            } else {
                setValidLogin(false);
                toast.error(data.message || "Login failed", {
                    autoClose: 2500,
                    theme: "dark",
                });
            }
        } catch (error) {
            setValidLogin(false);
            toast.error("Something went wrong. Please try again later.", {
                autoClose: 2500,
                theme: "dark",
            });
        }
    };

    // const handleLoginClick = async (e) => {
    //     e.preventDefault();
    //     setMessage("");
    //     if (!email) {
    //         emailRef.current?.focus();
    //         setEnterEmail(false);
    //         // alert("enter email")
    //         return;
    //     }
    //     if (!password) {
    //         passwordRef.current?.focus();
    //         setEnterPassword(false);
    //         return;
    //     }

    //     try {
    //         // throw new Error("This is a test error");
    //         const baseURL = window.location.hostname.includes("localhost")
    //             ? "http://localhost:5000"
    //             : "http://192.168.31.186:5000"; // 👈 your actual IP
    //         const res = await fetch(`${baseURL}/api/auth/login`, {
    //             method: "POST",
    //             credentials: "include", // ✅ IMPORTANT: allows cookies to be sent
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ email, password }),
    //         });
    //         const data = await res.json();
    //         if (res.ok) {
    //                 setUser(data);
    //                 // setMessage("Login successful ✅");
    //                 setIsLoggedIn(true);
    //                 toast.success("Login successful ✅", {
    //                     autoClose: 2500,
    //                     theme: "dark",
    //                 });
    //             router.replace(redirectPath);
    //             console.log("router is that ", redirectPath);
    //         } else {
    //             setValidLogin(false);
    //             toast.error(data.message || "Login failed", {
    //                 autoClose: 2500,
    //                 theme: "dark",
    //             });
    //         }
    //     } catch (error) {
    //         setValidLogin(false);
    //         // setMessage("");
    //         toast.error("Something went wrong. Please try again later.", {
    //             autoClose: 2500,
    //             theme: "dark",
    //         });
    //     }
    // };

    return (
        <div className=" bg-gray-200 text-gray-900 flex justify-center">
            <div className="scale-less border border-[#b0b0b0] max-w-screen-xl m-0 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="sm:rounded-l-lg flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
                        }}
                    ></div>
                </div>
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-7">
                    <div className="mt-1 flex flex-col items-center">
                        <h1 className="text-[#8067fd] text-2xl xl:text-3xl font-extrabolds">
                            Log In
                        </h1>

                        <div className="w-full-custom-class flex-1 mt-6">
                            <div className="flex flex-col items-center gap-5">
                                <button className="cursor-pointer w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow">
                                    <div className="bg-white p-2 rounded-full">
                                        <img
                                            className="w-5"
                                            src="/google.png"
                                            alt="google-logo"
                                        />
                                    </div>
                                    <span className="ml-4">
                                        Log In with Google
                                    </span>
                                </button>

                                <button className="cursor-pointer w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow">
                                    <div className="bg-white p-1 rounded-full">
                                        <img
                                            className="w-6 p-1"
                                            src="/git.jpg"
                                            alt="git-logo"
                                        />
                                    </div>
                                    <span className="ml-4">
                                        Log In with GitHub
                                    </span>
                                </button>
                            </div>

                            <div className="w-full my-7 border-b flex justify-center">
                                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Or sign up with e-mail
                                </div>
                            </div>

                            <div className="mx-auto max-w-xs">
                                <form onSubmit={handleLoginClick}>
                                    <input
                                        className="w-full px-8 py-3.5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        ref={emailRef}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEnterEmail(true);
                                            setValidLogin(true);
                                        }}
                                    />
                                    {!enterEmail && (
                                        <p className="text-[#ff112d] mb-1 mt-1 ml-2 ">
                                            Enter email
                                        </p>
                                    )}
                                    <div
                                        className={`relative 
                                  ${enterEmail ? "mt-5" : "mt-1"}`}
                                    >
                                        <input
                                            className="w-full px-8 py-3.5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Password"
                                            ref={passwordRef}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setValidLogin(true);
                                                setEnterPassword(true);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                        >
                                            {showPassword ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                    {!enterPassword && (
                                        <p className="text-[#ff112d] mb-1 mt-1 ml-2 ">
                                            Enter password
                                        </p>
                                    )}
                                    {/* {!validLogin && (
                                        <p className="text-[#ff112d] mb-1 mt-1 ml-2 ">
                                            {message}
                                        </p>
                                    )} */}
                                    <button
                                        type="submit"
                                        className={`cursor-pointer tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-3.5 rounded-lg hover:bg-indigo-700 flex items-center justify-center focus:outline-none
                                     ${enterPassword ? "mt-5" : "mt-2"} 
                                     `}
                                    >
                                        <span className="text-lg">Log In</span>
                                    </button>
                                </form>

                                <p className="mt-4 text-sm text-center text-gray-600">
                                    Don't have an account?{" "}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.replace(
                                                `/auth/signup?redirect=${redirectPath}`
                                            );
                                        }}
                                        className="text-indigo-500 hover:underline"
                                    >
                                        Signup here
                                    </button>
                                </p>

                                {/* Add Forgot Password link */}
                                <p className="mt-2 text-sm text-center text-indigo-500">
                                    <Link
                                        replace
                                        href="/forgot-password"
                                        className="hover:underline"
                                    >
                                        Forgot Password?
                                    </Link>
                                </p>

                                <p className="mt-6 text-xs text-gray-600 text-center">
                                    I agree to abide by{" "}
                                    <Link
                                        href="/terms-and-conditions"
                                        aria-label="Read our terms and conditions"
                                        className="border-b border-gray-500 border-dotted"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacy-policy"
                                        aria-label="Read our privacy policy"
                                        className="border-b border-gray-500 border-dotted"
                                    >
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
