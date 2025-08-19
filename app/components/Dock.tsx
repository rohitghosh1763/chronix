"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandX,
    IconExchange,
    IconHome,
    IconNewSection,
    IconTerminal2,
} from "@tabler/icons-react";
const Dock = () => {
    const links = [
        {
            title: "Home",
            icon: (
                <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/",
        },

        {
            title: "Follow me on Facebook",
            icon: (
                <IconBrandFacebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://www.facebook.com/rgrg1234/",
        },
        {
            title: "Follow me on Instagram",
            icon: (
                <IconBrandInstagram className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://www.instagram.com/rohitghosh12/",
        },
        {
            title: "Follow me on GitHub",
            icon: (
                <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://www.github.com/rohitghosh1763/",
        },
    ];
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <FloatingDock items={links} />
        </div>
    );
};

export default Dock;
