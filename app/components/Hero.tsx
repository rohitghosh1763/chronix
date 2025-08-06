"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import React from "react";
import { FeatureCards } from "./FeatureCards";

const Hero = () => {
    const { user } = useAuth();

    return (
        <div className="pt-16 md:pt-24 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Main Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Master Your Time with{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Chronix
                        </span>
                    </h1>

                    {user ? (
                        <div className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6">
                            Welcome back,{" "}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {user.displayName?.split(" ")[0] || user.email}
                            </span>
                            ! Ready to make today productive? �
                        </div>
                    ) : (
                        <div className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6">
                            Transform your productivity with intelligent time
                            management
                        </div>
                    )}

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Chronix is your intelligent time management companion
                        that helps you track productivity, analyze habits, and
                        achieve your goals with data-driven insights and
                        seamless workflow optimization.
                    </p>

                    {/* CTA Buttons */}
                    {user ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg">
                                Start Tracking Time
                            </button>
                            <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 dark:hover:border-blue-400 font-semibold rounded-lg transition-colors duration-200">
                                View Analytics
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg">
                                Get Started Free
                            </button>
                            <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600 dark:hover:border-blue-400 font-semibold rounded-lg transition-colors duration-200">
                                Learn More
                            </button>
                        </div>
                    )}
                </div>

                {/* MacBook Scroll Component - Removed for now */}
                <div className="w-full py-20 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Experience Chronix Dashboard
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            Your complete productivity command center
                        </p>
                        <div className="max-w-4xl mx-auto">
                            <img
                                src="/images/chronix-dashboard.png"
                                alt="Chronix Dashboard Preview"
                                className="w-full h-auto rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Features Grid with Glowing Stars */}
                <FeatureCards />

                {/* Stats Section */}
                {user && (
                    <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
                            Your Productivity Dashboard
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    24h
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    Time Tracked This Week
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    85%
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    Productivity Score
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                    12
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    Goals Completed
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Hero;
