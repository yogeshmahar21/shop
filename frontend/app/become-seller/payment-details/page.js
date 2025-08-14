"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, CreditCard, Check, ClipboardList } from "lucide-react";
import Select, { components } from "react-select";
import Env from "@/config/frontendEnv";


const paymentOptions = [
    { value: "upi", label: "UPI ID" },
    { value: "paypal", label: "PayPal" },
    { value: "bank", label: "Bank Account" },
];
export default function BankDetailsPage() {
    const apiUrl = Env.LOCAL_URL || Env.IP_URL
    const router = useRouter();
    const [isValid, setIsValid] = useState(true);
    const [bankValid, setBankValid] = useState(true);
    const [accValid, setAccValid] = useState(true);
    const [upiAlready, setUpiAlready] = useState(true);
    const [paypalAlready, setpaypalAlready] = useState(true);
    const [bankData, setBankData] = useState({
        paymentMethod: "upi", // will be set to "bank", "upi", or "paypal"
        accountName: "",
        accountNumber: "",
        confirmAccountNumber: "",
        routingNumber: "",
        upiId: "",
        paypalEmail: "",
    });
    // const takenUpiIds = ["user@upi", "test@upi", "demo@upi"];
    // const fakebank = ["12", "13", "11"];
    // const takenPaypalIds = [
    //     "user@paypal.com",
    //     "test @paypal.com",
    //     "demo@paypal.com",
    // ];

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem("paymentData");
        // const savedDatas = localStorage.getItem("sellerBasicData");
        // console.log("first seller data si herer  ",savedDatas)
        if (savedData) {
            setBankData(JSON.parse(savedData));
        }
    }, []);
    const steps = [
        { icon: <User size={20} />, label: "Profile" },
        { icon: <CreditCard size={20} />, label: "Bank" },
        { icon: <ClipboardList size={20} />, label: "Property" },
    ];
    const SingleValue = ({ data, ...props }) => (
        <components.SingleValue {...props}>
            {data.label}
            {/* Show only country code in selected value */}
        </components.SingleValue>
    );
    const CustomOption = ({ data, ...props }) => (
        <components.Option {...props}>
            {data.label} {/* Show both in dropdown */}
        </components.Option>
    );
    const customStyles = {
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
            cursor: "pointer",
            boxShadow: "none",
        }),
    };
    const handleGenericChange = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...bankData,
            [name]: value,
        };

        setBankData(updatedData);
        localStorage.setItem("paymentData", JSON.stringify(updatedData));
    };
    const handleAccountNameChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z ]/g, ""); // only letters & space

        const updatedData = {
            ...bankData,
            accountName: value,
        };

        setBankData(updatedData);
        localStorage.setItem("paymentData", JSON.stringify(updatedData));
    };
    const handleAccountNumberChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ""); // only numbers

        const updatedData = {
            ...bankData,
            accountNumber: value,
        };
        setBankValid(true);
        setAccValid(true);
        setBankData(updatedData);
        localStorage.setItem("paymentData", JSON.stringify(updatedData));
    };

    // Confirm account number
    const handleConfirmAccountNumberChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ""); // only numbers

        const updatedData = {
            ...bankData,
            confirmAccountNumber: value,
        };
        setBankValid(true);
        setAccValid(true);
        setBankData(updatedData);
        localStorage.setItem("paymentData", JSON.stringify(updatedData));
    };

    // IFSC or routing number
    const handleRoutingNumberChange = (e) => {
        const value = e.target.value.toUpperCase(); // IFSCs are usually uppercase

        const updatedData = {
            ...bankData,
            routingNumber: value,
        };

        setBankData(updatedData);
        localStorage.setItem("paymentData", JSON.stringify(updatedData));
    };
    const handleUpiChange = (e) => {
        const value = e.target.value.toLowerCase();

        const updatedData = {
            ...bankData,
            upiId: value,
        };
        setUpiAlready(true);
        setBankData(updatedData);
        localStorage.setItem("paymentData", JSON.stringify(updatedData));
    };

    // PayPal email
    const handlePaypalChange = (e) => {
        const value = e.target.value.toLowerCase();

        const updatedData = {
            ...bankData,
            paypalEmail: value,
        };
        setpaypalAlready(true);
        setBankData(updatedData);
        localStorage.setItem("paymentData", JSON.stringify(updatedData));
    };
    // const handleChange = (e) => {
    //     setIsValid(true);
    //     setBankValid(true);
    //     setAccValid(true);
    //     setUpiAlready(true);
    //     setpaypalAlready(true);
    //     const { name, value } = e.target;

    //     let updatedData;

    //     if (name === "accountType") {
    //         // Clear payment fields when account type changes
    //         updatedData = {
    //             accountType: value,
    //             upiId: "",
    //             paypalId: "",
    //             bankName: "",
    //             accountNumber: "",
    //             ifscCode: "",
    //             // add more fields if needed
    //         };
    //     } else {
    //         updatedData = {
    //             ...bankData,
    //             [name]: value,
    //         };
    //     }

    //     setBankData(updatedData);
    //     localStorage.setItem("paymentData", JSON.stringify(updatedData));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsValid(true);
        setBankValid(true);
        setAccValid(true);
        setUpiAlready(true);
        setpaypalAlready(true);
        const baseURL = window.location.hostname.includes("localhost")
            ? "http://localhost:5000"
            : "http://192.168.31.186:5000";

        if (bankData.paymentMethod === "upi") {
            if (!bankData.upiId.includes("@")) {
                setIsValid(false);
                return;
            }

            // Check with backend
            const res = await fetch(
                `${apiUrl}/api/seller/check-payment?upiId=${bankData.upiId}`
            );
            const data = await res.json();
            if (data.exists) {
                setUpiAlready(false);
                return;
            }
        }
        if (bankData.paymentMethod === "paypal") {
            const res = await fetch(
                `${apiUrl}/api/seller/check-payment?paypalEmail=${bankData.paypalEmail}`
            );
            const data = await res.json();
            if (data.exists) {
                setpaypalAlready(false);
                return;
            }
        }
        if (bankData.paymentMethod === "bank") {
            if (bankData.accountNumber !== bankData.confirmAccountNumber) {
                setAccValid(false);
                return;
            }

            const res = await fetch(
                `${apiUrl}/api/seller/check-payment?accountNumber=${bankData.accountNumber}`
            );
            const data = await res.json();
            if (data.exists) {
                setBankValid(false);
                return;
            }
        }
        localStorage.setItem("paymentData", JSON.stringify(bankData));
        // Optional: Debug
        const basic = localStorage.getItem("sellerBasicData");
        const payment = localStorage.getItem("paymentData");
        console.log("✅ Basic Info:", basic);
        console.log("💸 Payment Info:", payment);

        // Proceed to final confirmation
        router.replace("/become-seller/final-confirmation");
    };

    const handlePrev = () => {
        router.push("/become-seller/");
    };

    const [showTermsModal, setShowTermsModal] = useState(false);
    const [agreed, setAgreed] = useState(true);

    // if (!agreed) {
    //   alert("You must agree to the payout terms to proceed.");
    //   return;
    // }

    return (
        <section className="max-w-3xl mx-auto pt-20 px-7 mb-10">
            <h1 className="text-2xl font-bold mb-6">How You&apos;ll Get Paid</h1>

            {/* Progress Bar */}
            <ol className="flex items-center justify-center w-full mb-10 sm:px-8 px-4">
                {steps.map((s, index) => {
                    const currentStep = 2;
                    const stepIndex = index + 1;
                    const isCompleted = stepIndex < currentStep;
                    const isActive = stepIndex === currentStep;

                    return (
                        <li
                            key={index}
                            className={`flex items-center w-full ${
                                index !== steps.length - 1
                                    ? `after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block ${
                                          stepIndex < currentStep
                                              ? "after:border-green-500"
                                              : "after:border-gray-200"
                                      }`
                                    : "w-auto max-w-10"
                            }`}
                        >
                            <span
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#b2d1fc] lg:h-12 lg:w-12 shrink-0 ${
                                    isCompleted
                                        ? "bg-green-500 text-white"
                                        : isActive
                                        ? "bg-[#d2e5ff] text-black"
                                        : "bg-gray-100 text-gray-400"
                                }`}
                            >
                                {isCompleted ? <Check size={20} /> : s.icon}
                            </span>
                        </li>
                    );
                })}
            </ol>

            {/* Payment Method Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                    <label className="block font-medium mb-2">
                        Select Payment Method
                    </label>
                    <Select
                        isSearchable={false}
                        components={{
                            SingleValue,
                            Option: CustomOption, // Optional: remove the vertical bar
                        }}
                        options={paymentOptions}
                        placeholder="Accounting Options"
                        value={paymentOptions.find(
                            (opt) => opt.value === bankData.paymentMethod
                        )}
                        onChange={(selectedOption) => {
                            const method = selectedOption.value;
                            setIsValid(true);
                            setBankValid(true);
                            setAccValid(true);
                            setUpiAlready(true);
                            setpaypalAlready(true);
                            let cleanedData = {
                                paymentMethod: method,
                            };

                            if (method === "bank") {
                                cleanedData = {
                                    ...cleanedData,
                                    accountName: "",
                                    accountNumber: "",
                                    confirmAccountNumber: "",
                                    routingNumber: "",
                                };
                            } else if (method === "upi") {
                                cleanedData = {
                                    ...cleanedData,
                                    upiId: "",
                                };
                            } else if (method === "paypal") {
                                cleanedData = {
                                    ...cleanedData,
                                    paypalEmail: "",
                                };
                            }

                            setBankData(cleanedData);
                            localStorage.setItem(
                                "paymentData",
                                JSON.stringify(cleanedData)
                            );
                        }}
                        styles={customStyles}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>

                {/* Bank Details */}
                {bankData.paymentMethod === "bank" && (
                    <>
                        <label htmlFor="accountName">Account Holder Name</label>
                        <input
                            type="text"
                            name="accountName"
                            value={bankData.accountName || ""}
                            onChange={handleAccountNameChange}
                            placeholder="Account Holder Name"
                            className="mt-1 w-full p-2 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded"
                            required
                            pattern="[A-Za-z ]+" // Allow only alphabets and spaces
                            title="Only alphabetic characters are allowed"
                        />
                        <div>
                            <label htmlFor="accountNumber">
                                Account Number
                            </label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={bankData.accountNumber || ""}
                                onChange={handleAccountNumberChange}
                                placeholder="Account Number"
                                className={`w-full p-2 mt-1 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded appearance:none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                                    accValid ? "mb-6" : "mb-0"
                                }`}
                                required
                                inputMode="numeric" // Optimizes for numeric input on mobile devices
                                pattern="[0-9]*" // Allows only numbers (including for form validation)
                                onInput={(e) => {
                                    // This ensures that only numeric characters are allowed
                                    e.target.value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                }}
                                title="Only numeric characters are allowed"
                            />
                            {!accValid && (
                                <p className="text-[#ff112d] pl-1 mb-1">
                                    Account number not matched
                                </p>
                            )}
                            <label htmlFor="confirmAccountNumber">
                                Confirm Account Number
                            </label>
                            <input
                                type="text"
                                name="confirmAccountNumber"
                                value={bankData.confirmAccountNumber || ""}
                                onChange={handleConfirmAccountNumberChange}
                                placeholder="Confirm Account Number"
                                className={`w-full mt-1 p-2 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded appearance:none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
                                    ${bankValid ? "mb-0" : "mb-6"}}`}
                                required
                                inputMode="numeric" // Optimizes for numeric input on mobile devices
                                pattern="[0-9]*" // Allows only numbers (including for form validation)
                                onInput={(e) => {
                                    // This ensures that only numeric characters are allowed
                                    e.target.value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                }}
                                title="Only numeric characters are allowed"
                            />
                            {!bankValid && (
                                <p className="text-[#ff112d]  pl-1 mb-1">
                                    Account number already registered
                                </p>
                            )}
                            {/* </div> */}
                            <input
                                type="text"
                                name="routingNumber"
                                value={bankData.routingNumber || ""}
                                onChange={handleRoutingNumberChange}
                                placeholder="IFSC / Routing Number"
                                className={`w-full p-2 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded
                                ${!bankValid ? "mt-0" : "mt-6 "}}
                                `}
                                required
                            />
                            {/* <label htmlFor="routingNumber">IFSC / Routing Number</label> */}
                        </div>
                    </>
                )}

                {/* UPI ID */}
                <div>
                    {bankData.paymentMethod === "upi" && (
                        <input
                            type="text"
                            name="upiId"
                            value={bankData.upiId || ""}
                            onChange={handleUpiChange}
                            placeholder="Enter your UPI ID"
                            className="w-full p-2 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded"
                            required
                        />
                    )}
                    {!upiAlready && (
                        <p className="text-[#ff112d]  mt-1">
                            UPI id already registered
                        </p>
                    )}
                    {!isValid && (
                        <p className="text-[#ff112d]  mt-1">Invalid UPI id</p>
                    )}
                </div>

                {/* PayPal Email */}
                <div>
                    {bankData.paymentMethod === "paypal" && (
                        <input
                            type="email"
                            name="paypalEmail"
                            value={bankData.paypalEmail || ""}
                            onChange={handlePaypalChange}
                            placeholder="Enter your PayPal Email"
                            className="w-full p-2 pl-3 bg-[#fafbff] step1input focus:outline-none ring-[.5px] rounded"
                            required
                        />
                    )}
                    {!paypalAlready && (
                        <p className="text-[#ff112d]  mt-1">
                            Paypal email already registered
                        </p>
                    )}
                </div>
                <div>
                    <input
                        className="cursor-pointer scale-110"
                        type="checkbox"
                        checked={agreed}
                        onChange={() => setAgreed(!agreed)}
                        required
                    />{" "}
                    <span>
                        I agree to the{" "}
                        <button
                            type="button"
                            className="text-blue-600 cursor-pointer underline hover:text-blue-800"
                            onClick={() => setShowTermsModal(true)}
                        >
                            terms & conditions
                        </button>
                    </span>
                </div>
                {showTermsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#333333af] bg-opacity-50 m-0">
                        <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative shadow-lg overflow-y-auto max-h-[90vh]">
                            <button
                                className="absolute h-10 top-2 right-3 text-gray-500 cursor-pointer p-2 hover:text-black text-2xl font-bold"
                                onClick={() => setShowTermsModal(false)}
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-semibold mb-4">
                                Terms & Conditions
                            </h2>
                            <p className="text-sm text-gray-700 space-y-2">
                                <strong>1. Accuracy:</strong> You confirm all
                                payment details provided are correct and owned
                                by you.
                                <br />
                                <strong>2. Responsibility:</strong> You agree to
                                bear responsibility for any failed or incorrect
                                transfers due to inaccurate information.
                                <br />
                                <strong>3. Authorization:</strong> By submitting
                                this form, you authorize us to process payouts
                                to your chosen method.
                                <br />
                                <strong>4. Updates:</strong> Changes to your
                                payout method must be updated in your account
                                settings before the next payment cycle.
                                <br />
                                <strong>5. Disputes:</strong> Any payout-related
                                dispute must be raised within 7 days of the
                                payment date.
                                <br />
                                {/* You can add more clauses here as needed */}
                            </p>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between mt-6 gap-2">
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="cursor-pointer w-full max-w-50 py-2 bg-[#5595d3] text-white rounded"
                    >
                        Previous
                    </button>

                    <button
                        type="submit"
                        className="cursor-pointer w-full max-w-50 py-2 bg-[#444] text-white rounded"
                    >
                        Next
                    </button>
                </div>
            </form>
        </section>
    );
}
