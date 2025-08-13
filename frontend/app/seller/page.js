// app/seller/page.js

"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
import { sellerList } from "@/lib/SellerData";
import { useRouter, useSearchParams } from "next/navigation";

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
export default function SellerPage() {
    const [searchQuery, setSearchQuery] = useState("");
const [shuffledSellers, setShuffledSellers] = useState([]);
 useEffect(() => {
    const shuffled = shuffleArray(sellerList);
    setShuffledSellers(shuffled);
  }, []);

  const filteredSellers = shuffledSellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

    return (
        <section className="p-6 pt-21 max-w-7xl mb-12 mx-auto">
            <h1 className="text-4xl md:text-5xl w-fit font-extrabold mb-6 uppercase tracking-wide text-transparent 
            bg-clip-text bg-gradient-to-r from-[#cb2bb3] via-[#353535] to-[#f65f5f] drop-shadow-md">
  Our Network Members
</h1>

            <div>
               
            </div>
            <input
                type="text"
                placeholder="Search sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md p-2 pl-3  border focus:outline-none focus:ring-[.5px] ring-[.5px] focus:ring-black border-gray-300 rounded mb-12"
            />
 {filteredSellers.length === 0 ? (
      <div className="pt-21 pb-30 text-center text-xl">
        No sellers found matching your search.
      </div>
    ) : (
            <div className="grid grid-cols-1 justify-items-center  sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredSellers.map((seller, index) => (
                    <div
                        key={index}
                        className="w-full max-w-sm bg-white  border border-gray-200 rounded-lg shadow-sm dark:bg-[#006464] dark:border-gray-700"
                    >
                        <div className="flex flex-col items-center pt-7 pb-7">
                            <img
                                className="w-24 h-24 mb-3 rounded-full shadow-lg"
                                src={seller.profilePic}
                                alt={seller.name}
                            />
                            <h5 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
                                {seller.name}
                            </h5>
                            <span className="text-sm text-gray-300">
                                {seller.expertise}
                            </span>
                            <span className="text-sm pt-1 text-gray-300 ">
                                {seller.location}
                            </span>
                            <div className="flex mt-4 md:mt-5">
                                <Link
                                    href={`/seller/${seller.username}`}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-[#1c1c1c] rounded-lg hover:bg-[#2c2c2c] focus:outline-none "
                                >
                                    View More
                                </Link>
                                {/* <Link
                                    href={`/seller/${seller.username}/message`}
                                    className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-[#ececec]"
                                >
                                    Message
                                </Link> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
              )}
        </section>
    );
}
