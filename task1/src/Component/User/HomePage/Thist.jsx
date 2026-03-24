import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductSlider = () => {
  
  const [products, setProducts] = useState([]);
  const [cartQty, setCartQty] = useState({}); // 🔥 store qty per product

  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

useEffect(() => {
  fetchProducts();

  if (user_id) {
    fetchCart();
  }

  // 🔥 listen for cart updates globally
  window.addEventListener("cartUpdated", fetchCart);

  return () => {
    window.removeEventListener("cartUpdated", fetchCart);
  };
}, []);

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FETCH CART (to show qty if already added)
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/cart/${user_id}`
      );

      const qtyMap = {};
      res.data.forEach((item) => {
      qtyMap[item.product_id] = item.quantity; // product_id = id
      });

      setCartQty(qtyMap);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 ADD TO CART + ANIMATION
  const addToCart = async (productId, stock) => {
  if (stock <= 0) {
    alert("Out of Stock ❌");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/cart/add", {
      user_id,
      product_id: productId,
    });

    setCartQty((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));

    animateToCart(productId);

  } catch (error) {
    console.log(error);
  }
};

  // 🔥 INCREASE
 const increaseQty = async (productId, stock) => {
  if ((cartQty[productId] || 0) >= stock) {
    alert("No more stock available ❌");
    return;
  }

  await addToCart(productId, stock);
};

  // 🔥 DECREASE
  const decreaseQty = async (productId) => {
    try {
      // find cart row id
      const res = await axios.get(
        `http://localhost:5000/api/cart/${user_id}`
      );

const item = res.data.find((i) => i.product_id === productId);

      if (!item) return;

      if (item.quantity > 1) {
        await axios.put(
          `http://localhost:5000/api/cart/decrease/${item.id}`
        );
      } else {
        await axios.delete(
          `http://localhost:5000/api/cart/${item.id}`
        );
      }

      setCartQty((prev) => {
        const newQty = { ...prev };
        if (newQty[productId] > 1) {
          newQty[productId] -= 1;
        } else {
          delete newQty[productId];
        }
        return newQty;
      });

      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 ANIMATION FUNCTION
  const animateToCart = (productId) => {
    const img = document.getElementById(`product-img-${productId}`);
    const cart = document.getElementById("cart-icon");

    if (img && cart) {
      const imgRect = img.getBoundingClientRect();
      const cartRect = cart.getBoundingClientRect();

      const clone = img.cloneNode(true);

      clone.style.position = "fixed";
      clone.style.top = imgRect.top + "px";
      clone.style.left = imgRect.left + "px";
      clone.style.width = imgRect.width + "px";
      clone.style.height = imgRect.height + "px";
      clone.style.zIndex = "9999";
      clone.style.transition = "all 0.8s ease-in-out";

      document.body.appendChild(clone);

      setTimeout(() => {
        clone.style.top = cartRect.top + "px";
        clone.style.left = cartRect.left + "px";
        clone.style.width = "30px";
        clone.style.height = "30px";
        clone.style.opacity = "0.5";
      }, 50);

      setTimeout(() => {
        clone.remove();
        window.dispatchEvent(new Event("cartUpdated"));
      }, 800);
    }
  };

  return (
  <div className="bg-[#eef6f2] py-12 px-6">
    <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
      Best Selling Products
    </h2>

    <div className="flex gap-6 overflow-x-auto pb-4">

      {products.map((item) => (
        <div
          key={item.id}
          className="min-w-60 bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 group"
        >
          {/* IMAGE */}
          <div className="relative p-4">
            <img
              id={`product-img-${item.id}`}
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.name}
              className="h-40 mx-auto object-contain group-hover:scale-105 transition"
            />

            {/* 🔥 STOCK BADGE */}
            <span
              className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-semibold ${
                item.stock === 0
                  ? "bg-red-100 text-red-600"
                  : item.stock <= 5
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {item.stock === 0
                ? "Out of Stock"
                : item.stock <= 5
                ? `Only ${item.stock} left`
                : "In Stock"}
            </span>
          </div>

          {/* CONTENT */}
          <div className="px-4 pb-4">
            {/* NAME */}
            <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 min-h-10">
              {item.name}
            </h3>

            {/* PRICE */}
            <p className="text-[#019147] font-bold text-lg mt-2">
              ₹{item.price}
            </p>

            {/* 🔥 BUTTON / QTY */}
            {item.stock === 0 ? (
              <button
                disabled
                className="bg-gray-300 text-gray-600 w-full py-2 mt-4 rounded-lg cursor-not-allowed text-sm font-semibold"
              >
                Out of Stock
              </button>
            ) : cartQty[item.id] ? (
              <div className="flex items-center justify-between mt-4 bg-gray-100 rounded-lg p-1.5">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded shadow hover:bg-gray-200"
                >
                  -
                </button>

                <span className="font-bold text-gray-800">
                  {cartQty[item.id]}
                </span>

                <button
                  onClick={() => increaseQty(item.id, item.stock)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded shadow hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(item.id, item.stock)}
                className="bg-[#019147] hover:bg-green-700 text-white w-full py-2 mt-4 rounded-lg transition font-semibold text-sm shadow-sm"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      ))}

    </div>
  </div>
);

};

export default ProductSlider;