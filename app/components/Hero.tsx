"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
    const { user, signInWithGoogle } = useAuth();
    const firstName = user?.displayName?.split(" ")[0] || "there";

    return (
        <div className=" min-h-screen flex flex-col justify-center items-center px-6 py-32 bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900 transition-colors duration-500">
            <motion.div
                className="max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {user && (
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-md rounded-full border border-neutral-200 dark:border-neutral-700 shadow-md">
                            <img
                                src={user.photoURL || "/images/userlogo.png"}
                                alt="Profile"
                                className="w-9 h-9 rounded-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "/images/userlogo.png";
                                }}
                            />
                            <span className="text-neutral-800 dark:text-neutral-200 font-medium text-base">
                                Welcome back,{" "}
                                <span className="font-semibold">
                                    {firstName}
                                </span>{" "}
                                👋
                            </span>
                        </div>
                    </div>
                )}

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 dark:text-white leading-tight mb-6">
                    Log your <br />
                    <span className="text-blue-600 dark:text-blue-400">
                        work hours
                    </span>{" "}
                    with ease
                </h1>

                <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-light mb-12 max-w-2xl mx-auto">
                    Stay focused while we track the time for you
                </p>

                {user ? (
                    <Link href={"/routes/punch"}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="mb-20 inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full text-lg transition-all shadow-lg"
                        >
                            Track Time
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </motion.button>
                    </Link>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={signInWithGoogle}
                        className="mb-20 inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full text-lg transition-all shadow-lg"
                    >
                        Get Started
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </motion.button>
                )}
            </motion.div>

            <div className="w-full max-w-6xl mx-auto mt-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
                    {[
                        {
                            title: "Punch In",
                            iconBg: "from-green-400 to-green-600",
                            iconPath: "M12 6v6m0 0v6m0-6h6m-6 0H6",
                            desc: "One click to start your day",
                        },
                        {
                            title: "Auto Track",
                            iconBg: "from-blue-400 to-blue-600",
                            iconPath:
                                "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                            desc: "Time runs quietly in the background",
                        },
                        {
                            title: "Punch Out",
                            iconBg: "from-red-400 to-red-600",
                            iconPath: "M6 18L18 6M6 6l12 12",
                            desc: "End your shift effortlessly",
                        },
                    ].map(({ title, iconBg, iconPath, desc }) => (
                        <motion.div
                            key={title}
                            className="text-center group"
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 200 }}
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
};

export default Hero;
