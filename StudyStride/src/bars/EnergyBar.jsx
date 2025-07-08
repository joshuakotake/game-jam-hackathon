import React from 'react';

const EnergyBar = ({ value = 0, onFill }) => {
  return (
    <div className="bar-container">
      <span className="bar-label">
        <button className="bar-emoji-btn" onClick={onFill} aria-label="Fill Energy Bar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 13 13" shapeRendering="crispEdges" width="24" height="24">
            <metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
            <path stroke="#000000" d="M2 0h9M1 1h1M11 1h1M0 2h1M6 2h3M12 2h1M0 3h1M5 3h1M8 3h1M12 3h1M0 4h1M4 4h1M7 4h1M12 4h1M0 5h1M3 5h1M6 5h5M12 5h1M0 6h1M2 6h1M10 6h1M12 6h1M0 7h1M2 7h5M9 7h1M12 7h1M0 8h1M5 8h1M8 8h1M12 8h1M0 9h1M4 9h1M7 9h1M12 9h1M0 10h1M4 10h3M12 10h1M1 11h1M11 11h1M2 12h9" />
            <path stroke="#ffffff" d="M2 1h5M1 2h2M1 3h1M1 4h1M1 5h1M1 6h1" />
            <path stroke="#d4d4d4" d="M7 1h4M3 2h3M9 2h3M2 3h3M6 3h1M9 3h3M2 4h2M5 4h1M8 4h3M2 5h1M4 5h1M3 6h1M1 7h1M1 8h4M6 8h1M9 8h1M1 9h3M5 9h1M8 9h1M1 10h3M2 11h2" />
            <path stroke="#a1a1a1" d="M7 3h1M6 4h1M11 4h1M5 5h1M11 5h1M4 6h5M11 6h1M7 7h1M10 7h2M7 8h1M10 8h1M6 9h1M9 9h2M7 10h3M4 11h4" />
          </svg>
        </button> ENERGY
      </span>
      <div className="bar-segments">
        {[...Array(10)].map((_, i) => (
          <span key={i} className={`bar-segment${i < value ? ' filled' : ''}`}></span>
        ))}
      </div>
    </div>
  );
};

export default EnergyBar;
