"use client";
import { Product } from "@/sanity.types";
import useBasketStore from "@/store/store";
import React, { useEffect, useState } from "react";

interface AddToBasketButtonProps {
  product: Product;
  disabled?: boolean;
}

function AddToBasketButton({ product, disabled }: AddToBasketButtonProps) {
  const { addItem, removeItem, getItemCount } = useBasketStore();
  const itemCount = getItemCount(product._id);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        disabled={itemCount === 0 || disabled}
        onClick={() => removeItem(product._id)}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          itemCount === 0
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300 "
        }`}
      >
        <span
          className={`text-xl font-bold ${itemCount === 0 ? "text-gray-400" : "text-gray-700"}`}
        >
          {" "}
          -{" "}
        </span>
      </button>

      <span className="w-8 text-center font-semibold">{itemCount}</span>
      <button
        onClick={() => addItem(product)}
        disabled={
          disabled ||
          (product?.stock !== undefined && itemCount >= product.stock)
        }
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
          disabled ||
          (product?.stock !== undefined && itemCount >= product.stock)
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        <span className={`text-xl mx-auto font-bold text-white`}> + </span>
      </button>
    </div>
  );
}

export default AddToBasketButton;
