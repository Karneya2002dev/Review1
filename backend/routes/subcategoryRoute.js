const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { generateSubcategoryCode } = require("../utils/generateCode");

router.post("/", (req, res) => {
  const { name, category_id } = req.body;

  db.query(
    "INSERT INTO subcategories (name, category_id) VALUES (?, ?)",
    [name, category_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const id = result.insertId;
      const code = generateSubcategoryCode(id);

      db.query(
        "UPDATE subcategories SET subcategory_code=? WHERE id=?",
        [code, id]
      );

      res.json({ message: "Subcategory Added", code });
    }
  );
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM subcategories", (err, data) => {
    res.json(data);
  });
});



router.put("/:id", (req, res) => {
  const { name, category_id } = req.body;

  db.query(
    "UPDATE subcategories SET name=?, category_id=? WHERE id=?",
    [name, category_id, req.params.id],
    (err) => {
      if (err) return res.send(err);
      res.send("Updated");
    }
  );
});



router.delete("/:id", (req, res) => {
  db.query("DELETE FROM subcategories WHERE id=?", [req.params.id], (err) => {
    if (err) return res.send(err);
    res.send("Deleted");
  });
});


module.exports = router;