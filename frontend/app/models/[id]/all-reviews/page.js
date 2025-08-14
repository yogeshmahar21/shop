"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { models } from "@/lib/pData";
import CustomerReviewCard from "@/components/CustomerReviewCard";
import { ChevronDown } from "lucide-react";
import RelatedProducts from "@/components/RelatedProducts";
import { IoIosStar } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";

const ReviewsPage = () => {
  const params = useParams() || {};
  const id = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Guard against undefined params (SSR safety)
  

  const currentModel = useMemo(
    () => models.find((m) => m.id.toString() === id),
    [id]
  );
  const allReviews = currentModel?.review || [];

  const reviewsPerPage = 8;

  // Filters and controls
  const [recent, setRecent] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [tagsFilter, setTagsFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown states
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [isDateRangeDropdownOpen, setIsDateRangeDropdownOpen] = useState(false);
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);

  const dropdownRefs = {
    one: useRef(null),
    two: useRef(null),
    three: useRef(null),
  };

  // Save recently viewed (SSR-safe)
  useEffect(() => {
    if (!currentModel || typeof window === "undefined") return;

    const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const filtered = stored.filter((m) => m.id !== currentModel.id);
    const updatedStorage = [currentModel, ...filtered].slice(0, 8);

    localStorage.setItem("recentlyViewed", JSON.stringify(updatedStorage));

    const recentlyViewedToShow = updatedStorage.filter(
      (m) => m.id !== currentModel.id
    );
    setRecent(recentlyViewedToShow);
  }, [id, currentModel]);

  // Initialize from URL params
  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearch(initialSearch);
    setSearchInput(initialSearch);
    setRatingFilter(searchParams.get("rating") || "");
    setSortBy(searchParams.get("sort") || "");
    setDateRange(searchParams.get("range") || "");
    setVerifiedOnly(searchParams.get("verified") === "true");
    setTagsFilter(searchParams.get("tags") || "");
    setCurrentPage(parseInt(searchParams.get("page")) || 1);
  }, [searchParams]);

  // Update URL when filters change
  const updateURLParams = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);

    if (key !== "page") {
      params.set("page", 1);
      setCurrentPage(1);
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Memoized filtered and sorted reviews
  const filteredReviews = useMemo(() => {
    let filtered = [...allReviews];

    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.comment.toLowerCase().includes(term)
      );
    }

    if (ratingFilter) {
      filtered = filtered.filter((r) => r.rating === parseInt(ratingFilter));
    }

    if (dateRange) {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - parseInt(dateRange));
      filtered = filtered.filter((r) => new Date(r.date) >= limitDate);
    }

    if (verifiedOnly) {
      filtered = filtered.filter((r) => r.verified);
    }

    if (tagsFilter) {
      const tag = tagsFilter.toLowerCase();
      filtered = filtered.filter((r) =>
        r.comment.toLowerCase().includes(tag)
      );
    }

    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [
    allReviews,
    search,
    ratingFilter,
    sortBy,
    dateRange,
    verifiedOnly,
    tagsFilter,
  ]);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfLastReview - reviewsPerPage,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  // Event Handlers
  const handleSearch = () => {
    setSearch(searchInput);
    setCurrentPage(1);
    updateURLParams("search", searchInput);
  };

  const handleFilterChange = (setter, key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setter(value);
    setCurrentPage(1);
    updateURLParams(key, value === true ? "true" : value || "");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURLParams("page", page);
  };

  const toggleDropdown = (dropdown) => {
    if (dropdown === "rating") {
      setIsRatingDropdownOpen((prev) => !prev);
      setIsDateRangeDropdownOpen(false);
      setIsSortByDropdownOpen(false);
    } else if (dropdown === "dateRange") {
      setIsDateRangeDropdownOpen((prev) => !prev);
      setIsRatingDropdownOpen(false);
      setIsSortByDropdownOpen(false);
    } else if (dropdown === "sortBy") {
      setIsSortByDropdownOpen((prev) => !prev);
      setIsRatingDropdownOpen(false);
      setIsDateRangeDropdownOpen(false);
    }
  };

  const closeDropdown = (dropdown) => {
    if (dropdown === "rating") setIsRatingDropdownOpen(false);
    if (dropdown === "dateRange") setIsDateRangeDropdownOpen(false);
    if (dropdown === "sortBy") setIsSortByDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRefs.one.current?.contains(event.target) ||
      dropdownRefs.two.current?.contains(event.target) ||
      dropdownRefs.three.current?.contains(event.target)
    ) {
      return;
    }
    setIsRatingDropdownOpen(false);
    setIsDateRangeDropdownOpen(false);
    setIsSortByDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  if (!id) return null;

  const handleClearAll = () => {
    setSearch("");
    setSearchInput("");
    setRatingFilter("");
    setSortBy("");
    setDateRange("");
    setVerifiedOnly(false);
    setTagsFilter("");
    setCurrentPage(1);
    router.replace(`?page=1`, { scroll: false }); // Clear all query params
  };
  if (!currentModel) return null;
  return (
    <div className="bg-[#f1f3f6] ">
      <div className="bg-[#f1f3f6] pt-10 max-w-[1370px]">
        <div className="w-full  bg-white mb-8 custom-shadow-pdetails">
            <div className="p-4 md:p-6 w-full max-w-220 mx-auto">
                {/* starting here  */}
                <div className=" flex flex-col-reverse sm:flex sm:flex-row items-center sm:gap-10 gap-5 mt-10 mx-2">
                <div className="bg-white min-w-70 shadow-lg flex rounded-xl p-6 w-max border border-gray-200">
                    <div className="flex flex-col items-center  gap-1">
                        {/* Left: Average Rating */}
                        <div className="min-w-25 flex flex-col items-center w-full">
                        <h1 className="font-bold text-2xl">Customer Review</h1>
                            <div className="  flex items-center justify-center">
                                <span className="text-lg font-bold text-[#00a63e]">
                                    {(
                                        allReviews.reduce(
                                            (sum, r) => sum + r.rating,
                                            0
                                        ) / allReviews.length || 0
                                    ).toFixed(1)} out of 5
                                </span>
                            </div>
                            <div className="flex mt-0.5">
                                {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                        <IoIosStar
                                            key={i}
                                            className={`text-xl ${
                                                i <
                                                Math.round(
                                                    allReviews.reduce(
                                                        (sum, r) =>
                                                            sum + r.rating,
                                                        0
                                                    ) / allReviews.length
                                                )
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {allReviews.length} total reviews
                            </p>
                        </div>

                        {/* Right: Rating Distribution */}
                        <div className="flex-1 grid grid-cols-1 gap-3 w-full">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = allReviews.filter(
                                    (r) => r.rating === star
                                ).length;
                                const percent = (
                                    (count / allReviews.length) * 100 || 0
                                ).toFixed(0);
                                return (
                                    <div
                                        key={star}
                                        className="flex items-center gap-2 "
                                    >
                                        <span className="text-sm font-medium min-w-6">
                                            {star}★
                                        </span>
                                        <div className="flex-1 bg-gray-100 min-w-40 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-yellow-400 h-full rounded-full"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <span className="text-sm w-7 text-right text-gray-600">
                                            {percent}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                       
                    </div>

                    {/* CTA Button */}

                    <div>
                </div>
                        </div>
                            <div>
                                <Link href={`/models/${model.id}`} className="">
                                <h2 className="text-[32px] leading-tight hover:underline">{model.title}</h2>
                                </Link>
                                <p className="flex">by&nbsp;
                                    <span className="text-blue-700 hover:underline hover:text-blue-500 cursor-pointer">
                                    {model.owner}
                                    </span>
                                    </p>

                                {/* <p className="pt-3 max-w-50 min-w-50 hidden"><img className=" w-auto h-auto" src={model.image[0]} alt={model.id} /> </p> */}
                    <div className="mt-2 hidden sm:flex">
                        <button
                            onClick={() => {
                                document
                                    .getElementById("write-review-section")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="bg-[#8470f9] hover:bg-[#8172d4] cursor-pointer text-white font-medium px-5 py-2 rounded-lg transition"
                        >
                             Write a Model Review
                        </button>
                    </div>
                            </div>
                            </div>
                    <div className="mt-5 flex sm:hidden justify-center">
                        <button
                            onClick={() => {
                                document
                                    .getElementById("write-review-section")
                                    ?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="bg-[#8470f9] hover:bg-[#8172d4] cursor-pointer text-white font-medium px-5 py-2 rounded-lg transition"
                        >
                             Write a Model Review
                        </button>
                    </div>

                {/* Filters */}
                <div className="sm:pt-12 pt-9 flex flex-col gap-4 mb-3 flex-wrap">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            className="w-full sm:w-100 border rounded px-3 py-2"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 hover:bg-[#796cc7] bg-[#816df0] text-white rounded cursor-pointer"
                        >
                            Search
                        </button>
                    </div>

                    <div className="md:gap-4 max-h-10 gap-2 flex">
                        {/* Custom Rating Filter Dropdown */}
                        <div
                            className="relative inline-block text-left w-full sm:w-40"
                            ref={dropdownRefs.one}
                        >
                            <button
                                onClick={() => toggleDropdown("rating")}
                                className="w-full flex justify-between cursor-pointer border rounded px-3 py-2 text-left"
                            >
                                {ratingFilter
                                    ? `${ratingFilter} Stars`
                                    : "Ratings"}
                                <ChevronDown className="absolute right-1 md:relative md:justify-between md:flex" />
                            </button>
                            {isRatingDropdownOpen && (
                                <div
                                    className={`absolute w-full min-w-25 bg-white border border-[#cecece] mt-1 rounded-lg shadow-lg z-1`}
                                >
                                    <ul className="py-2 text-sm">
                                        <li>
                                            <button
                                                onClick={() => {
                                                    setRatingFilter("");
                                                    closeDropdown("rating");
                                                    updateURLParams(
                                                        "rating",
                                                        ""
                                                    );
                                                }}
                                                className="cursor-pointer block px-3 py-1.5 w-full text-left hover:bg-gray-100"
                                            >
                                                All Ratings
                                            </button>
                                        </li>
                                        {[5, 4, 3, 2, 1].map((star) => (
                                            <li key={star}>
                                                <button
                                                    onClick={() => {
                                                        setRatingFilter(star);
                                                        closeDropdown("rating");
                                                        updateURLParams(
                                                            "rating",
                                                            star
                                                        );
                                                    }}
                                                    className="cursor-pointer block px-3 py-1.5 w-full text-left hover:bg-gray-100"
                                                >
                                                    {star} Stars
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Custom Date Range Dropdown */}
                        <div
                            className="relative inline-block text-left w-full sm:w-40"
                            ref={dropdownRefs.two}
                        >
                            <button
                                onClick={() => toggleDropdown("dateRange")}
                                className="w-full flex justify-between cursor-pointer border rounded px-3 py-2 text-left"
                            >
                                {dateRange
                                    ? `Last ${dateRange} Days`
                                    : "All Time"}
                                <ChevronDown className=" absolute right-1 md:relative md:justify-between md:flex" />
                            </button>
                            {isDateRangeDropdownOpen && (
                                <div
                                    className={`absolute w-full min-w-27 bg-white border border-[#cecece] mt-1 rounded-lg shadow-lg z-1`}
                                >
                                    <ul className="py-2 text-sm">
                                        <li>
                                            <button
                                                onClick={() => {
                                                    setDateRange("");
                                                    closeDropdown("dateRange");
                                                    updateURLParams(
                                                        "range",
                                                        ""
                                                    );
                                                }}
                                                className="block cursor-pointer px-3 py-1.5 w-full text-left hover:bg-gray-100"
                                            >
                                                All Time
                                            </button>
                                        </li>
                                        {["7", "30"].map((range) => (
                                            <li key={range}>
                                                <button
                                                    onClick={() => {
                                                        setDateRange(range);
                                                        closeDropdown(
                                                            "dateRange"
                                                        );
                                                        updateURLParams(
                                                            "range",
                                                            range
                                                        );
                                                    }}
                                                    className="block cursor-pointer px-3 py-1.5 w-full text-left hover:bg-gray-100"
                                                >
                                                    Last {range} Days
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Custom Sort By Dropdown */}
                        <div
                            className="relative inline-block text-left w-full sm:w-40"
                            ref={dropdownRefs.three}
                        >
                            <button
                                onClick={() => toggleDropdown("sortBy")}
                                className="w-full flex justify-between  cursor-pointer border rounded px-3 py-2 text-left"
                            >
                                {sortBy
                                    ? sortBy === "recent"
                                        ? "Most Recent"
                                        : "Highest Rating"
                                    : "Sort By"}
                                <ChevronDown className="absolute right-1 md:relative md:justify-between md:flex" />
                            </button>
                            {isSortByDropdownOpen && (
                                <div
                                    className={`absolute w-full bg-white border border-[#cecece] mt-1 rounded-lg shadow-lg z-1`}
                                >
                                    <ul className="py-2 text-sm">
                                        <li>
                                            <button
                                                onClick={() => {
                                                    setSortBy("");
                                                    closeDropdown("sortBy");
                                                    updateURLParams("sort", "");
                                                }}
                                                className="block cursor-pointer px-3 py-1.5 w-full text-left hover:bg-gray-100"
                                            >
                                                Default
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => {
                                                    setSortBy("recent");
                                                    closeDropdown("sortBy");
                                                    updateURLParams(
                                                        "sort",
                                                        "recent"
                                                    );
                                                }}
                                                className="block px-3 cursor-pointer py-1.5 w-full text-left hover:bg-gray-100"
                                            >
                                                Most Recent
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={() => {
                                                    setSortBy("rating");
                                                    closeDropdown("sortBy");
                                                    updateURLParams(
                                                        "sort",
                                                        "rating"
                                                    );
                                                }}
                                                className="block px-3 py-1.5 w-full cursor-pointer text-left hover:bg-gray-100"
                                            >
                                                Highest Rating
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <button
                        onClick={handleClearAll}
                        className="w-fit rounded ml-1 text-blue-800 hover:text-blue-500 hover:underline cursor-pointer"
                    >
                        Clear filter
                    </button>
                </div>

                {/* Reviews */}
                {currentReviews.length > 0 ? (
                    <div className="space-y-4">
                        {currentReviews.map((review, index) => (
                            <CustomerReviewCard key={index} review={review} />
                        ))}
                    </div>
                ) : (
                    <div>No reviews found</div>
                )}

                {/* Pagination */}
                {/* Pagination */}
                <div className="flex justify-center items-center space-x-2 mt-6">
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
            <div className="bg-[#f1f3f6] pb-6">
                <div className=" bg-green-400 custom-shadow-pdetails ">
                    <RelatedProducts currentModel={model} />
                </div>
            </div>
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
                                className="lg:max-w-full "
                            >
                                {recent.map((product) => (
                                    <SwiperSlide
                                        key={product.id}
                                        className="!w-[250px] max-w-none"
                                    >
                                        <div className=" w-full max-w-[280px] min-w-[150px] bg-white rounded-[10px] overflow-hidden   overflow-y-hidden  border  border-[#c9c9c9]">
                                            <img
                                                src={product.image[0]}
                                                alt={product.title}
                                                className="w-full h-48 object-cover user-select-none"
                                            />
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
                                                                    i <
                                                                    product.rating
                                                                        ? "text-yellow-500"
                                                                        : "text-gray-300"
                                                                }
                                                            />
                                                        ))} */}
                                                </div>
                                                <p className="text-black font-bold mt-2">
                                                    ₹{product.price}
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
    );
};

export default ReviewsPage;
