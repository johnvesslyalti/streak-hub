// app/page.tsx
"use client";

import { useEffect, useState } from 'react';
// Import the new deleteStreak Server Action
import { getAllStreaks, createStreak, deleteStreak } from './actions';
import { StreakData } from '@/types/streak';
import NewStreakForm from '@/component/NewStreakForm';
import StreakCard from '@/component/StreakCard';

export default function Home() {
  const [streaks, setStreaks] = useState<StreakData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStreaks = async () => {
    setLoading(true);
    const result = await getAllStreaks();

    if ('error' in result) {
      setError(result.error);
      setStreaks([]);
    } else {
      setStreaks(result);
      setError(null);
    }
    setLoading(false);
  };

  const handleCreateNewStreak = async (name: string) => {
    const result = await createStreak(name);
    if (result.success) {
      await loadStreaks(); // Refresh the list
    } else {
      alert(`Error creating streak: ${result.error}`);
    }
  };

  // FIX 2: Implementation of handleDeleteStreak
  const handleDeleteStreak = async (id: number) => {
    // Optimistically remove the streak from the UI first for better UX
    setStreaks(prev => prev.filter(s => s.id !== id));

    const result = await deleteStreak(id); // Call the Server Action

    if (result.success) {
      // Success! The list is already updated optimistically.
      console.log(`Streak ID ${id} deleted successfully.`);
    } else {
      // Failure: Alert user and reload the full list to revert the optimistic update
      alert(`Error deleting streak: ${result.error}. Reloading data.`);
      await loadStreaks();
    }
  };

  useEffect(() => {
    loadStreaks();
  }, []);

  // Use a sleek full-screen loading state
  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-teal-400 text-3xl font-semibold animate-pulse">
        Loading Streak Hub...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      {/* Enhanced main title styling: huge, bold, and accented with teal-400 */}
      <h1 className="text-6xl font-black mb-10 pt-4 text-center text-teal-400 tracking-wider">
        🔥 Streak Hub
      </h1>

      {/* Prominent error display */}
      {error && <div className="max-w-4xl mx-auto text-center p-4 bg-red-800 rounded-lg mb-8 text-lg font-medium shadow-xl">{error}</div>}

      <NewStreakForm onCreate={handleCreateNewStreak} />

      {/* Section Divider and Title Styling */}
      <h2 className="text-3xl font-bold mt-16 mb-8 text-center text-gray-300 border-b border-gray-700 pb-3">
        My Active Goals
      </h2>

      {/* Responsive Grid for Streak Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {streaks.length === 0 ? (
          <p className="col-span-full text-center text-lg text-gray-500 p-12 bg-gray-900 rounded-xl border border-dashed border-gray-700">
            No active streaks found. Start your journey by adding a new goal above!
          </p>
        ) : (
          streaks.map((streak) => (
            <StreakCard
              key={streak.id}
              streak={streak}
              onResetSuccess={loadStreaks}
              // FIX 3: PASS THE REQUIRED PROP TO RESOLVE THE TYPESCRIPT ERROR
              onDeleteSuccess={handleDeleteStreak}
            />
          ))
        )}
      </div>
    </div>
  );
}