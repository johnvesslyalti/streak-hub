// components/NewStreakForm.tsx
"use client";

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { FormEvent } from 'react'; // Import FormEvent for correct typing

// --- Props for NewStreakForm ---
interface NewStreakFormProps {
    onCreate: (name: string) => Promise<void>; // Function from page.tsx to call createStreak and refresh
}

// --- Sub-Component for the Submit Button ---
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        // Enhanced button styling: use blue accent, large padding, shadow, and rounded-xl
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-r-xl transition disabled:opacity-50 shadow-md shadow-blue-900/50 flex-shrink-0"
        >
            {pending ? "Adding..." : "Add Goal"}
        </button>
    );
}

// --- Main New Streak Form Component ---
export default function NewStreakForm({ onCreate }: NewStreakFormProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Function to handle the form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmedName = name.trim();
        if (!trimmedName) {
            // Display error prominently
            setError("Please enter a clear name for your new streak goal.");
            return;
        }

        // Call the parent handler which runs the Server Action and refreshes
        await onCreate(trimmedName);

        // Clear the input field after successful submission
        setName('');
    };

    return (
        // Enhanced container: larger padding, more rounded, and dedicated background
        <div className="max-w-xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
            <h3 className="text-2xl font-extrabold mb-5 text-center text-blue-400">
                Start a New Streak
            </h3>

            <form onSubmit={handleSubmit} className="flex gap-0">
                {/* Enhanced input styling: border, large text, focus ring, and dark background */}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., No PMO, Meditate Daily"
                    required
                    className="flex-grow p-3 border border-gray-600 bg-gray-900 rounded-l-xl text-gray-100 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <SubmitButton />
            </form>

            {error && (
                // Prominent error message styling
                <p className="mt-4 text-red-400 text-sm font-medium text-center">
                    🚨 {error}
                </p>
            )}
        </div>
    );
}