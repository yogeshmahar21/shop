// 'use client'
// import React from 'react'
// import { Search} from 'lucide-react';

// const SearchBar = () => {
  
//   return (

    
//     <div className=''>
//             <form className="search-bar">
//       <input  
//         type="text"
//         placeholder="Search..."
//         // value={searchQuery}
//         // onChange={(e) => setSearchQuery(e.target.value)}
//         className="border-[#00000035] border-y border-l shadow-2xl search-input"
//       />
//       <button type="submit"  className="border-[#00000035] border-r border-y search-btn"><Search/></button>
//     </form>
//     </div>
//   )
// }

// export default SearchBar
 


'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

const SearchBar = ({  setFilterLoading }) => {
  const [disabled, setDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🟡 Sync input with the URL on first load
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchQuery.trim()) {
      params.set("search", searchQuery);
      params.set("page", 1);
    } else {
      params.delete("search");
      params.set("page", 1);
    }

    setFilterLoading(true);
    setDisabled(true);
    inputRef.current.blur();

    setTimeout(() => {
      setDisabled(false);
      setFilterLoading(false); // ✅ Hide loader after short delay
    }, 4000);
    if (searchQuery) {
      router.push(`/models?search=${encodeURIComponent(searchQuery)}`);
  }
  };

  const handleInputFocus = () => {
    setDisabled(false); // Enable input on click
  };

  return (
    <div>
      <form className="search-bar mx-4 sm:mx-[37px]" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          ref={inputRef}
          onFocus={handleInputFocus} // Enable input when clicked
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-[#00000035] border-y border-l shadow-2xl search-input"
        />
        <button type="submit" className="border-[#00000035] border-r border-y search-btn">
          <Search />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
