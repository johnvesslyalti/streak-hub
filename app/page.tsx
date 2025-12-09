// app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { getAllStreaks, createStreak } from './actions';
import StreakCard from '@/component/StreakCard'
import { StreakData } from '@/types/streak'; // Import the type
import NewStreakForm from '@/component/NewStreakForm';

export default function Home() {
  // Initialize state with the StreakData[] type
  const [streaks, setStreaks] = useState<StreakData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStreaks = async () => {
    setLoading(true);
    const result = await getAllStreaks();

    // Check if the result is an error object
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

  useEffect(() => {
    loadStreaks();
  }, []);

  if (loading) return <div className="text-center p-8 text-xl">Loading Streaks...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-green-400">
        Streak Hub
      </h1>

      {error && <div className="text-center p-4 bg-red-800 rounded mb-6">{error}</div>}

      <NewStreakForm onCreate={handleCreateNewStreak} />

      <h2 className="text-2xl font-semibold mt-12 mb-6 border-b border-gray-700 pb-2">
        My Active Streaks
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streaks.length === 0 ? (
          <p className="col-span-full text-center text-gray-400">
            No streaks yet. Use the form above to add your first goal!
          </p>
        ) : (
          streaks.map((streak) => (
            <StreakCard key={streak.id} streak={streak} onResetSuccess={loadStreaks} />
          ))
        )}
      </div>
    </div>
  );
}