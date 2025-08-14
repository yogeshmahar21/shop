"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Sorting from "@/components/Sorting";
import SortingListModels from "@/components/SortingListModels";
import toast from "react-hot-toast";
import DotLoader from "@/components/Dotloader";
import Env from "@/config/frontendEnv";
export default function ListedModelsPage() {
    const router = useRouter();
    const apiUrl = Env.LOCAL_URL || Env.IP_URL;
    const searchParams = useSearchParams();
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadLinks, setDownloadLinks] = useState({});
    const [loadingIds, setLoadingIds] = useState({}); // track loading per id
    const [filterLoading, setFilterLoading] = useState(true);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 20; // or any number you want per page
    const [totalPages, setTotalPages] = useState(1);
    const [totalModels, setTotalModels] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteModelId, setDeleteModelId] = useState(null);
    const sort = searchParams.get("sort") || "";
    const start = (page - 1) * limit + 1;
    const end = Math.min(start + limit - 1, totalModels);
    useEffect(() => {
        const fetchModels = async () => {
            setFilterLoading(true); // Reset loading state before fetching
            try {
                // setFilterLoading(true); 
                const res = await fetch(
                    `${apiUrl}/api/models/mine?sort=${sort}&page=${page}&limit=${limit}`,
                    {
                        credentials: "include", // for cookies
                    }
                );
                const data = await res.json();
                setModels(data.models || []);
                console.log("Fetched models:", data.total);
                setTotalPages(data.totalPages || 1);
                setTotalModels(data.total || 0);
            } catch (err) {
                console.error("Error fetching models:", err);
            }
            setFilterLoading(false);
        };

        fetchModels();
    }, [searchParams.toString()]);
    const handleSortChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }
        router.push(`/seller-dashboard/listing?${params.toString()}`);
    };
    const handleModelClick = (id) => {
        router.push(`/models/${id}`);
    };
    const handleEdit = async (id) => {
        console.log("first id is this ", id);
        router.push(`/seller-dashboard/edit-model/${id}`);
    };

    const handleDeleteClick = (id) => {
        setDeleteModelId(id);
        setConfirmDelete(true);
    };

    // When user clicks "Cancel" in modal
    const handleCancelDelete = () => {
        setConfirmDelete(false);
        setDeleteModelId(null);
    };
    const handleConfirmDelete = async (e) => {
        e.preventDefault();
        const id = deleteModelId;
        setIsDeleting(true); // ⬅️ Show loader
        const toastId = toast.loading("Deleting model, Please wait... ");
        try {
            await fetch(`${apiUrl}/api/models/${id}`, {
                method: "DELETE",
                credentials: "include", // 🔑 Sends auth cookies
                headers: {
                    "Content-Type": "application/json", // optional for DELETE but okay
                },
            });
            setModels((prevModels) => prevModels.filter((m) => m._id !== id));
            setTotalModels((prev) => prev - 1);
            if (models.length === 1 && page > 1) {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", String(page - 1));
                router.replace(
                    `/seller-dashboard/listing?${params.toString()}`
                );
            }
            // setModels(models.filter((model) => model._id !== id)); // Use _id if that's what's in DB
            toast.success("Model deleted successfully", { id: toastId });
        } catch (err) {
            console.error("Failed to delete model:", err);
            toast.success(" Error deleting model", { id: toastId });
        } finally {
            setIsDeleting(false); // Hide loader
            setConfirmDelete(false);
            setDeleteModelId(null);
        }
    };
    const handleDownload = async (id) => {
        if (loadingIds[id]) return; // already loading, ignore extra clicks
        const now = Date.now();
        const expiryDuration = 60 * 60 * 1000; // 1 hour in milliseconds

        // Check if we have a cached link and it's still valid
        if (
            downloadLinks[id] &&
            downloadLinks[id].url &&
            now - downloadLinks[id].timestamp < expiryDuration
        ) {
            window.open(downloadLinks[id].url, "_blank");
            toast.success("Download success of cahhe");
            return;
        }

        try {
            setLoadingIds((prev) => ({ ...prev, [id]: true }));

            const res = await fetch(`${apiUrl}/api/models/${id}/files`, {
                credentials: "include",
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error("Failed to download");
                return;
            }

            setDownloadLinks((prev) => ({
                ...prev,
                [id]: {
                    url: data.zipFile,
                    timestamp: now,
                },
            }));

            window.open(data.zipFile, "_blank");
            toast.success("Download success");
        } catch (err) {
            console.error("Download error:", err);
            toast.error("Something went wrong while downloading.");
        } finally {
            setLoadingIds((prev) => ({ ...prev, [id]: false }));
        }
    };
    const isEditedToday = (lastEditedAt, createdAt) => {
        if (!lastEditedAt) {
            // If never edited, allow edit
            return false;
        }

        const editedDate = new Date(lastEditedAt);
        const now = new Date();

        // Check if lastEditedAt is today
        return (
            editedDate.getDate() === now.getDate() &&
            editedDate.getMonth() === now.getMonth() &&
            editedDate.getFullYear() === now.getFullYear()
        );
    };

    return (
        <>
            {confirmDelete && (
                <div className="fixed z-2 bg-[#00000087] flex justify-center  w-full h-[100vh] md:top-15 top-12.5 ">
                    {!isDeleting ? (
                        <div className="rounded-lg mt-18 p-10 h-50 bg-amber-50 max-w-100 text-center">
                            <p>Are you sure you want to delete this model?</p>
                            <div className="flex flex-row justify-around items-start mt-10">
                                <span
                                    onClick={handleConfirmDelete}
                                    className="bg-[#ff1717] text-white rounded-lg py-2 px-4 cursor-pointer mb-4"
                                >
                                    Yes Delete
                                </span>
                                <span
                                    onClick={handleCancelDelete}
                                    className="bg-[#000000] text-white rounded-lg py-2 px-4 cursor-pointer "
                                >
                                    Cancel
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="sm:top-[38%] top-[34%] relative">
                            <DotLoader />
                        </div>
                    )}
                </div>
            )}

            {/* <div className="p-6 md:pt-23 pt-20 pb-20 max-w-6xl mx-auto shadow-xl"> */}
            <div className="p-6 md:pt-23 pt-20 pb-20 max-w-6xl mx-auto shadow-xl">
                {/* <div className="flexs"> */}
                <h1 className="text-2xl font-bold mb-3">All Listed Models</h1>
                <div className="mb-4">
                    <SortingListModels
                        sort={sort}
                        onSortChange={handleSortChange}
                        setFilterLoading={setFilterLoading}
                    />
                    {models.length > 0 && (
                        <h1 className="mt-2 ml-2">
                            {" "}
                            Showing {start} – {end} of {totalModels} results
                        </h1>
                    )}

                    {/* </div> */}
                </div>
                {filterLoading ? (
                    <div className="overflow-x-auto border-[#00000036] border-1 rounded-xl">
                        <table className="min-w-[875px] w-full bg-white shadow-md rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-[#dadada] text-left text-sm font-semibold text-gray-600">
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Software</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Upload Date</th>
                                    <th className="px-4 py-3">
                                        Edit / Downlaod / Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(7)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-4 py-3">
                                            <div className="bg-gray-300 h-4 w-32 rounded" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="bg-gray-300 h-4 w-24 rounded" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="bg-gray-300 h-4 w-20 rounded" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="bg-gray-300 h-4 w-16 rounded" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="bg-gray-300 h-4 w-28 rounded" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="bg-gray-300 h-4 w-24 rounded" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : models.length === 0 ? (
                    <p className="text-gray-600">
                        You haven&apos;t uploaded any models yet.&nbsp;
                        <button
                            onClick={() =>
                                router.push("/seller-dashboard/add-new-model")
                            }
                            className="text-blue-500 underline cursor-pointer"
                        >
                            add model now
                        </button>
                    </p>
                ) : (
                    <div className="overflow-x-auto border-[#00000036] border-1 rounded-xl">
                        <table className="min-w-[875px] w-full bg-white shadow-md rounded-xl overflow-hidden">
                            <thead>
                                <tr className="bg-[#dadada] text-left text-sm font-semibold text-gray-600">
                                    <th className="px-4 py-3">Title</th>
                                    <th className="px-4 py-3">Software</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3">Price</th>
                                    <th className="px-4 py-3">Upload Date</th>
                                    <th className="px-4 py-3">
                                        Edit / Downlaod / Delete
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {models.map((model, index) => (
                                    <tr
                                        id={model._id}
                                        key={model._id}
                                        className="border-t text-sm odd:bg-[#ffffff] even:bg-[#f5f5f5]"
                                    >
                                        <td
                                            onClick={() =>
                                                handleModelClick(model._id)
                                            }
                                            className="px-4 max-w-[160px] overflow-hidden cursor-pointer underline text-[#1500ff] whitespace-nowrap hover:text-[#0c0093] py-3"
                                        >
                                            {model.title}
                                        </td>
                                        <td className="px-4 py-3">
                                            {model.software}
                                        </td>
                                        <td className="px-4 py-3">
                                            {model.category}
                                        </td>
                                        <td className="px-4 whitespace-nowrap py-3">
                                            ₹{model.price}
                                        </td>
                                        <td className="px-4 whitespace-nowrap py-3">
                                            {model.updatedAt !==
                                            model.createdAt ? (
                                                <>
                                                    <p className="p-0 m-0 h-0 italic text-[#0f9313]">
                                                        Last Updated
                                                    </p>
                                                    <br />
                                                    {new Date(
                                                        model.updatedAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {" "}
                                                    {new Date(
                                                        model.createdAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap md:flex-nowrap gap-2.5">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(model._id)
                                                    }
                                                    disabled={isEditedToday(
                                                        model.lastEditedAt,
                                                        model.createdAt
                                                    )}
                                                    className={`px-3 py-1 rounded ${
                                                        isEditedToday(
                                                            model.lastEditedAt,
                                                            model.createdAt
                                                        )
                                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                                            : "bg-[#444] text-white hover:bg-[#3b3b3b] hover:text-[#e0e0e0] cursor-pointer"
                                                    }`}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    disabled={
                                                        loadingIds[model._id]
                                                    }
                                                    onClick={() =>
                                                        handleDownload(
                                                            model._id
                                                        )
                                                    }
                                                    className="px-3 py-1 cursor-pointer bg-[#04a41a] text-white rounded hover:bg-[#088619]"
                                                >
                                                    {loadingIds[model._id]
                                                        ? "Preparing..."
                                                        : "Download ZIP"}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            model._id
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-10 gap-2">
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(
                                    searchParams.toString()
                                );
                                params.set("page", String(page - 1));
                                router.replace(
                                    `/seller-dashboard/listing?${params.toString()}`
                                );
                            }}
                            disabled={page <= 1}
                            className="px-4 bg-[#816df0] py-1.5 text-white cursor-pointer rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="text-sm px-2 py-1">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(
                                    searchParams.toString()
                                );
                                params.set("page", String(page + 1));
                                router.replace(
                                    `/seller-dashboard/listing?${params.toString()}`
                                );
                            }}
                            disabled={page >= totalPages}
                            className="px-4  bg-[#816df0] py-1.5 text-white cursor-pointer rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-5"></div>
        </>
    );
}
