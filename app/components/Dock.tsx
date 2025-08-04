"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
    IconBrandFacebook,
    IconBrandGithub,
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
            title: "Follow Me on Facebook",
            icon: (
                <IconBrandFacebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://www.facebook.com/rgrg1234/",
        },
        {
            title: "Follow Me on GitHub",
            icon: (
                <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://www.github.com/rohitghosh1763/",
        },
    ];
    return (
        <div className="fixed bottom-6 right-6 md:bottom-auto md:right-auto md:top-0 md:left-0 md:w-full md:h-[85rem] md:flex md:items-center md:justify-center">
            <FloatingDock
                mobileClassName="translate-y-0" // remove demo offset
                items={links}
            />
        </div>
    );
};

export default Dock;
