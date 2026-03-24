// // import { createContext, useContext, useEffect, useState } from "react";
// // import axios from "axios";

// // const CartContext = createContext();

// // export const useCart = () => useContext(CartContext);

// // export const CartProvider = ({ children }) => {
// //   const [cartQty, setCartQty] = useState({});
// //   const user_id = localStorage.getItem("user_id");

// //   // ✅ FETCH CART
// //   const fetchCart = async () => {
// //     if (!user_id) return;

// //     try {
// //       const res = await axios.get(`http://localhost:5000/api/cart/${user_id}`);

// //       const qtyMap = {};
// //       res.data.forEach((item) => {
// //         qtyMap[item.product_id] = item.quantity;
// //       });

// //       setCartQty(qtyMap);
// //     } catch (err) {
// //       console.log("Cart fetch error:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCart();
// //   }, [user_id]);

// //   // ✅ ADD TO CART
// //   const addToCart = async (productId) => {
// //     try {
// //       await axios.post("http://localhost:5000/api/cart/add", {
// //         user_id,
// //         product_id: productId,
// //       });

// //       setCartQty((prev) => ({
// //         ...prev,
// //         [productId]: (prev[productId] || 0) + 1,
// //       }));

// //     } catch (err) {
// //       console.log("Add error:", err);
// //     }
// //   };

// //   // ✅ INCREASE
// //   const increaseQty = async (productId) => {
// //     await addToCart(productId);
// //   };

// //   // ✅ DECREASE
// //   const decreaseQty = async (productId) => {
// //     try {
// //       const res = await axios.get(`http://localhost:5000/api/cart/${user_id}`);
// //       const item = res.data.find((i) => i.product_id === productId);

// //       if (!item) return;

// //       if (item.quantity > 1) {
// //         await axios.put(`http://localhost:5000/api/cart/decrease/${item.id}`);
// //       } else {
// //         await axios.delete(`http://localhost:5000/api/cart/${item.id}`);
// //       }

// //       setCartQty((prev) => {
// //         const newQty = { ...prev };
// //         if (newQty[productId] > 1) {
// //           newQty[productId] -= 1;
// //         } else {
// //           delete newQty[productId];
// //         }
// //         return newQty;
// //       });

// //     } catch (err) {
// //       console.log("Decrease error:", err);
// //     }
// //   };

// //   return (
// //     <CartContext.Provider
// //       value={{
// //         cartQty,
// //         fetchCart,
// //         addToCart,
// //         increaseQty,
// //         decreaseQty,
// //       }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };


// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartQty, setCartQty] = useState({});
//   const [cartCount, setCartCount] = useState(0);

//   const user_id = localStorage.getItem("user_id");

//   // ✅ FETCH CART (GLOBAL)
//   const fetchCart = async () => {
//     try {
//       if (!user_id) return;

//       const res = await axios.get(
//         `http://localhost:5000/api/cart/${user_id}`
//       );

//       const qtyMap = {};
//       let total = 0;

//       res.data.forEach((item) => {
//         qtyMap[item.product_id] = item.quantity;
//         total += item.quantity;
//       });

//       setCartQty(qtyMap);
//       setCartCount(total);

//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, [user_id]);

//   // ✅ ADD
//   const addToCart = async (productId) => {
//     await axios.post("http://localhost:5000/api/cart/add", {
//       user_id,
//       product_id: productId,
//     });

//     fetchCart();
//   };

//   // ✅ INCREASE
//   const increaseQty = async (productId) => {
//     await addToCart(productId);
//   };

//   // ✅ DECREASE
//   const decreaseQty = async (productId) => {
//     const res = await axios.get(
//       `http://localhost:5000/api/cart/${user_id}`
//     );

//     const item = res.data.find((i) => i.product_id === productId);

//     if (!item) return;

//     if (item.quantity > 1) {
//       await axios.put(
//         `http://localhost:5000/api/cart/decrease/${item.id}`
//       );
//     } else {
//       await axios.delete(
//         `http://localhost:5000/api/cart/${item.id}`
//       );
//     }

//     fetchCart();
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartQty,
//         cartCount,
//         addToCart,
//         increaseQty,
//         decreaseQty,
//         fetchCart
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartQty, setCartQty] = useState({});
  const [cartCount, setCartCount] = useState(0);

  const user_id = localStorage.getItem("user_id");

  // 🧠 HELPER → Calculate total count
  const calculateTotal = (qtyMap) => {
    return Object.values(qtyMap).reduce((acc, val) => acc + val, 0);
  };

  // ===============================
  // ✅ FETCH CART (LOGIN / GUEST)
  // ===============================
  const fetchCart = async () => {
    try {
      if (user_id) {
        // 🔥 LOGGED USER
        const res = await axios.get(
          `http://localhost:5000/api/cart/${user_id}`
        );

        const qtyMap = {};
        res.data.forEach((item) => {
          qtyMap[item.product_id] = item.quantity;
        });

        setCartQty(qtyMap);
        setCartCount(calculateTotal(qtyMap));

      } else {
        // 🟡 GUEST USER
        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || {};
        setCartQty(guestCart);
        setCartCount(calculateTotal(guestCart));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user_id]);

  // ===============================
  // ✅ ADD TO CART
  // ===============================
  const addToCart = async (productId) => {
    try {
      if (user_id) {
        // 🔥 API
        await axios.post("http://localhost:5000/api/cart/add", {
          user_id,
          product_id: productId,
        });

        fetchCart();

      } else {
        // 🟡 LOCAL STORAGE
        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || {};

        guestCart[productId] = (guestCart[productId] || 0) + 1;

        localStorage.setItem("guest_cart", JSON.stringify(guestCart));

        setCartQty(guestCart);
        setCartCount(calculateTotal(guestCart));
      }

      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // ✅ INCREASE
  // ===============================
  const increaseQty = async (productId) => {
    await addToCart(productId);
  };

  // ===============================
  // ✅ DECREASE
  // ===============================
  const decreaseQty = async (productId) => {
    try {
      if (user_id) {
        // 🔥 API
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

        fetchCart();

      } else {
        // 🟡 LOCAL STORAGE
        const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || {};

        if (guestCart[productId] > 1) {
          guestCart[productId] -= 1;
        } else {
          delete guestCart[productId];
        }

        localStorage.setItem("guest_cart", JSON.stringify(guestCart));

        setCartQty(guestCart);
        setCartCount(calculateTotal(guestCart));
      }

      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartQty,
        cartCount,
        addToCart,
        increaseQty,
        decreaseQty,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);