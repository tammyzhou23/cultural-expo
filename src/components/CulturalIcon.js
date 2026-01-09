import React from 'react';

// Custom icon representing cultural exploration - a minimalist globe with a star symbol
const CulturalIcon = ({ className = "w-5 h-5 text-white" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Globe circle */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Latitude lines */}
      <path
        d="M3 12h18M8.5 6.5c2.5 1.5 4.5 1.5 7 0M8.5 17.5c2.5-1.5 4.5-1.5 7 0"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Longitude line */}
      <path
        d="M12 3v18"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Cultural star symbol in center */}
      <path
        d="M12 8l1.5 3 3.5 0.5-2.5 2 0.5 3.5-3-2-3 2 0.5-3.5-2.5-2 3.5-0.5z"
        fill="currentColor"
      />
    </svg>
  );
};

export default CulturalIcon;
