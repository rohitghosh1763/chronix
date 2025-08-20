"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconBrandTabler,
    IconCalendarStats,
    IconClockHour4,
    IconMenu2,
    IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";

export function SidebarDemo({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const links = [
        {
            label: "Home",
            href: "#",
            icon: (
                <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Time Tracking",
            href: "/routes/punch",
            icon: (
                <IconClockHour4 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Analytics",
            href: "/routes/analytics",
            icon: (
                <IconCalendarStats className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        // {
        //     label: "Goals",
        //     href: "#",
        //     icon: (
        //         <IconTarget className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        //     ),
        // },
        // {
        //     label: "Profile",
        //     href: "#",
        //     icon: (
        //         <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        //     ),
        // },
        // {
        //     label: "Settings",
        //     href: "#",
        //     icon: (
        //         <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        //     ),
        // },
    ];

    return (
        <div className="flex min-h-screen w-full bg-neutral-100 dark:bg-neutral-800">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex fixed left-0 top-0 h-full z-[100]">
                <Sidebar open={open} setOpen={setOpen}>
                    <SidebarBody className="justify-between gap-10 relative z-50">
                        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                            {open ? <Logo /> : <LogoIcon />}
                            <div className="mt-8 flex flex-col gap-2">
                                {links.map((link, idx) => (
                                    <SidebarLink key={idx} link={link} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <SidebarLink
                                link={{
                                    label:
                                        user?.displayName ||
                                        user?.email ||
                                        "User",
                                    href: "#",
                                    icon: (
                                        <Image
                                            src={
                                                user?.photoURL ||
                                                "/images/userlogo.png"
                                            }
                                            className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                                            width={50}
                                            height={50}
                                            alt="Avatar"
                                        />
                                    ),
                                }}
                            />
                        </div>
                    </SidebarBody>
                </Sidebar>
            </div>

            {/* Mobile Sidebar Toggle Button */}
            <div className="md:hidden fixed top-5 left-6 z-[90] bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-2.5">
                <IconMenu2
                    className="text-neutral-800 dark:text-neutral-200 w-5 h-5 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    onClick={() => setOpen(true)}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {open && (
                    <div className="md:hidden fixed inset-0 z-[9999]">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60"
                            onClick={() => setOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{
                                type: "spring",
                                damping: 30,
                                stiffness: 300,
                            }}
                            className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-neutral-900 shadow-2xl flex flex-col z-[9999]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
                                <Logo />
                                <button
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center w-8 h-8 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors duration-200"
                                >
                                    <IconX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between p-4">
                                <div className="flex flex-col gap-2">
                                    {links.map((link, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                                        >
                                            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                {link.icon}
                                            </div>
                                            <span className="text-neutral-700 dark:text-neutral-200 text-sm font-medium">
                                                {link.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* User Info */}
                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src={
                                                    user?.photoURL ||
                                                    "/images/userlogo.png"
                                                }
                                                className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                                                width={50}
                                                height={50}
                                                alt="Avatar"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-neutral-700 dark:text-neutral-200 font-medium truncate">
                                                {user?.displayName ||
                                                    user?.email ||
                                                    "User"}
                                            </p>
                                            {user?.email &&
                                                user?.displayName && (
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                                        {user.email}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 min-h-screen md:ml-[60px]">
                {children}
            </div>
        </div>
    );
}

export const Logo = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                Chronix
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};
