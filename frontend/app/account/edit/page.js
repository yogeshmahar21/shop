"use client";
import { Buffer } from "buffer";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Select, { components } from "react-select";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Env from "@/config/frontendEnv";

export default function EditProfile() {
    const [apiUrl, setApiUrl] = useState(Env.LOCAL_URL || Env.IP_URL);
    const [userNameValid, setUserNameValid] = useState(true);
    const usernameRef = useRef(null);
    const { setIsLoggedIn, user, setUser } = useAuth();
    // console.log("thisi is user testing of auth : ", user);
    const [validName, setValidName] = useState(true);
    const [numberValid, setNumberValid] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const mobileNORef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const router = useRouter();
    // const [existMobile, setExistMobile] = useState(true);

    const takenUsernames = [
        "yogesh-bha",
        "yogesh-bhai",
        "jane123",
        "admin-user",
        "test.user",
    ];
    const nextInputRef = useRef(null);
    console.log("edit page suser ", user);
    const SingleValue = ({ data, ...props }) => (
        <components.SingleValue {...props}>
            {data.value} {data.label}
            {/* Show only country code in selected value */}
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
        }),
        dropdownIndicator: (base) => ({
            ...base,
            // padding: "0 2px 0 0", // reduce clickable area
            // fontSize: '24px', // reduce arrow size
        }),
        singleValue: (base) => ({
            ...base,
            color: "inherit",
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
        control: (base, state) => ({
            ...base,
            background: state.isFocused ? "#f9f9f9" : "white",
            // borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            boxShadow: "none",
        }),
    };
    const [formData, setFormData] = useState({});
    useEffect(() => {
        if (user) {
            setFormData({
                ...user,
                gender: user.gender?.trim() ? user.gender : "Male",
            });
        }
    }, [user]);
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const baseURL = window.location.hostname.includes("localhost")
                    ? "http://localhost:5000"
                    : "http://192.168.31.186:5000"; // 👈 your actual IP
                const res = await fetch(`${apiUrl}/api/countries`);
                const data = await res.json();
                setCountryOptions(data);
                if (user?.countryCode) {
                    const matchedOption = data.find(
                        (opt) => opt.value === user.countryCode
                    );
                    setSelectedCountry(matchedOption || data[0]);
                } else {
                    setSelectedCountry(data[0]);
                }
            } catch (err) {
                console.error("Error loading countries:", err);
            }
        };

        fetchCountries();
    }, []);
    const sanitizeUsername = (value) => {
        const allowedPattern = /^[a-z0-9._-]*$/;
        const lower = value.toLowerCase();

        if (!allowedPattern.test(lower)) {
            console.log("first");
        }

        return lower.replace(/[^a-z0-9._-]/g, "");
    };
    const dummyUser = {
        name: "Yogesh Bhai",
        gender: "Male",
        mobile: "9876543210",
        email: "yogesh@example.com",
        profileImg: "https://i.pravatar.cc/150?img=3",
        countryCode: "+91",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "name") {
            setValidName(true);
        }

        if (name === "mobile") {
            setNumberValid(true);
        }
    };
    const handleEmailChange = (e) => {
        const updatedEmail = e.target.value.trim();
        setFormData({ ...formData, email: updatedEmail });
        setFormData((prev) => ({
            ...prev,
            email: updatedEmail,
        }));
        // Reset validation states
        setValidEmail(true);

        // Check if email was changed
        // if (updatedEmail !== user.email) {
        //     alert("Email has been changed.");
        //     setEmailChanged(true); // optional flag if you need it later
        // } else {
        //     alert("Email is unchanged.");
        //     setEmailChanged(false);
        // }
    };

    const handleUsernameChange = (e) => {
        const { name, value } = e.target;
        const cleanedValue = sanitizeUsername(value);
        // Sanitize only if it's the userName field

        console.log("this is the updated value ", cleanedValue);
        if (!takenUsernames.includes(cleanedValue)) {
            setUserNameValid(true);
        }
        const updatedData = {
            ...formData,
            [name]: cleanedValue,
        };

        setFormData(updatedData);
        // localStorage.setItem("sellerBasicData", JSON.stringify(updatedData));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nameRegex = /^[A-Za-z\s]*$/;
        if (!formData.name) {
            nameRef.current?.focus();
            setValidName(false);
            return;
        }
        if (!nameRegex.test(formData.name)) {
            nameRef.current?.focus();
            setValidName(false);
            return;
        }
        if (formData.mobile.length < 10 || formData.mobile.length > 15) {
            mobileNORef.current?.focus();
            setNumberValid(false);
            return;
        }
        if (!formData.email) {
            emailRef.current?.focus();
            setValidEmail(false);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            emailRef.current?.focus();
            setValidEmail(false);
            return;
        }
        try {
            const baseURL = window.location.hostname.includes("localhost")
                ? "http://localhost:5000"
                : "http://192.168.31.186:5000";
            const mobileCheckRes = await fetch(
                `${apiUrl}/api/user/check-mobile?mobile=${encodeURIComponent(
                    formData.mobile
                )}&countryCode=${encodeURIComponent(
                    formData.countryCode || "+91"
                )}&excludeId=${user._id}`
            );
            const mobileCheck = await mobileCheckRes.json();
            if (mobileCheck.exists) {
                toast.error("This mobile number is already registered.", {
                    autoClose: 2000,
                    theme: "dark",
                });
                return;
            }
            if (formData.email !== user.email) {
                const emailCheckRes = await fetch(
                    `${apiUrl}/api/user/check-email?email=${encodeURIComponent(
                        formData.email
                    )}&excludeId=${user._id}`
                );
                const emailCheck = await emailCheckRes.json();

                if (emailCheck.exists) {
                    toast.error("This email is already registered.", {
                        autoClose: 2000,
                        theme: "dark",
                    });
                    return; // stop here if duplicate
                }

                const otpRes = await fetch(`${apiUrl}/api/otp/send-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: formData.email,
                        name: formData.name,
                        type: "accountupdate",
                    }),
                });
                // alert('working')
                const otpData = await otpRes.json();

                if (otpRes.ok) {
                    // 2. Save signup form data in localStorage

                    // 3. Show success toast
                    console.log("otp sent ", otpRes);
                    toast.success("An OTP has been sent to your email", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                    localStorage.setItem(
                        "accountupdate",
                        JSON.stringify(formData)
                    );
                    router.push(
                        `/otp-verification?redirect=/account&type=accountupdate`
                    );
                } else {
                    toast.error(otpData.message || "Failed to send OTP", {
                        autoClose: 2500,
                        theme: "dark",
                    });
                }
                return;
            }
            const payload = new FormData();
            payload.append("name", formData.name);
            payload.append("userName", formData.userName);
            payload.append("email", formData.email);
            payload.append("mobile", formData.mobile);
            payload.append("specializedIn", formData.specializedIn);
            payload.append("countryCode", formData.countryCode || "+91");
            payload.append("gender", formData.gender || "Male");
            if (formData.profileFile) {
                payload.append("profilePic", formData.profileFile); // 👈 must match backend multer field name
            }
            const response = await fetch(`${apiUrl}/api/user/update-profile`, {
                // method: "POST",
                // credentials: "include",
                // headers: {
                    //     "Content-Type": "application/json",
                    //     // Include auth token if needed
                    // },
                    // body: JSON.stringify(formData),
                    method: "PUT",
                    credentials: "include",
                    body: payload, // 👈 send FormData
                });
                
                const result = await response.json();
                console.log("foormdata .profile pic ", result.updatedUser);
            if (response.ok) {
                toast.success("Profile updated successfully!", {
                    autoClose: 1800,
                    theme: "dark",
                });
                setUser(result.updatedUser); // Optional: update context
                router.push("/account");
            } else {
                // setExistMobile(false);
                toast.error("Failed to update profile. Please try again.", {
                    autoClose: 2000,
                    theme: "dark",
                });
            }
        } catch (error) {
            alert("Something went wrong. Please try again. aa");
            // }
        }
        console.log("Updated Profile:", formData);
    };

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;

    return (
        <div className="bg-gray-100 pt-16 md:pt-25 pb-16 max-w-[1370px] mx-auto">
            <div className="flex lg:flex-row flex-col items-center justify-center px-2 lg:items-start m-auto w-full gap-5">
                <div className="max-w-xl w-full bg-white rounded-lg shadow-2xl p-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center gap-3 mb-6 mt-4">
                        {formData?.profilePic && (
                            <img
                                src={formData?.profilePic}
                                alt="Profile"
                                className="h-28 w-28 rounded-full object-cover shadow-md border"
                            />
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const imageUrl = URL.createObjectURL(file);
                                    setFormData({
                                        ...formData,
                                        profilePic: imageUrl, // for preview
                                        profileFile: file, // for upload
                                    });
                                }
                            }}
                            className="mt-1 text-sm border-1 w-25 bg-[#e6e6e67a] border-[#0101016e] rounded-md p-1"
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-center mb-4">
                        Edit Personal Information
                    </h2>

                    {/* Name */}
                    <div className={` ${validName ? "mb-6" : "mb-0"}`}>
                        <label className="text-gray-600 text-sm">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            ref={nameRef}
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 rounded bg-[#fafbff] step1input focus:bg-[#f5f9ff] focus:outline-none ring-[.5px]"
                        />
                        {!validName && (
                            <p className="text-[#ff112d] mb-1 py-0 mt-0.5 pl-1 ">
                                Invalid name
                            </p>
                        )}
                    </div>
                    {/* <div
                            className={`w-full max-w-150 ${
                                userNameValid ? " " : " mb-0"
                            }`}
                        >
                            <p className="pb-1 text-gray-600 text-sm">
                                Username *(a-z, 0-9, - _ .)
                            </p>
                            <input
                                type="text"
                                ref={usernameRef}
                                name="userName"
                                value={formData.userName || ""}
                                onChange={handleUsernameChange}
                                placeholder="Username"
                                required
                                className="w-full p-2 pl-3 bg-[#fafbff] step1input focus:bg-[#f5f9ff] focus:outline-none ring-[.5px] rounded"
                            />
                            {!userNameValid && (
                                <p className="text-[#ff112d] py-0 mt-0.5 pl-1">
                                    Username already exists
                                </p>
                            )}
                        </div> */}
                    {/* Gender */}
                    <div className="pl-1 mb-6">
                        <label className="text-gray-600 text-sm block mb-2 ">
                            Gender
                        </label>
                        <div className="flex gap-6">
                            {["Male", "Female", "Other"].map(
                                (option, index) => (
                                    <label
                                        key={index}
                                        className="flex items-center gap-2 text-gray-800"
                                    >
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={option}
                                            checked={formData.gender === option}
                                            onChange={handleChange}
                                            className="text-blue-500 focus:ring-blue-400"
                                        />
                                        {option}
                                    </label>
                                )
                            )}
                        </div>
                    </div>

                    {/* Country Code Dropdown */}
                    <div className="mb-6">
                        <label className="text-gray-600 text-sm block mb-1 ">
                            Country
                        </label>
                        <Select
                            components={{
                                SingleValue,
                                Option: CustomOption, // Optional: remove the vertical bar
                            }}
                            className="basic-single rounded bg-gray-100 border border-[#344] placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white "
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            options={countryOptions}
                            value={selectedCountry}
                            onChange={(selectedOption) => {
                                setSelectedCountry(selectedOption);
                                setFormData((prev) => ({
                                    ...prev,
                                    countryCode: selectedOption.value, // e.g., '+91'
                                }));
                                if (nextInputRef.current) {
                                    nextInputRef.current.focus();
                                }
                            }}
                            styles={customStyles}
                            placeholder="Choose country"
                        />
                        {/* <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                className="mt-1 w-full px-4 py-2 rounded bg-[#fafbff] step1input focus:bg-[#f5f9ff] focus:outline-none ring-[.5px]"
                            >
                                {countries.map((country, index) => (
                                    <option key={index} value={country.code}>
                                        {country.name} ({country.code})
                                    </option>
                                ))}
                            </select> */}
                    </div>

                    {/* Mobile */}
                    <div className={` ${numberValid ? "mb-6" : "mb-0"}`}>
                        <label className="text-gray-600 text-sm">
                            Mobile Number
                        </label>
                        <div className="flex">
                            <span className="px-4 py-2 border border-r-0 rounded-l-md bg-gray-100 text-gray-700 flex items-center">
                                {formData.countryCode}
                            </span>
                            <input
                                type="tel"
                                name="mobile"
                                ref={nextInputRef}
                                inputMode="numeric" // Optimizes for numeric input on mobile devices
                                pattern="[0-9]*"
                                value={formData.mobile}
                                onChange={handleChange}
                                onInput={(e) => {
                                    // This ensures that only numeric characters are allowed
                                    e.target.value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                }}
                                className="w-full px-4 py-2 border rounded-r-md focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                            />
                        </div>{" "}
                        {!numberValid && (
                            <p className="text-[#ff112d] py-0 mt-0.5 pl-1">
                                Invalid Mobile Number
                            </p>
                        )}
                        {/* {!existMobile && (
                                <p className="text-[#ff112d] py-0 mt-0.5 pl-1">
                                    Mobile number already in use.
                                </p>
                            )} */}
                    </div>

                    {/* Email */}
                    <form onSubmit={handleSubmit} className="">
                        <div className={` ${validEmail ? "mb-10" : "mb-4"}`}>
                            <label className="text-gray-600 text-sm">
                                Email Address{" "}
                                <span className="text-xs text-gray-500">
                                    (Changing email requires OTP verification.)
                                </span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleEmailChange}
                                className="mt-1 w-full px-4 py-2 rounded bg-[#fafbff] step1input focus:bg-[#f5f9ff] focus:outline-none ring-[.5px]"
                            />
                            {!validEmail && (
                                <p className="text-[#ff112d] py-0 mt-0.5 pl-1">
                                    Enter a valid email address.
                                </p>
                            )}
                        </div>

                        {/* Save */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="w-full max-w-50 bg-[#444] text-white rounded px-3 py-2  hover:bg-[#3b3b3b] cursor-pointer transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
