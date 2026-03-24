import React from "react";

const ProductCard = ({
  product,
  cartQty,
  addToCart,
  increaseQty,
  decreaseQty
}) => {
  if (!product) return null;

  const qty = cartQty[product.id] || 0;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">

      {/* IMAGE */}
      <div className="h-36 flex justify-center items-center mb-3">
        <img
          src={
            product.image
              ? `http://localhost:5000/uploads/${product.image}`
              : "https://via.placeholder.com/100"
          }
          alt={product.name}
          className="h-full object-contain"
        />
      </div>

      {/* NAME */}
      <h3 className="text-sm font-semibold text-gray-800">
        {product.name}
      </h3>

      {/* PRICE */}
      <div className="mt-2">
        <span className="text-green-600 font-bold">
          ₹{product.price}
        </span>
      </div>

      {/* 🔥 CART BUTTON */}
      {product.stock === 0 ? (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-600 py-2 rounded mt-3"
        >
          Out of Stock
        </button>
      ) : qty > 0 ? (
        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1.5 mt-3">

          {/* DECREASE */}
          <button
            onClick={() => decreaseQty(product.id)}
            className="w-8 h-8 bg-white rounded shadow hover:bg-gray-200"
          >
            -
          </button>

          <span className="font-bold">{qty}</span>

          {/* INCREASE */}
          <button
            onClick={() => increaseQty(product.id, product.stock)}
            className="w-8 h-8 bg-white rounded shadow hover:bg-gray-200"
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={() => addToCart(product.id, product.stock)}
          className="w-full bg-green-600 text-white py-2 rounded mt-3 hover:bg-green-700"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;