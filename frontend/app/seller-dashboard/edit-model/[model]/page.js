"use client";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Select, { components } from "react-select";
import { useRouter, useParams } from "next/navigation";
import { X, Plus } from "lucide-react";
import Env from "@/config/frontendEnv";
import DotLoader from "@/components/Dotloader";
import SimpleLoader from "@/components/SimpleLoader";

export default function EditModelPage() {
    const [apiUrl, setApiUrl] = useState(Env.LOCAL_URL || Env.IP_URL);
    const [softwareOptions, setSoftwareOptions] = useState([]);
    const [selectedSoftware, setSelectedSoftware] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formatOptions, setFormatOptions] = useState([]); // file formats for selected software
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadAgain, setUploadAgain] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedZipName, setSelectedZipName] = useState("");
    const [zipFile, setZipFile] = useState(null);
    const [newZipFile, setNewZipFile] = useState(null); // new ZIP file state
    const descriptionRef = useRef(null);
    const priceRef = useRef(null);
    const [imageLoadStatus, setImageLoadStatus] = useState([]);

    const tagsRef = useRef(null);
    const Router = useRouter();
    const zipRef = useRef();
    const previewRef = useRef();
    const [imagesError, setImagesError] = useState(false);
    const { model } = useParams();
    const id = model;
    // const [zipFileUrl, setZipFileUrl] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]); // URLs from backend
    const [zipPath, setZipPath] = useState(null);
    const [test, setTest] = useState(null);
    const [newImages, setNewImages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingAssets, setLoadingAssets] = useState(true); // 👈 loader flag
    // const [newZipFile, setTest] = useState(null);
    // const [existingZip, setExistingZip] = useState(null);
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

    // Fetch existing model if editing
    useEffect(() => {
        const fetchModelToEdit = async () => {
            if (!id) return;

            try {
                // setLoadingAssets(true); // 🔄 Start loader
                const res = await fetch(`${apiUrl}/api/models/${id}`, {
                    method: "GET",
                    credentials: "include", // 🔑 Sends auth cookies
                    headers: {
                        "Content-Type": "application/json", // optional for DELETE but okay
                    },
                });
                const data = await res.json();
                // Update state with fetched data
                setForm({
                    title: data.title || "",
                    description: data.description || "",
                    software: data.software || "",
                    category: data.category || "",
                    format: data.format || "",
                    price: data.price?.toString() || "",
                    tags: data.tags || "",
                    previewImages: [], // we won't re-upload images, show thumbnails instead
                    modelFile: null, // zip can't be pre-filled in file input
                    agreeToTerms: true,
                });
                setExistingImages(
                    (data.previewImages || []).map((img) => img.fileName)
                );
                const softwareMatch = softwareOptions.find(
                    (s) => s.name === data.software
                );
                const categoryMatch = categoryOptions.find(
                    (c) => c.name === data.category
                );

                setSelectedSoftware(softwareMatch || null);
                setSelectedCategory(categoryMatch || null);

                if (softwareMatch?.formats) {
                    const formatOpts = softwareMatch.formats.map((f) => ({
                        label: f,
                        value: f,
                    }));
                    setFormatOptions(formatOpts);
                    const formatMatch = formatOpts.find(
                        (f) => f.value === data.format
                    );
                    setSelectedFormat(formatMatch || null);
                }
            } catch (err) {
                console.error("❌ Failed to fetch model for editing", err);
            } finally {
                // setLoadingAssets(false); // ✅ Stop loader
            }
        };

        fetchModelToEdit();
    }, [id, softwareOptions, categoryOptions]);
    useEffect(() => {
        const fetchModelData = async () => {
            try {
                setLoadingAssets(true); // 🔄 Start loader
                const fileRes = await fetch(
                    `http://localhost:5000/api/models/${id}/images`,
                    {
                        method: "GET",
                        credentials: "include", // 🔑 Sends auth cookies
                        headers: {
                            "Content-Type": "application/json", // optional for DELETE but okay
                        },
                    }
                );
                const fileData = await fileRes.json();
                const existingUrls = fileData.previewImages.map((img) =>
                    img.url.trim()
                );
                setPreviewImages(existingUrls);
                setImageLoadStatus(
                    new Array(fileData.previewImages?.length || 0).fill(false)
                );
           
            } catch (err) {
                console.error("Failed to fetch model files", err);
            } finally {
                setLoadingAssets(false); // ✅ Stop loader
            }
        };

        fetchModelData();
    }, [id]);

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
  
    const isZipFile = (file) => {
        const validZipTypes = [
            "application/zip",
            "application/x-zip-compressed",
            "multipart/x-zip", // rare
            "application/octet-stream", // fallback generic binary
        ];
        const hasZipExtension = file.name.toLowerCase().endsWith(".zip");
        return hasZipExtension && validZipTypes.includes(file.type);
    };

    const triggerZipUpload = () => {
        if (zipRef.current) {
            zipRef.current.click();
        }
    };
    const onZipChange = (e) => {
        const file = e.target.files?.[0];
        setTest(form.modelFile);
        if (file) {
            console.log("file name is ", file.name);
            setSelectedZipName(file.name);
            setZipPath(file.name);
        }
        handleFileZipChange(e, "model");
    };
    const handleFileZipChange = (e, type) => {
        const file = e.target.files?.[0];
        if (!file) {
            return toast.error("File not found");
        }
        if (type === "model") {
            if (!isZipFile(file)) {
                return toast.error("Please upload a valid .zip file.");
            }
            if (file.size > 104857600) {
                return toast.error("Zip file size must be less than 100MB.");
            }
            setZipFile(file); // store it in state or handle upload
            setZipPath(file.name);
            setNewZipFile(file);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({ ...form, [name]: value });
        localStorage.setItem("modelData", JSON.stringify(form));
    };
    const handleRemoveZip = () => {
        // Clear the file input
        if (zipRef.current) {
            zipRef.current.value = null;
        }
        setZipFile(null);
        setNewZipFile(null);
        setZipPath(form.modelFile);
        setSelectedZipName("");
      
    };
    // const handleImageChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     const total = previewImages.length + files.length;

    //     if (total > 8) {
    //         return toast.error("You can upload up to 8 images only.");
    //     }
    //     const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    //     setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    //     setImageFiles((prev) => {
    //         const updatedFiles = [...prev, ...files];
    //         setForm((f) => ({
    //             ...f,
    //             previewImages: updatedFiles, // ✅ Actual files stored in form
    //         }));
    //         return updatedFiles;
    //     });
    // };
    // const handleRemoveImage = (index) => {
    //    const updatedPreviews = [...previewImages];
    // const updatedFiles = [...imageFiles];

    // updatedPreviews.splice(index, 1);
    // updatedFiles.splice(index, 1);

    // setPreviewImages(updatedPreviews);
    // setImageFiles(updatedFiles);

    // setForm((prev) => ({
    //     ...prev,
    //     previewImages: updatedFiles, // ✅ Keep actual files in sync
    // }));
    // };
    const handleImageLoad = (index) => {
        setImageLoadStatus((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    };

    const sanitizeFileName = (fileName) => {
        return fileName.trim().replace(/\s+/g, "-"); // or remove spaces completely with .replace(/\s+/g, "")
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const existing = existingImages || [];
        const current = imageFiles || [];
        const totalCount = existing.length + current.length + files.length;
        if (totalCount > 8) {
            return toast.error("You can upload up to 8 images only.");
        }
        const sanitizedFiles = files.map((file) => {
            const cleanedName = sanitizeFileName(file.name);
            return new File([file], cleanedName, { type: file.type });
        });
        const newFiles = [...current, ...sanitizedFiles];
        setImageFiles(newFiles);
        const newPreviews = files.map((file) => ( URL.createObjectURL(file)));
        setPreviewImages((prev) => [...prev, ...newPreviews]);
        setNewImages(newFiles);
        setForm((prev) => ({
            ...prev,
            previewImages: newFiles, // only files
        }));
    };

 const handleRemoveImage = (index) => {
  // Find out if index belongs to existingImages or imageFiles
  if (index < existingImages.length) {
    // Removing an existing image (string URL/fileName)
    const removedFileName = existingImages[index];

    // Remove from existingImages
    const updatedExisting = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedExisting);

    // Update form previewImages to combined updated existing + imageFiles
    setForm((prev) => ({
      ...prev,
      previewImages: [...updatedExisting, ...imageFiles],
    }));
  } else {
    // Removing a newly uploaded image
    const fileIndex = index - existingImages.length;

    // Remove from imageFiles and newImages state
    const updatedFiles = imageFiles.filter((_, i) => i !== fileIndex);
    setImageFiles(updatedFiles);
    setNewImages(updatedFiles);

    // Update form previewImages to combined existing + updated new files
    setForm((prev) => ({
      ...prev,
      previewImages: [...existingImages, ...updatedFiles],
    }));
  }

  // Also update previewImages state for UI display
  const updatedPreviewImages = previewImages.filter((_, i) => i !== index);
  setPreviewImages(updatedPreviewImages);
};


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLoading(true);
        const formData = new FormData();
        const toastId = toast.loading("Updating Please wait...");
        // Append updated fields if any (title, desc, etc.)  title: "",
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("software", form.software);
        formData.append("category", form.category);
        formData.append("format", form.format);
        formData.append("price", form.price);
        formData.append("tags", form.tags);
        formData.append("existingImages", JSON.stringify(existingImages));
        if (newImages) {
            newImages.forEach((file) => {
                formData.append("newImages", file);
            });
        }
        if (newZipFile) {
            formData.append("newZip", newZipFile);
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/models/update/${id}`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );
            const data = await res.json();
            if (!res.ok) {
                // Replace loading toast with error
                toast.error(data.message || "Update failed", { id: toastId });
                return;
            }
            toast.success("Model updated successfully!", { id: toastId });
            Router.replace("/seller-dashboard/listing");
        } catch (err) {
            console.error("Update Error:", err);
            toast.error("Something went wrong!", { id: toastId });
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed z-2 bg-[#00000087] flex justify-center  w-full h-[100vh] md:top-15 top-12.5 ">
                    <div className="sm:top-[38%] top-[34%] relative">
                        <DotLoader />
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

                            <div className="mt-11">
                                <label className="block mb-5 font-medium">
                                    Update Uploaded Images (max 8)
                                </label>

                                {/* Hidden input (only triggered by + buttons) */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    ref={previewRef}
                                    style={{ display: "none" }}
                                    disabled={loadingAssets}
                                    onChange={(e) =>
                                        handleImageChange(e, "preview")
                                    }
                                />

                                <div className="flex flex-wrap gap-4 max-w-xl">
                                    {[...Array(8)].map((_, i) => {
                                        const image = previewImages[i];
                                        if (image) {
                                            return (
                                                <div
                                                    key={i}
                                                    className="relative w-30 h-30 border rounded"
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Preview ${i}`}
                                                        className="w-full h-full object-cover rounded "
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveImage(i)
                                                        }
                                                        className="absolute text-black top-[-8px] cursor-pointer right-[-8px] bg-[#a7d4ff] rounded-full p-1 text-xs"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div
                                                key={i}
                                                className={`w-30 h-30 flex items-center justify-center border-2 border-dashed border-gray-300 rounded hover:bg-gray-100
                                                         ${
                                                             loadingAssets
                                                                 ? "cursor-not-allowed opacity-50"
                                                                 : "cursor-pointer hover:bg-gray-100"
                                                         }
                                                                      `}
                                                onClick={() => {
                                                    if (!loadingAssets) {
                                                        previewRef.current?.click();
                                                    }
                                                }}
                                            >
                                                {loadingAssets ? (
                                                    <SimpleLoader />
                                                ) : (
                                                    <Plus
                                                        strokeWidth={3}
                                                        color="purple"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* )} */}
                            </div>

                            {/* Model File Input */}
                            <div className="mt-10">
                                <label className="block mb-4 font-medium">
                                    Upload New File (.zip file 100MB max)
                                </label>
                                <div className="mb-5 ml-2 mt-7 w-fit max-w-fit relative">
                                    {selectedZipName && (
                                        <div>
                                            <p className="mt-2 w-fit max-w-fit text-[16px] text-green-600 font-medium">
                                                {selectedZipName}
                                            </p>
                                            <button
                                                onClick={handleRemoveZip}
                                                className="right-[-10] bg-[#ff4242] p-1 cursor-pointer rounded-full absolute top-[-12] "
                                            >
                                                <X color="white" size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-x-10 gap-y-5 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={triggerZipUpload}
                                        className="cursor-pointer bg-[#131010] text-white px-5 py-3 text-md rounded-lg"
                                    >
                                        Add new zip
                                    </button>
                                </div>
                                <br />
                                <input
                                    className="hidden"
                                    type="file"
                                    accept=".zip"
                                    ref={zipRef}
                                    onChange={onZipChange}
                                />
                            </div>
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
                                disabled={loadingAssets || isSubmitting}
                                className={`bg-green-600 text-white ${loadingAssets || isSubmitting ? " cursor-not-allowed " : "cursor-pointer"}  py-2.5 px-6 rounded hover:bg-green-700`}
                            >
                                {loadingAssets ? "Updating..." : "Update Model"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
