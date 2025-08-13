"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Select, { components } from "react-select";
import { useRouter } from "next/navigation";
import DotLoader from "@/components/Dotloader";
import Env from "@/config/frontendEnv";

export default function SellModelPage() {
    const [softwareOptions, setSoftwareOptions] = useState([]);
    const apiUrl = Env.LOCAL_URL || Env.IP_URL;
    const [selectedSoftware, setSelectedSoftware] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formatOptions, setFormatOptions] = useState([]); // file formats for selected software
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadAgain, setUploadAgain] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [zipFile, setZipFile] = useState(null);
    const descriptionRef = useRef(null);
    const priceRef = useRef(null);
    const tagsRef = useRef(null);
    const Router = useRouter();
    const zipRef = useRef();
    const previewRef = useRef();
    const [imagesError, setImagesError] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        software: "",
        category: "",
        format: "",
        price: "",
        tags: "",
        previewImages: [],
        modelFile: null,
        agreeToTerms: true,
    });
    useEffect(() => {
        const savedForm = localStorage.getItem("modelData");
        console.log("Saved form data:", savedForm); // Debugging line
        if (savedForm) {
            const parsed = JSON.parse(savedForm);
            setForm(parsed);
        }
    }, []);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [softwareRes, categoryRes] = await Promise.all([
                    fetch("http://localhost:5000/api/software"),
                    fetch("http://localhost:5000/api/categories"),
                ]);

                const softwareData = await softwareRes.json();
                const categoryData = await categoryRes.json();

                setSoftwareOptions(softwareData);
                setCategoryOptions(categoryData);

                const savedForm = localStorage.getItem("modelData");
                if (savedForm) {
                    const parsed = JSON.parse(savedForm);
                    const matchedCategory = categoryData.find(
                        (opt) => opt.name === parsed.category
                    );
                    setSelectedCategory(matchedCategory || null);
                }
            } catch (err) {
                console.error("Error fetching options:", err);
            }
        };

        fetchOptions();
    }, []);

    const SingleValue = ({ data, ...props }) => (
        <components.SingleValue {...props}>
            {data.name} {/* Show only country code in selected value */}
        </components.SingleValue>
    );
    const CustomOption = ({ data, ...props }) => (
        <components.Option {...props}>{data.name}</components.Option>
    );
    const SingleValues = ({ data, ...props }) => (
        <components.SingleValue {...props}>
            {data.formats}
        </components.SingleValue>
    );
    const customStyles = {
        menuPortal: (base) => ({ ...base, zIndex: 9999 }), // ensures it's on top
        menu: (base) => ({
            ...base,
            width: "100%",
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
            // color: "inherit",
        }),
        valueContainer: (base) => ({
            ...base,
            paddingRight: 0,
            paddingLeft: "12px", // prevent gap from this container
        }),
        indicatorsContainer: (base) => ({
            ...base,
            width: "25px",
            padding: "12px 0",
            // height: "40px",
            // optional: reduce container width
        }),
        control: (base, state) => ({
            ...base,
            // borderRadius: "8px",
            border: "1px",
            cursor: "pointer",
            boxShadow: "none",
        }),
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedForm = { ...form, [name]: value };
        setForm(updatedForm);
        localStorage.setItem("modelData", JSON.stringify(updatedForm));
    };
    const sanitizeFileName = (fileName) => {
        return fileName.trim().replace(/\s+/g, "-"); // or remove spaces completely with .replace(/\s+/g, "")
    };
    const handleFileChange = (e, type) => {
        e.preventDefault();
        const files = Array.from(e.target.files);
        // setImagesError(false); // Reset error state on new file selection
        if (files.length > 8) {
            toast.error("You can only upload up to 8 images.");
            setImagesError(true);
            return;
        }
        if (type === "preview") {
            // console.log("Preview images selected:", e.target.files);
            setImagesError(false); // Reset error state on new file selection
            const sanitizedFiles = files.map((file) => {
                const sanitizedName = sanitizeFileName(file.name);

                // If filename is already clean, return as is
                if (file.name === sanitizedName) return file;

                // 🛠 Reconstruct file with sanitized name
                return new File([file], sanitizedName, { type: file.type });
            });

            const uniqueFiles = Array.from(
                new Map(
                    [...form.previewImages, ...sanitizedFiles].map((f) => [
                        f.name,
                        f,
                    ])
                ).values()
            );
            setForm({ ...form, previewImages: uniqueFiles });
        } else {
            const file = files[0];
            const sanitizedName = sanitizeFileName(file.name);

            const sanitizedFile =
                file.name === sanitizedName
                    ? file
                    : new File([file], sanitizedName, { type: file.type });

            setForm({ ...form, modelFile: sanitizedFile });
        }
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate form
        setIsSubmitting(true);
        console.log(imagesError);
        if (imagesError) {
            toast.error("You can only upload up to 8 images.");
            setIsSubmitting(false);
            return;
        }
        setImagesError(false); // Reset error state on submit
        // return; // Debugging line
        const formData = new FormData();
        const toastId = toast.loading("Checking files Please wait...");

        for (const key in form) {
            if (key === "previewImages") {
                form.previewImages.forEach((file) =>
                    formData.append("previewImages", file)
                ); 
            } else if (key === "modelFile") {
                formData.append("zipFile", form.modelFile); // ✅ correct key name
            } else {
                formData.append(key, form[key]);
            }
        }

        try {
            const res = await fetch(`${apiUrl}/api/models/upload-model`, {
                method: "POST",
                credentials: "include", // ✅ this is required for sending cookies!
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.message.includes("too large")) {
                    toast.error("Your ZIP file exceeds the allowed size.");
                } else {
                    toast.error(data.message || "Upload failed");
                }
                return;
            }

            toast.success("Model uploaded successfully!", { id: toastId });
            setForm({
                title: "",
                description: "",
                software: "",
                category: "",
                format: "",
                price: "",
                tags: "",
                previewImages: [],
                modelFile: null,
                agreeToTerms: true,
            });
            setSelectedSoftware(null);
            setSelectedCategory(null);
            setPreviewImages([]);
            setZipFile(null);
            localStorage.removeItem("modelData");
            if (zipRef.current) zipRef.current.value = null;
            if (previewRef.current) previewRef.current.value = null;
            setUploadAgain(true); // Show upload again prompt
        } catch (err) {
            console.error("Upload Error:", err);
            toast.error("Something went wrong!", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isSubmitting && (
                <div className="fixed z-2 bg-[#00000087] flex justify-center  w-full h-[100vh] md:top-15 top-12.5 ">
                    <div className="sm:top-[38%] top-[34%] relative">
                        <DotLoader />
                    </div>
                </div>
            )}
            {uploadAgain && (
                <div className="fixed z-2 bg-[#00000087] flex justify-center  w-full h-[100vh] md:top-15 top-12.5 ">
                    <div className="rounded-lg  top-20 p-7 h-55 relative bg-amber-50 max-w-100">
                        <p>
                            Your model has been uploaded successfully. Would you
                            like to add another?
                        </p>
                        <div className="flex flex-col items-start mt-5">
                            <span
                                onClick={() => setUploadAgain(false)}
                                className="bg-green-700 text-white rounded-lg py-2 px-4 cursor-pointer mb-4"
                            >
                                Yes, Upload Another
                            </span>
                            <span
                                onClick={() =>
                                    Router.replace("/seller-dashboard")
                                }
                                className="bg-[#161561] text-white rounded-lg py-2 px-4 cursor-pointer "
                            >
                                Go to Dashboard
                            </span>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full md:px-3">
                {/* </div> */}
                <div className="max-w-4xl mx-auto pt-2 md:p-8 px-5 pb-10 bg-white md:mb-38 mb-10 rounded-md custom-shadow-sell-models md:relative top-24">
                    <h1 className="text-3xl font-bold mb-6">
                        Sell Your 3D Model
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Basic Info */}
                        <fieldset>
                            <legend className="text-xl font-semibold mb-4">
                                Basic Information
                            </legend>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Model Title
                                    </label>
                                    <input
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        className="w-full border rounded px-[14px] py-[10px] focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Software Used
                                    </label>
                                    <div
                                        className={`flex gap-2 items-center w-full border rounded border-[#000]`}
                                    >
                                        <Select
                                            components={{
                                                SingleValue,
                                                Option: CustomOption,
                                                IndicatorSeparator: () => null, // Optional: remove the vertical bar
                                            }}
                                            className="basic-single rounded w-full bg-gray-100   border border-gray-200 placeholder-gray-500 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                            classNamePrefix="select"
                                            // defaultValue={countryOptions[57]} // optional
                                            options={softwareOptions}
                                            required
                                            value={selectedSoftware}
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.name}
                                            onChange={(selectedOption) => {
                                                setSelectedSoftware(
                                                    selectedOption
                                                ); // update local state if needed
                                                setFormatOptions(
                                                    (
                                                        selectedOption.formats ||
                                                        []
                                                    ).map((format) => ({
                                                        label: format,
                                                        value: format,
                                                    }))
                                                );
                                                setForm((prev) => ({
                                                    ...prev,
                                                    software:
                                                        selectedOption?.name,
                                                    format: "",
                                                }));
                                                localStorage.setItem(
                                                    "modelData",
                                                    JSON.stringify(form)
                                                );
                                                setSelectedFormat(null);
                                                // console.log(form.software);
                                                if (priceRef.current) {
                                                    priceRef.current.focus();
                                                }
                                            }}
                                            styles={customStyles}
                                            placeholder="Choose software"
                                            menuPortalTarget={document.body} // 👈 render the menu in portal
                                            // className="w-48"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Price (INR)
                                    </label>
                                    <input
                                        name="price"
                                        value={form.price}
                                        ref={priceRef}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        className=" [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full  border rounded px-[14px] py-[10px]  focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                        required
                                        onChange={(e) => {
                                            // Allow only digits
                                            const onlyNums =
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                );
                                            setForm({
                                                ...form,
                                                price: onlyNums,
                                            });
                                            localStorage.setItem(
                                                "modelData",
                                                JSON.stringify(form)
                                            );
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Category
                                    </label>
                                    <div
                                        className={`flex gap-2 items-center w-full border rounded border-[#000]`}
                                    >
                                        <Select
                                            components={{
                                                SingleValue,
                                                Option: CustomOption,
                                                IndicatorSeparator: () => null, // Optional: remove the vertical bar
                                            }}
                                            className="basic-single rounded w-full bg-gray-100   border border-gray-200 placeholder-gray-500 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                            classNamePrefix="select"
                                            // defaultValue={countryOptions[57]} // optional
                                            options={categoryOptions}
                                            value={selectedCategory}
                                            required
                                            getOptionLabel={(e) => e.name}
                                            getOptionValue={(e) => e.name}
                                            onChange={(selectedOption) => {
                                                setForm((prev) => ({
                                                    ...prev,
                                                    category:
                                                        selectedOption?.name, // or selectedOption?.value if using value
                                                }));
                                                // console.log(form.software);
                                                setSelectedCategory(
                                                    selectedOption
                                                ); // update local state if needed
                                                if (descriptionRef.current) {
                                                    descriptionRef.current.focus();
                                                }
                                            }}
                                            styles={customStyles}
                                            placeholder="Choose Category"
                                            menuPortalTarget={document.body} // 👈 render the menu in portal
                                            // className="w-48"
                                        />
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* Description */}
                        <fieldset>
                            <legend className="text-xl font-semibold mb-4">
                                Description
                            </legend>

                            <label className="block mb-1 font-medium">
                                Model Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                ref={descriptionRef}
                                onChange={handleChange}
                                className="w-full border rounded p-3 h-28 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                required
                            />
                        </fieldset>

                        {/* Files & Format */}
                        <fieldset>
                            <legend className="text-xl font-semibold mb-4">
                                Model Files
                            </legend>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-1 font-medium">
                                        File Format (e.g. STL, STEP)
                                    </label>
                                    {/* <input
                                        name="format"
                                        value={form.format}
                                        onChange={handleChange}
                                        className="w-full border rounded px-[14px] py-[10px]  focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                        required
                                    /> */}
                                    {selectedSoftware ? (
                                        formatOptions.length > 0 ? (
                                            <div className="flex gap-2 items-center w-full border rounded border-[#000]">
                                                <Select
                                                    components={{
                                                        SingleValues,
                                                        IndicatorSeparator:
                                                            () => null,
                                                    }}
                                                    className="basic-single rounded w-full bg-gray-100 border border-gray-200 placeholder-gray-500 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                                    classNamePrefix="select"
                                                    options={formatOptions}
                                                    value={selectedFormat}
                                                    required
                                                    onChange={(selected) => {
                                                        setSelectedFormat(
                                                            selected
                                                        );
                                                        setForm((prev) => ({
                                                            ...prev,
                                                            format: selected.value,
                                                        }));
                                                        if (tagsRef.current) {
                                                            tagsRef.current.focus();
                                                        }
                                                    }}
                                                    placeholder="Select format"
                                                    styles={customStyles}
                                                    menuPortalTarget={
                                                        document.body
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-1 italic">
                                                No format options available for
                                                selected software.
                                            </p>
                                        )
                                    ) : (
                                        <div className="flex gap-2 items-center px-[14px] py-[12px] w-full border rounded border-[#000]">
                                            <p className="text-sm text-gray-500 italic">
                                                Please select software first to
                                                choose format.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-1 font-medium">
                                        Tags/Keywords (comma-separated)
                                    </label>
                                    <input
                                        name="tags"
                                        ref={tagsRef}
                                        value={form.tags}
                                        onChange={handleChange}
                                        className="w-full border rounded px-[14px] py-[10px]  focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="block mb-2 font-medium">
                                    Upload Preview Images
                                </label>
                                <input
                                    className="bg-[#f0f0f0] cursor-pointer p-1 pl-2 border  w-full max-w-[400px] md:w-fit focus:outline-none focus:ring-[.5px] focus:ring-blue-400 rounded-sm"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    required
                                    ref={previewRef}
                                    onChange={(e) =>
                                        handleFileChange(e, "preview")
                                    }
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block mb-2 font-medium">
                                    Upload Model File (.zip file 100MB max)
                                </label>
                                <input
                                    className="bg-[#f0f0f0] cursor-pointer p-1 pl-2 border w-full max-w-[400px] md:w-fit focus:outline-none focus:ring-[.5px] focus:ring-blue-400 rounded-sm"
                                    type="file"
                                    accept=".zip"
                                    ref={zipRef}
                                    onChange={(e) =>
                                        handleFileChange(e, "model")
                                    }
                                    required
                                />
                            </div>
                        </fieldset>
                        {/* Settings */}
                        <fieldset>
                            {/* <legend className="text-xl font-semibold mb-4">
                                    Settings
                                </legend> */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* <div>
                                    <label className="block mb-1 font-medium">
                                        License
                                    </label>
                                    <select
                                        name="license"
                                        value={form.license}
                                        onChange={handleChange}
                                        className="w-full border cursor-pointer rounded p-2 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                    >
                                        <option value="commercial">
                                            Commercial Use
                                        </option>
                                        <option value="personal">
                                            Personal Use
                                        </option>
                                    </select>
                                </div> */}

                                {/* <div>
                                    <label className="block mb-1 font-medium">
                                        Visibility
                                    </label>
                                    <select
                                        name="visibility"
                                        value={form.visibility}
                                        onChange={handleChange}
                                        className="w-full border cursor-pointer rounded p-2 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                    >
                                        <option value="public">Public</option>
                                        <option value="draft">
                                            Save as Draft
                                        </option>
                                    </select>
                                </div> */}

                                <div className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={form.agreeToTerms}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                agreeToTerms: e.target.checked,
                                            })
                                        }
                                        onInvalid={(e) =>
                                            e.target.setCustomValidity(
                                                "You must agree the terms to proceed."
                                            )
                                        }
                                        onInput={(e) =>
                                            e.target.setCustomValidity("")
                                        }
                                        required
                                        className="mt-1"
                                    />
                                    <label htmlFor="terms" className="text-sm">
                                        I agree to the{" "}
                                        <a
                                            href="/terms-and-conditions"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            Terms & Conditions
                                        </a>
                                    </label>
                                </div>
                            </div>
                        </fieldset>

                        {/* Submit Button */}
                        <div className="text-right">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-green-600 text-white ${isSubmitting ? " cursor-not-allowed " : "cursor-pointer"}  py-2.5 px-6 rounded hover:bg-green-700`}
                            >
                                {isSubmitting ? "Uploading..." : "Submit Model"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
