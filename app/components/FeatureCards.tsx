"use client";
import React from "react";
import {
    IconClock,
    IconTarget,
    IconTrendingUp,
    IconCalendarStats,
} from "@tabler/icons-react";

export function FeatureCards() {
    const features = [
        {
            icon: <IconClock className="w-6 h-6" />,
            title: "Smart Time Tracking",
            description: "Automatically track your time across projects and tasks with intelligent detection.",
        },
        {
            icon: <IconTarget className="w-6 h-6" />,
            title: "Goal Setting",
            description: "Set and achieve your productivity goals with precision and data-driven insights.",
        },
        {
            icon: <IconTrendingUp className="w-6 h-6" />,
            title: "Performance Analytics",
            description: "Gain deep insights into your productivity patterns and optimize your workflow.",
        },
        {
            icon: <IconCalendarStats className="w-6 h-6" />,
            title: "Detailed Reports",
            description: "Comprehensive reports to track progress and identify areas for improvement.",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                >
                    <div className="text-blue-600 dark:text-blue-400 mb-4">
                        {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                    </p>
                </div>
            ))}
        </div>
    );
}

