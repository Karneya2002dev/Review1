// pages/CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { getProducts } from "../../api";
import ProductCard from "./ProductCard";
import UserSidebar from "./UserSideBar";

// Helper to read query params
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("All");

  const query = useQuery();
  const category = query.get("category");
  const sub = query.get("sub");

  useEffect(() => {
    fetchProducts();
  }, [category, sub]); // refetch when URL changes

  const fetchProducts = async () => {
    try {
      const res = await getProducts({
        category,
        subCategory: sub,
      });

      setProducts(res.data);

      // set active state for UI highlight
      if (sub) setActive(sub);
      else if (category) setActive(category);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#eaf1ec] min-h-screen p-4">
      
      {/* Breadcrumb */}
      <div className="text-white bg-green-600 px-6 py-3 rounded-md mb-4">
        Home / {category || "All"} {sub && `/ ${sub}`}
      </div>

      <div className="flex gap-6">
        
        {/* Sidebar */}
        <UserSidebar active={active} setActive={setActive} />

        {/* Product Section */}
        <div className="flex-1">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {sub || category || "All Products"}
            </h2>

            <select className="border px-3 py-2 rounded-md">
              <option>Recommended</option>
              <option>Price Low to High</option>
              <option>Price High to Low</option>
            </select>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryPage;