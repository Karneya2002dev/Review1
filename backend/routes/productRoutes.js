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
  const { name, price, category_id, subcategory_id, description } = req.body;
  const image = req.file?.filename;

  db.query(
    `INSERT INTO products 
    (name, price, image, category_id, subcategory_id, description) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [name, price, image, category_id, subcategory_id, description],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const id = result.insertId;
      const code = generateProductCode(id);

      db.query(
        "UPDATE products SET product_code=? WHERE id=?",
        [code, id]
      );

      res.json({ message: "Product Added", code });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, data) => {
    res.json(data);
  });
});


router.put("/:id", upload.single("image"), (req, res) => {
  const { name, price, category_id, subcategory_id, description } = req.body;
  const image = req.file?.filename;

  let query = `UPDATE products SET name=?, price=?, category_id=?, subcategory_id=?, description=?`;
  let values = [name, price, category_id, subcategory_id, description];

  if (image) {
    query += ", image=?";
    values.push(image);
  }

  query += " WHERE id=?";
  values.push(req.params.id);

  db.query(query, values, (err) => {
    if (err) return res.send(err);
    res.send("Updated");
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