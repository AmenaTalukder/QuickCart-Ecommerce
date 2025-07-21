"use client";
import React, { useState, useRef, useEffect } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router } = useAppContext();
  const { openSignIn, signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleAccountClick = () => {
    if (isSignedIn) {
      setShowDropdown(!showDropdown);
    } else {
      openSignIn();
    }
  };

  const handleSignOut = () => {
    signOut();
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleAccountClick}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            {isSignedIn ? (
              <span>Hi, {user?.firstName || "User"}</span>
            ) : (
              "Account"
            )}
          </button>

          {isSignedIn && showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-2">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    router.push("/orders");
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Orders
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleAccountClick}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            {isSignedIn ? (
              <span>Hi, {user?.firstName || "User"}</span>
            ) : (
              "Account"
            )}
          </button>

          {isSignedIn && showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-2">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    router.push("/orders");
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Orders
                </button>
                <hr className="my-1" />
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
