// components/NewStreakForm.tsx
"use client";

import { useState } from 'react';
import { useFormStatus } from 'react-dom';

// --- Props for NewStreakForm ---
interface NewStreakFormProps {
    onCreate: (name: string) => Promise<void>; // Function from page.tsx to call createStreak and refresh
}

// --- Sub-Component for the Submit Button ---
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-r-lg transition disabled:opacity-50"
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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmedName = name.trim();
        if (!trimmedName) {
            setError("Please enter a name for your new streak.");
            return;
        }

        // Call the parent handler which runs the Server Action and refreshes
        await onCreate(trimmedName);

        // Clear the input field after successful submission (or handle failure within onCreate)
        setName('');
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl border border-blue-700">
            <h3 className="text-xl font-bold mb-4 text-center text-blue-400">
                New Streak Goal
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., No PMO, Read Daily, No Sugar"
                    required
                    className="flex-grow p-3 border border-gray-600 bg-gray-900 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <SubmitButton />
            </form>

            {error && (
                <p className="mt-3 text-red-400 text-sm text-center">
                    {error}
                </p>
            )}
        </div>
    );
}