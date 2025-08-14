"use client";
import { useEffect, useState } from "react";
import { models } from "@/lib/pData";
import Image from "next/image";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { use } from "react";
import { Heart } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import Hearts from "@/components/Heart";
import { motion } from "framer-motion";
import CustomerReviews from "@/components/CustomerReviews";
import RelatedProducts from "@/components/RelatedProducts";
import Loader from "@/components/Loader"; // if you created it
import LikeButton from "@/components/LikeButton";
import RecommendedProducts from "@/components/RecommendedProducts";
import SearchBar from "@/components/SearchBar";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import Env from "@/config/frontendEnv";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
export default function ModelDetailPage(props) {
    const { id } = useParams(); // ✅ This is the correct way now
    const [model, setModel] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [filteredModels, setFilteredModels] = useState(models); // Initialize with all models
    const [recent, setRecent] = useState([]);
    const [mainImage, setMainImage] = useState("");
    const [wishlistItems, setWishlistItems] = useState([]);
    const [hasMounted, setHasMounted] = useState(false);
    const isLiked = (id) => wishlistItems.some((item) => item.id === id);
    const [loading, setLoading] = useState(false);
    const [filterLoading, setFilterLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const apiUrl = Env.LOCAL_URL || Env.IP_URL;
    // useEffect(() => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         setFilteredModels(models); // models is your static data
    //         setLoading(false);
    //     }, 100); // Delay to show loader
    // }, []);
    // useEffect(() => {
    //     const fetchModelToEdit = async () => {
    //         if (!id) return;

    //         try {
    //             const res = await fetch(`${apiUrl}/api/models/${id}`, {
    //                 method: "GET",
    //                 credentials: "include", // 🔑 Sends auth cookies
    //                 headers: {
    //                     "Content-Type": "application/json", // optional for DELETE but okay
    //                 },
    //             });
    //             const data = await res.json();
    //             // console.log("thiss is fetched data id ", data);

    //             // Update state with fetched data
    //             setForm(data);

    //         } catch (err) {
    //             console.error("❌ Failed to fetch model for editing", err);
    //         }
    //     };

    //     fetchModelToEdit();
    // }, [id]);
    useEffect(
        () => async () => {
            const fetchModel = async () => {
                try {
                    setLoading(true);
                    const res = await fetch(`${apiUrl}/api/models/${id}`, {
                        method: "GET",
                        credentials: "include", // 🔑 Sends auth cookies
                        headers: {
                            "Content-Type": "application/json", // optional for DELETE but okay
                        },
                    });
                    //  const fileRes = await fetch(
                    //     `${apiUrl}/api/models/${id}/files`,
                    //     {
                    //         method: "GET",
                    //         credentials: "include", // 🔑 Sends auth cookies
                    //         headers: {
                    //             "Content-Type": "application/json", // optional for DELETE but okay
                    //         },
                    //     }
                    // );
                    // const fileData = await fileRes.json();
                    const data = await res.json();
                    // alert("Model fetched successfully");
                    setModel(data);
                    setImageFiles(data.previewImages);
                    console.log("this is res data ", data);
                    // console.log(data)
                } catch (error) {
                    console.error("Error fetching model:", error);
                } finally {
                    setLoading(false);
                }
            };

            // if (id)
            fetchModel();
        },
        [id]
    );
    console.log("this is imageFiles  ", imageFiles);

    const ProductDetailSkeleton = () => {
        return (
            <div className="animate-pulse pt-7 w-full">
                {/* Mobile title */}
                <div className="flex justify-center mb-5 md:hidden">
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>

                <div className="mb-5 px-4 md:px-4 flex md:flex-row flex-col items-center md:items-start gap-3 w-full">
                    {/* Thumbnails */}
                    <div className="flex flex-row md:flex-col min-w-[74px] max-w-full md:max-h-[350px] overflow-x-auto md:overflow-y-auto space-x-2 md:space-x-0 md:space-y-2">
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="p-[1px] w-17 h-17 flex-shrink-0 bg-gray-300 rounded"
                            ></div>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="lg:mr-8 relative w-full max-w-full min-w-[300px] h-[300px] md:w-[400px] md:h-[300px] lg:ml-1 lg:w-[750px] bg-gray-300 border border-[#0000001c] rounded-sm"></div>

                    {/* Right Column */}
                    <div className="w-full md:ml-4 mt-4 md:mt-0">
                        <div className="w-full space-y-4">
                            {/* Title */}
                            <div className="hidden md:block h-6 bg-gray-300 rounded w-1/2"></div>

                            {/* Rating */}
                            <div className="flex gap-2 mt-1.5">
                                <div className="h-[21px] bg-gray-300 rounded w-12"></div>
                                <div className="h-[21px] bg-gray-300 rounded w-28"></div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-1">
                                <div className="h-8 bg-gray-300 rounded w-20"></div>
                            </div>

                            {/* Description */}
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>

                            {/* Software / Category */}
                            <div className="h-4 bg-gray-300 rounded w-40"></div>
                            {/* Format */}
                            <div className="h-4 bg-gray-300 rounded w-28"></div>
                            {/* Seller */}
                            <div className="h-4 bg-gray-300 rounded w-32"></div>
                        </div>

                        {/* Buttons */}
                        <div className="bottom-0 w-full mt-5 left-0 flex flex-col md:flex-row gap-3">
                            <div className="bg-gray-300 rounded-full w-full md:w-[50%] h-10"></div>
                            <div className="bg-gray-300 rounded-full w-full md:w-[50%] h-10"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const RelatedModelsSkeleton = () => {
        const skeletonArray = Array(6).fill(null); // Number of skeleton slides

        return (
            <div className="lg:px-8 md:px-7 px-5 w-full bg-white border-t border-gray-200 pt-7">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Related Models You May Like
                </h2>

                <Swiper
                    slidesPerView="auto"
                    spaceBetween={15}
                    pagination={{
                        el: ".custom-pagination-related",
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    className="lg:max-w-full"
                >
                    {skeletonArray.map((_, index) => (
                        <SwiperSlide
                            key={index}
                            className="!w-[250px] max-w-none animate-pulse"
                        >
                            <div className="w-full max-w-[280px] min-w-[150px] bg-white rounded-[10px] overflow-hidden border border-[#c9c9c9]">
                                {/* Image Placeholder */}
                                <div className="w-full h-48 bg-gray-300"></div>

                                <div className="p-4">
                                    {/* Title Placeholder */}
                                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>

                                    {/* Rating Placeholder */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="h-5 w-12 bg-gray-300 rounded"></div>
                                        <div className="h-4 w-8 bg-gray-300 rounded"></div>
                                    </div>

                                    {/* Price Placeholder */}
                                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="resize-pagination-0 mt-4 pb-15 text-center">
                    <div className="custom-pagination-related"></div>
                </div>
            </div>
        );
    };

    // useEffect(() => {
    //     const current = models.find((item) => item.id.toString() === id);
    //     const currentModel = models.find((m) => m.id.toString() === id);
    //     if (!currentModel) return;

    //     // Get previously stored recently viewed items
    //     const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    //     // Remove current model if it already exists in the list
    //     const filtered = stored.filter((m) => m.id !== currentModel.id);

    //     // Add current model to the beginning of the list (for storage only)
    //     const updatedStorage = [currentModel, ...filtered].slice(0, 8);

    //     // Save to localStorage
    //     localStorage.setItem("recentlyViewed", JSON.stringify(updatedStorage));

    //     // Now filter again to exclude the current model for display
    //     const recentlyViewedToShow = updatedStorage.filter(
    //         (m) => m.id !== currentModel.id
    //     );
    //     setRecent(recentlyViewedToShow);

    //     // Set other states as needed
    //     setModel(currentModel);
    //     setModel(current);
    //     if (current?.image?.length > 0) {
    //         setMainImage(current.image[0]); // ✅ Set first image as default
    //     }
    // const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    // const updated = [
    //     current,
    //     ...stored.filter((m) => m.id !== current.id),
    // ].slice(0, 5);
    // setRecent(updated);
    // localStorage.setItem("recentlyViewed", JSON.stringify(updated));

    //     const storedWishlist =
    //         JSON.parse(localStorage.getItem("wishlist")) || [];
    //     setWishlist(storedWishlist);
    // }, [id]);
    // useEffect(() => {
    //     setHasMounted(true);

    //     const stored = localStorage.getItem("wishlistItems");
    //     if (stored) {
    //         setWishlistItems(JSON.parse(stored));
    //     }
    // }, []);
    // useEffect(() => {
    //     if (hasMounted) {
    //         localStorage.setItem(
    //             "wishlistItems",
    //             JSON.stringify(wishlistItems)
    //         );
    //     }
    // }, [wishlistItems]);
    // [
    //     {
    //         id: 1,
    //         name: "Rohan Patel",
    //         rating: 5,
    //         comment: "Excellent 3D model, very detailed and accurate.",
    //         date: "April 17, 2025",
    //     },
    //     {
    //         id: 2,
    //         name: "Sakshi Verma",
    //         rating: 4,
    //         comment: "Worked well in SolidWorks, good quality.",
    //         date: "April 18, 2025",
    //     },
    // ];

    // if (!model) return <div className="p-10 text-center">Loading...</div>;

    // // Filtered related products
    // const related = models
    //     .filter((m) => m.category === model.category && m.id !== model.id)
    //     .slice(0, 4);
    // const recommended = models
    //     .filter((m) => m.software === model.software && m.id !== model.id)
    //     .slice(0, 4);

    // // const [mainImage, setMainImage] = useState(models);

    // const toggleLike = (item) => {
    //     if (isLiked(item.id)) {
    //         setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
    //     } else {
    //         setWishlistItems((prev) => [...prev, item]);
    //     }
    // };

    // if (!hasMounted) return null; // 🚫 Avoid hydration error\

    return (
        <div className="bg-[#ffffff] min-h-[100vh] justify-items-center ">
            <div className="bg-white pt-14 md:pt-17 w-full pb-2 bg-gradient-to-b from-[#1e1e1e] to-white">
                <SearchBar setFilterLoading={setFilterLoading} />
            </div>
            {loading ? (
                <>
                    <ProductDetailSkeleton />
                </>
            ) : (
                <div className="w-full pt-4 md:pt-7 max-w-[1370px] min-h-[100vh] bg-white">
                    {/* Product Top */}

                    <h1 className="flex justify-center mb-5 md:hidden text-2xl font-bold mx-2">
                        {model.title}
                    </h1>
                    <div className="mb-5 px-4 md:px-4 flex md:flex-row flex-col items-center md:items-start gap-1">
                        {/* <div className="flex flex-row md:flex-col min-w-18.5 md:max-h-[350px] overflow-x-auto space-x-2 scrollable-container">
  {model.image?.slice(0, 8).map((img, index) => (
    <div key={index} className=" p-[1px] w-17 h-17 m-0 flex-shrink-0">
      <img
        src={img}
        alt={`Thumb ${index + 1}`}
        className={`w-full h-full p-1 rounded-md border-2 cursor-pointer object-cover hover:p-1.5 hover:border-blue-500 ${
          mainImage === img
            ? "border-blue-600"
            : "border-gray-300"
        }`}
        onMouseEnter={() => setMainImage(img)}
      />
    </div>
  ))}
</div> */}
                        <div className="flex flex-row md:flex-col min-w-18.5 max-w-full md:max-h-[350px] overflow-x-auto md:overflow-y-auto space-x-2 md:space-x-0 md:space-y-2 scrollable-container">
                            {imageFiles?.slice(0, 8).map((file, index) => (
                                <div
                                    key={index}
                                    className="p-[1px] w-17 h-17 flex-shrink-0"
                                >
                                    <img
                                        src={`${file.url}`}
                                        alt={`Thumb ${index + 1}`}
                                        className={`w-full h-full p-1 rounded-md border-2 cursor-pointer object-cover hover:p-1.5 hover:border-blue-500 ${
                                            mainImage === file.url
                                                ? "border-blue-600"
                                                : "border-gray-300"
                                        }`}
                                        onMouseEnter={() =>
                                            setMainImage(file.url)
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="lg:mr-8 relative w-full max-w-[400px] min-w-[300px] h-[300px] md:w-[400px] md:h-[300px] lg:ml-1 lg:w-[750px] bg-white border border-[#0000001c] rounded-sm flex items-center justify-center overflow-hidden">
                            <img
                                key={mainImage} // this will force re-render for transition
                                src={mainImage || imageFiles[0]?.url}
                                alt="Main View"
                                className="w-full h-full px-1 object-contain opacity-0 transition-opacity duration-300 ease-in-out"
                                onLoad={(e) =>
                                    (e.currentTarget.style.opacity = 1)
                                } // fades in when loaded
                            />
                            {/* <div
                                className={`select-none rounded-full absolute top-2 right-2
                      ${isLiked(model.id) ? "bg-[#ffc8e5]" : "bg-[#f2ecff]"}`}
                            >
                                <LikeButton
                                    model={model}
                                    isLiked={isLiked}
                                    toggleLike={toggleLike}
                                />
                              
                            </div> */}
                        </div>
                        <div className="w-full md:ml-4">
                            <div className="w-full space-y-4">
                                <h1 className=" hidden md:block text-2xl font-bold mb-1 ">
                                    {model.title}
                                </h1>
                                {/* <div> */}
                                <div className="flex gap-2 mt-1.5">
                                    <div className="flex max-w-[47px] items-center h-[21px] text-sm bg-green-700 text-white gap-1.5 px-1.5 rounded">
                                        <p className="flex text-xs items-center pt-[1px]">
                                            {model.rating}
                                        </p>
                                        <IoIosStar className="text-[11px] flex items-center" />
                                        {/* </div> */}
                                    </div>
                                    <p className="text-[#4a5565] text-sm">
                                        ({model.ratings} Ratings &{" "}
                                        {model.reviews} Reviews)
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mb-1 ">
                                    <p className="text-3xl font-bold ">
                                        {model.price === 0
                                            ? "Free"
                                            : `₹${model.price}`}
                                    </p>
                                    {/* <div className="text-green-600 text-md flex justify-center items-center">
                                        {model.rating}
                                    </div> */}
                                </div>
                                <p className="text-gray-600 text-sm mb-1.5 mt-2">
                                    {model.description}
                                </p>
                                <p className="text-sm mb-1 text-gray-600">
                                    {model.software} | {model.category}
                                </p>
                                <p className="text-sm mb-1 text-gray-600">
                                    Format: {model.format}
                                </p>
                                <p className="text-sm ">
                                    Seller: {model.seller?.name}
                                </p>
                            </div>
                            <div className=" bottom-0 w-full mt-5 left-0 flex gap-5 z-1">
                                <button className="bg-[#ffcb20] w-[50%] md:mr-2 lg:mr-4 rounded-full cursor-pointer md:w-full max-w-60 md:max-w-50 hover:bg-[#ffc525]  text-black px-4 py-2 ">
                                    Add to Cart
                                </button>
                                <button className="bg-[#ff8512] rounded-full cursor-pointer w-[50%] max-w-60 md:w-full md:max-w-50 hover:bg-[#ff7b00] text-black px-4 py-2 ">
                                    {model.price === 0
                                        ? "Download Now"
                                        : "Buy Now"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div>
                        {/* <div className="pb-6 bg-[#f1f3f6] ">
                            <div className="lg:px-8 px-5 bg-white custom-shadow-pdetails">
                                <CustomerReviews
                                    reviews={model.review}
                                    modelId={model.id}
                                />
                            </div>
                        </div> */}

                        {/* Related Products */}

                        <div className="bg-[#f1f3f6] pb-6">
                            <div className=" bg-green-400 custom-shadow-pdetails ">
                                {loading ? (
                                    <>
                                        <RelatedModelsSkeleton />
                                    </>
                                ) : (
                                    <RelatedProducts currentModel={model} />
                                )}
                            </div>
                        </div>

                        {/* Recommended Products */}

                        {/* <div className="bg-[#f1f3f6] pb-6">
                            <div className=" bg-green-400 custom-shadow-pdetails ">
                                <RecommendedProducts
                                    currentModelId={model.id}
                                    allModels={models}
                                />  
                            </div>
                        </div> */}
                        {/* Recently Viewed */}

                        <div className="bg-[#f1f3f6] pb-6">
                            <div className=" bg-green-400 custom-shadow-pdetails ">
                                <div className=" bg-[#f1f3f6]">
                                    <div className="lg:px-8 px-5 w-full bg-white border-t border-gray-200 pt-7">
                                        <h2 className="text-2xl font-semibold mb-4">
                                            Recently Viewed
                                        </h2>
                                        <Swiper
                                            slidesPerView="auto"
                                            spaceBetween={15}
                                            pagination={{
                                                el: ".custom-pagination-recent",
                                                clickable: true,
                                            }}
                                            modules={[Pagination]}
                                            className="lg:max-w-full"
                                        >
                                            {recent.map((product) => (
                                                <SwiperSlide
                                                    key={product.id}
                                                    className="!w-[250px] max-w-none"
                                                >
                                                    <div className=" w-full max-w-[280px] min-w-[150px] bg-white rounded-[10px] overflow-hidden   overflow-y-hidden  border  border-[#c9c9c9]">
                                                        <img
                                                            src={
                                                                product.image[0]
                                                            }
                                                            alt={product.title}
                                                            className="w-full h-48 object-cover user-select-none"
                                                        />
                                                        {/* <div
                                                            className={`scale-90 select-none rounded-full absolute top-2 right-2 bg-[#d61515] 
                      ${isLiked(product.id) ? "bg-[#ffc8e5]" : "bg-[#f2ecff]"}`}
                                                        >
                                                            <LikeButton
                                                                model={product}
                                                                isLiked={
                                                                    isLiked
                                                                }
                                                                toggleLike={
                                                                    toggleLike
                                                                }
                                                            />
                                                        </div> */}
                                                        <div className="p-4">
                                                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                                <Link
                                                                    href={`/models/${product.id}`}
                                                                    className="inline-block hover:text-[#ec843f]"
                                                                >
                                                                    {
                                                                        product.title
                                                                    }
                                                                </Link>
                                                            </h3>
                                                            <div className="flex items-center text-yellow-500 text-sm mt-1">
                                                                <div className="flex gap-2 mt-1.5">
                                                                    <div className="flex max-w-[47px] items-center h-[21px] text-sm bg-green-700 text-white gap-1.5 px-1.5 rounded">
                                                                        <p className="flex text-xs items-center pt-[1px]">
                                                                            {
                                                                                product.rating
                                                                            }
                                                                        </p>
                                                                        <IoIosStar className="text-[11px] flex items-center" />
                                                                        {/* </div> */}
                                                                    </div>
                                                                    <p className="text-[#4a5565] text-sm">
                                                                        (
                                                                        {
                                                                            product.ratings
                                                                        }
                                                                        )
                                                                    </p>
                                                                </div>
                                                                {/* {Array(5)
                                                                    .fill(0)
                                                                    .map(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => (
                                                                            <IoIosStar
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className={
                                                                                    i <
                                                                                    product.rating
                                                                                        ? "text-yellow-500"
                                                                                        : "text-gray-300"
                                                                                }
                                                                            />
                                                                        )
                                                                    )} */}
                                                            </div>
                                                            <p className="text-black font-bold mt-2">
                                                                {product.price ===
                                                                0
                                                                    ? "Free"
                                                                    : `₹${product.price}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <div className="resize-pagination-0 mt-4 pb-13 text-center">
                                            <div className="custom-pagination-recent"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
