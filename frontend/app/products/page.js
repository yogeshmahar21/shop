"use client";
import { useEffect, useState } from "react";
import { dummyData } from "@/lib/dummyData";
import Filter from "@/components/Filter";
import { useSearchParams, useRouter } from "next/navigation";

const parsePriceRange = (label) => {
  const [min, max] = label.split("-").map(Number);
  return { min, max };
};

const products = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    price: [],
    name: [],
    age: [],
  });

  const [filteredData, setFilteredData] = useState(dummyData);

  useEffect(() => {
    const urlParams = new URLSearchParams();

    filters.price.forEach((p) => urlParams.append("price", p));
    filters.name.forEach((n) => urlParams.append("name", n));
    filters.age.forEach((a) => urlParams.append("age", a));

    // router.replace(`/filters?${urlParams.toString()}`);
  }, [filters]);

  useEffect(() => {
    let data = [...dummyData];

    if (filters.price.length > 0) {
      data = data.filter((item) =>
        filters.price.some((range) => {
          const { min, max } = parsePriceRange(range);
          return item.price >= min && item.price <= max;
        })
      );
    }

    if (filters.name.length > 0) {
      data = data.filter((item) => filters.name.includes(item.name));
    }

    if (filters.age.length > 0) {
      data = data.filter((item) => filters.age.includes(item.age));
    }

    setFilteredData(data);
  }, [filters]);

  return (
    <div className="flex">
      <Filter filters={filters} setFilters={setFilters} />

      <div className="p-4 flex-1">
        <h1 className="text-2xl font-bold mb-4">Filtered Results</h1>
        {filteredData.map((item) => (
          <div key={item.id} className="mb-4 border p-4 rounded bg-white">
            <p><strong>Name:</strong> {item.name}</p>
            <p><strong>Age:</strong> {item.age}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
          </div> 
        ))}
      </div>
    </div>
  );
};

export default products;
