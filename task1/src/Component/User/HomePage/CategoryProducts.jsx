import React, { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import axios from "axios";
import ProductCard from "./ProductCard";
import UserSidebar from "./UserSideBar";
import { useCart } from "../HomePage/Context/CartContext";
import Header from "./Header";

const CategoryPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { cartQty, addToCart, increaseQty, decreaseQty } = useCart();

  const BASE_URL = "http://localhost:5000";

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/products`);
        setAllProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ FILTER LOGIC
  useEffect(() => {
    let filtered = [...allProducts];

    if (activeCategory) {
      filtered = filtered.filter(
        (p) => p.category_id === activeCategory
      );
    }

    if (activeSubCategory) {
      filtered = filtered.filter(
        (p) => p.subcategory_id === activeSubCategory
      );
    }

    setFilteredProducts(filtered);
  }, [activeCategory, activeSubCategory, allProducts]);

  return (
    <div className="bg-[#eaf1ec] min-h-screen p-4 md:p-6 mt-16 md:mt-24">
      <Header />

      {/* 🔰 Breadcrumb */}
      <div className="bg-green-600 text-white px-4 py-2 rounded mb-5 text-sm font-medium shadow">
        Home / Products
      </div>

      {/* 📱 Mobile Filter Button */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm font-semibold text-green-700"
        >
          <Filter size={18} /> Filters
        </button>

        <span className="text-sm text-gray-600">
          {filteredProducts.length} items
        </span>
      </div>

      <div className="flex gap-6">

        {/* 🧱 PRODUCTS SECTION */}
        <main className="flex-1">

          {/* Desktop Title */}
          <div className="hidden lg:flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Products
              <span className="text-gray-500 text-sm ml-2">
                ({filteredProducts.length})
              </span>
            </h2>
          </div>

          {/* 🔄 Loading */}
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    cartQty={cartQty}
                    addToCart={addToCart}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                  />
                ))
              ) : (
                <div className="col-span-full bg-white p-10 rounded-xl text-center shadow">
                  <p className="text-gray-500 text-lg">
                    No products found
                  </p>

                  <button
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveSubCategory(null);
                    }}
                    className="mt-4 text-green-600 underline"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* 🧱 SIDEBAR RIGHT (DESKTOP) */}
        <aside className="hidden lg:block w-72">
          <div className="sticky top-24">
            <UserSidebar
              setActiveCategory={setActiveCategory}
              setActiveSubCategory={setActiveSubCategory}
            />
          </div>
        </aside>

      </div>

      {/* 📱 MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Filters</h3>
              <X onClick={() => setIsSidebarOpen(false)} />
            </div>

            <UserSidebar
              setActiveCategory={(cat) => {
                setActiveCategory(cat);
                setIsSidebarOpen(false);
              }}
              setActiveSubCategory={(sub) => {
                setActiveSubCategory(sub);
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;