"use client";
import { useState } from "react";

export default function AccountWishlist() {
    const [wishlist, setWishlist] = useState([
        {
            id: 1,
            title: "Industrial Fan 3D Model",
            image: "/models/fan.jpg",
            software: "SolidWorks",
            price: 499,
        },
        {
            id: 2,
            title: "Hydraulic Cylinder",
            image: "/models/cylinder.jpg",
            software: "CATIA",
            price: 899,
        },
        {
            id: 3,
            title: "Robotic Arm CAD",
            image: "/models/robotic-arm.jpg",
            software: "Fusion 360",
            price: 1200,
        },
    ]);

    const removeFromWishlist = (id) => {
        setWishlist(wishlist.filter((item) => item.id !== id));
    };

    return (
        <div className="bg-gray-100 min-h-screen pt-20 pb-10 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">My Wishlist</h2>

                {wishlist.length === 0 ? (
                    <p className="text-center text-gray-500">Your wishlist is empty.</p>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-md p-4 shadow hover:shadow-lg transition"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-40 object-cover rounded"
                                />
                                <div className="mt-3">
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        Software: {item.software}
                                    </p>
                                    <p className="text-blue-600 font-semibold mt-1">
                                        ₹{item.price}
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                                            View Model
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="text-sm text-red-600 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
