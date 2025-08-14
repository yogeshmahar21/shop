"use client";
import React, { useState, useMemo, useRef,useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Sorting = ({ onSortChange, sort ,setFilterLoading}) => {
    const router = useRouter();
    const searchParams = useSearchParams(); 
    
    const sortOptions = [
      { label: "Newest First", value: "newest" },
      { label: "Oldest First", value: "oldest" },
      { label: "Top Rated", value: "top_rating" },
      { label: "Price: Low to High", value: "price_asc" },
      { label: "Price: High to Low", value: "price_desc" },
      // { label: "Most Popular", value: "popular" },
    ];
    
    // const [sortOption, setSortOption] = useState(searchParams.get("sort") || "Default");
    const initialSortValue = searchParams.get("sort") || "";
const initialSortLabel = sortOptions.find(opt => opt.value === initialSortValue)?.label || "Default";
const [sortOption, setSortOption] = useState(initialSortLabel);
    const [isOpen, setIsOpen] = useState(false);
    
    // Function to handle dropdown toggle
    const toggleDropdown = () => setIsOpen(!isOpen);
    
    // Function to handle sorting change
    const handleSortChange = async (value, label) => {
      // Set the selected sorting option
      setSortOption(label);
      onSortChange(value); 
      // setFilterLoading(true); 
      // Update the URL with the new sort parameter
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("sort", value);
      } else {
        params.delete("sort");
      }
  
      // Close the dropdown and update the router
      setIsOpen(false);
      await router.push(`/models?${params.toString()}`); 
      // setTimeout(() => setFilterLoading(false), 400); // Smooth hide loader
    };
    const dropdownRef = useRef(null);

// Close dropdown if clicked outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
useEffect(() => {
  if (sort) {
    const matchedLabel = sortOptions.find(opt => opt.value === sort)?.label || "Default";
    setSortOption(matchedLabel);
  } else {
    setSortOption("Default");
  }
}, [sort]);

  return (
    <div className=" flex justify-end items-center">
        
    <div ref={dropdownRef} className="relatives inline-block text-left">
        <button
            id="dropdownDefaultButton"
            onClick={toggleDropdown}
            className="text-[#000000] font-normal bg-[#f7f9ff] border border-[#b9b9b9] cursor-pointer focus:outline-none  rounded-lg text-[13px] px-3 py-2 text-center inline-flex items-center  transition-all duration-300 ease-in-out"
            type="button"
            aria-expanded={
                isOpen ? "true" : "false"
            }
            aria-haspopup="true"
        >
            Sort by: {sortOption}
        </button>

        {isOpen && (
            <div
                id="dropdown"
                className="z-3 absolute right-5 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-40 dark:bg-gray-700  dark:divide-gray-600 dark:text-white opacity-100 transition-all duration-300 ease-in-out transform scale-100 origin-top"
                role="menu"
                aria-labelledby="dropdownDefaultButton"
            >
                <ul className="py-2 border-[1px] border-[#cecece] bg-[#f7f9ff] rounded-[5px] text-sm">
                    {sortOptions.map((option) => (
                        <li key={option.value}>
                            <button
                                // value={option.values}
                                onClick={() =>
                                    handleSortChange(
                                        option.value,
                                        option.label
                                    )
                                }
                                className="cursor-pointer  text-black bg-[#f7f9ff] w-full block px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-200"
                                role="menuitem"
                                tabIndex="-1"
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
</div>
  )
}

export default Sorting