// components/StreakCard.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useFormStatus } from 'react-dom';
import { resetStreak, deleteStreak } from '@/app/actions';
import { StreakData } from '@/types/streak';

// --- Props for StreakCard ---
interface StreakCardProps {
    streak: StreakData;
    onResetSuccess: () => Promise<void>;
    onDeleteSuccess: (streakId: number) => Promise<void>;
}

// --- Sub-Component: Reset Button ---
interface ResetButtonProps {
    streakId: number;
    onResetSuccess: () => Promise<void>;
}

function ResetButton({ streakId, onResetSuccess }: ResetButtonProps) {
    // useFormStatus is used to automatically get the pending state of the form it's inside.
    const { pending } = useFormStatus();

    // Handler for resetting the streak
    const handleReset = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!window.confirm("Are you sure you want to reset this streak? This means you had a slip.")) {
            return;
        }

        const result = await resetStreak(streakId);

        if (result.success) {
            onResetSuccess();
        } else {
            alert(`Reset failed: ${result.error}`);
        }
    };

    return (
        // Wrap button in a form to use useFormStatus
        <form onSubmit={handleReset} className="flex-grow">
            <button
                type="submit"
                disabled={pending}
                // Styling: Primary action (reset) uses the aggressive red color
                className="bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-6 rounded-xl transition duration-150 disabled:opacity-50 w-full shadow-lg shadow-red-900/50"
            >
                {pending ? "Resetting..." : "Slip! Reset"}
            </button>
        </form>
    );
}

// --- Sub-Component: Delete Button ---
interface DeleteButtonProps {
    streakId: number;
    onDeleteSuccess: (streakId: number) => Promise<void>;
}

function DeleteButton({ streakId, onDeleteSuccess }: DeleteButtonProps) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("WARNING: Are you sure you want to permanently delete this streak? All data will be lost.")) {
            return;
        }

        setDeleting(true);
        const result = await deleteStreak(streakId);
        setDeleting(false);

        if (result.success) {
            onDeleteSuccess(streakId); // Trigger list update in parent (optimistic removal)
        } else {
            alert(`Deletion failed: ${result.error}`);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            // Styling: Secondary action (delete) uses muted gray/red
            className="bg-gray-800 hover:bg-red-700/30 text-gray-400 font-semibold py-3 px-3 text-sm rounded-xl transition duration-150 disabled:opacity-50 border border-gray-700"
        >
            {deleting ? "Deleting..." : "🗑️ Delete"}
        </button>
    );
}

// --- Main Streak Card Component ---
export default function StreakCard({ streak, onResetSuccess, onDeleteSuccess }: StreakCardProps) {
    const { id, name, currentStreak, maxStreak, startDate } = streak;

    return (
        // Beautiful UI Styling: Dark background, premium border, and subtle shadow
        <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl border-2 border-teal-800 hover:border-teal-500 transition duration-300 transform hover:scale-[1.02] shadow-teal-900/50">

            <h3 className="text-3xl font-extrabold text-center mb-4 text-teal-400 uppercase tracking-widest truncate">
                {name}
            </h3>

            <div className="text-center mb-6">
                <p className="text-sm uppercase tracking-wider text-gray-500">Current Streak</p>
                {/* Hero Number Styling */}
                <p className="text-8xl font-black text-teal-400 leading-none">
                    {currentStreak}
                </p>
                <p className="text-xl font-semibold mt-1 text-gray-300">Days</p>
            </div>

            {/* Record and Date Info */}
            <div className="flex justify-between text-base text-gray-400 border-t border-gray-700 pt-3 mt-4">
                <p className="font-medium">
                    <span className='font-bold'>Record:</span> <span className="text-yellow-400 font-bold">{maxStreak} Days</span>
                </p>
                <p className="text-gray-500">
                    <span className='font-bold text-gray-400'>Started:</span> <span className="text-gray-300">{startDate}</span>
                </p>
            </div>

            {/* ACTION BUTTONS CONTAINER (Reset + Delete) */}
            <div className="flex items-stretch gap-3 pt-6 border-t border-gray-800 mt-6">
                <ResetButton streakId={id} onResetSuccess={onResetSuccess} />
                <DeleteButton streakId={id} onDeleteSuccess={onDeleteSuccess} />
            </div>

        </div>
    );
}