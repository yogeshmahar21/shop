// components/ClientSideModelPage.js
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { models } from "@/lib/pData"; // your dummy data
import Filter from "@/components/Filter";
import Sorting from "@/components/Sorting";

const ClientSideModelPage = ({ software }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    software: [software],
    category: [],
    format: [],
  });

  useEffect(() => {
    const getParamArray = (key) => {
      const param = searchParams.getAll(key);
      return param.length ? param : [];
    };

    setSelectedFilters((prev) => ({
      ...prev,
      price: getParamArray("price"),
      software: [software],
      category: getParamArray("category"),
      format: getParamArray("format"),
    }));

    setSort(searchParams.get("sort") || "");
  }, [searchParams, software]);

  const updateURLParams = (filters) => {
    const params = new URLSearchParams();

    params.append("software", software);

    Object.entries(filters).forEach(([key, values]) => {
      if (key === "software") return;
      values.forEach((val) => params.append(key, val));
    });

    if (sort) params.set("sort", sort);

    router.push(`/models/${software}?${params.toString()}`);
  };

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    setSort(value);
    router.push(`/models/${software}?${params.toString()}`);
  };

  const [filteredModels, setFilteredModels] = useState([]);

  useEffect(() => {
    let result = [...models];
    result = result.filter(
      (model) => model.software.toLowerCase() === software.toLowerCase()
    );

    if (selectedFilters.price.length) {
      result = result.filter((model) =>
        selectedFilters.price.some((range) => {
          if (range === "Free") return model.price === 0;
          else if (range.includes("+")) {
            const min = Number(range.replace("₹", "").replace("+", "").trim());
            return model.price >= min;
          } else {
            const [min, max] = range.replace(/₹/g, "").split("-").map(Number);
            return model.price >= min && model.price <= max;
          }
        })
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

    setFilteredModels(result);
  }, [selectedFilters, software]);

  const finalModels = useMemo(() => {
    let sorted = [...filteredModels];

    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    else if (sort === "top-rating") sorted.sort((a, b) => b.rating - a.rating);

    return sorted;
  }, [filteredModels, sort]);

  return (
    <div className="pt-16 px-4">
      <h1 className="text-2xl font-bold mb-4 capitalize">{software} Models</h1>

      <div className="flex">
        <Filter
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          updateURLParams={updateURLParams}
        />
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <p>{finalModels.length} results found</p>
            <Sorting onSortChange={handleSortChange} sort={sort} />
          </div>
          <div>
            {finalModels.map((model) => (
              <div key={model.id} className="border p-4 mb-2 rounded">
                <h2 className="text-lg font-semibold">{model.title}</h2>
                <p>{model.description}</p>
                <p>Price: ₹{model.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSideModelPage;
