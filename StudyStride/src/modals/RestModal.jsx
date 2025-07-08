import { useState, useEffect } from 'react';

export default function RestModal({ onComplete, activityType }) {
  // Calculate initial end time
  const getEndTime = () => {
    const now = new Date();
    const secondsToAdd = activityType === 'energy' ? 15 * 60 :
                        activityType === 'thirst' ? 5 * 60 :
                        30 * 60;
    return new Date(now.getTime() + secondsToAdd * 1000);
  };

  const [endTime] = useState(getEndTime());
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const difference = endTime - now;
    return difference > 0 ? difference : 0;
  });

  // Format milliseconds to MM:SS
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Countdown effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = endTime - now;
      if (difference <= 0) {
        setTimeLeft(0);
        onComplete();
        return;
      }
      setTimeLeft(difference);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [endTime, onComplete]);

  const activityNames = {
    energy: 'get some rest',
    thirst: 'drink some water',
    hunger: 'eat some food'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4"> Break Time!</h2>
        <p className="text-gray-700">Step away from the screen and {activityNames[activityType]}. Make sure to be back before the timer runs out!</p>
        
        <div className="text-3xl font-medium text-center my-4 text-gray-800">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              onComplete();
            }}
            className="rounded-lg bg-gray-600 px-4 py-3 text-sm text-white shadow hover:bg-gray-700"
          >
            Complete Early
          </button>
        </div>
      </div>
    </div>
  );
}