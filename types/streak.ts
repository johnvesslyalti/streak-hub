// types/streak.ts

/**
 * Defines the structure of a Streak record returned by the database/ORM (Prisma).
 */
export interface DbStreak {
    id: number;
    userId: number;
    name: string;
    startDate: Date; // Date object from Prisma
    maxStreakDays: number;
    lastUpdated: Date;
}

/**
 * Defines the structure of a Streak object passed to the frontend components.
 * This includes the calculated 'currentStreak' and a formatted 'startDate'.
 */
export interface StreakData {
    id: number;
    name: string;
    currentStreak: number;
    maxStreak: number;
    startDate: string; // Formatted date string for display
}

/**
 * Defines the structure of a Server Action response.
 */
export interface ActionResponse {
    success: boolean;
    error?: string;
}