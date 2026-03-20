import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductSection = () => {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:5000";

  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        const data = res.data || [];

        setCategories(data);

        // ✅ Ensure first category is selected
        if (data.length > 0) {
          setActiveCat(data[0].id);
        }
      } catch (err) {
        console.error("Category fetch error:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Fetch Products based on category
  useEffect(() => {
    if (!activeCat) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${BASE_URL}/api/products?category=${activeCat}`
        );

        console.log("Products:", res.data); // DEBUG

        setProducts(res.data || []);
      } catch (err) {
        console.error("Product fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCat]);

  return (
    <div className="px-6 py-6 bg-gray-50">

      {/* Title */}
      <h2 className="text-2xl font-semibold text-center mb-6">
        Your Daily Essentials
      </h2>

      {/* ✅ Category Tabs */}
      <div className="flex gap-3 overflow-x-auto mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              console.log("Selected Category:", cat.id); // DEBUG
              setActiveCat(cat.id);
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition 
              ${activeCat === cat.id
                ? "bg-green-600 text-white font-semibold"
                : "bg-white border hover:bg-gray-100"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading products...</p>
      )}

      {/* No Products */}
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-400">No products found</p>
      )}

      {/* ✅ Product Slider */}
      <div className="flex gap-5 overflow-x-auto">
        {products.map((item) => (
          <div
            key={item.id}
            className="min-w-50 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* ✅ Image Fix */}
            <div className="flex justify-center mb-3">
              <img
                src={
                  item.image
                    ? item.image.startsWith("http")
                      ? item.image
                      : `${BASE_URL}/uploads/${item.image}`
                    : "https://via.placeholder.com/100"
                }
                alt={item.name}
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* Name */}
            <h4 className="text-sm font-medium truncate">
              {item.name}
            </h4>

            {/* Weight */}
            <p className="text-xs text-gray-500 mb-2">
              {item.weight}
            </p>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="line-through text-gray-400 text-sm">
                ₹{item.old_price}
              </span>
              <span className="text-red-500 font-semibold">
                ₹{item.price}
              </span>
            </div>

            {/* Button */}
            <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;