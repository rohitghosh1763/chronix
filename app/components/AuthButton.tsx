"use client";

import { useAuth } from "@/contexts/AuthContext";

export const AuthButton = () => {
    const { user, loading, signInWithGoogle, logout } = useAuth();

    if (loading) {
        return (
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        );
    }

    if (user) {
        return (
            <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <img
                    src="/images/userlogo.png"
                    alt="User"
                    className="w-8 h-8 rounded-full border-2 border-[#e0e0e0] dark:border-[#334155] object-cover"
                />

                {/* Logout Button */}
                <button
                    onClick={logout}
                    className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={signInWithGoogle}
            className="text-[#2e2e2e] dark:text-[#f3f4f6] hover:text-[#2563eb] dark:hover:text-[#3b82f6] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2563eb] dark:focus:ring-[#3b82f6] focus:ring-opacity-50 rounded-lg px-3 py-2 hover:bg-[#f3f4f6] dark:hover:bg-[#334155]/50"
        >
            Login
        </button>
    );
};
