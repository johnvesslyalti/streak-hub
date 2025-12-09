// components/StreakCard.tsx
"use client";

import { useFormStatus } from 'react-dom';
import { resetStreak } from '@/app/actions';
import { StreakData } from '@/types/streak';
import { FormEvent } from 'react'; // Import FormEvent for correct typing

// --- Props for StreakCard ---
interface StreakCardProps {
    streak: StreakData;
    onResetSuccess: () => Promise<void>; // Function to refresh the list in the parent
}

// --- Sub-Component for Reset Button (Client Component) ---
interface ResetButtonProps {
    streakId: number;
    onResetSuccess: () => Promise<void>;
}

function ResetButton({ streakId, onResetSuccess }: ResetButtonProps) {
    const { pending } = useFormStatus();

    // The handler function is the key to managing the reset flow
    const handleReset = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission

        // 1. Confirmation
        if (!window.confirm(`Are you sure you want to reset this streak? This means you had a slip.`)) {
            return;
        }

        // 2. Call Server Action
        const result = await resetStreak(streakId);

        // 3. Handle Result
        if (result.success) {
            // Refresh the parent list (Home page)
            onResetSuccess();
        } else {
            alert(`Reset failed: ${result.error}`);
        }
    };

    return (
        // The button is placed inside a <form> for useFormStatus to work correctly.
        // We use the onSubmit handler for custom logic, including confirmation.
        <form onSubmit={handleReset}>
            <button
                type="submit" // Use type="submit" for form submission
                disabled={pending}
                // Enhanced Tailwind Classes for the "Slip! Reset" button
                className="mt-6 bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-6 rounded-xl transition duration-150 disabled:opacity-50 w-full shadow-lg shadow-red-900/50"
            >
                {pending ? "Resetting..." : "Slip! Reset"}
            </button>
        </form>
    );
}

// --- Main Streak Card Component ---
export default function StreakCard({ streak, onResetSuccess }: StreakCardProps) {
    const { id, name, currentStreak, maxStreak, startDate } = streak;

    return (
        // Enhanced Card Styling: Dark background, premium border, and subtle shadow
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

            <div className="flex justify-between text-base text-gray-400 border-t border-gray-700 pt-3 mt-4">
                <p className="font-medium">
                    {/* Record Styling */}
                    <span className='font-bold'>Record:</span> <span className="text-yellow-400 font-bold">{maxStreak} Days</span>
                </p>
                <p className="text-gray-500">
                    {/* Start Date Styling */}
                    <span className='font-bold text-gray-400'>Started:</span> <span className="text-gray-300">{startDate}</span>
                </p>
            </div>

            <ResetButton streakId={id} onResetSuccess={onResetSuccess} />

        </div>
    );
}