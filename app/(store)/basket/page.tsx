"use client";

import AddToBasketButton from "@/components/AddToBasketButton";
import Loader from "@/components/loader";
import { imageUrl } from "@/lib/imageUrl";
import useBasketStore from "@/store/store";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function page() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 flex-col items-center justify-center min-h-[50hv]">
        <h1 className="text-2xl font-bold mb-6">Your Basket</h1>
        <p className="text-gray-500 text-lg">Your basket is empty.</p>
      </div>
    );
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  const handelCheckout = async () => {
  if(!isSignedIn){
    return;
  }
  setIsLoading(true)
  try {
    
  } catch (error) {
    console.error(error)
  } finally {
    setIsLoading(false)
  }
  
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Your Basket</h1>
      <div className="flex felx-col lg:flex-row gap-8">
        <div className="flex-grow">
          {groupedItems?.map((item) => (
            <div
              key={item.product._id}
              className="mb-4 p-4 border rounded flex items-center justify-between"
            >
              <div
                className="flex items-center cursor-pointer felx-1 min-w-0"
                onClick={() =>
                  router.push(`/product/${item.product.slug?.current}`)
                }
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shirnk-0 mr-4">
                  {item.product.image && (
                    <Image
                      src={imageUrl(item.product.image).url()}
                      alt={item.product.name ?? "Product Image"}
                      className="w-full h-full object-cover rounded"
                      width={96}
                      height={96}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold sm:text-xl truncate">
                    {item.product.name}
                  </h2>
                  <p className="text-sm sm:text-base">
                    Price : {(item.product.price ?? 0).toFixed(2)} EGP
                  </p>
                  <p className="text-sm sm:text-base">
                    Total :{" "}
                    {((item.product.price ?? 0) * item.quantity).toFixed(2)} EGP
                  </p>
                </div>
              </div>
              <div className="flex items-center ml-4 flex-shrink-0">
                <AddToBasketButton product={item.product} />
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 lg:top-4 h-fit lg:sticky bg-white p-6 border rounded lg:oreder-first fixed  bottom-0 left-0 lg:left-auto ">
          <h3 className="text-xl font-semibold">Order Summary :</h3>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between">
              <span>Items:</span>
              <span>
                {groupedItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </p>
            <p className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                {useBasketStore.getState().getTotalPrice().toFixed(2)} EGP
              </span>
            </p>
          </div>
          {isSignedIn ? (
            <button
              onClick={handelCheckout}
              disabled={isLoading}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-600"
            >
              {isLoading ? "Loading..." : "Checkout"}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Sign in to Checkout
              </button>
            </SignInButton>
          )}
        </div>
        <div className="h-64 lg:h-0"></div>
      </div>
    </div>
  );
}

export default page;
