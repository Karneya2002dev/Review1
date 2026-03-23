const express = require("express");
const router = express.Router();
const db = require("../config/db");


// ✅ 1. TOTAL COUNTS API (Categories, Subcategories, Products, Users, Orders)
router.get("/counts", (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM categories) AS totalCategories,
      (SELECT COUNT(*) FROM subcategories) AS totalSubcategories,
      (SELECT COUNT(*) FROM products) AS totalProducts,
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM orders) AS totalOrders
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});


// ✅ 2. CATEGORY-WISE PRODUCT COUNT (PIE CHART)
router.get("/category-stats", (req, res) => {
  const query = `
    SELECT c.name AS category, COUNT(p.id) AS total
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// ✅ 3. MONTHLY PRODUCT CREATION (BAR CHART)
router.get("/monthly-products", (req, res) => {
  const query = `
    SELECT 
      MONTH(created_at) AS month,
      COUNT(*) AS total
    FROM products
    GROUP BY MONTH(created_at)
    ORDER BY month
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// ✅ 4. REVENUE ANALYTICS
router.get("/revenue", (req, res) => {
  const query = `
    SELECT 
      SUM(price) AS totalRevenue,
      AVG(price) AS avgPrice,
      MAX(price) AS highestPrice,
      MIN(price) AS lowestPrice
    FROM products
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});


// ✅ 5. RECENT PRODUCTS
router.get("/recent-products", (req, res) => {
  const query = `
    SELECT * FROM products 
    ORDER BY id DESC 
    LIMIT 5
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// ✅ 6. USERS COUNT API (Standalone)
router.get("/users-count", (req, res) => {
  const query = `SELECT COUNT(*) AS totalUsers FROM users`;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});


// ✅ 7. ORDERS COUNT API (Standalone)
router.get("/orders-count", (req, res) => {
  const query = `SELECT COUNT(*) AS totalOrders FROM orders`;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
});


// ✅ 8. ORDERS BY STATUS (PIE CHART)
router.get("/orders-by-status", (req, res) => {
  const query = `
    SELECT status, COUNT(*) AS total
    FROM orders
    GROUP BY status
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// ✅ 9. MONTHLY USERS GROWTH
router.get("/monthly-users", (req, res) => {
  const query = `
    SELECT 
      MONTH(created_at) AS month,
      COUNT(*) AS total
    FROM users
    GROUP BY MONTH(created_at)
    ORDER BY month
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


module.exports = router;