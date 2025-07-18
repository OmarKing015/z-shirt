"use client";

import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import React from "react";
import { PackageIcon, ShoppingBasketIcon } from "lucide-react";

function Header() {
  const { user } = useUser();
  console.log(user);

  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-2">
      <div className="flex mx-auto items-center w-full flex-wrap justify-between mb-2 sm:mb-0">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
        >
          Tafreed
        </Link>
      </div>

        <Form
          action="/search"
          className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            placeholder="Search for products"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:ing-blue-500 focus:ring-opacity-50 border w-full max-w-4xl"
            name="query"
          />
        </Form>

      <div className="flex items-center space-x-4 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-start">
          <Link
 className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            href="/basket"
          >
            <span>My Basket</span>
            <ShoppingBasketIcon className="w-4 h-4" />
          </Link>

        <ClerkLoaded>
          <SignedIn>
            <Link
 className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              href="/orders"
            >

              <span>My Orders</span> <PackageIcon className="w-4 h-4" />
            </Link>
          </SignedIn>
          {user ? (
            <div className="flex items-center space-x-2">
              <UserButton />
              <div className="hidden sm:block text-xs">
                <p className="text-gray-400">welcome Back</p>
                <p className="font-bold">{user.fullName}!</p>
              </div>
            </div>
          ) : (
            <SignInButton mode="modal" />
          )}
        </ClerkLoaded>
      </div>
    </header>
  );
}

export default Header;
