"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Select, { components } from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Env from "@/config/frontendEnv";

export default function EditProfilePage() {
    const { user, setUser } = useAuth();
    const router = useRouter();
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const [allFields, setAllFields] = useState(true);
    const [validName, setValidName] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validSpecial, setValidSpecial] = useState(true);
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [numberValid, setNumberValid] = useState(true);
    const mobileNORef = useRef(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const specailRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        userName: "",
        email: "",
        profilePic: "",
        specializedIn: "",
        mobile: "",
        countryCode: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                userName: user.userName || "",
                email: user.email || "",
                profilePic: user.profilePic || "/random/user.png",
                specializedIn: user.specializedIn || "",
                mobile: user.mobile || "",
                countryCode: user.countryCode || "",
            });
        }
    }, [user]);

    const [initialData, setInitialData] = useState(null);
    const [errors, setErrors] = useState({});

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
        return value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    };

    const handleUserNameChange = (e) => {
        const { name, value } = e.target;
        const cleanedValue = sanitizeUsername(value);

        const updatedData = {
            ...formData,
            [name]: cleanedValue,
        };

        setFormData(updatedData);
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
        if (name === "email") {
            setValidEmail(true);
        }

        if (name === "mobile") {
            setNumberValid(true);
        }
        if (name === "specializedIn") {
            setValidSpecial(true);
        }
    };
    // ✅ Update image preview and data
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, profilePic: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        if (
            !formData.name ||
            !formData.userName ||
            !formData.specializedIn ||
            !formData.mobile ||
            !formData.email
        ) {
            setAllFields(false);
            return;
        }
        const nameRegex = /^[A-Za-z\s]*$/;
        if (!nameRegex.test(formData.name)) {
            nameRef.current?.focus();
            setValidName(false);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            emailRef.current?.focus();
            setValidEmail(false);
            return;
        }
        const specialRegex = /^[A-Za-z0-9\s]*$/;
        if (!specialRegex.test(formData.specializedIn)) {
            specailRef.current?.focus();
            setValidSpecial(false); 
            return;
        }
        if (formData.mobile.length < 10 || formData.mobile.length > 15) {
            mobileNORef.current?.focus();
            setNumberValid(false);
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
            const usernameCheckRes = await fetch(
                `${apiUrl}/api/user/check-username?userName=${encodeURIComponent(
                    formData.userName
                )}&excludeId=${user._id}`
            );

            const usernameCheck = await usernameCheckRes.json();
            if (usernameCheck.exists) {
                toast.error(" Username is already taken", {
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
                        type: "accountupdate"
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
                        "sellerupdateData",
                        JSON.stringify(formData)
                    );
                    router.replace(
                        `/otp-verification?redirect=/seller-dashboard/profile&type=selleraccountupdate`
                    );
                    // router.push(
                    //     `/otp-verification?redirect=/account&type=selleraccountupdate`
                    // );
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
            if (response.ok) {
                router.replace("/seller-dashboard/profile");
                // window.location.replace("/seller-dashboard/profile");

                toast.success("Profile updated successfully!", {
                    autoClose: 1800,
                    theme: "dark",
                });
                setUser(result.updatedUser); // Optional: update context
                console.log("Profile updated successfully:", result.updatedUser);
            } else {
                // setExistMobile(false);
                toast.error("Failed to update profile. Please try again.", {
                    autoClose: 2000,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.log("font dont know the eroor ", error);
            alert("Something went wrong. Please try again.");
            // }
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-7 sm:px-9 px-5 bg-[#caddff] mb-12 shadow-xl rounded-lg">
            <h2 className="text-2xl font-bold mb-6 pt-13">Edit Profile</h2>
            <div className="space-y-4">
                {/* Image Upload */}
                <div className="flex flex-col items-center mb-4 ">
                    <label className="block mb-1">Profile Picture</label>

                    { formData?.profilePic  &&  (
                            <img
                                src={formData.profilePic || `/random/user.png`}
                                alt="Preview"
                                className="w-30 h-30 rounded-full object-cover border-2 border-[#332d2d] p-1 mt-2 bg-[#fcfcfc]"
                            />
                        // ) : (
                            // <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            //     No Image
                            // </div>
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
                            className="mt-5 text-sm border-1 w-25 bg-[#e6e6e67a] border-[#0101016e] rounded-md p-1"
                        />
                </div>

                {/* Name */}
                <div>
                    <label className="block mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        ref={nameRef}
                        className="w-full p-2 pl-4 bg-[#fafbff] rounded focus:outline-none ring-[.5px]"
                    />
                    {!validName && (
                        <p className="text-red-500">Enter a valid name</p>
                    )}
                </div>

                {/* Username */}
                <div>
                    <label className="block mb-1">Username</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleUserNameChange}
                        required
                        className="w-full p-2 pl-4 bg-[#fafbff] rounded focus:outline-none ring-[.5px]"
                    />
                    {errors.userName && (
                        <p className="text-red-600 text-sm">
                            {errors.userName}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1">
                        Email{" "}
                        <span className="text-xs text-gray-500">
                            (Changing email requires OTP verification.)
                        </span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        ref={emailRef}
                        className="w-full p-2 pl-4 bg-[#fafbff] rounded focus:outline-none ring-[.5px]"
                    />
                    {!validEmail && (
                        <p className="text-red-500">Enter a valid email</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1">Select Country</label>

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
                            if (mobileNORef.current) {
                                mobileNORef.current.focus();
                            }
                        }}
                        styles={customStyles}
                        placeholder="Choose country"
                    />
                </div>
                {/* Mobile */}
                <div>
                    <label className="block mb-1">Mobile Number </label>
                    <div className="flex">
                        <span className="px-4 py-2 border-r-0 rounded-l-md ring-[.5px] bg-gray-100 text-gray-700 flex items-center">
                            {formData.countryCode}
                        </span>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            required
                            ref={mobileNORef}
                            inputMode="numeric" // Optimizes for numeric input on mobile devices
                            pattern="[0-9]*"
                            onInput={(e) => {
                                // This ensures that only numeric characters are allowed
                                e.target.value = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                );
                            }}
                            onChange={handleChange}
                            className="w-full p-2 pl-4 bg-[#fafbff]  rounded-r-md focus:outline-none ring-[.5px]"
                        />
                    </div>
                    {!numberValid && (
                        <p className="text-red-500">
                            Enter a valid mobile number
                        </p>
                    )}
                </div>
                {/* Specialized In */}
                <div>
                    <label className="block mb-1">Specialized In</label>
                    <input
                        type="text"
                        name="specializedIn"
                        value={formData.specializedIn}
                        onChange={handleChange}
                        required
                        ref={specailRef}
                        className="w-full p-2 pl-4 bg-[#fafbff] rounded focus:outline-none ring-[.5px]"
                    />
                    {!validSpecial && (
                        <p className="text-red-500">
                            Enter a valid Specialization
                        </p>
                    )}
                    {!allFields && (
                        <p className="text-red-500">*All fields are required</p>
                    )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-7">
                    <button
                        onClick={handleSave}
                        className="bg-[#373737] text-white px-4 py-2 cursor-pointer rounded hover:bg-[#2f2f2f]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
