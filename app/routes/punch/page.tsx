"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";

const PunchPage = () => {
    const { user, signInWithGoogle } = useAuth();
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [punchInTime, setPunchInTime] = useState<Date | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [duration, setDuration] = useState("00:00:00");
    const [isLoading, setIsLoading] = useState(false);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Calculate duration when punched in
    useEffect(() => {
        if (isPunchedIn && punchInTime) {
            const diff = currentTime.getTime() - punchInTime.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
    }, [currentTime, isPunchedIn, punchInTime]);

    const handlePunchIn = async () => {
        if (!user) {
            signInWithGoogle();
            return;
        }
        
        setIsLoading(true);
        try {
            // TODO: Add Firebase logic here
            const now = new Date();
            setPunchInTime(now);
            setIsPunchedIn(true);
        } catch (error) {
            console.error("Punch in failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePunchOut = async () => {
        setIsLoading(true);
        try {
            // TODO: Add Firebase logic here
            setIsPunchedIn(false);
            setPunchInTime(null);
            setDuration("00:00:00");
        } catch (error) {
            console.error("Punch out failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-16 bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900 transition-colors duration-500">
            <motion.div
                className="w-full max-w-4xl mx-auto text-center relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Simple Status Text */}
                {isPunchedIn && (
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                        You're clocked in
                    </p>
                )}

                {/* Large Circular Timer */}
                <div className="mb-8">
                    <motion.div 
                        className="w-72 h-72 mx-auto rounded-full border-2 border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm flex items-center justify-center shadow-lg relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        style={{ zIndex: 1 }}
                    >
                        <span className="text-5xl font-mono font-bold text-neutral-900 dark:text-white">
                            {isPunchedIn ? duration : "00:00:00"}
                        </span>
                    </motion.div>
                </div>

                {/* Punch In/Out Buttons */}
                <div className="flex gap-4 justify-center mb-12">
                    <motion.button
                        onClick={handlePunchIn}
                        disabled={isLoading || (isPunchedIn || !user)}
                        whileHover={{ scale: (isPunchedIn || !user) ? 1 : 1.05 }}
                        whileTap={{ scale: (isPunchedIn || !user) ? 1 : 0.98 }}
                        className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all shadow-lg w-[160px] ${
                            (isPunchedIn || !user)
                                ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white shadow-xl hover:shadow-2xl"
                        }`}
                    >
                        Punch In
                    </motion.button>
                    
                    <motion.button
                        onClick={handlePunchOut}
                        disabled={isLoading || !isPunchedIn}
                        whileHover={{ scale: !isPunchedIn ? 1 : 1.05 }}
                        whileTap={{ scale: !isPunchedIn ? 1 : 0.98 }}
                        className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all shadow-lg w-[160px] ${
                            !isPunchedIn 
                                ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-2xl"
                        }`}
                    >
                        Punch Out
                    </motion.button>
                </div>

                {/* Status Cards */}
                <div className="w-full max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                        {[
                            {
                                title: "Current Time",
                                value: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            },
                            {
                                title: "Current Status", 
                                value: isPunchedIn ? "Punched in" : "Punched out"
                            },
                            {
                                title: "Todays hours",
                                value: isPunchedIn ? duration : "00:00:00"
                            }
                        ].map(({ title, value }) => (
                            <motion.div
                                key={title}
                                className="text-center"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-md">
                                    <h3 className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 font-medium">
                                        {title}
                                    </h3>
                                    <p className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
                                        {value}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sign in prompt for non-authenticated users */}
                {!user && (
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                            Sign in to start tracking your work hours
                        </p>
                        <motion.button
                            onClick={signInWithGoogle}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                        >
                            Sign In
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default PunchPage;
