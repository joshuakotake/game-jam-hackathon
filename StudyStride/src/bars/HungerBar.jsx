import React from 'react';

const HungerBar = ({ value = 0, onFill }) => {
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
          onClick={onFill}
          className="mb-1 sm:mb-0 bg-gray-800 border-2 border-white rounded-md text-white text-xl mr-2 
                     cursor-pointer transition-all duration-200 hover:bg-gray-600 hover:scale-110 
                     active:bg-gray-700 active:scale-95 focus:outline-none px-1.5 py-0.5"
          aria-label="Fill Hunger Bar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 13 13" shapeRendering="crispEdges" width="24" height="24">
            <metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
            <path stroke="#000000" d="M2 0h9M1 1h1M11 1h1M0 2h1M4 2h2M12 2h1M0 3h1M3 3h1M6 3h1M12 3h1M0 4h1M2 4h1M7 4h1M12 4h1M0 5h1M2 5h1M8 5h1M12 5h1M0 6h1M3 6h1M8 6h1M12 6h1M0 7h1M4 7h1M7 7h1M12 7h1M0 8h1M5 8h2M12 8h1M0 9h1M12 9h1M0 10h1M12 10h1M1 11h1M11 11h1M2 12h9" />
            <path stroke="#ffffff" d="M2 1h5M1 2h2M1 3h1M1 4h1M1 5h1M1 6h1M8 7h1M7 8h3M8 9h3M9 10h1" />
            <path stroke="#d4d4d4" d="M7 1h4M3 2h1M6 2h6M2 3h1M7 3h5M3 4h1M8 4h3M3 5h1M9 5h2M2 6h1M9 6h1M1 7h3M9 7h1M1 8h4M1 9h7M1 10h5M2 11h2" />
            <path stroke="#a1a1a1" d="M4 3h2M4 4h2M11 4h1M4 5h3M11 5h1M4 6h3M10 6h2M5 7h1M10 7h2M10 8h1M6 10h3M4 11h4" />
          </svg>
        </button> HUNGER
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

export default HungerBar;
