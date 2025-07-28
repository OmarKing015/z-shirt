"use client"

import { ClerkLoaded, SignedIn, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link";
import Form from "next/form"
import { PackageIcon, ShoppingBasketIcon, Search, Menu, X, PenIcon, PenToolIcon } from "lucide-react"
import useBasketStore from "@/store/store"
import { useState } from "react"

function Header() {
  const { user } = useUser()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const itemCount = useBasketStore((state) => state.items.reduce((total, item) => total + item.quantity, 0))

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Tafreed
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <Form action="/search" className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  name="query"
                />
              </div>
            </Form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Basket */}
            <Link
              href="/basket"
              className="relative flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
              <ShoppingBasketIcon className="w-4 h-4" />
              <span>Basket</span>
            </Link>

            {/* Customize */}
            <Link
              href="/customize"
              className="relative flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <span>Customize</span>
            </Link>
            {/* Orders (Signed In Only) */}
            <ClerkLoaded>
              <SignedIn>
                <Link
                  href="/orders"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <PackageIcon className="w-4 h-4" />
                  <span>Orders</span>
                </Link>
              </SignedIn>

              {/* User Section */}
              {user ? (
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Welcome back</p>
                    <p className="font-semibold text-gray-900">{user.fullName}!</p>
                  </div>
                  <UserButton />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
              )}
            </ClerkLoaded>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
            Tafreed
          </Link>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-3">
            {/* Basket */}
            <Link
              href="/basket"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
              <ShoppingBasketIcon className="w-5 h-5" />
            </Link>

            {/* Customize */}
            <Link
              href="/customize"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <PenToolIcon/>
              <span>Customize</span>
            </Link>
            {/* User Button */}
            <ClerkLoaded>
              {user ? (
                <UserButton />
              ) : (
                <SignInButton mode="modal">
                  <button className="text-blue-600 hover:text-blue-700 font-medium">Sign In</button>
                </SignInButton>
              )}
            </ClerkLoaded>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <Form action="/search" className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                name="query"
              />
            </div>
          </Form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {/* Customize Link in Mobile Menu */}
              <Link
                href="/customize"
                className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">Customize</span>
              </Link>
              <ClerkLoaded>
                <SignedIn>
                  <Link
                    href="/orders"
                    className="flex items-center space-x-3 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <PackageIcon className="w-5 h-5" />
                    <span className="font-medium">My Orders</span>
                  </Link>
                </SignedIn>
              </ClerkLoaded>

              {user && (
                <div className="py-3 px-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="font-semibold text-gray-900">{user.fullName}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
