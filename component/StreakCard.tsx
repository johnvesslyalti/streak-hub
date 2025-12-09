// components/StreakCard.tsx
"use client";

import { useFormStatus } from 'react-dom';
import { resetStreak } from '@/app/actions';
import { StreakData } from '@/types/streak';

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
    // useFormStatus is great for providing immediate feedback (pending state)
    const { pending } = useFormStatus();

    // We wrap the Server Action in a client function to handle the confirmation and refresh logic
    const handleReset = async () => {
        // 1. Confirmation
        if (!window.confirm(`Are you sure you want to reset the streak for "${streakId}"? This means you had a slip.`)) {
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
        // Note: This button is placed within an explicit <form> tag to leverage 
        // the useFormStatus hook, even though the action is called manually above.
        // We use a custom action handler, not the form's default action.
        <button 
      onClick= { handleReset }
    type = "button" // Use type="button" since we handle submission via onClick
    disabled = { pending }
    className = "mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50 w-full"
        >
        { pending? "Resetting...": "Slip! Reset" }
        </button>
  );
}

// --- Main Streak Card Component ---
export default function StreakCard({ streak, onResetSuccess }: StreakCardProps) {
    const { id, name, currentStreak, maxStreak, startDate } = streak;

    return (
        <div className= "bg-gray-800 p-6 rounded-lg shadow-xl border border-green-700 hover:border-green-400 transition duration-300" >
        <h3 className="text-2xl font-bold text-center mb-4 text-green-400 uppercase tracking-wide truncate" >
            { name }
            </h3>

            < div className = "text-center mb-6" >
                <p className="text-sm uppercase tracking-wider text-gray-400" > Current Streak </p>
                    < p className = "text-7xl font-black text-white leading-none" >
                        { currentStreak }
                        </p>
                        < p className = "text-lg font-semibold mt-1 text-gray-300" > Days </p>
                            </div>

                            < div className = "flex justify-between text-sm text-gray-400 border-t border-gray-700 pt-3" >
        <p>
          ** Record:** <span className="text-yellow-400" > { maxStreak } Days </span>
        </p>
        <p>
        ** Started:** <span className="text-gray-300" > { startDate } </span>
            </p>
            </div>

            < ResetButton streakId = { id } onResetSuccess = { onResetSuccess } />

                </div>
  );
}