// app/actions.ts
"use server";

import { unstable_noStore as noStore } from 'next/cache';
import { StreakData, ActionResponse } from '@/types/streak'; // Import types
import { prisma } from '@/lib/prisma';

const USER_ID = 1; // Hardcoded user ID for single-user environment

/**
 * Helper function to calculate the current streak length in days.
 * @param startDate The date the streak began.
 * @returns The number of full days in the streak.
 */
function calculateStreak(startDate: Date): number {
    const start = new Date(startDate);
    const now = new Date();

    // Set time to midnight for accurate day comparison
    start.setUTCHours(0, 0, 0, 0);
    now.setUTCHours(0, 0, 0, 0);

    const diffTime = Math.abs(now.getTime() - start.getTime());
    // Convert to days (floor ensures only full days count)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

// --- Action 1: Fetch All Streaks for Home Screen ---
export async function getAllStreaks(): Promise<StreakData[] | { error: string }> {
    noStore();

    try {
        // Prisma returns the DbStreak structure (or similar)
        const streaks = await prisma.streak.findMany({
            where: { userId: USER_ID },
            orderBy: { id: 'asc' },
        });

        // Map and calculate the current streak
        return streaks.map(data => ({
            id: data.id,
            name: data.name,
            currentStreak: calculateStreak(data.startDate),
            maxStreak: data.maxStreakDays,
            // Format the date for display
            startDate: data.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        }));

    } catch (error) {
        console.error("Prisma error fetching all streaks:", error);
        return { error: "Failed to fetch streaks." };
    }
}

// --- Action 2: Create a New Streak ---
export async function createStreak(name: string): Promise<ActionResponse> {
    if (!name || name.trim() === '') {
        return { success: false, error: "Streak name cannot be empty." };
    }

    const streakName = name.trim();

    try {
        await prisma.streak.create({
            data: {
                userId: USER_ID,
                name: streakName,
                startDate: new Date(),
                maxStreakDays: 0,
            },
        });

        return { success: true };
    } catch (error: any) {
        // Type assertion for error is necessary for code checking properties like 'code'
        if (error.code === 'P2002') {
            return { success: false, error: `Streak "${streakName}" already exists.` };
        }
        console.error("Prisma error creating streak:", error);
        return { success: false, error: "Failed to create new streak." };
    }
}

// --- Action 3: Reset a Specific Streak ---
export async function resetStreak(streakId: number): Promise<ActionResponse> {
    try {
        const data = await prisma.streak.findUnique({ where: { id: streakId } });

        if (!data) {
            return { success: false, error: "Streak not found." };
        }

        const currentStreakDays = calculateStreak(data.startDate);
        const newMaxStreakDays = Math.max(data.maxStreakDays, currentStreakDays);

        // Update the database
        await prisma.streak.update({
            where: { id: streakId },
            data: {
                startDate: new Date(), // Reset to today
                maxStreakDays: newMaxStreakDays,
                lastUpdated: new Date(),
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Prisma error resetting streak:", error);
        return { success: false, error: "Failed to reset streak." };
    }
}