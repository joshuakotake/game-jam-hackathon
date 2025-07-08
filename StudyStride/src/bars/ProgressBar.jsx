import React, { useState, useEffect } from 'react';

const ProgressBar = ({ dueDate }) => {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const due = new Date(dueDate);
      
      // Calculate time remaining
      const timeDiff = due.getTime() - now.getTime();
      const isOverdueNow = timeDiff <= 0;
      
      // Get the start time from localStorage or use current time as start
      let startTime = localStorage.getItem('assignmentStartTime');
      if (!startTime) {
        startTime = now.getTime();
        localStorage.setItem('assignmentStartTime', startTime);
      }
      
      // Calculate total time from start to due date
      const totalTime = due.getTime() - parseInt(startTime);
      const elapsed = now.getTime() - parseInt(startTime);
      
      // Calculate progress percentage
      const progressPercentage = Math.min(Math.max((elapsed / totalTime) * 100, 0), 100);
      
      // Format time remaining
      let timeString = '';
      if (isOverdueNow) {
        timeString = 'Overdue!';
      } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          timeString = `${days}d ${hours}h ${minutes}m remaining`;
        } else if (hours > 0) {
          timeString = `${hours}h ${minutes}m remaining`;
        } else if (minutes > 0) {
          timeString = `${minutes}m remaining`;
        } else {
          timeString = 'Due now!';
        }
      }
      
      setProgress(progressPercentage);
      setTimeRemaining(timeString);
      setIsOverdue(isOverdueNow);
    };

    // Update immediately
    updateProgress();
    
    // Update every minute
    const interval = setInterval(updateProgress, 60000);
    
    return () => clearInterval(interval);
  }, [dueDate]);

  const getProgressColor = () => {
    if (isOverdue) return 'bg-red-500';
    if (progress > 80) return 'bg-red-400';
    if (progress > 60) return 'bg-orange-400';
    if (progress > 40) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getTextColor = () => {
    if (isOverdue) return 'text-red-600';
    if (progress > 80) return 'text-red-500';
    if (progress > 60) return 'text-orange-500';
    return 'text-gray-700';
  };

  return (
    <div className="w-full bg-gray-800 p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-300">Assignment Progress</h3>
        <span className="italic text-sm font-medium text-gray-300">
          {timeRemaining}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="mt-1 text-xs text-gray-300 text-right">
        {Math.round(progress)}% time elapsed
      </div>
    </div>
  );
};

export default ProgressBar;