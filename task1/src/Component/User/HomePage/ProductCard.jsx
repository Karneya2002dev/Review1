import React from "react";

const ProductCard = ({ product }) => {
  // 🛡️ Prevent crash if product is undefined
  if (!product) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border relative">

      {/* Discount Badge */}
      {product?.discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
          {product.discount}% OFF
        </span>
      )}

      {/* Image */}
      <div className="h-37.5 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        <img
          src={product?.image || "data:image/png;base64,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"}
          alt={product?.name || "product"}
          className="h-full object-contain"
        />
      </div>

      {/* Name */}
      <h3 className="font-medium text-gray-800">
        {product?.name || "No Name"}
      </h3>

      {/* Variants */}
      <select className="w-full border rounded-md p-2 mt-2 text-sm">
        {product?.variants?.length > 0 ? (
          product.variants.map((v, i) => (
            <option key={i}>{v}</option>
          ))
        ) : (
          <option>500g</option> // fallback
        )}
      </select>

      {/* Price */}
      <div className="mt-2">
        {product?.originalPrice && (
          <span className="line-through text-gray-400 mr-2">
            ₹{product.originalPrice}
          </span>
        )}
        <span className="text-red-600 font-semibold">
          ₹{product?.price || 0}
        </span>
      </div>

      {/* Button */}
      <button className="w-full bg-green-600 text-white py-2 rounded-md mt-3 hover:bg-green-700">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;