import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#eef6f2] py-10 px-6">

      {/* Title */}
      <h2 className="text-3xl font-semibold text-center mb-8">
        Best Selling Products
      </h2>

      {/* Product Row */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">

        {products.map((item) => (
          <div
            key={item.id}
            className="min-w-60 bg-white rounded-2xl shadow-sm border hover:shadow-md transition p-4"
          >

            {/* Image */}
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.name}
              className="h-40 mx-auto object-contain"
            />

            {/* Name */}
            <h3 className="font-medium mt-4 text-gray-800">
              {item.name}
            </h3>

            {/* Price */}
            <div className="mt-2">
              <span className="text-[#019147] font-bold text-lg">
                ₹{item.price}
              </span>
            </div>

            {/* Button */}
            <button className="bg-[#019147] hover:bg-green-700 text-white w-full py-2 mt-4 rounded-lg transition">
              Add to Cart
            </button>

          </div>
        ))}

      </div>

      {/* Show All */}
      <div className="text-center mt-8">
        <button className="bg-[#019147] hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">
          Show All →
        </button>
      </div>

    </div>
  );
};

export default ProductSlider;