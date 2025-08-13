"use client";
import { useEffect, useState } from "react";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlistItems");
    if (stored) {
      setWishlistItems(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border p-2 rounded shadow">
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded" />
              <h2 className="font-semibold mt-2">{item.title}</h2>
              <p className="text-gray-600">₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
