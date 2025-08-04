import Link from "next/link";
import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Dock from "./components/Dock";

const page = () => {
    return (
        <div className="min-h-screen transition-all duration-500 bg-[#f9f9f9] dark:bg-[#0f172a]">
            <Navbar />
            <Hero />
            <Dock />
        </div>
    );
};

export default page;
