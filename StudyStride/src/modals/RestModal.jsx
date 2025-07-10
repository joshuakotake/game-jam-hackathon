import { useState, useEffect } from 'react';

export default function RestModal({ onComplete, activityType }) {
  const storageKey = `restEndTime-${activityType}`;

  // Get or create end time
  const getEndTime = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored) return new Date(parseInt(stored, 10));

    const now = new Date();
    const secondsToAdd =
      activityType === 'energy' ? 15 * 60 :
      activityType === 'thirst' ? 5 * 60 :
      30 * 60;
    const newEnd = new Date(now.getTime() + secondsToAdd * 1000);
    localStorage.setItem(storageKey, newEnd.getTime().toString());
    return newEnd;
  };

  const [endTime] = useState(getEndTime);

  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const difference = endTime - now;
    return difference > 0 ? difference : 0;
  });

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Countdown but don't auto-close
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = endTime - now;
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  // Handle manual complete
  const handleComplete = () => {
    localStorage.removeItem(storageKey); // Clean up
    onComplete(); // Close modal and resume game
  };

  const activityNames = {
    energy: 'get some rest',
    thirst: 'drink some water',
    hunger: 'eat some food'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Break Time!</h2>
        <p className="text-gray-700">
          Step away from the screen and {activityNames[activityType]}. Make sure to be back before the timer runs out!
        </p>
        
        <div className="text-3xl font-medium text-center my-4 text-gray-800">
          {formatTime(timeLeft)}
        </div>

        {timeLeft <= 0 && (
          <p className="text-center text-red-500 mb-2">Time's up! You can now return.</p>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleComplete}
            className="rounded-lg bg-gray-600 px-4 py-3 text-sm text-white shadow hover:bg-gray-700"
          >
            {timeLeft > 0 ? 'Complete Early' : 'Return'}
          </button>
        </div>
      </div>
    </div>
  );
}
