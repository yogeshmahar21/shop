'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";

const Dummy = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Update URL query with search term
            router.push(`/model?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return ( 
        <form onSubmit={handleSearchSubmit} className="mt-10 search-form">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for models"
                className="search-input"
            />
            <button type="submit" className="search-button bg-amber-500 p-3">Search</button>
        </form>
    );
};

export default Dummy;
