"use client";
import React, { useState } from "react";

export const dummyData = [
  { id: 1, name: "yogesh", age: 14, price: 450, popularity: 70, rating: 4.3 },
  { id: 2, name: "khushi", age: 15, price: 750, popularity: 85, rating: 4.6 },
  { id: 3, name: "mahar", age: 12, price: 1200, popularity: 65, rating: 4.0 },
  { id: 4, name: "bhandari", age: 17, price: 2200, popularity: 90, rating: 4.8 },
  { id: 5, name: "yogesh", age: 16, price: 5100, popularity: 75, rating: 4.4 },
];

export default function SortDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Default");
  const [sortedModels, setSortedModels] = useState(dummyData);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const sortOptions = [
    "Default",
    "Price: Low to High",
    "Price: High to Low",
    "Most Popular",
    "Top Rated",
  ];

  const handleSortChange = (option) => {
    setSortOption(option);
    setIsOpen(false);

    let sortedData = [...dummyData]; // fresh copy

    switch (option) {
      case "Price: Low to High":
        sortedData.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        sortedData.sort((a, b) => b.price - a.price);
        break;
      case "Most Popular":
        sortedData.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case "Top Rated":
        sortedData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        sortedData = [...dummyData];
    }

    setSortedModels(sortedData);
  };

  return (
    <div>
      <div className="bg-red-400 flex justify-end p-3">
        <div className="relative inline-block text-left">
          <button
            id="dropdownDefaultButton"
            onClick={toggleDropdown}
            className="text-white bg-[#232323] cursor-pointer focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center transition-all duration-300 ease-in-out"
            type="button"
            aria-expanded={isOpen ? "true" : "false"}
            aria-haspopup="true"
          >
            Sort by: {sortOption}
          </button>

          {isOpen && (
            <div
              id="dropdown"
              className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600 dark:text-white transition-all duration-200"
              role="menu"
              aria-labelledby="dropdownDefaultButton"
            >
              <ul className="py-2 text-sm">
                {sortOptions.map((option) => (
                  <li key={option}>
                    <button
                      className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                      role="menuitem"
                      onClick={() => handleSortChange(option)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Display sorted data */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedModels.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <h3 className="font-bold">{item.name}</h3>
            <p>Age: {item.age}</p>
            <p>Price: ₹{item.price}</p>
            <p>Popularity: {item.popularity}</p>
            <p>Rating: {item.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
