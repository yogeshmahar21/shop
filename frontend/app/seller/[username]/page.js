"use client";
import { useEffect, useState } from "react";
import { sellerList } from "@/lib/SellerData";
import { models } from "@/lib/pData";import { useParams, useRouter, useSearchParams } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import { use } from "react";
import Link from "next/link";
const PRODUCTS_PER_PAGE = 25;

export default function SellerDetailPage(props) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const isLiked = (id) => wishlistItems.some((item) => item.id === id);
    const toggleLike = (item) => {
        if (isLiked(item.id)) {
            setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
        } else {
            setWishlistItems((prev) => [...prev, item]);
        }
    };

    const { username } = use(props.params); 

    const seller = sellerList.find(
        (seller) => seller.username.toLowerCase() === username.toLowerCase()
    );

 const updateURLParams = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        value ? params.set(key, value) : params.delete(key);
        if (key !== "page") {
            params.set("page", 1);
            setCurrentPage(1);
        }
        router.replace(`?${params.toString()}`, { scroll: true });
    };
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
    const pageFromURL = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(pageFromURL);
}, [searchParams]);

    // const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const totalPages = Math.ceil(models.length / PRODUCTS_PER_PAGE);
  
  const handlePageChange = (page) => {
        setCurrentPage(page);
        updateURLParams("page", page);
    };

    const paginatedProducts = models.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

 

    if (!seller) {
        return (
            <div className="p-10 text-center text-xl">Seller not found 😢</div>
        );
    }

    return (
        <div className="pt-12 md:pt-15">
            <section className="sm:p-6 p-2 bg-amber-100  ">
                <div className="flex flex-col mx-auto items-center max-w-3xl bg-white shadow-md rounded-lg p-8">
                    <img
                        className="w-32 h-32 rounded-full shadow-lg mb-4"
                        src={seller.profilePic}
                        alt={seller.name}
                    />
                    <h1 className="text-3xl font-bold mb-2">{seller.name}</h1>
                    <p className="text-lg text-gray-600">
                        {seller.expertise}
                    </p>
                    <p className="text-lg text-gray-600">
                        {seller.location}
                    </p>
                    <p className="text-lg text-gray-600 mb-4">
                        {seller.email}
                    </p>
                    <p className="text-md text-gray-500">
                        {seller.description || "No additional info provided."}
                    </p>
        
                </div>
            </section>



            <div className="mt-6 sm:px-7 px-5">
                <h3 className="text-2xl font-semibold">Seller's Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {paginatedProducts.map((product) => (
                        <div
                            key={product.id}
                            className=" ring-[0.5px] rounded-lg p-4"
                        >
                            <div className="absolute ">
                                <div
                                    className={`scale-90 select-none rounded-full  right-2 
                      ${isLiked(product.id) ? "bg-[#ffc8e5]" : "bg-[#675a74b8]"}`}
                                >
                                    <LikeButton
                                        model={product}
                                        isLiked={isLiked}
                                        toggleLike={toggleLike}
                                    />
                                </div>
                            </div>
                            <img
                                src={product.image[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-md"
                            />
                            <div className="mt-3">
                                <p className="font-bold text-xl">
                                    {" "}
                                    {product.price === 0
                                        ? "Free"
                                        : `₹${product.price}`}
                                </p>
                            </div>
                            <Link href={`/models/${product.id}`} className="w-auto">
                            <h4 className="hover:text-[#ec843f] cursor-pointer font-extrabold text-lg">{product.title}</h4>
                            </Link>
                            <p className="text-gray-600 restrict-passage">
                                {product.description}
                            </p>
                            <div className="flex gap-5 items-center mt-3">
                                <button className="  text-black px-4 py-2 rounded-lg bg-[#ff8512] cursor-pointer hover:bg-[#ff7b00]">
                                    Buy Now
                                </button>
                                <button className="  px-4 py-2 rounded-lg bg-[#ffcb20] cursor-pointer hover:bg-[#ffc525]  text-black">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                 <div className="flex justify-center items-center space-x-2 mt-6 pt-10 pb-9">
                    <button
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                            if (totalPages <= 3) return true;
                            if (currentPage <= 2) return page <= 3;
                            if (currentPage >= totalPages - 1)
                                return page >= totalPages - 2;
                            return Math.abs(currentPage - page) <= 1;
                        })
                        .map((page) => (
                            <button
                                key={page}
                                className={`px-3 py-1 rounded cursor-pointer ${
                                    currentPage === page
                                        ? "bg-[#816df0] text-white"
                                        : "bg-gray-200"
                                }`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}

                    <button
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            


        </div>
    );
}
