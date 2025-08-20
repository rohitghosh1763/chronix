import {
    doc,
    collection,
    addDoc,
    updateDoc,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Session {
    id?: string;
    userId: string;
    startAt: Timestamp;
    endAt?: Timestamp;
    durationMinutes?: number;
}

export interface SessionData {
    userId: string;
    startAt: Timestamp;
    endAt?: Timestamp;
    durationMinutes?: number;
}

// Create a new session (Punch In)
export const createSession = async (
    userId: string
): Promise<{ sessionId: string; startAt: Timestamp }> => {
    try {
        console.log("Creating session for user:", userId);

        const startAt = Timestamp.now();
        const sessionData: SessionData = {
            userId,
            startAt,
        };

        // console.log("Session data:", sessionData);

        const docRef = await addDoc(collection(db, "sessions"), sessionData);

        console.log("Session created with ID:", docRef.id);

        // Store session info in localStorage
        localStorage.setItem("currentSessionId", docRef.id);
        localStorage.setItem("sessionStartTime", startAt.toMillis().toString());

        return { sessionId: docRef.id, startAt };
    } catch (error) {
        console.error("Error creating session:", error);

        // More detailed error logging
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }

        throw new Error("Failed to punch in. Please try again.");
    }
};

// Update session with end time (Punch Out)
export const endSession = async (
    sessionId: string
): Promise<{ durationMinutes: number }> => {
    try {
        const endAt = Timestamp.now();
        const sessionRef = doc(db, "sessions", sessionId);

        // Get the session to calculate duration
        const sessionDoc = await getDoc(sessionRef);
        if (!sessionDoc.exists()) {
            throw new Error("Session not found");
        }

        const sessionData = sessionDoc.data() as SessionData;
        const startAt = sessionData.startAt;

        // Calculate duration in minutes
        const durationMillis = endAt.toMillis() - startAt.toMillis();
        const durationMinutes = Math.round(durationMillis / (1000 * 60));

        // Update the session
        await updateDoc(sessionRef, {
            endAt,
            durationMinutes,
        });

        // Clear localStorage
        localStorage.removeItem("currentSessionId");
        localStorage.removeItem("sessionStartTime");

        return { durationMinutes };
    } catch (error) {
        console.error("Error ending session:", error);
        throw new Error("Failed to punch out. Please try again.");
    }
};

// Get session by ID
export const getSession = async (
    sessionId: string
): Promise<Session | null> => {
    try {
        const sessionRef = doc(db, "sessions", sessionId);
        const sessionDoc = await getDoc(sessionRef);

        if (!sessionDoc.exists()) {
            return null;
        }

        return { id: sessionDoc.id, ...sessionDoc.data() } as Session;
    } catch (error) {
        console.error("Error getting session:", error);
        return null;
    }
};

// Get user's current active session (no endAt)
export const getCurrentActiveSession = async (
    userId: string
): Promise<Session | null> => {
    try {
        const q = query(
            collection(db, "sessions"),
            where("userId", "==", userId),
            orderBy("startAt", "desc"),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        // Check if the most recent session is still active (no endAt)
        const doc = querySnapshot.docs[0];
        const sessionData = doc.data() as SessionData;

        if (!sessionData.endAt) {
            return { id: doc.id, ...sessionData } as Session;
        }

        return null;
    } catch (error) {
        console.error("Error getting active session:", error);
        return null;
    }
};

// Get user's session history
export const getUserSessions = async (
    userId: string,
    limitCount: number = 10
): Promise<Session[]> => {
    try {
        const q = query(
            collection(db, "sessions"),
            where("userId", "==", userId),
            orderBy("startAt", "desc"),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const sessions: Session[] = [];

        querySnapshot.forEach((doc) => {
            sessions.push({ id: doc.id, ...doc.data() } as Session);
        });

        return sessions;
    } catch (error) {
        console.error("Error getting user sessions:", error);
        return [];
    }
};

// Auto punch out at 11:59 PM
export const autoPunchOut = async (sessionId: string): Promise<void> => {
    try {
        const sessionRef = doc(db, "sessions", sessionId);

        // Get the session to calculate duration
        const sessionDoc = await getDoc(sessionRef);
        if (!sessionDoc.exists()) {
            throw new Error("Session not found");
        }

        const sessionData = sessionDoc.data() as SessionData;
        const startAt = sessionData.startAt;

        // Set end time to 11:59 PM of the same day
        const startDate = startAt.toDate();
        const endOfDay = new Date(startDate);
        endOfDay.setHours(23, 59, 59, 999);
        const endAt = Timestamp.fromDate(endOfDay);

        // Calculate duration in minutes
        const durationMillis = endAt.toMillis() - startAt.toMillis();
        const durationMinutes = Math.round(durationMillis / (1000 * 60));

        // Update the session
        await updateDoc(sessionRef, {
            endAt,
            durationMinutes,
        });

        // Clear localStorage
        localStorage.removeItem("currentSessionId");
        localStorage.removeItem("sessionStartTime");
    } catch (error) {
        console.error("Error auto punching out:", error);
    }
};

// Check if auto punch out is needed
export const checkAndHandleAutoPunchOut = async (): Promise<boolean> => {
    const sessionId = localStorage.getItem("currentSessionId");
    const startTimeStr = localStorage.getItem("sessionStartTime");

    if (!sessionId || !startTimeStr) {
        return false;
    }

    const startTime = new Date(parseInt(startTimeStr));
    const now = new Date();

    // Check if it's a different day
    if (startTime.toDateString() !== now.toDateString()) {
        await autoPunchOut(sessionId);
        return true; // Auto punch out happened
    }

    return false; // No auto punch out needed
};

// Format duration for display
export const formatDuration = (durationMinutes: number): string => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:00`;
};

// Format duration from timestamps for live timer
export const formatLiveDuration = (
    startAt: Timestamp,
    currentTime?: Date
): string => {
    const now = currentTime || new Date();
    const startTime = startAt.toDate();
    const diffMs = now.getTime() - startTime.getTime();

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Test Firebase connection
export const testFirebaseConnection = async (
    userId: string
): Promise<boolean> => {
    try {
        console.log("Testing Firebase connection for user:", userId);

        // Try to read existing sessions for the user (this should be allowed by security rules)
        const q = query(
            collection(db, "sessions"),
            where("userId", "==", userId),
            limit(1)
        );

        await getDocs(q);
        console.log("Successfully queried sessions collection");

        return true;
    } catch (error) {
        console.error("Firebase connection test failed:", error);
        return false;
    }
};
