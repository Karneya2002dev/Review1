const express = require("express");
const router = express.Router();
const db = require("../config/db");


// ✅ ADD TO CART
router.post("/add", (req, res) => {
  const { user_id, product_id } = req.body;

  const checkQuery = "SELECT * FROM cart WHERE user_id=? AND product_id=?";

  db.query(checkQuery, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      // 🔥 Already exists → increase qty
      db.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE user_id=? AND product_id=?",
        [user_id, product_id],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: "Quantity updated" });
        }
      );
    } else {
      // 🔥 New item
      db.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)",
        [user_id, product_id],
        (err3) => {
          if (err3) return res.status(500).json(err3);
          res.json({ message: "Added to cart" });
        }
      );
    }
  });
});


// ✅ GET USER CART
router.get("/:user_id", (req, res) => {
  const { user_id } = req.params;

  // ✅ FIXED
const query = `
  SELECT 
    cart.id,
    cart.product_id,   -- 🔥 IMPORTANT FIX
    cart.quantity,
    products.name,
    products.price,
    products.image
  FROM cart
  JOIN products ON cart.product_id = products.id
  WHERE cart.user_id = ?
`;

  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// ✅ INCREASE QTY
router.put("/increase/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "UPDATE cart SET quantity = quantity + 1 WHERE id=?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Increased" });
    }
  );
});


// ✅ GET CART COUNT
router.get("/count/:user_id", (req, res) => {
  const { user_id } = req.params;

  const query = "SELECT SUM(quantity) AS total FROM cart WHERE user_id=?";

  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      count: result[0].total || 0,
    });
  });
});

// ✅ DECREASE QTY
router.post("/api/cart/decrease", (req, res) => {
  const { user_id, product_id } = req.body;

  const checkQuery = `
    SELECT quantity FROM cart 
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(checkQuery, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.json({ message: "Item not in cart" });
    }

    const currentQty = result[0].quantity;

    if (currentQty <= 1) {
      // delete item if qty becomes 0
      db.query(
        "DELETE FROM cart WHERE user_id=? AND product_id=?",
        [user_id, product_id],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          return res.json({ message: "Item removed from cart" });
        }
      );
    } else {
      // decrease quantity
      db.query(
        "UPDATE cart SET quantity = quantity - 1 WHERE user_id=? AND product_id=?",
        [user_id, product_id],
        (err3) => {
          if (err3) return res.status(500).json(err3);
          return res.json({ message: "Quantity decreased" });
        }
      );
    }
  });
});


// ✅ REMOVE ITEM
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM cart WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Removed" });
  });
});

module.exports = router;