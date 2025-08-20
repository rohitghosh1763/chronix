"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { testFirebaseConnection, createSession } from "@/lib/firestore";
import { db, auth } from "@/lib/firebase";

const FirebaseDebug = () => {
    const { user } = useAuth();
    const [testResult, setTestResult] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const runConnectionTest = async () => {
        setIsLoading(true);
        setTestResult("");

        try {
            // Test basic Firebase config
            console.log("Firebase Config Check:");
            console.log("Auth:", !!auth);
            console.log("Firestore:", !!db);
            console.log("User:", !!user);
            console.log("User ID:", user?.uid);

            // Test environment variables
            console.log("Environment Variables:");
            console.log(
                "API Key:",
                process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Missing"
            );
            console.log(
                "Project ID:",
                process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Set" : "Missing"
            );
            console.log(
                "Auth Domain:",
                process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Missing"
            );

            if (!user?.uid) {
                setTestResult("❌ No authenticated user");
                return;
            }

            // Test Firestore connection
            const connectionTest = await testFirebaseConnection(user.uid);

            if (connectionTest) {
                setTestResult("✅ Firebase connection successful!");
            } else {
                setTestResult("❌ Firebase connection failed");
            }
        } catch (error) {
            console.error("Debug test error:", error);
            setTestResult(
                `❌ Error: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const testSessionCreation = async () => {
        if (!user?.uid) {
            setTestResult("❌ No authenticated user");
            return;
        }

        setIsLoading(true);
        setTestResult("");

        try {
            console.log("Testing session creation...");
            const result = await createSession(user.uid);
            console.log("Session created successfully:", result);
            setTestResult(`✅ Session created! ID: ${result.sessionId}`);
        } catch (error) {
            console.error("Session creation failed:", error);
            setTestResult(
                `❌ Session creation failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Only show in development
    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-49 bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg border z-50 max-w-sm">
            <h3 className="text-sm font-bold mb-2">Firebase Debug</h3>
            <div className="text-xs space-y-1 mb-3">
                <div>Auth: {auth ? "✅" : "❌"}</div>
                <div>Firestore: {db ? "✅" : "❌"}</div>
                <div>User: {user ? "✅" : "❌"}</div>
                <div>User ID: {user?.uid || "None"}</div>
            </div>

            <button
                onClick={runConnectionTest}
                disabled={isLoading}
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 disabled:opacity-50 mr-2"
            >
                {isLoading ? "Testing..." : "Test Connection"}
            </button>

            <button
                onClick={testSessionCreation}
                disabled={isLoading}
                className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 disabled:opacity-50"
            >
                {isLoading ? "Creating..." : "Test Session"}
            </button>

            {testResult && <div className="mt-2 text-xs">{testResult}</div>}
        </div>
    );
};

export default FirebaseDebug;
