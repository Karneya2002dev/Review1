const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");   // ✅ MISSING
const jwt = require("jsonwebtoken");  // ✅ MISSING
const app = express();

const SECRET = "welcometopothysmart"; 

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const db = require("./config/db"); // ✅

app.use("/api/categories", require("./routes/categoryRoute"));
app.use("/api/subcategories", require("./routes/subcategoryRoute"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoute"));
app.use("/api/cart", require("./routes/cartRoutes"));

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password, phone) 
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [name, email, hashedPassword, phone], (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        message: "User Registered ✅",
        user_id: result.insertId,
      });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email=?";

  db.query(query, [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password ❌" });
    }

    // 🔥 Create Token
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login Success ✅",
      token,
      user_id: user.id,
      name: user.name,
    });
  });
});

// GET USER DETAILS
// GET USER DETAILS
app.get("/api/user/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT name, phone, address, city, pincode FROM users WHERE id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found ❌" });
      }

      res.json(result[0]);
    }
  );
});

// UPDATE USER DETAILS
app.put("/api/user/:id", (req, res) => {
  const { id } = req.params;
  const { name, phone, address, city, pincode } = req.body;

  const query = `
    UPDATE users 
    SET name=?, phone=?, address=?, city=?, pincode=? 
    WHERE id=?
  `;

  db.query(
    query,
    [name, phone, address, city, pincode, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "User updated successfully ✅" });
    }
  );
});

// ================= PLACE ORDER =================
app.post("/api/orders", (req, res) => {
  const { user_id, address, total, payment_method } = req.body;

  if (!user_id || !address || !total) {
    return res.status(400).json({ message: "Missing fields ❌" });
  }

  // 1️⃣ Insert Order
  const orderQuery = `
    INSERT INTO orders 
    (user_id, name, phone, address, city, pincode, total, payment_method)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    orderQuery,
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
    (err, result) => {
      if (err) {
        console.log("ORDER ERROR:", err);
        return res.status(500).json({ message: "DB error ❌" });
      }

      const orderId = result.insertId;

      // 2️⃣ Generate Order Number
      const orderNumber = `POT${orderId}HYS`;

      // 3️⃣ Update Order Number
      db.query(
        "UPDATE orders SET order_number=? WHERE id=?",
        [orderNumber, orderId],
        (updateErr) => {
          if (updateErr) {
            console.log("ORDER NUMBER ERROR:", updateErr);
          }

          // 4️⃣ Get Cart Items
          db.query(
            "SELECT * FROM cart WHERE user_id=?",
            [user_id],
            (cartErr, cartItems) => {
              if (cartErr) {
                console.log("CART FETCH ERROR:", cartErr);
              }

              // 5️⃣ Insert Order Items
              if (cartItems.length > 0) {
                const values = cartItems.map((item) => [
                  orderId,
                  item.product_id,
                  item.name,
                  item.price,
                  item.quantity,
                  item.image,
                ]);

                const itemsQuery = `
                  INSERT INTO order_items 
                  (order_id, product_id, name, price, quantity, image)
                  VALUES ?
                `;

                db.query(itemsQuery, [values], (itemsErr) => {
                  if (itemsErr) {
                    console.log("ORDER ITEMS ERROR:", itemsErr);
                  }

                  // 6️⃣ Clear Cart
                  db.query("DELETE FROM cart WHERE user_id=?", [user_id]);

                  // 7️⃣ Final Response
                  res.json({
                    message: "Order placed successfully ✅",
                    order_id: orderId,
                    order_number: orderNumber,
                  });
                });
              } else {
                // If cart empty
                res.json({
                  message: "Order placed (no items?)",
                  order_id: orderId,
                  order_number: orderNumber,
                });
              }
            }
          );
        }
      );
    }
  );
});

app.get("/api/orders/:user_id", (req, res) => {
  const { user_id } = req.params;

  const orderQuery = `
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `;

  db.query(orderQuery, [user_id], (err, orders) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB error" });
    }

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderIds = orders.map(o => o.id);

    const itemsQuery = `
      SELECT oi.*, p.name, p.image 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id IN (?)
    `;

    db.query(itemsQuery, [orderIds], (err2, items) => {
      if (err2) {
        console.log(err2);
        return res.status(500).json({ message: "DB error" });
      }

      // Map items to orders
      const result = orders.map(order => {
        return {
          ...order,
          items: items.filter(item => item.order_id === order.id)
        };
      });

      res.json(result);
    });
  });
});

// POST /api/cart/add
// app.post("/api/cart/add", (req, res) => {
//   console.log("BODY:", req.body);

//   const { user_id, product_id } = req.body;

//   if (!user_id || !product_id) {
//     return res.status(400).json({ message: "Missing data" });
//   }

//   const checkQuery = "SELECT * FROM cart WHERE user_id=? AND product_id=?";

//   db.query(checkQuery, [user_id, product_id], (err, result) => {
//     if (err) {
//       console.log("CHECK ERROR:", err);
//       return res.status(500).json(err);
//     }

//     if (result.length > 0) {
//       const updateQuery = "UPDATE cart SET quantity = quantity + 1 WHERE user_id=? AND product_id=?";
      
//       db.query(updateQuery, [user_id, product_id], (err2) => {
//         if (err2) {
//           console.log("UPDATE ERROR:", err2);
//           return res.status(500).json(err2);
//         }
//         return res.json({ message: "Quantity updated" });
//       });

//     } else {
//       const insertQuery = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)";
      
//       db.query(insertQuery, [user_id, product_id], (err3) => {
//         if (err3) {
//           console.log("INSERT ERROR:", err3);
//           return res.status(500).json(err3);
//         }
//         return res.json({ message: "Added to cart" });
//       });
//     }
//   });
// });


// app.put("/api/cart/increase/:id", (req, res) => {
//   const { id } = req.params;

//   db.query(
//     "UPDATE cart SET quantity = quantity + 1 WHERE id=?",
//     [id],
//     (err) => {
//       if (err) return res.status(500).json(err);
//       res.json({ message: "Increased" });
//     }
//   );
// });



// app.put("/api/cart/decrease/:id", (req, res) => {
//   const { id } = req.params;

//   db.query(
//     "UPDATE cart SET quantity = quantity - 1 WHERE id=? AND quantity > 1",
//     [id],
//     (err) => {
//       if (err) return res.status(500).json(err);
//       res.json({ message: "Decreased" });
//     }
//   );
// });

// app.delete("/api/cart/:id", (req, res) => {
//   const { id } = req.params;

//   db.query("DELETE FROM cart WHERE id=?", [id], (err) => {
//     if (err) return res.status(500).json(err);
//     res.json({ message: "Removed" });
//   });
// });


app.listen(5000, () => {
  console.log("Server running on port 5000");
});