import React from 'react';

const HealthBar = ({ value = 0 }) => {
  const getSegmentColor = (index) => {
    if (index >= value) return 'bg-gray-200';
    
    if (value <= 2) return 'bg-red-500';
    if (value <= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="flex items-center mb-4 font-medium text-lg tracking-wide max-w-full sm:flex-row flex-col sm:items-center items-start">
      <div className="flex items-center mr-4 tracking-wider w-28 sm:w-28 md:w-32 mb-2 sm:mb-0">
        <button
          className="mb-1 sm:mb-0 bg-gray-800 border-2 border-white rounded-md text-white text-xl mr-2 
          cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:scale-110 
          active:bg-gray-700 active:scale-95 focus:outline-none px-1.5 py-0.5"
          aria-label="Fill Health Bar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 13 13" shapeRendering="crispEdges" width="24" height="24">
            <metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
            <path stroke="#000000" d="M2 0h9M1 1h1M11 1h1M0 2h1M3 2h3M7 2h3M12 2h1M0 3h1M2 3h1M6 3h1M10 3h1M12 3h1M0 4h1M2 4h1M10 4h1M12 4h1M0 5h1M2 5h1M10 5h1M12 5h1M0 6h1M2 6h1M10 6h1M12 6h1M0 7h1M3 7h1M9 7h1M12 7h1M0 8h1M4 8h1M8 8h1M12 8h1M0 9h1M5 9h1M7 9h1M12 9h1M0 10h1M6 10h1M12 10h1M1 11h1M11 11h1M2 12h9" />
            <path stroke="#ffffff" d="M2 1h5M1 2h2M1 3h1M1 4h1M1 5h1M1 6h1M1 7h1" />
            <path stroke="#d4d4d4" d="M7 1h4M10 2h2M3 3h2M11 3h1M3 4h1M8 4h1M3 5h1M8 5h1M2 7h1M1 8h3M9 8h1M1 9h4M8 9h1M1 10h5M2 11h2" />
            <path stroke="#a1a1a1" d="M5 3h1M8 3h2M4 4h2M7 4h1M9 4h1M11 4h1M4 5h4M9 5h1M11 5h1M3 6h7M11 6h1M4 7h4M10 7h2M5 8h2M10 8h1M9 9h2M7 10h3M4 11h4" />
          </svg>
        </button> 
        HEALTH
      </div>
      <div className="flex gap-1 flex-wrap sm:flex-nowrap">
        {[...Array(10)].map((_, index) => (
          <div 
            key={index}
            className={`w-7 h-5 border-2 border-gray-800 box-border ${getSegmentColor(index)}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HealthBar;
