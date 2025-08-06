import Link from "next/link";
import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Dock from "./components/Dock";
import { SidebarDemo } from "./components/SidebarDemo";

const page = () => {
    return (
        <SidebarDemo>
            <div className="min-h-screen transition-all duration-500 bg-[#f9f9f9] dark:bg-[#0f172a]">
                <Navbar />
                <Hero />
                <Dock />
            </div>
        </SidebarDemo>
    );
};

export default page;
