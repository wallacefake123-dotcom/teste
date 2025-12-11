import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-10 w-auto" }) => (
  <svg 
    viewBox="0 0 100 50" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`${className} pointer-events-none select-none`}
    aria-label="Cube Car Logo"
    style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
  >
    {/* Right Loop & Background Diagonal */}
    <path 
      d="M70 10 H90 L100 25 L90 40 H70 L30 10 H50 L70 25 L60 40" 
      fill="#1A202C" 
      fillRule="evenodd"
    />
    <path 
      d="M50 40 L30 40 L70 10 L50 10"
      fill="#1A202C"
      className="opacity-80"
    />
    
    {/* Left Loop */}
    <path 
      d="M30 40 H10 L0 25 L10 10 H30" 
      fill="#1A202C" 
    />

    {/* Center Crossover (Blue) - Updated to #3667AA */}
    <path 
      d="M30 10 L70 40 H50 L30 25 L30 10Z" 
      fill="#3667AA" 
    />
    <path 
      d="M30 10 H50 L70 40 L50 40 L30 10" 
      fill="#3667AA" 
    />
  </svg>
);

export default Logo;