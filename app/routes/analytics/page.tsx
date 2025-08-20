"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSession } from "@/app/contexts/SessionContext";
import { getUserSessions, Session, formatDuration } from "@/app/lib/firestore";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import {
    IconClock,
    IconCalendar,
    IconTrendingUp,
    IconChartBar,
    IconUser,
    IconClockPlay,
    IconClockStop,
    IconEdit,
    IconTrash,
    IconX,
    IconCheck,
} from "@tabler/icons-react";

interface SessionStats {
    totalSessions: number;
    totalHours: number;
    averageSessionHours: number;
    thisWeekHours: number;
    thisMonthHours: number;
    longestSession: number;
}

const Analytics = () => {
    const { user, signInWithGoogle } = useAuth();
    const { currentSession, isPunchedIn, currentDuration } = useSession();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [stats, setStats] = useState<SessionStats>({
        totalSessions: 0,
        totalHours: 0,
        averageSessionHours: 0,
        thisWeekHours: 0,
        thisMonthHours: 0,
        longestSession: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
    });

    // Load user sessions
    const loadSessions = async () => {
        if (!user) return;

        setIsLoading(true);
        setError(null);

        try {
            // console.log("Loading sessions for user:", user.uid);

            // Get sessions using simple query (no composite index required)
            const q = query(
                collection(db, "sessions"),
                where("userId", "==", user.uid)
            );

            const querySnapshot = await getDocs(q);
            console.log("Found sessions:", querySnapshot.size);

            const userSessions: Session[] = [];
            querySnapshot.forEach((doc: any) => {
                const sessionData = doc.data();
                // console.log("Session data:", sessionData);
                userSessions.push({
                    id: doc.id,
                    ...sessionData,
                } as Session);
            });

            // Sort sessions by startAt in JavaScript (newest first)
            userSessions.sort(
                (a, b) => b.startAt.toMillis() - a.startAt.toMillis()
            );

            // Limit to last 50 sessions
            const limitedSessions = userSessions.slice(0, 50);

            setSessions(limitedSessions);
            calculateStats(limitedSessions);
        } catch (err) {
            console.error("Error loading sessions:", err);
            setError("Failed to load session data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, [user]);

    const calculateStats = (sessionList: Session[]) => {
        console.log("Calculating stats for sessions:", sessionList.length);

        if (sessionList.length === 0) {
            setStats({
                totalSessions: 0,
                totalHours: 0,
                averageSessionHours: 0,
                thisWeekHours: 0,
                thisMonthHours: 0,
                longestSession: 0,
            });
            return;
        }

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        let totalMinutes = 0;
        let thisWeekMinutes = 0;
        let thisMonthMinutes = 0;
        let longestMinutes = 0;
        let completedSessions = 0;

        sessionList.forEach((session) => {
            console.log(
                "Processing session:",
                session.id,
                "Duration:",
                session.durationMinutes
            );

            // Only count completed sessions for statistics
            if (session.durationMinutes && session.durationMinutes > 0) {
                const sessionDate = session.startAt.toDate();
                totalMinutes += session.durationMinutes;
                longestMinutes = Math.max(
                    longestMinutes,
                    session.durationMinutes
                );
                completedSessions++;

                if (sessionDate >= oneWeekAgo) {
                    thisWeekMinutes += session.durationMinutes;
                }
                if (sessionDate >= oneMonthAgo) {
                    thisMonthMinutes += session.durationMinutes;
                }
            }
        });

        console.log("Calculated stats:", {
            totalMinutes,
            completedSessions,
            thisWeekMinutes,
            thisMonthMinutes,
            longestMinutes,
        });

        setStats({
            totalSessions: completedSessions, // Only count completed sessions
            totalHours: Math.round((totalMinutes / 60) * 10) / 10,
            averageSessionHours:
                completedSessions > 0
                    ? Math.round((totalMinutes / completedSessions / 60) * 10) /
                      10
                    : 0,
            thisWeekHours: Math.round((thisWeekMinutes / 60) * 10) / 10,
            thisMonthHours: Math.round((thisMonthMinutes / 60) * 10) / 10,
            longestSession: Math.round((longestMinutes / 60) * 10) / 10,
        });
    };

    // Handle editing a session
    const handleEditSession = (session: Session) => {
        setEditingSession(session);
        const startDate = session.startAt.toDate();
        const endDate = session.endAt ? session.endAt.toDate() : new Date();

        setEditForm({
            startDate: startDate.toISOString().split("T")[0],
            startTime: startDate.toTimeString().slice(0, 5),
            endDate: endDate.toISOString().split("T")[0],
            endTime: endDate.toTimeString().slice(0, 5),
        });
        setIsEditModalOpen(true);
    };

    // Save edited session
    const handleSaveEdit = async () => {
        if (!editingSession || !user) return;

        try {
            const startDateTime = new Date(
                `${editForm.startDate}T${editForm.startTime}`
            );
            const endDateTime = new Date(
                `${editForm.endDate}T${editForm.endTime}`
            );

            if (endDateTime <= startDateTime) {
                setError("End time must be after start time");
                return;
            }

            // Calculate new duration
            const durationMs = endDateTime.getTime() - startDateTime.getTime();
            const durationMinutes = Math.round(durationMs / (1000 * 60));

            const sessionRef = doc(db, "sessions", editingSession.id!);
            await updateDoc(sessionRef, {
                startAt: Timestamp.fromDate(startDateTime),
                endAt: Timestamp.fromDate(endDateTime),
                durationMinutes: durationMinutes,
            });

            // Reload sessions to get updated data
            await loadSessions();

            setIsEditModalOpen(false);
            setEditingSession(null);
            setError(null);
        } catch (err) {
            console.error("Error updating session:", err);
            setError("Failed to update session");
        }
    };

    // Delete a session
    const handleDeleteSession = async (sessionId: string) => {
        if (!user || !confirm("Are you sure you want to delete this session?"))
            return;

        try {
            const sessionRef = doc(db, "sessions", sessionId);
            await deleteDoc(sessionRef);

            // Reload sessions to get updated data
            await loadSessions();
        } catch (err) {
            console.error("Error deleting session:", err);
            setError("Failed to delete session");
        }
    };

    const formatDate = (timestamp: any) => {
        return timestamp.toDate().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (timestamp: any) => {
        return timestamp.toDate().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getSessionDuration = (session: Session) => {
        if (session.durationMinutes && session.durationMinutes > 0) {
            return formatDuration(session.durationMinutes);
        }
        return "In Progress";
    };

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center px-6 pt-24 pb-16 bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <IconUser className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                        Analytics Dashboard
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
                        Sign in to view your work session analytics and time
                        tracking statistics.
                    </p>
                    <motion.button
                        onClick={signInWithGoogle}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                    >
                        Sign In to View Analytics
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 pt-24 pb-16 bg-gradient-to-b from-white to-neutral-50 dark:from-black dark:to-neutral-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                        Analytics Dashboard
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Track your work hours and productivity insights
                    </p>
                </motion.div>

                {/* Current Session Status */}
                {isPunchedIn && currentSession && (
                    <motion.div
                        className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <IconClockPlay className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="text-green-800 dark:text-green-200 font-medium">
                                Currently Working
                            </span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-green-900 dark:text-green-100">
                            {currentDuration}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Started at {formatTime(currentSession.startAt)} on{" "}
                            {formatDate(currentSession.startAt)}
                        </div>
                    </motion.div>
                )}

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {[
                        {
                            title: "Total Hours",
                            value: `${stats.totalHours}h`,
                            icon: IconClock,
                            color: "blue",
                            change: `${stats.totalSessions} sessions`,
                        },
                        {
                            title: "This Week",
                            value: `${stats.thisWeekHours}h`,
                            icon: IconTrendingUp,
                            color: "green",
                            change: `${stats.averageSessionHours}h avg/session`,
                        },
                        {
                            title: "This Month",
                            value: `${stats.thisMonthHours}h`,
                            icon: IconChartBar,
                            color: "purple",
                            change: `${stats.longestSession}h longest session`,
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700"
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div
                                    className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
                                >
                                    <stat.icon
                                        className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                                    />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                {stat.title}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-500">
                                {stat.change}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Error Display */}
                {error && (
                    <motion.div
                        className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                {/* Sessions List */}
                <motion.div
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                            <IconCalendar className="w-5 h-5" />
                            Recent Sessions
                        </h2>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-neutral-600 dark:text-neutral-400 mt-4">
                                    Loading sessions...
                                </p>
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="text-center py-8">
                                <IconClock className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    No sessions found. Start tracking your time!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sessions.map((session, index) => (
                                    <motion.div
                                        key={session.id}
                                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05,
                                        }}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <IconCalendar className="w-4 h-4 text-neutral-500" />
                                                <span className="font-medium text-neutral-900 dark:text-white">
                                                    {formatDate(
                                                        session.startAt
                                                    )}
                                                </span>
                                                {!session.endAt && (
                                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                <div className="flex items-center gap-2">
                                                    <IconClockPlay className="w-4 h-4 text-green-500" />
                                                    <span>
                                                        In:{" "}
                                                        {formatTime(
                                                            session.startAt
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <IconClockStop className="w-4 h-4 text-red-500" />
                                                    <span>
                                                        Out:{" "}
                                                        {session.endAt
                                                            ? formatTime(
                                                                  session.endAt
                                                              )
                                                            : "Still working"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <IconClock className="w-4 h-4 text-blue-500" />
                                                    <span className="font-mono">
                                                        Duration:{" "}
                                                        {getSessionDuration(
                                                            session
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                                            <button
                                                onClick={() =>
                                                    handleEditSession(session)
                                                }
                                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit Session"
                                            >
                                                <IconEdit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteSession(
                                                        session.id!
                                                    )
                                                }
                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Session"
                                            >
                                                <IconTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingSession && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsEditModalOpen(false)}
                    >
                        <motion.div
                            className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-neutral-200 dark:border-neutral-700"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                    Edit Session
                                </h3>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                                >
                                    <IconX className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editForm.startDate}
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    startDate: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={editForm.startTime}
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    startTime: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            value={editForm.endDate}
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    endDate: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={editForm.endTime}
                                            onChange={(e) =>
                                                setEditForm((prev) => ({
                                                    ...prev,
                                                    endTime: e.target.value,
                                                }))
                                            }
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                    >
                                        <IconCheck className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() =>
                                            setIsEditModalOpen(false)
                                        }
                                        className="flex-1 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Analytics;
