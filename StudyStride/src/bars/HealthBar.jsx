import React from 'react';

const HealthBar = ({ value = 0, onFill }) => {
  return (
    <div className="bar-container">
      <span className="bar-label">
        <button className="bar-emoji-btn" onClick={onFill}>❤</button> HEALTH
      </span>
      <div className="bar-segments">
        {[...Array(10)].map((_, i) => (
          <span key={i} className={`bar-segment${i < value ? ' filled' : ''}`}></span>
        ))}
      </div>
    </div>
  );
};

export default HealthBar;
