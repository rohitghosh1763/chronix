"use client";
import React from "react";
import { motion } from "framer-motion";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-6 py-32 bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900 transition-colors duration-500">
            <motion.div
                className="max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 dark:text-white leading-tight mb-6">
                    Everything You <br />
                    <span className="text-blue-600 dark:text-blue-400">
                        Need
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-light mb-12 max-w-2xl mx-auto">
                    Built for simplicity, powered by Firebase. No clutter. Just
                    focused tracking.
                </p>
            </motion.div>

            <div className="w-full max-w-6xl mx-auto mt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
                    {[
                        {
                            title: "One-Tap Punch In",
                            iconBg: "from-green-400 to-green-600",
                            iconPath:
                                "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
                            desc: "Start tracking with a single click. Your session begins immediately and logs securely in Firebase.",
                        },
                        {
                            title: "One-Tap Punch Out",
                            iconBg: "from-red-400 to-red-600",
                            iconPath:
                                "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l-5-5 5-5M21 12H9",
                            desc: "End your day with one button. Session ends and duration is auto-calculated in the backend.",
                        },
                        {
                            title: "Auto Timeout at 11:59 PM",
                            iconBg: "from-yellow-400 to-yellow-600",
                            iconPath:
                                "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                            desc: "If you forget to punch out, we'll automatically stop your session at 11:59 PM to ensure accuracy.",
                        },
                        {
                            title: "Daily Work Summary",
                            iconBg: "from-blue-400 to-blue-600",
                            iconPath:
                                "M9 12l2 2 4-4M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z",
                            desc: "Easily view how much time you've worked each day, and keep track of your productivity over time.",
                        },
                        {
                            title: "Realtime Status Detection",
                            iconBg: "from-purple-400 to-purple-600",
                            iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                            desc: "See if you're currently punched in or out. Status is synced in real-time across devices.",
                        },
                    ].map(({ title, iconBg, iconPath, desc }) => (
                        <motion.div
                            key={title}
                            className="text-center group"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            whileHover={{ y: -4 }}
                        >
                            <div
                                className={`w-20 h-20 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl group-hover:scale-110 transition-transform duration-200`}
                            >
                                <svg
                                    className="w-9 h-9 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={iconPath}
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
