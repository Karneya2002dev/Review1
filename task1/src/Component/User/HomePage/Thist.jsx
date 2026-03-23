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
  const addToCart = async (productId) => {
    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        user_id,
        product_id: productId,
      });

      // ✅ update local qty
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
  const increaseQty = async (productId) => {
    await addToCart(productId);
  };

  // 🔥 DECREASE
  const decreaseQty = async (productId) => {
    try {
      // find cart row id
      const res = await axios.get(
        `http://localhost:5000/api/cart/${user_id}`
      );

      const item = res.data.find((i) => i.id === productId);

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
    <div className="bg-[#eef6f2] py-10 px-6">
      <h2 className="text-3xl font-semibold text-center mb-8">
        Best Selling Products
      </h2>

      <div className="flex gap-6 overflow-x-auto pb-2">

        {products.map((item) => (
          <div
            key={item.id}
            className="min-w-60 bg-white rounded-2xl shadow-sm border hover:shadow-md transition p-4"
          >
            {/* IMAGE */}
            <img
              id={`product-img-${item.id}`}
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.name}
              className="h-40 mx-auto object-contain"
            />

            {/* NAME */}
            <h3 className="font-medium mt-4 text-gray-800">
              {item.name}
            </h3>

            {/* PRICE */}
            <p className="text-[#019147] font-bold text-lg mt-2">
              ₹{item.price}
            </p>

            {/* 🔥 BUTTON / QTY */}
            {cartQty[item.id] ? (
              <div className="flex items-center justify-between mt-4 bg-gray-100 rounded-lg p-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-3 py-1 bg-white rounded shadow"
                >
                  -
                </button>

                <span className="font-bold">
                  {cartQty[item.id]}
                </span>

                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-3 py-1 bg-white rounded shadow"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(item.id)}
                className="bg-[#019147] hover:bg-green-700 text-white w-full py-2 mt-4 rounded-lg transition"
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

export default ProductSlider;