"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { Heart, HeartIcon, Search, ShoppingBag } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { useRouter, useSearchParams } from "next/navigation";
// import Swiper and modules styles
import Link from "next/link";
import { GoShieldLock } from "react-icons/go";
import { FaGlobeAsia } from "react-icons/fa";
import { BsGlobe, BsGraphUpArrow } from "react-icons/bs";
import {
    RiUpload2Line,
    RiGlobalLine,
    RiMoneyDollarCircleLine,
} from "react-icons/ri";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import Feedback from "@/components/Feedback";
import { models } from "@/lib/pData";
import LikeButton from "@/components/LikeButton";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import 'aos/dist/aos.css';
// import AOS from 'aos';
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// const [searchQuery, setSearchQuery] = useState("");
// const router = useRouter();

// const handleSearch = (e) => {
//   e.preventDefault();
//   if (searchQuery.trim() !== "") {
//     router.push(`/products?search=${searchQuery}`);
//   }
// };

import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Default style
import '../styles/nprogress.css'; // Your custom style
NProgress.configure({ showSpinner: false, speed: 400 });

// Router.events.on('routeChangeStart', () => NProgress.start());
// Router.events.on('routeChangeComplete', () => NProgress.done());
// Router.events.on('routeChangeError', () => NProgress.done());
const cardData = [
    {
        id: 1,
        owner: "jony",
        name: "3D Model Model Model Model Model A",
        price: "$50",
        image: "./cubes.avif",
        description: "As high-qualy 3D model of a car.",
        software: "Catia",
    },
    {
        id: 2,
        owner: "Yogesh mahar rajpoot",
        name: "3D Model B",
        price: "$70",
        image: "./cubes.avif",
        description:
            " A premium aircraft model for your project A premium aircraft model for your project.",
        software: "Catia",
    },
    {
        id: 3,
        owner: "mony",
        name: "3D Model C",
        price: "$30",
        image: "./cubes.avif",
        description: "A realistic house model for architecture.",
        software: "Catia",
    },
    {
        id: 4,
        owner: "jonnnyy",
        name: "3D Model C",
        price: "$30",
        image: "./cubes.avif",
        description: "A realistic house model for architecture.",
        software: "Catia",
    },
    {
        id: 5,
        owner: "jonnnyy",
        name: "3D Model C",
        price: "$30",
        image: "./cubes.avif",
        description: "A realistic house model for architecture.",
        software: "Catia",
    },
];
const softwareLogos = [
    { name: "AutoCAD", src: "./auto.png" },
    { name: "Blender", src: "./blende.png" },
    { name: "CATIA", src: "./catia.png" },
    { name: "Fusion 360", src: "./fusion.png" },
    { name: "SolidWorks", src: "./soli.png" },
];
const exploreImage = [
    { src: "./fusion.png" },
    { src: "./sec.png" },
    { src: "./sec.png" },
    { src: "./sec.png" },
];

const Page = () => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -200 : 200,
                behavior: "smooth",
            });
        }
    };
    const [wishlistItems, setWishlistItems] = useState([]);
    const isLiked = (id) => wishlistItems.some((item) => item.id === id);
    const [filterLoading, setFilterLoading] = useState(false);
    const suggestions = [
        "Free 3D Designs",
        "Assembly",
        "Parts",
        "AutoCAD",
        "Solid Models",
    ];

    // const handleSearch = () => {
    //   console.log("Searching for:", searchInput);
    // Your search logic goes here
    // };
    const router = useRouter();
    const handleButtonClick = (value) => {
        setFilterLoading(value);
        router.push(`/models?search=${encodeURIComponent(value)}`);
    };
    const toggleLike = (item) => {
        if (isLiked(item.id)) {
            setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
        } else {
            setWishlistItems((prev) => [...prev, item]);
        }
    };

    return (
        <>
            <div className=" justify-items-center min-hzz-[100vh]">
                <div className="w-full max-w-[1370px] min-h-[100vh]">
                    {/* <img src="/hexa.avif" alt="" /> */}
                    <div className="homepage-container-main">
                        <img
                            //   data-aos="fade"
                            // data-aos-duration="1200"
                            className="size-full"
                            src="/cubes.avif"
                            alt="backgound image"
                        />

                        <div className="content-background-image">
                            <div className="contentbackh1">
                                <h1
                                    className="text-[#ffffff]"
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                    data-aos-duration="1000"
                                >
                                    Premium 3D Models, CAD Designs
                                </h1>
                            </div>
                            <div
                                data-aos="fade-up"
                                data-aos-delay="400"
                                data-aos-duration="1000"
                                className="searchbar-container"
                            >
                                {/* //   value={searchInput}
                            //   onChange={setSearchInput}
                            //   onSearch={handleSearch} */}
                                <SearchBar
                                    setFilterLoading={setFilterLoading}
                                />
                            </div>

                            <div
                                data-aos="fade-up"
                                data-aos-delay="600"
                                data-aos-duration="1000"
                                className="quick-search-links"
                            >
                                {suggestions.map((value, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleButtonClick(value)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <section className="flat-info-section py-16 px-4 md:px-20">
                        <div className="flat-info-container max-w-6xl mx-auto text-center">
                            <h2
                                data-aos="fade-up"
                                className="flat-info-heading text-3xl md:text-4xl font-semibold text-gray-800 mb-4"
                            >
                                3D Model Marketplace
                            </h2>
                            <p
                                data-aos="fade-up"
                                data-aos-delay="100"
                                className="flat-info-description text-gray-600 mb-12 max-w-2xl mx-auto"
                            >
                                Built for CAD creators and engineers who value
                                visibility, growth, and seamless collaboration.
                            </p>

                            <div className="item-centre-class flat-info-flex-wrapper flex flex-col md:flex-row justify-between items-start gap-10 text-center">
                                {/* Secure Platform */}
                                <div
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                    className="flat-info-item flex-1"
                                >
                                    <GoShieldLock className="flat-info-icon text-5xl text-emerald-500 mx-auto mb-4" />
                                    <h3 className="flat-info-title text-xl font-semibold text-gray-800 mb-2">
                                        Secure Platform
                                    </h3>
                                    <p className="flat-info-text text-gray-600 max-w-xs mx-auto">
                                        We ensure your intellectual property is
                                        stored and shared with maximum
                                        protection.
                                    </p>
                                </div>

                                {/* Global Reach */}
                                <div
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                    className="flat-info-item flex-1"
                                >
                                    <BsGlobe className="flat-info-icon text-5xl text-zinc-700 mx-auto mb-4" />
                                    <h3 className="flat-info-title text-xl font-semibold text-gray-800 mb-2">
                                        Global Reach
                                    </h3>
                                    <p className="flat-info-text text-gray-600 max-w-xs mx-auto">
                                        Connect with engineers, designers, and
                                        industry leaders across the globe.
                                    </p>
                                </div>

                                {/* Creator Growth */}
                                <div
                                    data-aos="fade-up"
                                    data-aos-delay="400"
                                    className="flat-info-item flex-1"
                                >
                                    <BsGraphUpArrow className="flat-info-icon text-5xl text-amber-500 mx-auto mb-4" />
                                    <h3 className="flat-info-title text-xl font-semibold text-gray-800 mb-2">
                                        Creator Growth
                                    </h3>
                                    <p className="flat-info-text text-gray-600 max-w-xs mx-auto">
                                        Share your work, grow your audience, and
                                        attract potential clients or employers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="home-section-flex-container">
                        <div className="home-section-text-content">
                            <h2
                                data-aos="fade-up"
                                className="home-section-heading"
                            >
                                Explore Premium Models
                            </h2>
                            <p
                                data-aos="fade-up"
                                className="home-section-description"
                            >
                                Discover our most popular mechanical{" "}
                                <b>3D models</b> carefully crafted by top
                                designers. Whether you're looking for engines,
                                gears, assemblies, or detailed industrial parts
                                – we&apos;ve got a wide range of professional-grade
                                assets ready for your next project.
                                {/* All models are <b>high-quality</b> and optimized for production. */}
                            </p>
                            <div className="explore-all-model">
                                <button
                                    data-aos="zoom-in"
                                    data-aos-delay="150"
                                    className="home-section-cta-button"
                                >
                                    <Link href="/models">View All Models</Link>
                                </button>
                            </div>
                        </div>
                        <div className="home-section-image-grid">
                            {exploreImage.map((image, index) => (
                                <img
                                    key={index}
                                    data-aos="zoom-in-up"
                                    data-aos-delay={(index + 1) * 100}
                                    src={image.src}
                                    //  src="./fusion.png"
                                    alt="Model 1"
                                    className="home-section-image"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="homepage-section-two">
                        <h1 data-aos="fade-up">Top Picks</h1>
                        {/* <div className="section-two-images">
                            <img src="./section2.png" alt="image" />
                            <img src="./betel.jpg" alt="image" />
                            <img src="./gear.jpeg" alt="image" />
                        </div> */}

                        <div className="section-two-products">
                            {/* <div className="slider-navi-btns">
                            <button className="custom-prev">❮</button>
                            <button className="custom-next">❯</button>
                        </div> */}

                            <Swiper
                                //   spaceBetween={50}
                                //         breakpoints={{
                                //             0: { slidesPerView: 1.5 },
                                // 450: { slidesPerView: 1.5 },
                                // 510: { slidesPerView: 1.7 },
                                // 640: { slidesPerView: 2 },
                                // 700: { slidesPerView: 2.2 },
                                // 768: { slidesPerView: 3 },
                                // 1024: { slidesPerView: 4 },
                                //         }}
                                slidesPerView="auto"
                                spaceBetween={7}
                                // navigation={{
                                //     nextEl: ".custom-next",
                                //     prevEl: ".custom-prev",
                                // }}
                                pagination={{
                                    el: ".custom-pagination-0",
                                    clickable: true,
                                }}
                                modules={[Navigation, Pagination]}
                                className="mySwiper"
                            >
                                {" "}
                                {models.slice(0, 8).map((item, index) => (
                                    <SwiperSlide
                                        className="!w-[220px] md:!w-[280px] max-w-none "
                                        key={item.id}
                                    >
                                        <div className="product-card ">
                                            <div
                                                className={`scale-90 select-none rounded-full absolute ml-2 mt-2 bg-[#sd61515] 
                                                            ${
                                                                isLiked(item.id)
                                                                    ? "bg-[#ffc8e5]"
                                                                    : "bg-[#5c5f64b1]"
                                                            }`}
                                            >
                                                <LikeButton
                                                    model={item}
                                                    isLiked={isLiked}
                                                    toggleLike={toggleLike}
                                                />
                                            </div>
                                            <img
                                                src={item.image[0]}
                                                alt="Product"
                                                className="product-image"
                                            />
                                            <div className="product-info">
                                                <Link
                                                    href={`/models/${item.id}`}
                                                >
                                                    <h3 className="product-title cursor-pointer hover:text-[#ec843f]">
                                                        {item.title}
                                                    </h3>
                                                </Link>
                                                <p className="product-description">
                                                    <span>{item.software}</span>
                                                </p>
                                                <p className="product-description">
                                                    {item.description}
                                                </p>
                                                <p className="product-seller">
                                                    Owner:{" "}
                                                    <span>{item.owner}</span>
                                                </p>
                                                <div className="product-bottom">
                                                    <p className="product-price">
                                                        {item.price === 0
                                                            ? "Free"
                                                            : `₹${item.price}`}
                                                    </p>
                                                    <div className="product-actions">
                                                        {/* <button className="wishlist-btn">
                                        <HeartIcon/>
                                        </button> */}
                                                        <button className="cart-btn">
                                                            <ShoppingBag
                                                                size={20}
                                                            />
                                                            &nbsp; Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="resize-pagination-0">
                                <div className="custom-pagination-0"></div>
                            </div>
                            <Swiper
                                //   spaceBetween={50}
                                slidesPerView="auto"
                                spaceBetween={7}
                                // navigation={{
                                //     nextEl: ".custom-next",
                                //     prevEl: ".custom-prev",
                                // }}
                                pagination={{
                                    el: ".custom-pagination-1",
                                    clickable: true,
                                }}
                                modules={[Navigation, Pagination]}
                                className="mySwiper"
                            >
                                {" "}
                                {models.slice(10, 20).map((item, index) => (
                                    <SwiperSlide
                                        className="!w-[220px] md:!w-[280px] max-w-none "
                                        key={item.id}
                                    >
                                        <div className="product-card">
                                            <div
                                                className={`scale-90 select-none rounded-full absolute ml-2 mt-2 bg-[#sd61515] 
                                                            ${
                                                                isLiked(item.id)
                                                                    ? "bg-[#ffc8e5]"
                                                                    : "bg-[#5c5f64b1]"
                                                            }`}
                                            >
                                                <LikeButton
                                                    model={item}
                                                    isLiked={isLiked}
                                                    toggleLike={toggleLike}
                                                />
                                            </div>
                                            <img
                                                src={item.image[0]}
                                                alt="Product"
                                                className="product-image"
                                            />
                                            <div className="product-info">
                                                <Link
                                                    href={`/models/${item.id}`}
                                                >
                                                    <h3 className="product-title cursor-pointer hover:text-[#ec843f]">
                                                        {item.title}
                                                    </h3>
                                                </Link>
                                                <p className="product-description">
                                                    <span>{item.software}</span>
                                                </p>
                                                <p className="product-description">
                                                    {item.description}
                                                </p>
                                                <p className="product-seller">
                                                    Owner:{" "}
                                                    <span>{item.owner}</span>
                                                </p>
                                                <div className="product-bottom">
                                                    <p className="product-price">
                                                        {item.price === 0
                                                            ? "Free"
                                                            : `₹${item.price}`}
                                                    </p>
                                                    <div className="product-actions">
                                                        {/* <button className="wishlist-btn">
                                        <HeartIcon/>
                                        </button> */}
                                                        <button className="cart-btn">
                                                            <ShoppingBag
                                                                size={20}
                                                            />
                                                            &nbsp; Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="custom-pagination-1"></div>
                        </div>
                    </div>

                    <section className="software-logos mx-4">
                        <h2
                            data-aos="fade-up"
                            className="mb-4 text-xl font-semibold text-center"
                        >
                            Industry-Leading Software
                        </h2>

                        <div
                            className="overflow-x-auto whitespace-nowrap px-4 py-4 h-35 flex  "
                            // Fixed vertical height
                        >
                            {softwareLogos.map((logo, index) => (
                                <div
                                    key={index}
                                    className="inline-block text-center mx-5 align-top w-28"
                                >
                                    <img
                                        data-aos="zoom-in"
                                        data-aos-delay="100"
                                        src={logo.src}
                                        alt={logo.name}
                                        className="h-16 w-auto mx-auto object-contain"
                                    />
                                    <p className="mt-1.5 text-sm">
                                        {logo.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="software-logo-section">
                        {/* <div className="owner-card-slider">
                        <img src="./hexa.avif" alt="profile-Picture" />
                        <div className="owner-details-card">
                            <h2>Name</h2>
                            <p>description of the owner here</p>
                            <button>view now</button>
                        </div>
                    </div> */}
                        <h1 data-aos="fade-up">Popular Sellers</h1>

                        <Swiper
                            grabCursor={true}
                            // centeredSlides={true}
                            breakpoints={{
                                0: { slidesPerView: 1 }, // On very small screens, 1 card visible
                                560: { slidesPerView: 2 }, // When width is around 500px, show 2 cards
                                850: { slidesPerView: 3 }, // Default: Show 3 cards
                                1150: { slidesPerView: 4 }, // Default: Show 3 cards
                            }}
                            // pagination={true}
                            pagination={{
                                el: ".custom-pagination-2",
                                clickable: true,
                            }}
                            modules={[Pagination]}
                            className="mySwiper"
                        >
                            {cardData.map((item) => (
                                <SwiperSlide
                                    key={item.id}
                                    // data-aos="zoom-in"
                                    // data-aos-duration="800"
                                >
                                    <div className="owner-card-slider">
                                        <img
                                            src={item.image}
                                            // src="./hexa.avif"
                                            alt="profile-Picture"
                                            className="owner-img"
                                        />
                                        <div className="owner-details-card">
                                            <h2 className="owner-name">
                                                {item.owner}
                                                {/* owner */}
                                            </h2>
                                            <p className="owner-desc">
                                                {item.description}
                                                {/* deswction of the owner of the page or the softearte  */}
                                            </p>
                                            <button className="view-btn">
                                                View Now
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="resize-pagination-2">
                            <div className="custom-pagination-2"></div>
                        </div>
                    </div>

                    <section className="join-us-glass-section-wrapper">
                        <div className="join-us-glass-section-card">
                            <h2
                                data-aos="fade-up"
                                className="join-us-glass-section-heading"
                            >
                                Monetize Your CAD Skills
                            </h2>
                            <p
                                data-aos="fade-up"
                                data-aos-delay="100"
                                className="join-us-glass-section-description"
                            >
                                Join a network of talented CAD creators, share
                                your work with the world, and get rewarded for
                                your talent and innovation.
                            </p>
                            <Link href='/become-seller'>
                            <button
                                data-aos="zoom-in"
                                data-aos-delay="200"
                                className="join-us-glass-section-animated-button"
                            >
                                Join the Revolution
                            </button>
                                </Link>
                        </div>
                    </section>
                    <section className="w-full custom-bg-color py-16 px-4 md:px-20">
                        <div className="max-w-6xl mx-auto text-center">
                            <h2
                                data-aos="fade-up"
                                className="text-3xl md:text-4xl font-semibold mb-4 text-gray-800"
                            >
                                How It Works
                            </h2>
                            <p
                                data-aos="fade-up"
                                className="text-gray-600 mb-12"
                            >
                                Start sharing your designs in just a few simple
                                steps.
                            </p>

                            <div className="item-centre-class flex flex-col md:flex-row justify-between items-start gap-10">
                                {/* Step 1 */}
                                <div
                                    data-aos="fade-up"
                                    data-aos-delay="100"
                                    className="flex-1 flex flex-col items-center text-center"
                                >
                                    <RiUpload2Line className="text-5xl text-sky-500 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Upload Your Models
                                    </h3>
                                    <p className="text-gray-600 max-w-xs">
                                        Easily upload your 3D/CAD files with
                                        proper tags and descriptions to reach
                                        the right audience.
                                    </p>
                                </div>

                                {/* Step 2 */}
                                <div
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                    className="flex-1 flex flex-col items-center text-center"
                                >
                                    <RiGlobalLine className="text-5xl text-teal-500 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Showcase to the World
                                    </h3>
                                    <p className="text-gray-600 max-w-xs">
                                        Your models get listed on a global
                                        platform viewed by engineers, students,
                                        and professionals.
                                    </p>
                                </div>

                                {/* Step 3 */}
                                <div
                                    data-aos="fade-up"
                                    data-aos-delay="300"
                                    className="flex-1 flex flex-col items-center text-center"
                                >
                                    <RiMoneyDollarCircleLine className="text-5xl text-amber-500 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Earn Revenue
                                    </h3>
                                    <p className="text-gray-600 max-w-xs">
                                        Get paid for every download, track your
                                        performance, and grow your CAD business.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="custom-bg-color-2 py-20">
                        <div className="max-w-6xl mx-auto px-8 text-center">
                            <h2
                                data-aos="fade-up"
                                className="text-3xl font-semibold text-gray-800 mb-4"
                            >
                                What Our Community Says
                            </h2>
                            <p
                                data-aos="fade-up"
                                className="text-gray-600 mb-12"
                            >
                                Real stories from real creators using our
                                platform.
                            </p>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Testimonial 1 */}
                                <div
                                    data-aos="flip-left"
                                    data-aos-delay="100"
                                    className="bg-gray-50 p-6 rounded-lg shadow-sm"
                                >
                                    <img
                                        src="/random/user.png"
                                        alt="user"
                                        className="w-16 h-16 rounded-full mx-auto mb-4"
                                    />
                                    <p className="text-gray-700 italic">
                                        &quot;This platform helped me reach a global
                                        audience for my CAD models. Super
                                        intuitive!&quot;
                                    </p>
                                    <h4 className="mt-4 font-semibold text-gray-800">
                                        Aarav Sharma
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Mechanical Engineer
                                    </p>
                                </div>

                                {/* Testimonial 2 */}
                                <div
                                    data-aos="flip-left"
                                    data-aos-delay="200"
                                    className="bg-gray-50 p-6 rounded-lg shadow-sm"
                                >
                                    <img
                                        src="/random/user.png"
                                        alt="user"
                                        className="w-16 h-16 rounded-full mx-auto mb-4"
                                    />
                                    <p className="text-gray-700 italic">
                                        &quot;I&apos;ve uploaded over 100 models and
                                        gained recognition from top design
                                        firms.&quot;
                                    </p>
                                    <h4 className="mt-4 font-semibold text-gray-800">
                                        Sneha Verma
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        CAD Creator
                                    </p>
                                </div>

                                {/* Testimonial 3 */}
                                <div
                                    data-aos="flip-left"
                                    data-aos-delay="300"
                                    className="bg-gray-50 p-6 rounded-lg shadow-sm"
                                >
                                    <img
                                        src="/random/user.png"
                                        alt="user"
                                        className="w-16 h-16 rounded-full mx-auto mb-4"
                                    />
                                    <p className="text-gray-700 italic">
                                        &quot;Selling my 3D designs was never this
                                        easy. Great experience and support.&quot;
                                    </p>
                                    <h4 className="mt-4 font-semibold text-gray-800">
                                        Rahul Mehta
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Product Designer
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* <Feedback /> */}

                    <section className="homepage-newsletter-section">
                        <div className="homepage-newsletter-wrapper">
                            <h2
                                data-aos="fade-up"
                                className="homepage-newsletter-heading"
                            >
                                Be the First to Discover New Designs
                            </h2>
                            <p
                                data-aos="fade-up"
                                className="homepage-newsletter-description"
                            >
                                Get updates on new CAD models, platform
                                features, and creator tools directly to your
                                inbox.
                            </p>
                            <form
                                data-aos="zoom-in"
                                data-aos-delay="150"
                                className="homepage-newsletter-form"
                            >
                                <input
                                    type="email"
                                    className="homepage-newsletter-input"
                                    placeholder="Enter your email address"
                                />
                                <button
                                    type="submit"
                                    className="homepage-newsletter-button"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Page;
