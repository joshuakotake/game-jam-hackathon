import React, { useState, useEffect } from 'react';

const ProgressBar = ({ dueDate }) => {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const due = new Date(dueDate);
      
      // Calculate time remaining
      const timeDiff = due.getTime() - now.getTime();
      
      // Get the start time from localStorage or use current time as start
      let startTime = localStorage.getItem('assignmentStartTime');
      if (!startTime) {
        startTime = now.getTime();
        localStorage.setItem('assignmentStartTime', startTime);
      }

      const totalTime = due.getTime() - parseInt(startTime);
      const elapsed = now.getTime() - parseInt(startTime);
      const progressPercentage = Math.min(Math.max((elapsed / totalTime) * 100, 0), 100);
      
      // Format time remaining
      let timeString = '';
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      if (days > 0) {
        timeString = `${days}d ${hours}h ${minutes}m remaining`;
      } else if (hours > 0) {
        timeString = `${hours}h ${minutes}m remaining`;
      } else if (minutes > 0) {
        timeString = `${minutes}m ${seconds}s remaining`;
      } else if (seconds > 0) {
        timeString = `${seconds}s remaining`;
      } else {
        timeString = 'Due now!';
      }
      
      setProgress(progressPercentage);
      setTimeRemaining(timeString);
    };

    updateProgress();
    
    const interval = setInterval(updateProgress, 1000);
    
    return () => clearInterval(interval);
  }, [dueDate]);

  return (
    <div className="w-full bg-[#303030] p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-300">Task Progress</h3>
        <span className="italic text-sm font-medium text-gray-300">
          {timeRemaining}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out bg-green-400"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-300 text-right">
        {Math.round(progress)}% time elapsed
      </div>
    </div>
  );
};

export default ProgressBar;
