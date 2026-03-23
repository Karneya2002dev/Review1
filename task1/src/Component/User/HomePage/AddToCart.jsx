import React from "react";
import { useCart } from "../../User/HomePage/UseCart";

const AddToCartButton = ({ productId }) => {
  const { cartQty, addToCart, increaseQty, decreaseQty } = useCart();

  return (
    <>
      {cartQty[productId] ? (
        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2 mt-3">
          <button
            onClick={() => decreaseQty(productId)}
            className="px-3 py-1 bg-white rounded shadow"
          >
            -
          </button>

          <span className="font-bold">{cartQty[productId]}</span>

          <button
            onClick={() => increaseQty(productId)}
            className="px-3 py-1 bg-white rounded shadow"
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={() => addToCart(productId)}
          className="bg-[#019147] hover:bg-green-700 text-white w-full py-2 mt-3 rounded-lg transition"
        >
          Add to Cart
        </button>
      )}
    </>
  );
};

export default AddToCartButton;