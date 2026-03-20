const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/categories", require("./routes/categoryRoute"));
app.use("/api/subcategories", require("./routes/subcategoryRoute"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoute"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});