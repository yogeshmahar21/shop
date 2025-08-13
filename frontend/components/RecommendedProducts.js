"use client";
import { useState ,useEffect } from "react";
import React from "react";
import Link from "next/link";
import { IoIosStar } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { models } from "@/lib/pData";
import LikeButton from "@/components/LikeButton";
import { Island_Moments } from "next/font/google";
const RecommendedProducts = ({ currentModelId, allModels }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
       const [hasMounted, setHasMounted] = useState(false);
       const [recommended, setRecommended] = useState([]);
       useEffect(() => {
           setHasMounted(true);
   
           const stored = localStorage.getItem("wishlistItems");
           if (stored) {
               setWishlistItems(JSON.parse(stored));
           }
       }, []);
       useEffect(() => {
           if (hasMounted) {
               localStorage.setItem(
                   "wishlistItems",
                   JSON.stringify(wishlistItems)
               );
           }
       }, [wishlistItems]);
       useEffect(() => {
           const filtered = allModels
             .filter((m) => m.id !== currentModelId)
             .sort(() => 0.5 - Math.random())
             .slice(0, 10);
         
           setRecommended(filtered);
         }, [allModels, currentModelId]);
   
       const isLiked = (id) => wishlistItems.some((item) => item.id === id);
       const toggleLike = (item) => {
           if (isLiked(item.id)) {
               setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
            } else {
                setWishlistItems((prev) => [...prev, item]);
            }
        };
        
        if (!hasMounted) return null;
        // Filter out the current model and pick 4 random others
        
        // const recommended = allModels
        // .filter((m) => m.id !== currentModelId)
        // .sort(() => 0.5 - Math.random())
        // .slice(0, 10);
   
  return (
    <div className=" bg-[#f1f3f6]">
        <div className="lg:px-8 px-5 w-full bg-white border-t border-gray-200 pt-7">
    {/* <div className="mt-12 w-full border-t border-gray-200 pt-8"> */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Recommended for You
      </h2>
      <Swiper
               
                 slidesPerView="auto"
                 spaceBetween={15}
                pagination={{
                    el: ".custom-pagination-recom",
                    clickable: true,
                }}
                modules={[Pagination]}
                className="lg:max-w-full "
            >
        {recommended.map((product ,index) => (
                    <SwiperSlide key={product.id} className="!w-[250px] max-w-none">
                        <div
                            className=" w-full max-w-[280px] min-w-[150px] bg-white rounded-[10px] overflow-hidden   overflow-y-hidden  border  border-[#c9c9c9]"
                        >
                            <img
                                src={product.image[0]}
                                alt={product.title}
                                className="w-full h-48 object-cover user-select-none"
                            />
                             <div
                                                        className={`scale-80 select-none rounded-full absolute top-2 right-2 bg-[#d61515] 
                      ${isLiked(product.id) ? "bg-[#ffc8e5]" : "bg-[#f2ecff]"}`}
                                                    >
                                                        <LikeButton 
                                                        model={product}
                                                        isLiked={isLiked}
                                                        toggleLike={toggleLike}/>
                                                        {/* <motion.div
                                                            className="select-none  rounded-full p-2 cursor-pointer transition-colors duration-200"
                                                            onClick={() =>
                                                                toggleLike(
                                                                    model
                                                                )
                                                            }
                                                            initial={false}
                                                            animate={
                                                                isLiked(
                                                                    model.id
                                                                )
                                                                    ? {
                                                                          scale: [
                                                                              1,
                                                                              1.4,
                                                                              0.8,
                                                                              1,
                                                                          ],
                                                                      }
                                                                    : {}
                                                            }
                                                            transition={{
                                                                duration: 0.45,
                                                                ease: [
                                                                    0.04, 0.4,
                                                                    0.5, 0.95,
                                                                ],
                                                            }}
                                                        >
                                                            <Heart
                                                                className="cursor-pointer"
                                                                size={16}
                                                                fill={
                                                                    isLiked(
                                                                        model.id
                                                                    )
                                                                        ? "red"
                                                                        : "#c4c4c4"
                                                                }
                                                                color={
                                                                    isLiked(
                                                                        model.id
                                                                    )
                                                                        ? "red"
                                                                        : "#c4c4c4"
                                                                }
                                                            />
                                                        </motion.div> */}
                                                    </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                            <Link
                                    href={`/models/${product.id}`}
                                    className="inline-block hover:text-[#ec843f]"
                                >
                                    {product.title}
                                </Link>
                                </h3>
                                
                                <div className="flex items-center text-yellow-500 text-sm mt-1">
                                <div className="flex gap-2 mt-1.5">
                                    <div className="flex max-w-[47px] items-center h-[21px] text-sm bg-green-700 text-white gap-1.5 px-1.5 rounded">
                                        <p className="flex text-xs items-center pt-[1px]">
                                            {product.rating}
                                        </p>
                                        <IoIosStar className="text-[11px] flex items-center" />
                                        {/* </div> */}
                                    </div>
                                    <p className="text-[#4a5565] text-sm">
                                        ({product.ratings})
                                    </p>
                                </div>
                                    {/* {Array(5)
                                        .fill(0)
                                        .map((_, i) => (
                                            <IoIosStar
                                                key={i}
                                                className={
                                                    i < product.rating
                                                        ? "text-yellow-500"
                                                        : "text-gray-300"
                                                }
                                            />
                                        ))} */}
                                </div>
                                <p className="text-black font-bold mt-2">
                                {product.price === 0 ? 'Free' : `₹${product.price}`}
                                </p>
                                
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="resize-pagination-0 mt-4 pb-15 text-center">
                <div className="custom-pagination-recom"></div>
            </div>
      
    </div>
    </div>
  );
};

export default RecommendedProducts;
