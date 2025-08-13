"use client";
import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CloudLightning, Eye, EyeOff } from "lucide-react"; // Using lucide-react for icons
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import DotLoader from "@/components/Dotloader";
// const Checkbox = ({ children, ...props }) => (
//   <label style={{ marginRight: "1em", display: "flex", alignItems: "center", gap: "0.5em" }}>
//     <input type="checkbox" {...props} />
//     {children}
//   </label>
// );

import Env from "@/config/frontendEnv";

export default function SignUpPage() {
    const searchParams = useSearchParams();
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    
    const [isPending, startTransition] = useTransition(); // ✅ track route change
    const [loading, setLoading] = useState(false); // ✅ form/api loading
    const router = useRouter();
    const [redirectPath, setRedirectPath] = useState("/account");
    // const { redirect } = router.query;
    // console.log(redirect)
    // const [password, setPassword] = useState("");
    const { setIsLoggedIn, user, setUser } = useAuth();
    const [passwordlength, setPasswordLength] = useState(true);
    const [isValid, setIsValid] = useState(true);
    const [mustrequiredpassword, setMustRequiredPassword] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [validName, setValidName] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [numberValid, setNumberValid] = useState(true);
    const mobileNORef = useRef(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState(() => {
        const stored = localStorage.getItem("signupData");
        if (stored) {
            try {
                console.log("json datya ", JSON.parse(stored));
                return JSON.parse(stored);
            } catch (err) {
                console.error(
                    "Failed to parse signup data from localStorage:",
                    err
                );
            }
        }
        return {
            name: "",
            email: "",
            password: "",
            isSeller: false,
            gender: "",
            countryCode: "",
            mobile: "",
        };
    });
    // useEffect(() => {
    //     if (form.countryCode) {
    //         const matched = countryOptions.find(
    //             (opt) => opt.value === form.countryCode
    //         );
    //         if (matched) {
    //             console.log("form countty ", matched.value);
    //             setSelectedCountry(matched);
    //         }
    //     }
    // }, [form.countryCode]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000"; // 👈 your actual IP
                const res = await fetch(`${apiUrl}/api/countries`);
                const data = await res.json();
                setCountryOptions(data);
                const matched = data.find(
                    (opt) => opt.value === form.countryCode 
                );
                setSelectedCountry(matched || data[57]); // Default selection
            } catch (err) {
                console.error("Error loading countries:", err);
            }
        };

        fetchCountries();
    }, []);
    useEffect(() => {
        const redirect = searchParams.get("redirect") || "/account";
        if (redirect) {
            setRedirectPath(redirect);
        }
    }, [searchParams]);
    const SingleValue = ({ data, ...props }) => (
        <components.SingleValue {...props}>
            {data.value} {/* Show only country code in selected value */}
        </components.SingleValue>
    );
    const CustomOption = ({ data, ...props }) => (
        <components.Option {...props}>
            {data.value} {data.label} {/* Show both in dropdown */}
        </components.Option>
    );
    const customStyles = {
        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // ensures it's on top
        menu: (base) => ({
            ...base,
            width: "300px",
            background: "white", // 👈 wider dropdown
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: "0 2px 0 0", // reduce clickable area
            // fontSize: '24px', // reduce arrow size
        }),
        option: (provided, state) => ({
            ...provided,
            transition: "none",
            color: state.isSelected ? "white" : "black",
            backgroundColor: state.isSelected
                ? "#9998ff" // ✅ your custom color for selected
                : state.isFocused
                  ? "#ededff" // hover color
                  : "white",
            ":active": {
                color: "white",
                backgroundColor: state.isSelected
                    ? "#9998ff" // keep same as selected
                    : "#9998ff", // same as hover
            },
        }),
        singleValue: (base) => ({
            ...base,
            color: "inherit",
        }),
        valueContainer: (base) => ({
            ...base,
            paddingRight: 0,
            paddingLeft: "12px", // prevent gap from this container
        }),
        indicatorsContainer: (base) => ({
            ...base,
            width: "25px",
            padding: "16px 0",
            // optional: reduce container width
        }),
        control: (base, state) => ({
            ...base,
            background: state.isFocused ? "white" : "#f3f4f600",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            boxShadow: "none",
        }),
    };
    console.log("first form  ",form)
    const handleSubmit = async (e) => {
        setLoading(true); // ⏳ show loader immediately
        e.preventDefault();
        const nameRegex = /^[A-Za-z\s]*$/;
        if (!form.name) {
            nameRef.current?.focus();
            setValidName(false);
            return;
        }
        if (!nameRegex.test(form.name)) {
            nameRef.current?.focus();
            setValidName(false);
            return;
        }

        if (form.mobile.length < 10 || form.mobile.length > 15) {
            mobileNORef.current?.focus();
            setNumberValid(false);
            return;
        }
        if (!form.email) {
            emailRef.current?.focus();
            setValidEmail(false);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            emailRef.current?.focus();
            setValidEmail(false);
            return;
        }
        if (!form.password || form.password.length < 8) {
            passwordRef.current?.focus();
            setPasswordLength(false);
            return;
        }
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/;

        if (!strongPasswordRegex.test(form.password)) {
            passwordRef.current?.focus();
            setMustRequiredPassword(false);
            return;
        }
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000"; // 👈 your actual IP

            const res = await fetch(`${apiUrl}/api/auth/check-email-mobile`, {
                method: "POST",
                // credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    mobile: form.mobile,
                }),
            });
            const data = await res.json();
    
            if (res.ok) {
                // tell me what to write here to send otp on email
                const otpRes = await fetch(`${apiUrl}/api/otp/send-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: form.email,
                        name: form.name,
                        password:form.password,
                        type: "signup", // 👈 pass it here
                    }),
                });
                const otpData = await otpRes.json();
                // const signupinfo = JSON.parse(localStorage.getItem("signupData") || "{}");
                // console.log("otp sent ", signupinfo);
                if (otpRes.ok) {
                    // 2. Save signup form data in localStorage

                    // 3. Show success toast
                    toast.success("An OTP has been sent to your email", {
                        autoClose: 2500,
                        theme: "dark",
                    });

                    // 4. Redirect to OTP verification page
                    startTransition(() => {
                        router.push(
                            `/otp-verification?type=signup&redirect=${redirectPath}`
                        );
                    });
                } else {
                    toast.error(otpData.message || "Failed to send OTP", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                }
                // toast.success("An OTP has been sent to your email", {
                //     autoClose: 2500,
                //     theme: "dark",
                // });
                // router.push(
                //     `/otp-verification?email=${encodeURIComponent(form.email)}&data=${base64}&type=signup&redirect=${redirectPath}`
                // );
            } else {
                toast.error(data.message || "Signup failed", {
                    autoClose: 2500,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Registration failed Please try again.", {
                autoClose: 2500,
                theme: "dark",
            });
        }
    };
    const isRouteLoading = isPending;
    const isFormLoading = loading;
    const isLoading = isRouteLoading || isFormLoading;
    return (
        <>
            <div className="  bg-gray-200 text-gray-900 flex justify-center">
                <div className="border border-[#b0b0b0] scale-less max-w-screen-xl m-0 bg-white shadow xs:bg-amber-400 sm:rounded-lg flex justify-center flex-1">
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
                            <h1 className="text-2xl text-[#8067fd] xl:text-3xl font-extrabolds">
                                Sign up
                            </h1>

                            <div className="w-full flex-1 mt-6">
                                <div className="flex flex-col items-center gap-5">
                                    <button className="w-full cursor-pointer max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow">
                                        <div className="bg-white p-2 rounded-full">
                                            <img
                                                className="w-5"
                                                src="/google.png"
                                                alt="google-logo"
                                            />
                                        </div>
                                        <span className="ml-4">
                                            Sign Up with Google
                                        </span>
                                    </button>

                                    <button className="w-full cursor-pointer max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow">
                                        <div className="bg-white p-1 rounded-full">
                                            <img
                                                className="w-6 p-1"
                                                src="/git.jpg"
                                                alt="git-logo"
                                            />
                                        </div>
                                        <span className="ml-4">
                                            Sign Up with GitHub
                                        </span>
                                    </button>
                                </div>

                                <div className=" border-b flex justify-center my-5">
                                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                        Or sign up with e-mail
                                    </div>
                                </div>

                                <div className="mx-auto max-w-xs">
                                    <form onSubmit={handleSubmit}>
                                        <input
                                            className={` w-full px-8 py-3 rounded-lg text-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white ${
                                                validName ? "mb-5" : " mb-0"
                                            }`}
                                            type="text"
                                            placeholder="Name"
                                            // required
                                            ref={nameRef}
                                            value={form.name}
                                            onChange={(e) => {
                                                const updatedForm = {
                                                    ...form,
                                                    name: e.target.value,
                                                };
                                                setValidName(true);
                                                setForm(updatedForm);
                                                const {
                                                    password,
                                                    ...safeForm
                                                } = updatedForm; // ✅ remove password
                                                localStorage.setItem(
                                                    "signupData",
                                                    JSON.stringify(safeForm)
                                                );
                                            }}
                                        />
                                        {!validName && (
                                            <p className="text-[#ff112d] mb-1 ml-2 ">
                                                Invalid name
                                            </p>
                                        )}

                                        <div
                                            className={`flex gap-2 items-center max-w-md w-full
                                        ${numberValid ? "mb-5" : " mb-0"}`}
                                        >
                                            {/* <div> */}

                                            <Select
                                                components={{
                                                    SingleValue,
                                                    Option: CustomOption,
                                                    IndicatorSeparator: () =>
                                                        null, // Optional: remove the vertical bar
                                                }}
                                                className="basic-single rounded-lg w-30 bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white "
                                                classNamePrefix="select"
                                                // defaultValue={countryOptions[57]} // optional
                                                options={countryOptions}
                                                value={selectedCountry}
                                                onChange={(selectedOption) => {
                                                    const updatedForm = {
                                                        ...form,
                                                        countryCode:
                                                            selectedOption?.value,
                                                    };
                                                    const {
                                                        password,
                                                        ...safeForm
                                                    } = updatedForm; // ✅ Exclude password
                                                    setForm(updatedForm);
                                                    localStorage.setItem(
                                                        "signupData",
                                                        JSON.stringify(safeForm)
                                                    );
                                                    setSelectedCountry(
                                                        selectedOption
                                                    ); // update local state if needed
                                                    if (mobileNORef.current) {
                                                        mobileNORef.current.focus();
                                                    }
                                                }}
                                                styles={customStyles}
                                                placeholder="Choose country"
                                                menuPortalTarget={document.body} // 👈 render the menu in portal
                                                // className="w-48"
                                            />
                                            <input
                                                className=" mb-[20pxx] w-full px-8 py-3 rounded-lg text-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white"
                                                type="tel"
                                                placeholder="Mobile no."
                                                // required
                                                ref={mobileNORef}
                                                inputMode="numeric" // Optimizes for numeric input on mobile devices
                                                pattern="[0-9]*"
                                                // value={mobile}
                                                value={form.mobile}
                                                onInput={(e) => {
                                                    // This ensures that only numeric characters are allowed
                                                    e.target.value =
                                                        e.target.value.replace(
                                                            /[^0-9]/g,
                                                            ""
                                                        );
                                                }}
                                                onChange={(e) => {
                                                    // setValidName(true);
                                                    const updatedForm = {
                                                        ...form,
                                                        mobile: e.target.value,
                                                    };
                                                    setForm(updatedForm);
                                                    const {
                                                        password,
                                                        ...safeForm
                                                    } = updatedForm; // ✅ remove password
                                                    localStorage.setItem(
                                                        "signupData",
                                                        JSON.stringify(safeForm)
                                                    );
                                                    setNumberValid(true);
                                                }}
                                            />
                                            {/* </div> */}
                                        </div>
                                        {!numberValid && (
                                            <p className="text-[#ff112d] py-0 mt-0.5 pl-1">
                                                Invalid Mobile Number
                                            </p>
                                        )}
                                        <input
                                            className="w-full px-8 py-3  rounded-lg text-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white"
                                            type="email"
                                            placeholder="Email"
                                            // required
                                            value={form.email}
                                            ref={emailRef}
                                            // onChange={(e) => {
                                            //      const normalizedEmail = e.target.value.toLowerCase().trim(); // ⬅️ Normalize here
                                            //     const updatedForm = {
                                            //         ...form,
                                            //         email: normalizedEmail,
                                            //     };
                                            //     console.log(normalizedEmail)
                                            //     setForm(updatedForm);
                                            //     const {
                                            //         password,
                                            //         ...safeForm
                                            //     } = updatedForm; // ✅ remove password
                                            //     localStorage.setItem(
                                            //         "signupData",
                                            //         JSON.stringify(safeForm)
                                            //     );
                                            // }}
                                            onChange={(e) => {
                                                setValidEmail(true);
                                                setForm({
                                                    ...form,
                                                    email: e.target.value,
                                                });
                                                // console.log(normalizedEmail)
                                            }}
                                            onBlur={(e) => {
                                                const normalizedEmail =
                                                    e.target.value
                                                        .toLowerCase()
                                                        .trim();
                                                const updatedForm = {
                                                    ...form,
                                                    email: normalizedEmail,
                                                };
                                                setForm(updatedForm);
                                                const {
                                                    password,
                                                    ...safeForm
                                                } = updatedForm;
                                                localStorage.setItem(
                                                    "signupData",
                                                    JSON.stringify(safeForm)
                                                );
                                            }}
                                        />

                                        <div className="mx-auto max-w-xs">
                                            <div className="relative mt-5">
                                                <input
                                                    className="w-full px-8 py-3  rounded-lg font-medium text-lg bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    // required
                                                    ref={passwordRef}
                                                    placeholder="Password"
                                                    onChange={(e) => {
                                                        // setPassword(e.target.value);

                                                        setForm({
                                                            ...form,
                                                            password:
                                                                e.target.value,
                                                        });
                                                        setValidPassword(true);
                                                        setPasswordLength(true);
                                                        setMustRequiredPassword(
                                                            true
                                                        );
                                                        // localStorage.setItem(
                                                        //     "signupData",
                                                        //     JSON.stringify(
                                                        //         updatedForm
                                                        //     )
                                                        // );
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            (prev) => !prev
                                                        )
                                                    }
                                                >
                                                    {/* {showPassword ? <Eye size={20}/> : <EyeOff size={20} />  } */}
                                                    {showPassword ? "🙈" : "👁️"}
                                                </button>
                                            </div>
                                        </div>
                                        {/* {alreadyExistUser && (
                                            <p className="text-[#ff112d] text-center mt-1">
                                                {alreadyExistUser}
                                            </p>
                                        )} */}
                                        {!validEmail && (
                                            <p className="text-[#ff112d] text-center mt-1">
                                                Enter a valid email address.
                                            </p>
                                        )}
                                        {!validPassword && (
                                            <p className="text-[#ff112d] text-center mt-1">
                                                Password must match.
                                            </p>
                                        )}
                                        {!passwordlength && (
                                            <p className="text-[#ff112d] text-center mt-1">
                                                At least 8 characters in
                                                password.
                                            </p>
                                        )}
                                        {!mustrequiredpassword && (
                                            <p className="text-[#ff112d] text-center mt-1">
                                                Password should have a capital
                                                letter, a number, and a special
                                                character (like !@#).
                                            </p>
                                        )}
                                        <button
                                            type="submit"
                                            className="cursor-pointer mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-3.5 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:outline-none"
                                        >
                                            <span className="text-lg">
                                                {/* {isLoading && (
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                )}
                                                {isLoading
                                                    ? "Please wait..."
                                                    : "Sign Up"} */}
                                                Sign Up
                                                {/* <DotLoader/> */}
                                            </span>
                                        </button>

                                        <p className="mt-4 text-sm text-center text-gray-600">
                                            Already have an account?{" "}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    router.replace(
                                                        `/auth/login?redirect=${redirectPath}`
                                                    );
                                                }}
                                                className="text-indigo-500 hover:underline cursor-pointer"
                                            >
                                                Login here
                                            </button>
                                        </p>

                                        <p className="mt-2 text-xs text-gray-600 text-center">
                                            I agree to abide by{" "}
                                            <Link
                                                href="/terms&conditions"
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
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
