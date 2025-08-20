"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
    Session,
    createSession,
    endSession,
    getSession,
    getCurrentActiveSession,
    checkAndHandleAutoPunchOut,
    formatLiveDuration,
} from "@/lib/firestore";

interface SessionContextType {
    currentSession: Session | null;
    isPunchedIn: boolean;
    currentDuration: string;
    isLoading: boolean;
    error: string | null;
    punchIn: () => Promise<void>;
    punchOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>(
    {} as SessionContextType
);

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
    const { user, loading: authLoading } = useAuth();
    const [currentSession, setCurrentSession] = useState<Session | null>(null);
    const [currentDuration, setCurrentDuration] = useState("00:00:00");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isPunchedIn = currentSession !== null && !currentSession.endAt;

    // Timer effect for live duration updates
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPunchedIn && currentSession) {
            interval = setInterval(() => {
                const duration = formatLiveDuration(currentSession.startAt);
                setCurrentDuration(duration);
            }, 1000);
        } else {
            setCurrentDuration("00:00:00");
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isPunchedIn, currentSession]);

    // Load session on app start
    useEffect(() => {
        if (authLoading || !user) return;

        const loadSession = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Check for auto punch out first
                const autoPunchedOut = await checkAndHandleAutoPunchOut();
                if (autoPunchedOut) {
                    setCurrentSession(null);
                    setIsLoading(false);
                    return;
                }

                // Check localStorage for active session
                const sessionId = localStorage.getItem("currentSessionId");

                if (sessionId) {
                    // Verify session still exists and is active
                    const session = await getSession(sessionId);
                    if (session && !session.endAt) {
                        setCurrentSession(session);
                    } else {
                        // Session was ended elsewhere, clean up localStorage
                        localStorage.removeItem("currentSessionId");
                        localStorage.removeItem("sessionStartTime");
                        setCurrentSession(null);
                    }
                } else {
                    // Check if user has any active session in Firestore
                    const activeSession = await getCurrentActiveSession(
                        user.uid
                    );
                    if (activeSession) {
                        setCurrentSession(activeSession);
                        // Update localStorage
                        localStorage.setItem(
                            "currentSessionId",
                            activeSession.id!
                        );
                        localStorage.setItem(
                            "sessionStartTime",
                            activeSession.startAt.toMillis().toString()
                        );
                    }
                }
            } catch (err) {
                console.error("Error loading session:", err);
                setError("Failed to load session data");
            } finally {
                setIsLoading(false);
            }
        };

        loadSession();
    }, [user, authLoading]);

    // Auto punch out check - runs every hour
    useEffect(() => {
        if (!isPunchedIn) return;

        const checkAutoPunchOut = async () => {
            const autoPunchedOut = await checkAndHandleAutoPunchOut();
            if (autoPunchedOut) {
                setCurrentSession(null);
            }
        };

        // Check every hour
        const interval = setInterval(checkAutoPunchOut, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, [isPunchedIn]);

    const punchIn = async () => {
        if (!user) {
            setError("User not authenticated");
            return;
        }

        if (isPunchedIn) {
            setError("Already punched in");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            console.log("Attempting to punch in for user:", user.uid);

            const { sessionId, startAt } = await createSession(user.uid);

            console.log("Session created successfully:", {
                sessionId,
                startAt,
            });

            const newSession: Session = {
                id: sessionId,
                userId: user.uid,
                startAt,
            };

            setCurrentSession(newSession);
            console.log("Session state updated");
        } catch (err) {
            console.error("Punch in error:", err);
            setError(err instanceof Error ? err.message : "Failed to punch in");
        } finally {
            setIsLoading(false);
        }
    };

    const punchOut = async () => {
        if (!currentSession || !isPunchedIn) {
            setError("No active session to punch out");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            await endSession(currentSession.id!);
            setCurrentSession(null);
        } catch (err) {
            console.error("Punch out error:", err);
            setError(
                err instanceof Error ? err.message : "Failed to punch out"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const refreshSession = async () => {
        if (!user || !currentSession) return;

        try {
            const session = await getSession(currentSession.id!);
            setCurrentSession(session);
        } catch (err) {
            console.error("Error refreshing session:", err);
            setError("Failed to refresh session data");
        }
    };

    const value = {
        currentSession,
        isPunchedIn,
        currentDuration,
        isLoading,
        error,
        punchIn,
        punchOut,
        refreshSession,
    };

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
};
