// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useCart } from "../HomePage/Context/CartContext";

// const ProductSection = () => {
//   const [categories, setCategories] = useState([]);
//   const [activeCat, setActiveCat] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔥 FILTER STATES
//   const [search, setSearch] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [inStockOnly, setInStockOnly] = useState(false);

//   const { cartQty, addToCart, increaseQty, decreaseQty } = useCart();

//   const BASE_URL = "http://localhost:5000";

//   // ✅ FETCH CATEGORIES
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/api/categories`);
//         const data = res.data || [];

//         setCategories(data);

//         if (data.length > 0) {
//           setActiveCat(data[0].id);
//         }
//       } catch (err) {
//         console.error("Category fetch error:", err);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // ✅ FETCH PRODUCTS
//   useEffect(() => {
//     if (!activeCat) return;

//     const fetchProducts = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get(
//           `${BASE_URL}/api/products?category=${activeCat}`
//         );

//         setProducts(res.data || []);
//       } catch (err) {
//         console.error("Product fetch error:", err);
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [activeCat]);

//   // 🔥 FILTER LOGIC
//   const filteredProducts = products.filter((item) => {
//     const matchesSearch = item.name
//       .toLowerCase()
//       .includes(search.toLowerCase());

//     const matchesMin = minPrice ? item.price >= Number(minPrice) : true;
//     const matchesMax = maxPrice ? item.price <= Number(maxPrice) : true;

//     const matchesStock = inStockOnly ? item.stock > 0 : true;

//     return matchesSearch && matchesMin && matchesMax && matchesStock;
//   });

//   return (
//     <div className="px-6 py-8 bg-gray-50">

//       {/* TITLE */}
//       <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//         Your Daily Essentials
//       </h2>

//       {/* 🔥 FILTER SECTION */}
//       <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">

//         {/* SEARCH */}
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded-md text-sm w-48"
//         />

//         {/* PRICE FILTER */}
//         <div className="flex gap-2">
//           <input
//             type="number"
//             placeholder="Min ₹"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}
//             className="border px-2 py-2 rounded-md text-sm w-24"
//           />
//           <input
//             type="number"
//             placeholder="Max ₹"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}
//             className="border px-2 py-2 rounded-md text-sm w-24"
//           />
//         </div>

//         {/* STOCK FILTER */}
//         <label className="flex items-center gap-2 text-sm">
//           <input
//             type="checkbox"
//             checked={inStockOnly}
//             onChange={() => setInStockOnly(!inStockOnly)}
//           />
//           In Stock Only
//         </label>
//       </div>

//       {/* CATEGORY TABS */}
//       <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             onClick={() => setActiveCat(cat.id)}
//             className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
//               activeCat === cat.id
//                 ? "bg-green-600 text-white font-semibold shadow"
//                 : "bg-white border hover:bg-gray-100"
//             }`}
//           >
//             {cat.name}
//           </button>
//         ))}
//       </div>

//       {/* LOADING */}
//       {loading && (
//         <p className="text-center text-gray-500">Loading products...</p>
//       )}

//       {/* EMPTY */}
//       {!loading && filteredProducts.length === 0 && (
//         <p className="text-center text-gray-400">No products found</p>
//       )}

//       {/* PRODUCTS */}
//       <div className="flex gap-5 overflow-x-auto pb-2">
//         {filteredProducts.map((item) => (
//           <div
//             key={item.id}
//             className="min-w-[180px] bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition group"
//           >
//             {/* IMAGE */}
//             <div className="flex justify-center mb-3">
//               <img
//                 src={
//                   item.image
//                     ? item.image.startsWith("http")
//                       ? item.image
//                       : `${BASE_URL}/uploads/${item.image}`
//                     : "https://via.placeholder.com/100"
//                 }
//                 alt={item.name}
//                 className="w-24 h-24 object-contain group-hover:scale-105 transition"
//               />
//             </div>

//             {/* NAME */}
//             <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
//               {item.name}
//             </h4>

//             {/* PRICE */}
//             <div className="flex items-center gap-2 mb-3">
//               {item.old_price && (
//                 <span className="line-through text-gray-400 text-xs">
//                   ₹{item.old_price}
//                 </span>
//               )}
//               <span className="text-green-600 font-bold">
//                 ₹{item.price}
//               </span>
//             </div>

//             {/* CART BUTTON */}
//             {item.stock === 0 ? (
//               <button
//                 disabled
//                 className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg text-sm"
//               >
//                 Out of Stock
//               </button>
//             ) : cartQty[item.id] ? (
//               <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1.5">
//                 <button
//                   onClick={() => decreaseQty(item.id)}
//                   className="w-8 h-8 bg-white rounded shadow hover:bg-gray-200"
//                 >
//                   -
//                 </button>

//                 <span className="font-bold text-gray-800">
//                   {cartQty[item.id]}
//                 </span>

//                 <button
//                   onClick={() => increaseQty(item.id, item.stock)}
//                   className="w-8 h-8 bg-white rounded shadow hover:bg-gray-200"
//                 >
//                   +
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => addToCart(item.id, item.stock)}
//                 className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition"
//               >
//                 Add to Cart
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductSection;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../HomePage/Context/CartContext";

const ProductSection = () => {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { cartQty, addToCart, increaseQty, decreaseQty } = useCart();

  const BASE_URL = "http://localhost:5000";

  // ✅ FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/categories`);
        const data = res.data || [];

        setCategories(data);

        if (data.length > 0) {
          setActiveCat(data[0].id); // ✅ default category
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  // ✅ FETCH PRODUCTS BASED ON CATEGORY
  useEffect(() => {
    if (!activeCat) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${BASE_URL}/api/products`, {
          params: { category: activeCat }, // ✅ proper param passing
        });

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
    <div className="px-6 py-8 bg-gray-50">

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Your Daily Essentials
      </h2>

      {/* ✅ CATEGORY TABS */}
      <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              activeCat === cat.id
                ? "bg-green-600 text-white font-semibold shadow"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">Loading products...</p>
      )}

      {/* EMPTY */}
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-400">No products found</p>
      )}

      {/* ✅ PRODUCTS */}
      <div className="flex gap-5 overflow-x-auto pb-2">
        {products.map((item) => (
          <div
            key={item.id}
            className="min-w-[180px] bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition"
          >
            {/* IMAGE */}
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

            {/* NAME */}
            <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
              {item.name}
            </h4>

            {/* PRICE */}
            <div className="flex items-center gap-2 mb-3">
              {item.old_price && (
                <span className="line-through text-gray-400 text-xs">
                  ₹{item.old_price}
                </span>
              )}
              <span className="text-green-600 font-bold">
                ₹{item.price}
              </span>
            </div>

            {/* CART BUTTON */}
            {item.stock === 0 ? (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg text-sm"
              >
                Out of Stock
              </button>
            ) : cartQty[item.id] ? (
              <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1.5">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-8 h-8 bg-white rounded shadow"
                >
                  -
                </button>

                <span className="font-bold">
                  {cartQty[item.id]}
                </span>

                <button
                  onClick={() => increaseQty(item.id, item.stock)}
                  className="w-8 h-8 bg-white rounded shadow"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(item.id, item.stock)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold"
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;