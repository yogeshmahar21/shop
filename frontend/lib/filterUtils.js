export const applyFilters = (models, filters) => {
    return models.filter((model) => {
      const matchSoftware =
        filters.software.length === 0 ||
        filters.software.some((f) => f.toLowerCase() === model.software.toLowerCase());
  
      const matchCategory =
        filters.category.length === 0 ||
        filters.category.some((f) => f.toLowerCase() === model.category.toLowerCase());
  
      const matchFormat =
        filters.format.length === 0 ||
        filters.format.some((f) => f.toLowerCase() === model.format.toLowerCase());
  
      const matchPrice =
        filters.price.length === 0 ||
        filters.price.some((priceRange) => {
          const price = model.price;
          if (priceRange.toLowerCase() === "free") return price === 0;
          if (priceRange.includes("₹0 - ₹500")) return price > 0 && price <= 500;
          if (priceRange.includes("₹500 - ₹1000")) return price > 500 && price <= 1000;
          if (priceRange.includes("₹1000 - ₹2000")) return price > 1000 && price <= 2000;
          if (priceRange.includes("₹2000+")) return price > 2000;
          return false;
        });
  
      return matchSoftware && matchCategory && matchFormat && matchPrice;
    });
  };
  