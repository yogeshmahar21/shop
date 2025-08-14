// /app/models/page.js
// if i am using mongo db then use following useeffect instead of above for fetching data
// useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Simulate fetch or apply real fetch here
//         const response = await fetch('/api/models'); // or local filter logic
//         const data = await response.json();

//         setFilteredModels(data);
//       } catch (error) {
//         console.error("Failed to fetch models:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//  const [models, setModels] = useState([]);
"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Filter from "@/components/Filter";
import { Heart } from "lucide-react";
import { IoIosStar } from "react-icons/io";
import qs from "qs";
import { BsFillShieldLockFill } from "react-icons/bs";
import { applyFilters } from "@/lib/filterUtils";
import { models } from "@/lib/pData";
import { useRouter, useSearchParams } from "next/navigation";
import { HiMiniXMark } from "react-icons/hi2";
import Sorting from "@/components/Sorting";
import SearchBar from "@/components/SearchBar";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import Loader from "@/components/Loader"; // if you created it
import Loaders from "@/components/Loader"; // if you created it
import LikeButton from "@/components/LikeButton";
import Dummy from "@/components/Dummy";
import BackToTopButton from "@/components/BackToTop";
import axios from "axios";
import Env from "@/config/frontendEnv";
import { IoFilterSharp } from "react-icons/io5";
const ModelsPage = () => {
    const apiUrl = Env.LOCAL_URL || Env.IP_URL; // Use your API URL from config
    const router = useRouter();
    const searchParams = useSearchParams();
    // const [loading ,setLoading] = useState(false);
    // ===== States =====
    const [models, setModels] = useState([]);
    const [search, setSearch] = useState("");
    // const [searchQuery, setSearchQuery] = useState("");
    const [sort, setSort] = useState("newest");
    const [category, setCategory] = useState("");
    const [software, setSoftware] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedFilters, setSelectedFilters] = useState({
        price: [],
        software: [],
        category: [],
        format: [],
    });
     const limit = 10; 
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [loading, setLoading] = useState(false);

    // Wishlist
    const [wishlistItems, setWishlistItems] = useState([]);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const stored = localStorage.getItem("wishlistItems");
        if (stored) setWishlistItems(JSON.parse(stored));

        const query = new URLSearchParams(searchParams.toString());
         const restoredFilters = {
        price: query.get("price")?.split(",") || [],
        software: query.get("software")?.split(",") || [],
        category: query.get("category")?.split(",") || [],
        format: query.get("format")?.split(",") || [],
    };
        setSearch(query.get("search") || "");
        setSort(query.get("sort") || "newest");
        // setCategory(query.get("category") || "");
        setMinPrice(query.get("minPrice") || "");
        setMaxPrice(query.get("maxPrice") || "");
        setPage(parseInt(query.get("page")) || 1);
        setSelectedFilters(restoredFilters);
          fetchModels(restoredFilters);
    }, []);

    // Save wishlist to localStorage
    useEffect(() => {
        if (hasMounted) {
            localStorage.setItem(
                "wishlistItems",
                JSON.stringify(wishlistItems)
            );
        }
    }, [wishlistItems, hasMounted]);


    // useEffect(() => {
        const fetchModels = async () => {
            try {
                const params = new URLSearchParams();

                selectedFilters.category.forEach((c) =>
                    params.append("category", c)
                );
                selectedFilters.software.forEach((s) =>
                    params.append("software", s)
                );
                selectedFilters.format.forEach((f) =>
                    params.append("format", f)
                );
                selectedFilters.price.forEach((p) => params.append("price", p));

                params.append("page", page);
                params.append("limit", 30);
                params.append("search", search);
                params.append("sort", sort);
                params.append("minPrice", minPrice);
                params.append("maxPrice", maxPrice);
                // params.append("Price", Price);

                axios.get(`${apiUrl}/api/models/all?${params.toString()}`, {
                    withCredentials: true,
                });

                // setLoading(true);
                setLoading(true);
                const res = await axios.get(
                    `${apiUrl}/api/models/all?${params.toString()}&sort=${sort}&page=${page}&limit=${limit}`,
                    {
                        withCredentials: true, // ✅ send cookies
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Models fetched:", selectedFilters);
                // console.log('this si res ',res)
                setModels(res.data.models);
                setPages(res.data.pages);
            } catch (error) {
                console.error("Error fetching models:", error);
            } finally {
                setLoading(false);
            }
        };
useEffect(() => {
    fetchModels();
    updateURLParams();
}, [page, search, sort, category, software, minPrice, maxPrice, selectedFilters]);

    //     fetchModels();
    //     updateURLParams(); // sync URL
    // }, [
    //     page,
    //     search,
    //     sort,
    //     category,
    //     software,
    //     minPrice,
    //     maxPrice,
    //     selectedFilters,
    // ]);

    const handleTestStart = () => {
        console.log("Test started");
        // console.log(category);
        // console.log(software)
        console.log("selected filters software ", selectedFilters.software);
        console.log("selected filters category ", selectedFilters.category);
    };

    // const isLiked = (id) => wishlistItems.some((item) => item.id === id);
    // const toggleLike = (item) => {
    //     if (isLiked(item.id)) {
    //         setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
    //     } else {
    //         setWishlistItems((prev) => [...prev, item]);
    //     }
    // };

    // ===== Handlers =====
    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
        setPage(1);
    };

    const handlePriceChange = (min, max) => {
        setSelectedFilters((prev) => ({
            ...prev,
            price: [min, max].filter(Boolean), // Remove empty inputs
        }));
        setPage(1);
    };

    const handleMultiFilterChange = (updater) => {
        setSelectedFilters((prev) =>
            typeof updater === "function" ? updater(prev) : updater
        );
        setPage(1);
    };

    const resetFilters = () => {
        setSearch("");
        setCategory("");
        setSoftware("");
        setMinPrice("");
        setMaxPrice("");
        setSelectedFilters({
            price: [],
            software: [],
            category: [],
            format: [],
        });
        setSort("newest");
        setPage(1);
    };

    const updateURLParams = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (sort !== "newest") params.set("sort", sort);
        if (category) params.set("category", category);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (page > 1) params.set("page", page);
        if (selectedFilters.price.length)
            params.set("price", selectedFilters.price.join(","));
        if (selectedFilters.software.length)
            params.set("software", selectedFilters.software.join(","));
        if (selectedFilters.category.length)
            params.set("category", selectedFilters.category.join(","));
        if (selectedFilters.format.length)
            params.set("format", selectedFilters.format.join(","));
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const isLiked = (id) => wishlistItems.some((item) => item.id === id);
    const toggleLike = (item) => {
        if (isLiked(item.id)) {
            setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
        } else {
            setWishlistItems((prev) => [...prev, item]);
        }
    };
    // side filter logic
    const handleSideFilter = () => {
        const openFilter1 = document.querySelector(
            "#custom-filter-animation-id"
        );
        const openFilter2 = document.querySelector(
            "#custom-filter-animation-id-sub"
        );
        openFilter1?.classList.toggle("custom-filter-animation");
        openFilter2?.classList.toggle("custom-filter-animation-sub");
    };

    // const updateURLParam = (key, value) => {
    //     const params = new URLSearchParams(searchParams.toString());

    //     if (value === "" || value === null || value?.length === 0) {
    //         params.delete(key); // remove if empty
    //     } else {
    //         // handle arrays for multi-select filters
    //         if (Array.isArray(value)) {
    //             params.delete(key); // clear old values
    //             value.forEach((val) =>
    //                 params.append(key, encodeURIComponent(val))
    //             );
    //         } else {
    //             params.set(key, value);
    //         }
    //     }

    //     router.push(`?${params.toString()}`, { scroll: false });
    // };

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
    const getVisiblePageNumbers = () => {
        const maxPagesToShow = 5;
        const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(pages, startPage + maxPagesToShow - 1);
        return Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
        );
    };
    if (!hasMounted) return null; // 🚫 Avoid hydration error
    // if (initialLoading || filterLoading) {
    //    return <Loaders/>
    // }
    return (
        <div className="min-h-[100vh]  pt-14 bg-[#e4eeff] ">
            {/* <Loader /> */}
            <div className="min-h-[100vh]">
                {/* {initialLoading ? ( */}
                {/* <Loader /> */}
                {/* // ) : ( */}
                <div className="">
                    {/* <Loaders/> */}
                    <BackToTopButton />

                    <div className="md:pt-4">
                        <SearchBar
                            // setFilterLoading={setFilterLoading}
                            onSearch={handleSearchChange}
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                            onClick={handleTestStart}
                        >
                            test start
                        </button>
                    </div>
                    {/* {filterLoading ? ( */}
                    {loading ? (
                        <div className=" bg-green-100 flex">
                            {" "}
                            <Loader />
                        </div>
                    ) : (
                        <div className=" bg-[#e4eeff] flex pb-3">
                            {/* filter here */}
                            {/* {showFilters && ( */}
                            <div
                                id="custom-filter-animation-id"
                                className="lg:flex hidden"
                            >
                                <div
                                    id="custom-filter-animation-id-sub"
                                    className=" "
                                >
                                    <Filter
                                        selectedFilters={selectedFilters}
                                        handleMultiFilterChange={
                                            handleMultiFilterChange
                                        }
                                        handleCategoryChange={
                                            handleCategoryChange
                                        }
                                        handlePriceChange={handlePriceChange}
                                        resetFilters={resetFilters}
                                    />
                                </div>
                            </div>
                            {/* )} */}
                            <div className="rounded shadow-md bg-white flex mt-[10px] w-full md:ml-[8px] lg:ml-0 md:mr-[8px]">
                                <div className="w-full rounded bg-white">
                                    <div className="md:flex md:flex-row-reverse items-center justify-between h-auto pb-4 pt-4 md:pt-6 pr-4 pl-7">
                                        <div className="min-w-[170px] gap-2 flex  justify-end items-center pb-2 md:pb-0">
                                            <button
                                                onClick={handleSideFilter}
                                                className="text-[#000000] lg:hidden font-normal bg-[#f7f9ff] border border-[#b9b9b9] cursor-pointer focus:outline-none  rounded-lg text-[13px] px-3 py-2 text-center inline-flex items-center  transition-all duration-300 ease-in-out"
                                            >
                                                <IoFilterSharp className="text-[18px]" />{" "}
                                                &nbsp; Filter{" "}
                                            </button>
                                            <Sorting
                                                onSortChange={handleSortChange}
                                                sort={sort}
                                                // setFilterLoading={
                                                //     setFilterLoading
                                                // }
                                            />
                                        </div>
                                        <div className="absolutes">
                                            <h1 className="text-xl font-semibold">
                                                <p className="text-[15px] text-gray-600">
                                                    {/* Showing {start} – {end} of{" "} */}
                                                    {models.length} result
                                                    {models.length !== 1
                                                        ? "s"
                                                        : ""}
                                                    {search && (
                                                        <>
                                                            {" "}
                                                            for &quot;
                                                            <strong>
                                                                {search}
                                                            </strong>
                                                            &quot;
                                                        </>
                                                    )}
                                                </p>
                                            </h1>
                                        </div>
                                    </div>
                                    <div></div>
                                    {models.length === 0 ? (
                                        <div className="text-center py-10 text-gray-600 text-lg font-medium">
                                            No results found.
                                        </div>
                                    ) : (
                                        <div>
                                            {models.map((model) => {
                                                return (
                                                    <div
                                                        key={model._id}
                                                        className="group border-t overflow-hidden h-autoa h-[2s00px] border-[#f0f0f0] pt-6 pb-7 lg:pl-8 pl-1 sm:pl-3 md:p-4  sm:pr-3 pr-1 transition w-full xl:p-[40px]"
                                                    >
                                                        <div className="cursor-pointer flex ">
                                                            {" "}
                                                            <div className="models-page-image-div flex w-[38%] sm:w-[40%] md:w-[35%] lg:w-[30%] xl:w-[25%] relative h-auto  sm:h-[200px] ml-[10px] flex-shrink-0">
                                                                <img
                                                                    src={
                                                                        model
                                                                            .previewImages[0]
                                                                            .url
                                                                    }
                                                                    alt={
                                                                        model.title
                                                                    }
                                                                    className="w-full h-auto min-w-0 sm:object-contain object-contain object-center rounded-sm"
                                                                />
                                                                <div
                                                                    className={`scale-80 select-none rounded-full absolute top-2 right-2 bg-[#d61515] 
                      ${isLiked(model.id) ? "bg-[#ffc8e5]" : "bg-[#f2ecff]"}`}
                                                                >
                                                                    <LikeButton
                                                                        model={
                                                                            model
                                                                        }
                                                                        isLiked={
                                                                            isLiked
                                                                        }
                                                                        toggleLike={
                                                                            toggleLike
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* Right Side */}
                                                            <div className="min-w-50 w-full flex flex-col justify-between sm:pl-8 pl-3">
                                                                <Link
                                                                    href={`/models/${model._id}`}
                                                                >
                                                                    <div>
                                                                        <h2 className="text-[15px] group-hover:text-[#ec843f] font-semibold text-gray-800 sm:text-lg md:text-xl lg:text-2xl ">
                                                                            {
                                                                                model.title
                                                                            }
                                                                        </h2>

                                                                        <p className="text-[13px] leading-4 text-gray-600 mt-1 single-line-truncate">
                                                                            {
                                                                                model.description
                                                                            }
                                                                        </p>

                                                                        {/* Rating and reviews */}
                                                                        <div className="flex items-start gap-2 text-yellow-500 mt-2">
                                                                            <div className="flex items-center h-[21px] text-sm bg-green-700 text-white gap-1.5 px-1.5 rounded">
                                                                                <p className="flex text-xs items-center pt-[1px]">
                                                                                    {
                                                                                        model.rating
                                                                                    }
                                                                                </p>
                                                                                <IoIosStar className="text-[11px] flex items-center" />
                                                                            </div>
                                                                            <div className="flex gap-0 ">
                                                                                <p className="text-[#4a5565] text-[13px] sm:text-sm">
                                                                                    (
                                                                                    {
                                                                                        model.ratings
                                                                                    }
                                                                                </p>
                                                                                <p className="text-[#4a5565] text-sm hidden sm:block  ">
                                                                                    &nbsp;Ratings
                                                                                    &&nbsp;
                                                                                    {
                                                                                        model.reviews
                                                                                    }
                                                                                    &nbsp;Reviews
                                                                                </p>
                                                                                <p className="text-[#4a5565] text-[13px] sm:text-sm">
                                                                                    {" "}
                                                                                    )
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Software and Category */}
                                                                        {/* <div className="flwex justify-betweewn"> */}
                                                                        <div>
                                                                            <div className="text-[12px] sm:text-sm text-gray-700 sm:mt-2.5 mt-1.5">
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        model.software
                                                                                    }
                                                                                </span>{" "}
                                                                                |{" "}
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        model.category
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-[12px] sm:text-sm text-gray-500 sm:mt-1">
                                                                                Owner:{" "}
                                                                                <span className="font-medium text-gray-700">
                                                                                    {
                                                                                        model.seller
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 sm:mt-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <p className="text-xl font-bold">
                                                                                    {model.price ===
                                                                                    0
                                                                                        ? "Free"
                                                                                        : `₹${model.price}`}
                                                                                </p>
                                                                                <div className="text-[#0000008f] flex items-center gap-0.5 text-xs">
                                                                                    <BsFillShieldLockFill className="text-[#259f3f] text-lg" />
                                                                                    <p>
                                                                                        Secure
                                                                                        Payment
                                                                                    </p>
                                                                                </div>
                                                                                {/* </div> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                {/* Price + Secure Payment */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {/* fgdfg */}
                                    <div className="flex justify-center items-center mb-5 gap-2 mt-6 flex-wrap">
                                        {models.length > 24 && page > 1 && (
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/models?${updateQueryParam(
                                                            "page",
                                                            page - 1
                                                        )}`
                                                    )
                                                }
                                                className={`flex items-center justify-center h-[35px] w-[35px] rounded-full ${
                                                    page === 1
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                                }`}
                                                disabled={page === 1}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                        )}
                                        {/* Page Numbers */}
                                        {models.length > 24 &&
                                            getVisiblePageNumbers().map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() =>
                                                        router.push(
                                                            `/models?${updateQueryParam(
                                                                "page",
                                                                p
                                                            )}`
                                                        )
                                                    }
                                                    className={`px-4 py-2 flex items-center cursor-pointer justify-center h-[42px] w-[42px] rounded-lg font-medium  ${
                                                        p === page
                                                            ? "bg-[#4022ea] text-white"
                                                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}

                                        {/* Next Button */}
                                        {models.length > 24 &&
                                            end < models.length && (
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/models?${updateQueryParam(
                                                                "page",
                                                                page + 1
                                                            )}`
                                                        )
                                                    }
                                                    className={`flex items-center justify-center h-[35px] w-[35px] rounded-full ${
                                                        page === totalPages
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                                    }`}
                                                    disabled={
                                                        page === totalPages
                                                    }
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* // )} */}
            </div>
        </div>
    );
};

export default ModelsPage;

{
    /* <h1 className="text-3xl font-bold mb-4">All CAD Models</h1>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <input
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded border"
      />

      <select
          onChange={(e) => setSoftwareFilter(e.target.value)}
          className="p-2 rounded border"
      >
          <option value="">All Softwares</option>
          <option value="solidworks">SolidWorks</option>
          <option value="autocad">AutoCAD</option>
          <option value="blender">Blender</option>
      </select>

      <select
          onChange={(e) => setPriceFilter(e.target.value)}
          className="p-2 rounded border"
      >
          <option value="">All Prices</option>
          <option value="Free">Free</option>
          <option value="Paid">Paid</option>
      </select>

      <select
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded border"
      >
          <option value="newest">Newest</option>
          <option value="a-z">A - Z</option>
          <option value="z-a">Z - A</option>
      </select>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredModels.length > 0 ? (
          filteredModels.map((model) => (
              <div
                  key={model.id}
                  className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
              >
                  <img
                      src={model.image}
                      alt={model.title}
                      className="w-full h-48 object-cover mb-3 rounded-md"
                  />
                  <h2 className="text-xl font-semibold mb-1">
                      <Link
                          href={`/models/${model.software}/${model.category}/${model.id}`}
                      >
                          {model.title}
                      </Link>
                  </h2>
                  <p className="text-sm text-gray-600 capitalize">
                      {model.software} &bull; {model.category}
                  </p>
                  <p className="text-green-600 font-semibold mt-2">
                      ₹{model.price === 0 ? 'Free' : model.price}
                  </p>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                      Add to Cart
                  </button>
              </div>
          ))
      ) : (
          <div className="col-span-full text-center text-gray-500">No models found.</div>
      )}
  </div> */
}
