export const dummyData = [
    { id: 1, name: "yogesh", age: 14, price: 450 },
    { id: 2, name: "khushi", age: 15, price: 750 },
    { id: 3, name: "mahar", age: 12, price: 1200 },
    { id: 4, name: "bhandari", age: 17, price: 2200 },
    { id: 5, name: "yogesh", age: 16, price: 5100 },
  ];
  
 
  const [filteredModels, setFilteredModels] = useState(models);
  const [sortedModels, setSortedModels] = useState(models);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Default");
  // Sorting options
  const sortOptions = ["Default", "Price: Low to High", "Price: High to Low", "Most Popular", "Top Rated"];

  // Handle sorting option change
  const handleSortChange = (option) => {
    setSortOption(option);
    setIsOpen(false); // Close dropdown on selection

    let sortedData = [...filteredModels]; // Copy of the filtered models
    
    // Sorting logic based on the selected option
    if (option === "Price: Low to High") {
      sortedData = sortedData.sort((a, b) => a.price - b.price); // Ascending order by price
    } else if (option === "Price: High to Low") {
      sortedData = sortedData.sort((a, b) => b.price - a.price); // Descending order by price
    } else if (option === "Most Popular") {
      sortedData = sortedData.sort((a, b) => b.popularity - a.popularity); // Assuming `popularity` exists
    } else if (option === "Top Rated") {
      sortedData = sortedData.sort((a, b) => b.rating - a.rating); // Assuming `rating` exists
    }

    setSortedModels(sortedData); // Update the sorted models state
  };
  <div className="bg-red-400 flex justify-end">
  <div className="relative inline-block text-left">
  <button
    id="dropdownDefaultButton"
    onClick={toggleDropdown}
    className="text-white bg-[#232323] cursor-pointer focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  transition-all duration-300 ease-in-out"
    type="button"
    aria-expanded={isOpen ? "true" : "false"}
    aria-haspopup="true"
  >
    Sort by: {sortOption} 
  </button>

  {isOpen && (
    <div
      id="dropdown"
      className="z-3 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600 dark:text-white opacity-100 transition-all duration-300 ease-in-out transform scale-100 origin-top"
      role="menu"
      aria-labelledby="dropdownDefaultButton"
    >
      <ul className="py-2 text-sm">
        {sortOptions.map((option) => (
          <li key={option}>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white transition-colors duration-200"
              role="menuitem"
              tabIndex="-1"
              onClick={() => handleSortChange(option)} 
            >
              {option} 
            </a>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
</div>