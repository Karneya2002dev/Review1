import axios from "axios";
import { useState, useEffect } from "react";

export const useCart = () => {
  const user_id = localStorage.getItem("user_id");
  const [cartQty, setCartQty] = useState({});

  // ✅ FETCH CART
  const fetchCart = async () => {
    if (!user_id) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${user_id}`);

      const qtyMap = {};
      res.data.forEach((item) => {
        qtyMap[item.product_id] = item.quantity;
      });

      setCartQty(qtyMap);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();

    window.addEventListener("cartUpdated", fetchCart);

    return () => {
      window.removeEventListener("cartUpdated", fetchCart);
    };
  }, []);

  // ✅ ADD
  const addToCart = async (productId) => {
    await axios.post("http://localhost:5000/api/cart/add", {
      user_id,
      product_id: productId,
    });

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ✅ INCREASE
  const increaseQty = async (productId) => {
    await addToCart(productId);
  };

  // ✅ DECREASE
  const decreaseQty = async (productId) => {
    const res = await axios.get(`http://localhost:5000/api/cart/${user_id}`);

    const item = res.data.find((i) => i.product_id === productId);
    if (!item) return;

    if (item.quantity > 1) {
      await axios.put(`http://localhost:5000/api/cart/decrease/${item.id}`);
    } else {
      await axios.delete(`http://localhost:5000/api/cart/${item.id}`);
    }

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return {
    cartQty,
    addToCart,
    increaseQty,
    decreaseQty,
    fetchCart
  };
};