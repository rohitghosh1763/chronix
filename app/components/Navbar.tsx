"use client";

import React, { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-4">
            <nav className="max-w-7xl mx-auto bg-[#ffffff]/95 dark:bg-[#1e293b]/95 backdrop-blur-lg border border-[#e0e0e0] dark:border-[#334155] rounded-xl px-4 sm:px-6 py-3 shadow-xl shadow-black/5 dark:shadow-black/20">
                <div className="flex items-center justify-between">
                    {/* Left Navigation Links - Desktop */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <a
                            href="#"
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                        >
                            What's Included
                        </a>
                        <a
                            href="#"
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                        >
                            Stories
                        </a>
                        <a
                            href="#"
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                        >
                            Our Why
                        </a>
                        <a
                            href="#"
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                        >
                            FAQs
                        </a>
                    </div>

                    {/* Logo - Responsive positioning */}
                    <div className="flex-1 flex justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-8 md:relative md:left-5">
                        <h1 className="text-[#2e2e2e] dark:text-[#f3f4f6] text-lg sm:text-xl font-bold tracking-wide font-poppins">
                            CHRONIX
                        </h1>
                    </div>

                    {/* Right Side - Desktop */}
                    <div className="hidden lg:flex items-center space-x-3">
                        <ThemeToggle />
                        <a
                            href="#"
                            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                        >
                            Login
                        </a>
                        <button className="bg-[#2563eb] dark:bg-[#3b82f6] hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] focus:bg-[#1d4ed8] dark:focus:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 hover:translate-y-[-1px]">
                            Start Testing
                        </button>
                    </div>

                    {/* Mobile Menu - Theme Toggle and Hamburger */}
                    <div className="lg:hidden flex items-center space-x-3">
                        <ThemeToggle />
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
                            <a
                                href="#"
                                className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-xl px-4 py-3 text-center hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                What's Included
                            </a>
                            <a
                                href="#"
                                className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-xl px-4 py-3 text-center hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Stories
                            </a>
                            <a
                                href="#"
                                className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-xl px-4 py-3 text-center hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Our Why
                            </a>
                            <a
                                href="#"
                                className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-xl px-4 py-3 text-center hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                FAQs
                            </a>

                            <div className="border-t border-[#e0e0e0] dark:border-[#334155] my-3"></div>

                            <a
                                href="#"
                                className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-xl px-4 py-3 text-center hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </a>
                            <button
                                className="bg-[#2563eb] dark:bg-[#3b82f6] hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb] focus:bg-[#1d4ed8] dark:focus:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Start Testing
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
