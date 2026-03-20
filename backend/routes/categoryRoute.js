const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const { generateCategoryCode } = require("../utils/generateCode");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ADD CATEGORY
router.post("/", upload.single("image"), (req, res) => {
  const { name } = req.body;
  const image = req.file?.filename;

  db.query(
    "INSERT INTO categories (name, image) VALUES (?, ?)",
    [name, image],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const id = result.insertId;
      const code = generateCategoryCode(id);

      db.query(
        "UPDATE categories SET category_code=? WHERE id=?",
        [code, id]
      );

      res.json({ message: "Category Added", code });
    }
  );
});

// GET
router.get("/", (req, res) => {
  db.query("SELECT * FROM categories", (err, data) => {
    res.json(data);
  });
});


router.put("/:id", upload.single("image"), (req, res) => {
  const { name } = req.body;
  const image = req.file?.filename;

  let query = "UPDATE categories SET name=?";
  let values = [name];

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
  db.query("DELETE FROM categories WHERE id=?", [req.params.id], (err) => {
    if (err) return res.send(err);
    res.send("Deleted");
  });
});



module.exports = router;

