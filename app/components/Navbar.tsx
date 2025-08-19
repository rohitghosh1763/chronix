"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButton } from "./AuthButton";
import { useAuth } from "@/contexts/AuthContext";
import { sign } from "crypto";

const Navbar = () => {
    const { user, signInWithGoogle } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-4"
            style={{
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                isolation: "isolate",
            }}
        >
            <nav className="max-w-7xl mx-auto bg-[#ffffff]/95 dark:bg-[#1e293b]/95 backdrop-blur-lg border border-[#e0e0e0] dark:border-[#334155] rounded-xl px-4 sm:px-6 py-3 shadow-xl shadow-black/5 dark:shadow-black/20">
                <div className="flex items-center justify-between">
                    {/* Left Navigation Links - Desktop */}
                    <div className="hidden lg:flex items-center space-x-6 flex-shrink-0">
                        <Link
                            href="/"
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                        >
                            Home
                        </Link>
                        <Link
                            href="/routes/features"
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                        >
                            Features
                        </Link>
                        <Link
                            href="/routes/about"
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                        >
                            About
                        </Link>
                    </div>

                    {/* Mobile Left Spacer - maintains layout */}
                    <div className="lg:hidden w-8 flex-shrink-0"></div>

                    {/* Logo - Stable fixed positioning */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link
                            href="/"
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] text-lg sm:text-xl font-bold tracking-wide font-poppins whitespace-nowrap hover:opacity-80 transition-opacity"
                        >
                            CHRONIX
                        </Link>
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
                        <ThemeToggle />
                        <AuthButton />
                        {user ? (
                            <Link href={"/routes/punch"}>
                                <button className="bg-[#2563eb] dark:bg-[#3b82f6] hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] focus:bg-[#1d4ed8] dark:focus:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 hover:translate-y-[-1px] whitespace-nowrap">
                                    Track Time
                                </button>
                            </Link>
                        ) : (
                            <button
                                onClick={signInWithGoogle}
                                className="bg-[#2563eb] dark:bg-[#3b82f6] hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] focus:bg-[#1d4ed8] dark:focus:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 hover:translate-y-[-1px] whitespace-nowrap"
                            >
                                Get started
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu - Theme Toggle and Hamburger */}
                    <div className="lg:hidden flex items-center space-x-3 flex-shrink-0">
                        <ThemeToggle />
                        {/* Mobile hamburger menu button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 transition-all duration-200 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                            aria-label="Toggle mobile menu"
                        >
                            <svg
                                className={`h-5 w-5 transition-all duration-300 ${
                                    isMobileMenuOpen ? "rotate-180" : ""
                                }`}
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <div
                    className={`lg:hidden transition-all duration-500 ease-out overflow-hidden ${
                        isMobileMenuOpen
                            ? "max-h-[400px] opacity-100 mt-6 mb-2"
                            : "max-h-0 opacity-0 mt-0"
                    }`}
                >
                    <div className="bg-[#ffffff] dark:bg-[#1e293b] rounded-2xl border border-[#e0e0e0] dark:border-[#334155] shadow-xl shadow-black/5 dark:shadow-black/20 p-4">
                        <div className="flex flex-col space-y-1">
                            <Link
                                href="/"
                                className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-xl px-4 py-3 text-center hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/features"
                                className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-xl px-4 py-3 text-center hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="/about"
                                className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-xl px-4 py-3 text-center hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>

                            <div className="border-t border-[#e0e0e0] dark:border-[#334155] my-3"></div>

                            <AuthButton />
                            <button
                                className="w-full bg-[#2563eb] dark:bg-[#3b82f6] hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] focus:bg-[#1d4ed8] dark:focus:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Track Time
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
