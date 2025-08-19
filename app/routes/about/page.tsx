"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-6 py-32 bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900 transition-colors duration-500">
            <motion.div
                className="max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 dark:text-white leading-tight mb-6">
                    About <br />
                    <span className="text-blue-600 dark:text-blue-400">
                        Chronix
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-light mb-12 max-w-2xl mx-auto">
                    A simple, effective time tracking solution built with React
                    and Firebase.
                </p>
            </motion.div>

            <div className="w-full max-w-6xl mx-auto mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
                    {[
                        {
                            title: "Our Mission",
                            iconBg: "from-blue-400 to-blue-600",
                            iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                            desc: "To provide the simplest, most reliable way to track your work hours without the complexity of traditional time tracking tools.",
                        },
                        {
                            title: "Built With",
                            iconBg: "from-purple-400 to-purple-600",
                            iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
                            desc: "Next.js 15, React 19, Firebase, Tailwind CSS, and TypeScript. Modern technologies for a reliable experience.",
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
