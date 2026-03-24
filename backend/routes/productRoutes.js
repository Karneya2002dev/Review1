const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const { generateProductCode } = require("../utils/generateCode");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ADD PRODUCT
router.post("/", upload.single("image"), (req, res) => {
  const {
    name,
    price,
    category_id,
    subcategory_id,
    description,
    stock // ✅ added
  } = req.body;

  const image = req.file?.filename;

  db.query(
    `INSERT INTO products 
    (name, price, image, category_id, subcategory_id, description, stock) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, price, image, category_id, subcategory_id, description, stock],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const id = result.insertId;
      const code = generateProductCode(id);

      db.query(
        "UPDATE products SET product_code=? WHERE id=?",
        [code, id],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({ message: "Product Added", code });
        }
      );
    }
  );
});


// ✅ GET PRODUCTS (WITH CATEGORY FILTER)
router.get("/", (req, res) => {
  const { category, subcategory, min, max } = req.query;

  let query = "SELECT * FROM products WHERE 1=1";
  let values = [];

  // ✅ CATEGORY FILTER
  if (category) {
    query += " AND category_id = ?";
    values.push(Number(category));
  }

  // ✅ SUBCATEGORY FILTER
  if (subcategory) {
    query += " AND subcategory_id = ?";
    values.push(Number(subcategory));
  }

  // ✅ PRICE FILTER
  if (min && max) {
    query += " AND price BETWEEN ? AND ?";
    values.push(Number(min), Number(max));
  }

  db.query(query, values, (err, data) => {
    if (err) {
      console.log("PRODUCT FETCH ERROR:", err);
      return res.status(500).json(err);
    }

    res.json(data);
  });
});
router.put("/:id", upload.single("image"), (req, res) => {
  const { 
    name, 
    price, 
    category_id, 
    subcategory_id, 
    description,
    stock // ✅ ADD THIS
  } = req.body;

  const image = req.file?.filename;

  let query = `
    UPDATE products 
    SET name=?, price=?, category_id=?, subcategory_id=?, description=?, stock=?
  `;

  let values = [
    name,
    price,
    category_id,
    subcategory_id,
    description,
    stock // ✅ ADD THIS
  ];

  // If image uploaded
  if (image) {
    query += ", image=?";
    values.push(image);
  }

  query += " WHERE id=?";
  values.push(req.params.id);

  db.query(query, values, (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Product Updated ✅" });
  });
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err) => {
    if (err) return res.send(err);
    res.send("Deleted");
  });
});
// FILTER PRODUCTS (Category / Subcategory / Price)
router.get("/filter", (req, res) => {
  const { category, subcategory, min, max } = req.query;

  let query = "SELECT * FROM products WHERE 1=1";
  let values = [];

  if (category) {
    query += " AND category_id = ?";
    values.push(category);
  }

  if (subcategory) {
    query += " AND subcategory_id = ?";
    values.push(subcategory);
  }

  if (min && max) {
    query += " AND price BETWEEN ? AND ?";
    values.push(min, max);
  }

  db.query(query, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(data);
  });
});


module.exports = router;