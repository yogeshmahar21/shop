"use client"
import { useState,useEffect } from "react";
import { ChevronDown,X } from "lucide-react";
import { HiMiniXMark } from "react-icons/hi2";
import { FaXmark } from "react-icons/fa6";
const data = {
  software: ["AutoCAD", "Blender", "CATIA", "Fusion 360", "SolidWorks"],
  price: ["Free", "₹10 - ₹500", "₹500 - ₹1000", "₹1000 - ₹2000", "₹3000+"],
  category: ["Mechanical", "Electrical", "Architecture"],
  format: [".blend", ".dwg", ".sldprt",".CATPart", ".f3d"],
};

const Filter = ({ selectedFilters, setSelectedFilters, updateURLParams ,handleFilterChange,setFilterLoading}) => {
  const [showPrice, setShowPrice] = useState(true);
  const [showSoftware, setShowSoftware] = useState(true);
  const [showCategory, setShowCategory] = useState(false);
  const [showFormat, setShowFormat] = useState(false);
  // const [filterLoading, setFilterLoading] = useState(false);

const handleCloseSideFilter = () => {
    const openFilter1 = document.querySelector("#custom-filter-animation-id")
    const openFilter2 = document.querySelector("#custom-filter-animation-id-sub")
    openFilter1?.classList.toggle('custom-filter-animation')
    openFilter2?.classList.toggle('custom-filter-animation-sub')
    // openFilter1.classList.add("custom-filter-animation");
    // openFilter2.classList.add("custom-filter-animation-sub");
};
 

  const handleCheckboxChange = (type, value) => {
    const isSelected = selectedFilters[type].includes(value);
    const newFilters = {
      ...selectedFilters,
      [type]: isSelected
        ? selectedFilters[type].filter((item) => item !== value)
        : [...selectedFilters[type], value],
    };
    // setSelectedFilters((prev) => ({
    //   ...prev,
    //   [type]: isSelected
    //     ? prev[type].filter((item) => item !== value)
    //     : [...prev[type], value],
    // }));
    
  setSelectedFilters(newFilters);
  setFilterLoading(true);
  updateURLParams(newFilters);
  handleFilterChange(newFilters); 
   setTimeout(() => setFilterLoading(false), 400);
  };
  
  const clearAllFilters = () => {
    const cleared = { price: [], software: [], category: [], format: [] };
    // setSelectedFilters({ price: [], software: [], category: [] ,format: [] });
    setSelectedFilters(cleared);
    setFilterLoading(true); // ✅ Show loader
    updateURLParams(cleared);
    handleFilterChange(cleared);
    setTimeout(() => setFilterLoading(false), 400);
    
  // await router.push(`/models?${params.toString()}`);

  // setTimeout(() => handleFilterChange(false), 400); //
};

const removeFilter = async (type, value) => {
  const isSelected = selectedFilters[type].includes(value);
  const newFilters = {
    ...selectedFilters,
    [type]: isSelected
    ? selectedFilters[type].filter((item) => item !== value)
    : [...selectedFilters[type], value],
  };
  // setSelectedFilters((prev) => ({
  //   ...prev,
  //   [type]: prev[type].filter((item) => item !== value),
  // }));
  setSelectedFilters(newFilters);
  setFilterLoading(true);
  await updateURLParams(newFilters);
  handleFilterChange(newFilters);
  setTimeout(() => setFilterLoading(false), 400);
  // handleFilterChange(true);
  // setSelectedFilters(newFilters);           // ✅ Update the state
  // await updateURLParams(newFilters);    
  // setTimeout(() => {
  //   handleFilterChange(false);
  // }, 400);
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









// components/Filter.js
// import React, { useState } from "react";
// import { ChevronDown, X } from "lucide-react";

// const data = {
//   software: ["AutoCAD", "Blender", "Catia", "Fusion-360", "SolidWorks"],
//   price: ["0", "₹0 - ₹500", "₹500 - ₹1000", "₹1000 - ₹2000", "₹2000+"],
//   category: ["Mechanical", "Electrical", "Architecture"],
//   format: [".fgr", ".sdf", ".wet", ".asdf"],
// };

// const Filter = ({ selectedFilters, setSelectedFilters }) => {
//   const [showPrice, setShowPrice] = useState(true);
//   const [showSoftware, setShowSoftware] = useState(false);
//   const [showCategory, setShowCategory] = useState(false);
//   const [showFormat, setShowFormat] = useState(false);

//   const handleCheckboxChange = (type, value) => {
//     const isSelected = selectedFilters[type].includes(value);
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [type]: isSelected
//         ? prev[type].filter((item) => item !== value)
//         : [...prev[type], value],
//     }));
//   };

//   const clearAllFilters = () => {
//     setSelectedFilters({ price: [], software: [], category: [], format: [] });
//   };

//   const removeFilter = (type, value) => {
//     setSelectedFilters((prev) => ({
//       ...prev,
//       [type]: prev[type].filter((item) => item !== value),
//     }));
//   };

//   return (
//     <div className="h-fit flex p-[10px] bg-green-200">
//       {/* Sidebar */}
//       <div className="lg:block w-74 bg-white shadow-md rounded">
//         <div className="flex justify-between items-center pb-3 px-4 pt-4">
//           <h2 className="text-xl font-bold">Filters</h2>
//           {(selectedFilters.price.length > 0 ||
//             selectedFilters.software.length > 0 ||
//             selectedFilters.format.length > 0 ||
//             selectedFilters.category.length > 0) && (
//             <button
//               onClick={clearAllFilters}
//               className="cursor-pointer text-xs text-blue-600 font-semibold"
//             >
//               CLEAR ALL
//             </button>
//           )}
//         </div>

//         {/* Show selected filters as tags */}
//         {(selectedFilters.price.length > 0 ||
//         selectedFilters.format.length > 0 ||
//           selectedFilters.software.length > 0 ||
//           selectedFilters.category.length > 0) && (
//           <div className="px-4 pt-2 pb-3 flex flex-wrap gap-2">
//             {Object.entries(selectedFilters).map(([type, values]) =>
//               values.map((value) => (
//                 <div
//                   key={value}
//                   onClick={() => removeFilter(type, value)}
//                   className="cursor-pointer flex items-center bg-[#f0f0f0] text-xs text-gray-800 px-3 py-2 rounded-full hover:line-through"
//                 >
//                   {value} &nbsp;
//                   <X size={15} />
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {/* Price Filter */}
//         <div className="cursor-pointer border-b border-[#f0f0f0] user-select-none pb-2">
//           <h3
//             onClick={() => setShowPrice(!showPrice)}
//             className="text-sm px-4 pt-4 pb-1 w-full flex items-center justify-between"
//           >
//             Price
//             <ChevronDown
//               className={`text-[#878787] transition-transform duration-300 ${
//                 showPrice ? "rotate-180" : ""
//               }`}
//               size={22}
//             />
//           </h3>
//           {showPrice &&
//             data.price.map((price, index) => (
//               <div key={index} className="px-4 space-y-2 py-[5px]">
//                 <label className="cursor-pointer text-[#717171] flex items-center w-full">
//                   <input
//                     type="checkbox"
//                     className="mr-3 w-[16px] h-[16px] cursor-pointer"
//                     checked={selectedFilters.price.includes(price)}
//                     onChange={() => handleCheckboxChange("price", price)}
//                   />
//                   {price}
//                 </label>
//               </div>
//             ))}
//         </div>

//         {/* Software Filter */}
//         <div className="cursor-pointer border-b border-[#f0f0f0] user-select-none pb-2">
//           <h3
//             onClick={() => setShowSoftware(!showSoftware)}
//             className="text-sm px-4 pt-4 pb-1 w-full flex items-center justify-between"
//           >
//             Software
//             <ChevronDown
//               className={`text-[#878787] transition-transform duration-300 ${
//                 showSoftware ? "rotate-180" : ""
//               }`}
//               size={22}
//             />
//           </h3>
//           {showSoftware &&
//             data.software.map((software, index) => (
//               <div key={index} className="px-4 space-y-2 py-[5px]">
//                 <label className="cursor-pointer text-[#717171] flex items-center w-full">
//                   <input
//                     type="checkbox"
//                     className="mr-3 w-[16px] h-[16px] cursor-pointer"
//                     checked={selectedFilters.software.includes(software)}
//                     onChange={() =>
//                       handleCheckboxChange("software", software)
//                     }
//                   />
//                     {software}
//                 </label>
//               </div>
//             ))}
//         </div>

//         {/* Category Filter */}
//         <div className="cursor-pointer border-b border-[#f0f0f0] user-select-none pb-2">
//           <h3
//             onClick={() => setShowCategory(!showCategory)}
//             className="text-sm px-4 pt-4 pb-1 w-full flex items-center justify-between"
//           >
//             Category
//             <ChevronDown
//               className={`text-[#878787] transition-transform duration-300 ${
//                 showCategory ? "rotate-180" : ""
//               }`}
//               size={22}
//             />
//           </h3>
//           {showCategory &&
//             data.category.map((category, index) => (
//               <div key={index} className="px-4 space-y-2 py-[5px]">
//                 <label className="cursor-pointer text-[#717171] flex items-center w-full">
//                   <input
//                     type="checkbox"
//                     className="mr-3 w-[16px] h-[16px] cursor-pointer"
//                     checked={selectedFilters.category.includes(category)}
//                     onChange={() =>
//                       handleCheckboxChange("category", category)
//                     }
//                   />
//                   {category}
//                 </label>
//               </div>
//             ))}
//         </div>

//         {/* Format Filter */}
//         <div className="cursor-pointer border-b border-[#f0f0f0] user-select-none pb-2">
//           <h3
//             onClick={() => setShowFormat(!showFormat)}
//             className="text-sm px-4 pt-4 pb-1 w-full flex items-center justify-between"
//           >
//             File Format
//             <ChevronDown
//               className={`text-[#878787] transition-transform duration-300 ${
//                 showFormat ? "rotate-180" : ""
//               }`}
//               size={22}
//             />
//           </h3>
//           {showFormat &&
//             data.format.map((format, index) => (
//               <div key={index} className="px-4 space-y-2 py-[5px]">
//                 <label className="cursor-pointer text-[#717171] flex items-center w-full">
//                   <input
//                     type="checkbox"
//                     className="mr-3 w-[16px] h-[16px] cursor-pointer"
//                     checked={selectedFilters.format.includes(format)}
//                     onChange={() =>
//                       handleCheckboxChange("format", format)
//                     }
//                   />
//                   {format}
//                 </label>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Filter;












               
            // <div className="lg:hidden">
            //     <button
            //         onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            //         className="bg-blue-600 text-white p-2 rounded-full fixed bottom-6 right-6 z-50"
            //     >
            //         Filters
            //     </button>
            // </div>
            // <div
            //     className={`lg:hidden fixed top-0 left-0 w-2/3 bg-white shadow-lg p-4 transition-all duration-300 ease-in-out transform ${
            //         isMobileFiltersOpen ? "translate-x-0" : "translate-x-full"
            //     }`}
            // >
            //     <h2 className="text-xl font-bold mb-4">Filters</h2>

            //     <div className="mb-6">
            //         <h3 className="font-semibold mb-2">Software</h3>
            //         <div className="space-y-2">
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 SolidWorks
            //             </label>
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 AutoCAD
            //             </label>
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 Blender
            //             </label>
            //         </div>
            //     </div>
            //     <div className="mb-6">
            //         <h3 className="font-semibold mb-2">Price</h3>
            //         <div className="space-y-2">
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 ₹0 - ₹500
            //             </label>
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 ₹500 - ₹1000
            //             </label>
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 ₹1000 - ₹2000
            //             </label>
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 ₹2000+
            //             </label>
            //         </div>
            //     </div>

            //     <div className="mb-6">
            //         <h3 className="font-semibold mb-2">Categories</h3>
            //         <div className="space-y-2">
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 Mechanical
            //             </label>
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 Electrical
            //             </label>
            //             <label>
            //                 <input type="checkbox" className="mr-2" />
            //                 Architecture
            //             </label>
            //         </div>
            //     </div>

            //     <button className="bg-red-600 text-white py-2 px-4 rounded-full w-full">
            //         Clear Filters
            //     </button>
            // </div>
     