"use client";
import { useState } from "react";

export default function SellModelPage() {
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
        license: "commercial",
        visibility: "public",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e, type) => {
        if (type === "preview") {
            setForm({
                ...form,
                previewImages: [...form.previewImages, ...e.target.files],
            });
        } else {
            setForm({ ...form, modelFile: e.target.files[0] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Model:", form);
        // TODO: Upload to backend
    };
    const softwareOptions = [
        "SolidWorks",
        "AutoCAD",
        "CATIA",
        "Fusion 360",
        "Creo",
        "Siemens NX",
        "Autodesk Inventor",
        "Rhino",
        "Onshape",
        "Other",
    ];
    const categoryOptions = [
        "Mechanical",
        "Electrical",
        "Automobile",
        "Aerospace",
        "Civil",
        "Architectural",
        "Product Design",
        "3D Printing",
        "Robotics",
        "Medical",
        "Furniture",
        "Consumer Electronics",
        "Industrial Equipment",
        "Other",
    ];

    return (
        <>
        {/* <div className="min-h-1"> */}
            
        {/* </div> */}
        <div className="max-w-4xl mx-auto pt-2 md:p-8 px-5 pb-10 bg-white md:mb-38 mb-10 rounded-md custom-shadow-sell-models md:relative top-24">
            <h1 className="text-3xl font-bold mb-6">Sell Your 3D Model</h1>

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
                                className="w-full border rounded p-2 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Software Used
                            </label>
                            <select
                                name="software"
                                value={form.software}
                                onChange={handleChange}
                                className="w-full cursor-pointer border rounded p-2 bg-white focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                required
                            >
                                <option value="">Select Software</option>
                                {softwareOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Price (INR)
                            </label>
                            <input
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                type="number"
                                className="w-full  border rounded p-2 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Category
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className=" cursor-pointer w-full border rounded p-2 bg-white focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                required
                            >
                                <option value="">Select Category</option>
                                {categoryOptions.map((option) => (
                                    <option  key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
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
                            <input
                                name="format"
                                value={form.format}
                                onChange={handleChange}
                                className="w-full border rounded p-2 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Tags (comma-separated)
                            </label>
                            <input
                                name="tags"
                                value={form.tags}
                                onChange={handleChange}
                                className="w-full border rounded p-2 focus:outline-none focus:ring-[.5px] focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block mb-2 font-medium">
                            Upload Preview Images
                        </label>
                        <input
                         className="bg-[#f0f0f0] cursor-pointer p-1 pl-2 border focus:outline-none focus:ring-[.5px] focus:ring-blue-400 rounded-sm"
                            type="file"
                            multiple
                            accept="image/*"
                            required
                            onChange={(e) => handleFileChange(e, "preview")}
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block mb-2 font-medium">
                            Upload Model File (.zip file)
                        </label>
                        <input
                        className="bg-[#f0f0f0] cursor-pointer p-1 pl-2 border focus:outline-none focus:ring-[.5px] focus:ring-blue-400 rounded-sm"
                            type="file"
                            accept=".zip"
                            onChange={(e) => handleFileChange(e, "model")}
                            required
                        />
                    </div>
                </fieldset>

                {/* Settings */}
                <fieldset>
                    <legend className="text-xl font-semibold mb-4">
                        Settings
                    </legend>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
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
                                <option value="personal">Personal Use</option>
                            </select>
                        </div>

                        <div>
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
                                <option value="draft">Save as Draft</option>
                            </select>
                        </div>
                    </div>
                </fieldset>

                {/* Submit Button */}
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-green-600 text-white cursor-pointer py-2 px-6 rounded hover:bg-green-700"
                    >
                        Submit Model
                    </button>
                </div>
            </form>
        </div>
        </>
    );
}
