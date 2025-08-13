"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";
import { IoIosStar } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import LikeButton from "@/components/LikeButton";
import { models } from "@/lib/pData";

const RandomModels = ({ allModels, count = 4 }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [randomModels, setRandomModels] = useState([]);

    useEffect(() => {
        const shuffled = [...models].sort(() => 0.5 - Math.random());
        setRandomModels(shuffled.slice(0, count));
    }, [allModels, count]);

    const isLiked = (id) => wishlistItems.some((item) => item.id === id);

    const toggleLike = (item) => {
        if (isLiked(item.id)) {
            setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
        } else {
            setWishlistItems((prev) => [...prev, item]);
        }
    };

    return (
        <div className="bg-[#f1f3f6]">
            <div className="lg:px-8 px-5 w-full bg-white border-t border-gray-200 pt-7">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 ml-2">
                    You Might Like
                </h2>

                <Swiper
                    slidesPerView="auto"
                    spaceBetween={15}
                    pagination={{
                        el: ".custom-pagination-recom",
                        clickable: true,
                    }}
                    modules={[Pagination]}
                    className="lg:max-w-full"
                >
                    {randomModels.map((model) => (
                        <SwiperSlide
                            key={model.id}
                            className="!w-[240px] max-w-none"
                        >
                            <div className="w-full max-w-[280px] min-w-[150px] bg-white rounded-[10px] overflow-hidden border border-[#c9c9c9] relative">
                                <img
                                    src={model.image[0]}
                                    alt={model.title}
                                    className="w-full h-48 object-cover user-select-none"
                                />
                                <div
                                    className={`scale-80 select-none rounded-full absolute top-2 right-2 
                                    ${isLiked(model.id) ? "bg-[#ffc8e5]" : "bg-[#f2ecff]"}`}
                                >
                                    <LikeButton
                                        model={model}
                                        isLiked={isLiked}
                                        toggleLike={toggleLike}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        <Link
                                            href={`/models/${model.id}`}
                                            className="inline-block hover:text-[#ec843f]"
                                        >
                                            {model.title}
                                        </Link>
                                    </h3>
                                    <div className="flex gap-2 mt-1.5">
                                        <div className="flex max-w-[47px] items-center h-[21px] text-sm bg-green-700 text-white gap-1.5 px-1.5 rounded">
                                            <p className="flex text-xs items-center pt-[1px]">
                                                {model.rating}
                                            </p>
                                            <IoIosStar className="text-[11px] flex items-center" />
                                        </div>
                                        <p className="text-[#4a5565] text-sm">
                                            ({model.ratings})
                                        </p>
                                    </div>
                                    <p className="text-black font-bold mt-2">
                                        {model.price === 0
                                            ? "Free"
                                            : `₹${model.price}`}
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

export default RandomModels;
