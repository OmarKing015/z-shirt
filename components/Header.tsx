"use client";

import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
  Protect,
} from "@clerk/nextjs";
import Link from "next/link";
import {
  PackageIcon,
  ShoppingBasketIcon,
  Search,
  Menu,
  X,
  PenToolIcon,
  SlidersHorizontal,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import useBasketStore from "@/store/store";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <header className="border-b sticky top-0 z-50 bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          Tafreed
        </Link>

        <div className="hidden lg:flex items-center space-x-4">
          <form action="/search" className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search for products..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
              name="query"
            />
          </form>

          <Button asChild variant="default">
            <Link href="/basket" className="relative">
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <ShoppingBasketIcon className="w-4 h-4 mr-2" /> Basket
            </Link>
          </Button>

          <Button asChild variant="secondary">
            <Link href="/customize">Customize</Link>
          </Button>

          <Button asChild variant="secondary">
            <Link href="/designControl">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Design Control
            </Link>
          </Button>

          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="destructive">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Admin
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/studio">Sanity Studio</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/designControl">Custom Design</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ClerkLoaded>
            <SignedIn>
              <Link
                href="/orders"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                <PackageIcon className="w-4 h-4 inline mr-1" /> Orders
              </Link>
            </SignedIn>

            {user ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
            )}
          </ClerkLoaded>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t py-4 px-4 space-y-3">
          <form action="/search" className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-md"
              name="query"
            />
          </form>

          <Link href="/basket" className="flex items-center space-x-2">
            <ShoppingBasketIcon className="w-4 h-4" />
            <span>Basket ({itemCount})</span>
          </Link>
          <Link href="/customize" className="block">Customize</Link>
          <Link href="/designControl" className="block">Design Control</Link>

          {isAdmin && (
            <Protect>
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500">Admin</p>
                <Link href="/studio" className="block">Sanity Studio</Link>
                <Link href="/designControl" className="block">Custom Design</Link>
              </div>
            </Protect>
          )}
        </div>
      )}
    </header>
  );
}
