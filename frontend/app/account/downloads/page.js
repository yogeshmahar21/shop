"use client";
import { useState } from "react";
import RandomModels from "@/components/RandomModels";
import { models } from "@/lib/pData";

export default function AccountDownloads() {
    const [downloads] = useState([
        {
            id: 1,
            title: "Engine Block CAD Model",
            fileName: "engine-block.step",
            downloadUrl: "/downloads/engine-block.step",
            status: "Completed",
            date: "2025-05-10",
        },
        {
            id: 2,
            title: "Gearbox Assembly",
            fileName: "gearbox.zip",
            downloadUrl: "/downloads/gearbox.zip",
            status: "Pending",
            date: "2025-05-09",
        },
        {
            id: 3,
            title: "Crankshaft STL",
            fileName: "crankshaft.stl",
            downloadUrl: "/downloads/crankshaft.stl",
            status: "Completed",
            date: "2025-05-08",
        },
    ]);

    return (
        <div className="w-full pt-4 md:pt-7 max-w-[1370px]  bg-white">
            <div className="bg-gray-100  pt-20 pb-10 md:px-4 ">
                <div className="max-w-5xl mx-auto bg-white shadow-md md:rounded-lg py-6 px-4 md:px-6">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        My Downloads
                    </h2>

                    {/* Table wrapper to prevent overflow */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-3">Title</th>
                                    <th className="p-3">File</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3 text-center">
                                        Download
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {downloads.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3">{item.title}</td>
                                        <td className="p-3 text-blue-600 underline">
                                            {item.fileName}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 text-sm rounded-md ${
                                                    item.status === "Completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="p-3">{item.date}</td>
                                        <td className="p-3 text-center">
                                            {item.status === "Completed" ? (
                                                <a
                                                    href={item.downloadUrl}
                                                    download
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                                >
                                                    Download
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">
                                                    Not ready
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="bg-[#f1f3f6] pb-6">
                <div className=" bg-green-400 custom-shadow-pdetails ">
                    <RandomModels count={10} />
                </div>
            </div>
        </div>
    );
}
