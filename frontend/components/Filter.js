"use client"
import { useState,useEffect } from "react";
import { ChevronDown,X } from "lucide-react";
import { HiMiniXMark } from "react-icons/hi2";
import { FaXmark } from "react-icons/fa6";
const data = {
  software: ["AutoCAD", "Blender", "CATIA", "Fusion 360", "SolidWorks"],
  price: ["Free", '₹10 - ₹500', "₹500 - ₹1000", "₹1000 - ₹2000", "₹3000+"],
  category: ["Mechanical", "Electrical", "Architecture"],
  format: [".blend", ".dwg", ".sldprt",".CATPart", ".f3d"],
};

const Filter = ({ selectedFilters, handleMultiFilterChange, handlePriceChange ,resetFilters}) => {
  const [showPrice, setShowPrice] = useState(true);
  const [showSoftware, setShowSoftware] = useState(true);
  const [showCategory, setShowCategory] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  // const [filterLoading, setFilterLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([])

const handleCloseSideFilter = () => {
    const openFilter1 = document.querySelector("#custom-filter-animation-id")
    const openFilter2 = document.querySelector("#custom-filter-animation-id-sub")
    openFilter1?.classList.toggle('custom-filter-animation')
    openFilter2?.classList.toggle('custom-filter-animation-sub')
    // openFilter1.classList.add("custom-filter-animation");
    // openFilter2.classList.add("custom-filter-animation-sub");
};
 

   const handleCheckboxChange = (type, value) => {
    handleMultiFilterChange((prev) => {
      const updated = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value) // remove
        : [...prev[type], value]; // add
      return { ...prev, [type]: updated };
    });
  };



    const clearAllFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    resetFilters();
  };


  const removeFilter = (type, value) => {
    handleCheckboxChange(type, value);
  };
  
 const handleCustomPriceChange = () => {
    if (minPriceInput || maxPriceInput) {
    handlePriceChange(minPriceInput, maxPriceInput);
  }
  };

  return (
    <div className=" h-fit flex lg:px-[10px] lg:mt-[10px]">
      {/* Sidebar */}
      <div className=" lg:block sm:w-74 w-[100vw] bg-white shadow-md rounded sm:px-0 px-3">
        {/* Filters Header */}
        <div className="flex justify-between items-center pb-3 px-4 pt-4">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={handleCloseSideFilter} className="flex lg:hidden cursor-pointer absolute right-0 m-4 mr-4.5">
            <HiMiniXMark className="text-[25px] "/>
          </button>
          
          {(selectedFilters.price.length > 0 ||
            selectedFilters.software.length > 0 ||
            selectedFilters.format.length > 0 ||
            selectedFilters.category.length > 0) && (
            <button
              onClick={clearAllFilters}
              className="cursor-pointer text-xs text-blue-600 font-semibold mr-14 mt-[6px] lg:mr-0"
            >
              CLEAR ALL
            </button>
          )}
        </div>

        {/* Show selected filters as tags */}
        {(selectedFilters.price.length > 0 ||
        selectedFilters.format.length > 0 ||
          selectedFilters.software.length > 0 ||
          selectedFilters.category.length > 0) && (
          <div className="px-4 pt-2 pb-3 flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([type, values]) =>
              values.map((value) => (
                <div
                  key={value}
                  onClick={() => removeFilter(type, value)}
                  className="cursor-pointer flex items-center bg-[#f0f0f0] text-xs text-gray-800 px-3 py-2 rounded-full hover:line-through"
                >
                  {value} &nbsp;
                <X size={15}/>
                </div>
              ))
            )}
          </div>
        )}

        {/* Price Filter */}
        <div className="cursor-pointer border-b border-t border-[#f0f0f0] user-select-none pb-2">
          <h3
            onClick={() => setShowPrice(!showPrice)}
            className="text-sm px-4 pt-4 pb-1 w-full flex items-center justify-between"
          >
            Price
            <ChevronDown
              className={`text-[#878787] transition-transform duration-300 ${
                showPrice ? "rotate-180" : ""
              }`}
              size={22}
            />
          </h3>
          <div className="pt-2">
          {showPrice &&
            data.price.map((price, index) => (
              <div key={index} className="px-4 space-y-2 py-[5px]">
                <label className="cursor-pointer text-[#717171] flex items-center w-full">
                  <input
                    type="checkbox"
                    className="mr-3 w-[16px] h-[16px] cursor-pointer"
                    checked={selectedFilters.price.includes(price)}
                    onChange={() => handleCheckboxChange("price", price)}
                    />
                   {price}
                </label>
              </div>
            ))}
            </div>
        </div>

        {/* Software Filter */}
        <div className="cursor-pointer border-b border-[#f0f0f0] user-select-none pb-2">
          <h3
            onClick={() => setShowSoftware(!showSoftware)}
            className="text-sm px-4 pt-4 pb-1 w-full flex items-center justify-between"
          >
            Software
            <ChevronDown
              className={`text-[#878787] transition-transform duration-300 ${
                showSoftware ? "rotate-180" : ""
              }`}
              size={22}
            />
          </h3>
          <div className="pt-2">
          {showSoftware &&
            data.software.map((software, index) => (
              <div key={index} className="px-4 space-y-2 py-[5px]">
                <label className="cursor-pointer text-[#717171] flex items-center w-full">
                  <input
                    type="checkbox"
                    className="mr-3 w-[16px] h-[16px] cursor-pointer"
                    checked={selectedFilters.software.includes(software)}
                    onChange={() =>
                      handleCheckboxChange("software", software)
                    }
                  />
                  {software}
                </label>
              </div>
            ))}
        </div>
        </div>

        {/* Category Filter */}
        <div className="cursor-pointer border-b border-[#f0f0f0] user-select-none pb-2">
          <h3
            onClick={() => setShowCategory(!showCategory)}
            className="text-sm px-4 pt-4 pb-1 w-full flex items-center justify-between"
          >
            Category
            <ChevronDown
              className={`text-[#878787] transition-transform duration-300 ${
                showCategory ? "rotate-180" : ""
              }`}
              size={22}
            />
          </h3> 
                   <div className="pt-2">
          {showCategory &&
            data.category.map((category, index) => (
              <div key={index} className="px-4 space-y-2 py-[5px]">
                <label className="cursor-pointer text-[#717171] flex items-center w-full">
                  <input
                    type="checkbox"
                    className="mr-3 w-[16px] h-[16px] cursor-pointer"
                    checked={selectedFilters.category.includes(category)}
                    onChange={() =>
                      handleCheckboxChange("category", category)
                    }
                  />
                  {category}
                </label>
              </div>
            ))}
        </div>
        </div>

        <div className="cursor-pointer border-b border-[#f0f0f0] user-select-none pb-2">
          <h3
            onClick={() => setShowFormat(!showFormat)}
            className="text-sm px-4 pt-4 pb-1 w-full flex items-center justify-between"
          >
            File Format
            <ChevronDown
              className={`text-[#878787] transition-transform duration-300 ${
                showFormat ? "rotate-180" : ""
              }`}
              size={22}
            />
          </h3>
          <div className="pt-2">
          {showFormat &&
            data.format.map((format, index) => (
              <div key={index} className="px-4 space-y-2 py-[5px]">
                <label className="cursor-pointer text-[#717171] flex items-center w-full">
                  <input
                    type="checkbox"
                    className="mr-3 w-[16px] h-[16px] cursor-pointer"
                    checked={selectedFilters.format.includes(format)}
                    onChange={() =>
                      handleCheckboxChange("format", format)
                    }
                  />
                  {format}
                </label>
              </div>
            ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;







