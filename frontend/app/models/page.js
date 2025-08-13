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
import { IoFilterSharp } from "react-icons/io5";
const ModelsPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    
  const [searchQuery, setSearchQuery] = useState('');
    // const searchQuery = useMemo(() => {
    //     return searchParams.get("search")?.toLowerCase() || "";
    // }, [searchParams]);
    const [sortOption, setSortOption] = useState(null);
    const [sort, setSort] = useState(searchParams.get("sort") || "");
    const [selectedFilters, setSelectedFilters] = useState({
        price: [],
        software: [],
        category: [],
        format: [],
    });
    useEffect(() => {
        const query = searchParams.get("search") || "";
        setSearchQuery(query);
      }, [searchParams]);
    const [initialLoading, setInitialLoading] = useState(false); // for page load
    const [filterLoading, setFilterLoading] = useState(false); // for filters/search
    

    //     useEffect(() => {
    //   setLoading(true);
    //   setTimeout(() => {
    //     setFilteredModels(models); // models is your static data
    //     setLoading(false);
    //   }, 1000); // Delay to show loader
    // }, []);
    
    // Extract filters from URL on load
    useEffect(() => {
        const getParamArray = (key) => {
            const param = searchParams.getAll(key);
            // return param.length ? param : [];
            
            return param.length ? param.map(decodeURIComponent) : [];
        };
        
        setSelectedFilters({
            price: getParamArray("price"),
            software: getParamArray("software"),
            category: getParamArray("category"),
            format: getParamArray("format"),
        });
        
        setSort(searchParams.get("sort") || "");
    }, [searchParams]);

    useEffect(() => {
        setInitialLoading(true);
        setTimeout(() => {
            // setFilteredModels(models); // or fetched data
            setInitialLoading(false);
        }, 1000);
    }, []);
    
    const updateURLParams = (filters) => {
        return new Promise((resolve) => {
            const currentParams = new URLSearchParams(searchParams.toString()); // get existing URL params
            const newParams = new URLSearchParams();

            // Add filters
            Object.entries(filters).forEach(([key, values]) => {
                // values.forEach((val) => newParams.append(key, val));
                values.forEach((val) =>
                    newParams.append(key, encodeURIComponent(val))
                );
            });

            // Preserve existing search param
            const currentSearch = currentParams.get("search");
            if (currentSearch) {
                newParams.set("search", currentSearch);
            }
            // Preserve sort
            if (sort) {
                newParams.set("sort", sort);
            }
            const params = new URLSearchParams(window.location.search);
            params.set("page", 1);
            router.push(`/models?${newParams.toString()}`);
        });
    };
    const handleSortChange = (value) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }

        setSort(value);
        params.set("page", 1);
        router.push(`/models?${params.toString()}`);
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

    // const [filteredModels, setFilteredModels] = useState(models);

    // Filter models based on selected filters
    // useEffect(() => {
        const filteredModels = useMemo(() => {
        let result = [...models];
        // setFilterLoading(true);
        if (selectedFilters.price.length) {
            result = result.filter((model) => {
                return selectedFilters.price.some((range) => {
                    if (range === "Free") {
                        return model.price === 0;
                    } else if (range.includes("+")) {
                        const min = Number(
                            range.replace("₹", "").replace("+", "").trim()
                        );
                        return model.price >= min;
                    } else {
                        const [min, max] = range
                            .replace(/₹/g, "")
                            .split("-")
                            .map(Number);
                        return model.price >= min && model.price <= max;
                    }
                });
            });
        }

        if (selectedFilters.software.length) {
            result = result.filter((model) =>
                selectedFilters.software.includes(model.software)
            );
        }

        if (selectedFilters.category.length) {
            result = result.filter((model) =>
                selectedFilters.category.includes(model.category)
            );
        }

        if (selectedFilters.format.length) {
            result = result.filter((model) =>
                selectedFilters.format.includes(model.format)
            );
        }
        if (searchQuery) {
            const keywords = searchQuery.toLowerCase().split(' ').filter(Boolean);
            result = result.filter((model) => {
                const target = `
                  ${model.title}
                  ${model.description}
                  ${model.software}
                  ${model.category}
                  ${model.format}
                  ${model.price}
                  ${model.owner}
                `.toLowerCase();
            
                return keywords.some(word => target.includes(word));
              });

            // result = result.filter(
            //     (model) =>
            //         model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            //     model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            //     model.software.toLowerCase().includes(searchQuery.toLowerCase()) ||
            //     model.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            //     model.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
            //     model.price.toString().includes(searchQuery) ||
            //     model.owner.toLowerCase().includes(searchQuery.toLowerCase())
            //         // model.title.toLowerCase().includes(searchQuery) ||
            //         // model.description.toLowerCase().includes(searchQuery) ||
            //         // model.software.toLowerCase().includes(searchQuery) ||
            //         // model.category.toLowerCase().includes(searchQuery) ||
            //         // model.format.toLowerCase().includes(searchQuery) ||
            //         // model.price.toString().includes(searchQuery) ||
            //         // model.owner.toLowerCase().includes(searchQuery)
            // );
        }
        // setFilteredModels(result); // this updates the URL and triggers data load
        setTimeout(() => setFilterLoading(false), 300);
        // }, [selectedFilters,models, searchQuery]);
        return result;
    },[selectedFilters ,searchQuery])
   
    const handleFilterChange = async (newFilters) => {
        setFilterLoading(true); // show loader
        
        await updateURLParams(newFilters); // this updates the URL and triggers data load
        
        // delay hiding loader a bit to make it smooth
        setTimeout(() => setFilterLoading(false), 400);
    };
    
    // Final sorting logic
    const finalModels = useMemo(() => {
        let sorted = [...filteredModels];

        if (sort === "price-asc") {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sort === "price-desc") {
            sorted.sort((a, b) => b.price - a.price);
        } else if (sort === "popular") {
            sorted.sort((a, b) => b.popularity - a.popularity);
        } else if (sort === "top-rating") {
            sorted.sort((a, b) => b.rating - a.rating);
        }

        return sorted;
    }, [filteredModels, sort]);
    //all aboive done correct

    const page = Number(searchParams.get("page")) || 1;
    const itemsPerPage = 24;

    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, finalModels.length);
    const paginatedModels = finalModels.slice(start - 1, end);
    const updateQueryParam = (key, value) => {
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        return params.toString();
    };
    const totalPages = Math.ceil(finalModels.length / itemsPerPage);
    const visiblePages = 3; // you can customize how many page numbers to show

    const getVisiblePageNumbers = () => {
        const pages = [];
        const half = Math.floor(visiblePages / 2);
        let startPage = Math.max(1, page - half);
        let endPage = Math.min(totalPages, startPage + visiblePages - 1);

        if (endPage - startPage + 1 < visiblePages) {
            startPage = Math.max(1, endPage - visiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };
    // here is the heart icon
    // albove wroking
    const [wishlistItems, setWishlistItems] = useState([]);
    const [hasMounted, setHasMounted] = useState(false);

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

    const isLiked = (id) => wishlistItems.some((item) => item.id === id);

    const toggleLike = (item) => {
        if (isLiked(item.id)) {
            setWishlistItems((prev) => prev.filter((p) => p.id !== item.id));
        } else {
            setWishlistItems((prev) => [...prev, item]);
        }
    };

    if (!hasMounted) return null; // 🚫 Avoid hydration error
    // if (initialLoading || filterLoading) {
    //    return <Loaders/>
    // }
    return (
        <div className="min-h-[100vh]  pt-14 bg-[#e4eeff] ">
            {/* <Loader /> */}
            <div className="min-h-[100vh]">
                {initialLoading ? (
                    <Loader />
                ) : (
                    
                    
                    <div className="">
                        {/* <Loaders/> */}
                        <BackToTopButton />

                        <div className="md:pt-4">
                            <SearchBar setFilterLoading={setFilterLoading} />
                        </div>
                        {/* {filterLoading ? ( */}

                        <div className=" bg-green-100 flex">
                        
                        </div>
                        {filterLoading && (
                           
                          <Loader/>
                          
                        )}
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
                                        setSelectedFilters={setSelectedFilters}
                                        updateURLParams={updateURLParams}
                                        handleFilterChange={handleFilterChange}
                                        showFilters={showFilters}
                                        setShowFilters={setShowFilters}
                                        setFilterLoading={setFilterLoading}
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
                                                setFilterLoading={
                                                    setFilterLoading
                                                }
                                            />
                                        </div>
                                        <div className="absolutes">
                                            <h1 className="text-xl font-semibold">
                                                <p className="text-[15px] text-gray-600">
                                                    Showing {start} – {end} of{" "}
                                                    {finalModels.length} result
                                                    {finalModels.length !== 1
                                                        ? "s"
                                                        : ""}
                                                    {searchQuery && (
                                                        <>
                                                            {" "}
                                                            for "
                                                            <strong>
                                                                {searchQuery}
                                                            </strong>
                                                            "
                                                        </>
                                                    )}
                                                </p>
                                            </h1>
                                        </div>
                                    </div>
                                    <div></div>
                                    {finalModels.length === 0 ? (
                                        <div className="text-center py-10 text-gray-600 text-lg font-medium">
                                            No results found.
                                        </div>
                                    ) : (
                                        <div>
                                            {paginatedModels.map((model) => {
                                                return (
                                                    <div
                                                        key={model.id}
                                                        className="group border-t overflow-hidden h-autoa h-[2s00px] border-[#f0f0f0] pt-6 pb-7 lg:pl-8 pl-1 sm:pl-3 md:p-4  sm:pr-3 pr-1 transition w-full xl:p-[40px]"
                                                    >
                                                        <div className="cursor-pointer flex ">  <div className="models-page-image-div flex w-[38%] sm:w-[40%] md:w-[35%] lg:w-[30%] xl:w-[25%] relative h-auto  sm:h-[200px] ml-[10px] flex-shrink-0">
                                                                <img
                                                                    src={
                                                                        model
                                                                            .image[0]
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
                                                                        href={`/models/${model.id}`}
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
                                                                                    model.owner
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
                                        {finalModels.length > 24 &&
                                            page > 1 && (
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
                                        {finalModels.length > 24 &&
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
                                        {finalModels.length > 24 &&
                                            end < finalModels.length && (
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
                        {/* )} */}
                    </div>
                )}
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
