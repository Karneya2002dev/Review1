// const express = require("express");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");   // ✅ MISSING
// const jwt = require("jsonwebtoken");  // ✅ MISSING
// const app = express();

// const SECRET = "welcometopothysmart"; 

// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));
// const db = require("./config/db"); // ✅

// app.use("/api/categories", require("./routes/categoryRoute"));
// app.use("/api/subcategories", require("./routes/subcategoryRoute"));
// app.use("/api/products", require("./routes/productRoutes"));
// app.use("/api/dashboard", require("./routes/dashboardRoute"));
// app.use("/api/cart", require("./routes/cartRoutes"));

// app.post("/api/auth/signup", async (req, res) => {
//   const { name, email, password, phone } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const query = `
//       INSERT INTO users (name, email, password, phone) 
//       VALUES (?, ?, ?, ?)
//     `;

//     db.query(query, [name, email, hashedPassword, phone], (err, result) => {
//       if (err) {
//         console.log("DB ERROR:", err);
//         return res.status(500).json({ message: "Database error" });
//       }

//       res.json({
//         message: "User Registered ✅",
//         user_id: result.insertId,
//       });
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ================= LOGIN =================
// app.post("/api/auth/login", (req, res) => {
//   const { email, password } = req.body;

//   const query = "SELECT * FROM users WHERE email=?";

//   db.query(query, [email], async (err, result) => {
//     if (err) return res.status(500).json(err);

//     if (result.length === 0) {
//       return res.status(400).json({ message: "User not found ❌" });
//     }

//     const user = result[0];

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ message: "Wrong password ❌" });
//     }

//     // 🔥 Create Token
//     const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });

//     res.json({
//       message: "Login Success ✅",
//       token,
//       user_id: user.id,
//       name: user.name,
//     });
//   });
// });
// // User:
// app.post("/api/orders", (req, res) => {
//   const { user_id, address, total, payment_method } = req.body;

//   if (!user_id || !address || !total) {
//     return res.status(400).json({ message: "Missing fields ❌" });
//   }

//   // ✅ 1. GET CART ITEMS FIRST
//   db.query(
//     "SELECT * FROM cart WHERE user_id=?",
//     [user_id],
//     (cartErr, cartItems) => {
//       if (cartErr) {
//         console.log(cartErr);
//         return res.status(500).json({ message: "Cart fetch error ❌" });
//       }

//       if (cartItems.length === 0) {
//         return res.status(400).json({ message: "Cart is empty ❌" });
//       }

//       // ✅ 2. CHECK STOCK
//       const productIds = cartItems.map(i => i.product_id);

//       db.query(
//         "SELECT id, stock FROM products WHERE id IN (?)",
//         [productIds],
//         (err, products) => {

//           if (err) {
//             console.log(err);
//             return res.status(500).json({ message: "Stock check error ❌" });
//           }

//           for (let item of cartItems) {
//             const product = products.find(p => p.id === item.product_id);

//             if (!product || product.stock < item.quantity) {
//               return res.status(400).json({
//                 message: `Product out of stock ❌`
//               });
//             }
//           }

//           // ✅ 3. INSERT ORDER
//           const orderQuery = `
//             INSERT INTO orders 
//             (user_id, name, phone, address, city, pincode, total, payment_method)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//           `;

//           db.query(
//             orderQuery,
//             [
//               user_id,
//               address.name,
//               address.phone,
//               address.address,
//               address.city,
//               address.pincode,
//               total,
//               payment_method,
//             ],
//             (err2, result) => {
//               if (err2) {
//                 console.log(err2);
//                 return res.status(500).json({ message: "Order error ❌" });
//               }

//               const orderId = result.insertId;
//               const orderNumber = `POT${orderId}HYS`;

//               // ✅ 4. UPDATE ORDER NUMBER
//               db.query(
//                 "UPDATE orders SET order_number=? WHERE id=?",
//                 [orderNumber, orderId]
//               );

//               // ✅ 5. INSERT ORDER ITEMS
//               const values = cartItems.map((item) => [
//                 orderId,
//                 item.product_id,
//                 item.name,
//                 item.price,
//                 item.quantity,
//                 item.image,
//               ]);

//               db.query(
//                 `INSERT INTO order_items 
//                 (order_id, product_id, name, price, quantity, image)
//                 VALUES ?`,
//                 [values],
//                 (itemsErr) => {
//                   if (itemsErr) {
//                     console.log(itemsErr);
//                   }

//                   // ✅ 6. REDUCE STOCK
//                   cartItems.forEach((item) => {
//                     db.query(
//                       "UPDATE products SET stock = stock - ? WHERE id=?",
//                       [item.quantity, item.product_id]
//                     );
//                   });

//                   // ✅ 7. CLEAR CART
//                   db.query("DELETE FROM cart WHERE user_id=?", [user_id]);

//                   // ✅ FINAL RESPONSE
//                   res.json({
//                     message: "Order placed successfully ✅",
//                     order_id: orderId,
//                     order_number: orderNumber,
//                   });
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// });

// // GET USER DETAILS
// // GET USER DETAILS
// app.get("/api/users/:id", (req, res) => {
//   const { id } = req.params;

//   db.query(
//     "SELECT name, phone, address, city, pincode FROM users WHERE id=?",
//     [id],
//     (err, result) => {
//       if (err) return res.status(500).json(err);

//       if (result.length === 0) {
//         return res.status(404).json({ message: "User not found ❌" });
//       }

//       res.json(result[0]);
//     }
//   );
// });

// // app.put("/:id", (req, res) => {
// //   const { id } = req.params;
// //   const { name, email, phone, address, city, pincode } = req.body;

// //   db.query(
// //     "UPDATE users SET name=?, email=?, phone=?, address=?, city=?, pincode=? WHERE id=?",
// //     [name, email, phone, address, city, pincode, id],
// //     (err) => {
// //       if (err) return res.status(500).json(err);
// //       res.json({ message: "User updated" });
// //     }
// //   );
// // });

// // DELETE user
// app.delete("/api/users/:id", (req, res) => {
//   const { id } = req.params;

//   db.query("DELETE FROM users WHERE id=?", [id], (err) => {
//     if (err) return res.status(500).json(err);

//     res.json({ message: "User deleted successfully ✅" });
//   });
// });


// // UPDATE USER DETAILS
// app.put("/api/users/:id", (req, res) => {
//   const { id } = req.params;
//   const { name, phone, address, city, pincode } = req.body;

//   const query = `
//     UPDATE users 
//     SET name=?, phone=?, address=?, city=?, pincode=? 
//     WHERE id=?
//   `;

//   db.query(query, [name, phone, address, city, pincode, id], (err) => {
//     if (err) return res.status(500).json(err);

//     res.json({ message: "User updated successfully ✅" });
//   });
// });

// app.get("/api/users", (req, res) => {
//   const query = `
//     SELECT id, name, email, phone, address, city, pincode
//     FROM users
//     ORDER BY id DESC
//   `;

//   db.query(query, (err, result) => {
//     if (err) return res.status(500).json({ error: "DB error" });

//     res.json(result);
//   });
// });
// // ================= PLACE ORDER =================
// // ✅ Check stock before placing order
// db.query(
//   "SELECT id, stock FROM products WHERE id IN (?)",
//   [cartItems.map(i => i.product_id)],
//   (err, products) => {

//     for (let item of cartItems) {
//       const product = products.find(p => p.id === item.product_id);

//       if (!product || product.stock < item.quantity) {
//         return res.status(400).json({
//           message: `Product out of stock ❌`
//         });
//       }
//     }

//     // 👉 Continue order creation here
//   }
// );


// app.post("/api/orders", (req, res) => {
//   const { user_id, address, total, payment_method } = req.body;

//   // 5️⃣ Insert Order Items
// if (cartItems.length > 0) {
//   const values = cartItems.map((item) => [
//     orderId,
//     item.product_id,
//     item.name,
//     item.price,
//     item.quantity,
//     item.image,
//   ]);

//   const itemsQuery = `
//     INSERT INTO order_items 
//     (order_id, product_id, name, price, quantity, image)
//     VALUES ?
//   `;

//   db.query(itemsQuery, [values], (itemsErr) => {
//     if (itemsErr) {
//       console.log("ORDER ITEMS ERROR:", itemsErr);
//     }

//     // ✅ 6️⃣ REDUCE STOCK HERE
//     cartItems.forEach((item) => {
//       db.query(
//         "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
//         [item.quantity, item.product_id, item.quantity],
//         (stockErr) => {
//           if (stockErr) {
//             console.log("STOCK UPDATE ERROR:", stockErr);
//           }
//         }
//       );
//     });

//     // 7️⃣ Clear Cart
//     db.query("DELETE FROM cart WHERE user_id=?", [user_id]);

//     res.json({
//       message: "Order placed successfully ✅",
//       order_id: orderId,
//       order_number: orderNumber,
//     });
//   });
// }
// })
// app.get("/api/orders", (req, res) => {
//   const query = `
//     SELECT 
//       o.id,
//       o.user_id,
//       o.name,
//       o.phone,
//       o.address,
//       o.city,
//       o.pincode,
//       o.total,
//       o.status,
//       oi.product_id,
//       p.name AS product_name,
//       oi.quantity
//     FROM orders o
//     LEFT JOIN order_items oi ON o.id = oi.order_id
//     LEFT JOIN products p ON oi.product_id = p.id
//     ORDER BY o.id DESC
//   `;

//   db.query(query, (err, results) => {
//     if (err) return res.status(500).json(err);

//     // group items per order
//     const ordersMap = {};

//     results.forEach(row => {
//       if (!ordersMap[row.id]) {
//         ordersMap[row.id] = {
//           id: row.id,
//           user_id: row.user_id,
//           name: row.name,
//           phone: row.phone,
//           address: row.address,
//           city: row.city,
//           pincode: row.pincode,
//           total: row.total,
//           status: row.status,
//           items: []
//         };
//       }

//       if (row.product_id) {
//         ordersMap[row.id].items.push({
//           product_id: row.product_id,
//           product_name: row.product_name,
//           quantity: row.quantity
//         });
//       }
//     });

//     res.json(Object.values(ordersMap));
//   });
// });

// app.get("/api/orders/:user_id", (req, res) => {
//   const { user_id } = req.params;

//   const orderQuery = `
//     SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
//   `;

//   db.query(orderQuery, [user_id], (err, orders) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ message: "DB error" });
//     }

//     if (orders.length === 0) {
//       return res.json([]);
//     }

//     const orderIds = orders.map(o => o.id);

//     const itemsQuery = `
//       SELECT oi.*, p.name, p.image 
//       FROM order_items oi
//       JOIN products p ON oi.product_id = p.id
//       WHERE oi.order_id IN (?)
//     `;

//     db.query(itemsQuery, [orderIds], (err2, items) => {
//       if (err2) {
//         console.log(err2);
//         return res.status(500).json({ message: "DB error" });
//       }

//       // Map items to orders
//       const result = orders.map(order => {
//         return {
//           ...order,
//           items: items.filter(item => item.order_id === order.id)
//         };
//       });

//       res.json(result);
//     });
//   });
// });


// app.delete("/api/users/:id", (req, res) => {
//   const { id } = req.params;

//   db.query("DELETE FROM users WHERE id=?", [id], (err) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ error: "DB error" });
//     }

//     res.json({ message: "User deleted successfully ✅" });
//   });
// });
// // POST /api/cart/add
// // app.post("/api/cart/add", (req, res) => {
// //   console.log("BODY:", req.body);

// //   const { user_id, product_id } = req.body;

// //   if (!user_id || !product_id) {
// //     return res.status(400).json({ message: "Missing data" });
// //   }

// //   const checkQuery = "SELECT * FROM cart WHERE user_id=? AND product_id=?";

// //   db.query(checkQuery, [user_id, product_id], (err, result) => {
// //     if (err) {
// //       console.log("CHECK ERROR:", err);
// //       return res.status(500).json(err);
// //     }

// //     if (result.length > 0) {
// //       const updateQuery = "UPDATE cart SET quantity = quantity + 1 WHERE user_id=? AND product_id=?";
      
// //       db.query(updateQuery, [user_id, product_id], (err2) => {
// //         if (err2) {
// //           console.log("UPDATE ERROR:", err2);
// //           return res.status(500).json(err2);
// //         }
// //         return res.json({ message: "Quantity updated" });
// //       });

// //     } else {
// //       const insertQuery = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)";
      
// //       db.query(insertQuery, [user_id, product_id], (err3) => {
// //         if (err3) {
// //           console.log("INSERT ERROR:", err3);
// //           return res.status(500).json(err3);
// //         }
// //         return res.json({ message: "Added to cart" });
// //       });
// //     }
// //   });
// // });


// // app.put("/api/cart/increase/:id", (req, res) => {
// //   const { id } = req.params;

// //   db.query(
// //     "UPDATE cart SET quantity = quantity + 1 WHERE id=?",
// //     [id],
// //     (err) => {
// //       if (err) return res.status(500).json(err);
// //       res.json({ message: "Increased" });
// //     }
// //   );
// // });



// // app.put("/api/cart/decrease/:id", (req, res) => {
// //   const { id } = req.params;

// //   db.query(
// //     "UPDATE cart SET quantity = quantity - 1 WHERE id=? AND quantity > 1",
// //     [id],
// //     (err) => {
// //       if (err) return res.status(500).json(err);
// //       res.json({ message: "Decreased" });
// //     }
// //   );
// // });

// // app.delete("/api/cart/:id", (req, res) => {
// //   const { id } = req.params;

// //   db.query("DELETE FROM cart WHERE id=?", [id], (err) => {
// //     if (err) return res.status(500).json(err);
// //     res.json({ message: "Removed" });
// //   });
// // });
// app.put("/api/orders/:id", (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   const query = `UPDATE orders SET status=? WHERE id=?`;

//   db.query(query, [status, id], (err) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: "Status updated" });
//   });
// });

// app.get("/api/users", (req, res) => {
//   const query = `
//     SELECT 
//       id,
//       name,
//       email,
//       phone,
//       address,
//       city,
//       pincode
//     FROM users
//     ORDER BY id DESC
//   `;

//   db.query(query, (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ error: "DB error" });
//     }

//     res.json(result);
//   });
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });


const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const SECRET = "welcometopothysmart";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const db = require("./config/db");

// ROUTES
app.use("/api/categories", require("./routes/categoryRoute"));
app.use("/api/subcategories", require("./routes/subcategoryRoute"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoute"));
app.use("/api/cart", require("./routes/cartRoutes"));

/* ================= AUTH ================= */

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phone],
      (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });

        res.json({
          message: "User Registered ✅",
          user_id: result.insertId,
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password ❌" });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login Success ✅",
      token,
      user_id: user.id,
      name: user.name,
    });
  });
});

/* ================= USERS ================= */

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT name, phone, address, city, pincode FROM users WHERE id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(404).json({ message: "User not found ❌" });

      res.json(result[0]);
    }
  );
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, phone, address, city, pincode } = req.body;

  db.query(
    "UPDATE users SET name=?, phone=?, address=?, city=?, pincode=? WHERE id=?",
    [name, phone, address, city, pincode, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User updated ✅" });
    }
  );
});

app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.delete("/api/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "User deleted ✅" });
  });
});

/* ================= ORDER + STOCK ================= */

app.post("/api/orders", (req, res) => {
  const { user_id, address, total, payment_method } = req.body;

  if (!user_id || !address || !total) {
    return res.status(400).json({ message: "Missing fields ❌" });
  }

  // 1️⃣ GET CART
  db.query(
    "SELECT * FROM cart WHERE user_id=?",
    [user_id],
    (cartErr, cartItems) => {
      if (cartErr) return res.status(500).json({ message: "Cart error" });

      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart empty ❌" });
      }

      // 2️⃣ CHECK STOCK
      const productIds = cartItems.map((i) => i.product_id);

      db.query(
        "SELECT id, stock FROM products WHERE id IN (?)",
        [productIds],
        (err, products) => {
          if (err) return res.status(500).json({ message: "Stock error" });

          for (let item of cartItems) {
            const product = products.find(p => p.id === item.product_id);

            if (!product || product.stock < item.quantity) {
              return res.status(400).json({
                message: "Product out of stock ❌",
              });
            }
          }

          // 3️⃣ CREATE ORDER
          db.query(
            `INSERT INTO orders 
            (user_id, name, phone, address, city, pincode, total, payment_method)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user_id,
              address.name,
              address.phone,
              address.address,
              address.city,
              address.pincode,
              total,
              payment_method,
            ],
            (err2, result) => {
              if (err2) return res.status(500).json({ message: "Order error" });

              const orderId = result.insertId;
              const orderNumber = `POT${orderId}HYS`;

              db.query(
                "UPDATE orders SET order_number=? WHERE id=?",
                [orderNumber, orderId]
              );

              // 4️⃣ INSERT ORDER ITEMS
              const values = cartItems.map((item) => [
                orderId,
                item.product_id,
                item.name,
                item.price,
                item.quantity,
                item.image,
              ]);

              db.query(
                `INSERT INTO order_items 
                (order_id, product_id, name, price, quantity, image)
                VALUES ?`,
                [values],
                (itemsErr) => {
                  if (itemsErr) console.log(itemsErr);

                  // 5️⃣ REDUCE STOCK
                  cartItems.forEach((item) => {
                    db.query(
                      "UPDATE products SET stock = stock - ? WHERE id=?",
                      [item.quantity, item.product_id]
                    );
                  });

                  // 6️⃣ CLEAR CART
                  db.query("DELETE FROM cart WHERE user_id=?", [user_id]);

                  res.json({
                    message: "Order placed successfully ✅",
                    order_id: orderId,
                    order_number: orderNumber,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

app.get("/api/orders", (req, res) => {
  const query = `
    SELECT 
      o.id,
      o.name,
      o.phone,
      o.address,
      o.city,
      o.pincode,
      o.total,
      o.status,
      oi.product_id,
      p.name AS product_name,
      oi.quantity
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    ORDER BY o.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    const ordersMap = {};

    results.forEach(row => {
      if (!ordersMap[row.id]) {
        ordersMap[row.id] = {
          id: row.id,
          name: row.name,
          phone: row.phone,
          address: row.address,
          city: row.city,
          pincode: row.pincode,
          total: row.total,
          status: row.status || "placed",
          items: []
        };
      }

      if (row.product_id) {
        ordersMap[row.id].items.push({
          product_name: row.product_name,
          quantity: row.quantity
        });
      }
    });

    res.json(Object.values(ordersMap));
  });
});

app.get("/api/orders/:user_id", (req, res) => {
  const { user_id } = req.params;

  const orderQuery = `
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `;

  db.query(orderQuery, [user_id], (err, orders) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (orders.length === 0) return res.json([]);

    const orderIds = orders.map(o => o.id);

    const itemsQuery = `
      SELECT oi.*, p.name, p.image 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id IN (?)
    `;

    db.query(itemsQuery, [orderIds], (err2, items) => {
      if (err2) return res.status(500).json({ message: "DB error" });

      const result = orders.map(order => ({
        ...order,
        items: items.filter(i => i.order_id === order.id)
      }));

      res.json(result);
    });
  });
});
// Admin 
// ✅ GET USERS WITH ORDER COUNT
app.get("/api/users-with-orders", (req, res) => {
  const query = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.phone,
      u.address,
      u.city,
      u.pincode,
      COUNT(o.id) AS order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
    ORDER BY u.id DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "DB error" });
    }

    res.json(result);
  });
});

app.post("/api/users-with-orders", (req, res) => {
  const { name, email, phone, address, city, pincode } = req.body;

  const query = `
    INSERT INTO users (name, email, phone, address, city, pincode)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [name, email, phone, address, city, pincode], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "User added successfully ✅" });
  });
});

app.put("/api/users-with-orders/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, city, pincode } = req.body;

  const query = `
    UPDATE users 
    SET name=?, email=?, phone=?, address=?, city=?, pincode=?
    WHERE id=?
  `;

  db.query(
    query,
    [name, email, phone, address, city, pincode, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "User updated successfully ✅" });
    }
  );
});

app.delete("/api/users-with-orders/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "User deleted successfully ✅" });
  });
});



app.post("/api/users-with-orders", (req, res) => {
  const { name, email, phone, address, city, pincode } = req.body;

  // ✅ Validation
  if (!name || !email) {
    return res.status(400).json({ message: "Name & Email required ❌" });
  }

  const query = `
    INSERT INTO users (name, email, phone, address, city, pincode)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, email, phone, address, city, pincode],
    (err, result) => {
      if (err) {
        console.log("INSERT ERROR:", err);
        return res.status(500).json({ message: "DB error ❌" });
      }

      res.json({
        message: "User added successfully ✅",
        user_id: result.insertId,
      });
    }
  );
});
/* ================= START SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});