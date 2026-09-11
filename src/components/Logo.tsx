import React from 'react';
import './Logo.css';

/*
  Monogram mark: a shield silhouette (the fraud-operations half of the job)
  holding a "KO" cut from it, with a signal pulse running through the middle.
  Drawn inline as SVG so it stays crisp, themes with the page and costs no
  extra network request.
*/
const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`logo-mark ${className ?? ''}`} aria-hidden="true">
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ko-grad" x1="6" y1="3" x2="42" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--logo-from)" />
          <stop offset="1" stopColor="var(--logo-to)" />
        </linearGradient>
      </defs>

      {/* Shield */}
      <path
        d="M24 3.5 41.5 9.2v14.4c0 10.4-7 17.9-17.5 21.4C13.5 41.5 6.5 34 6.5 23.6V9.2L24 3.5Z"
        stroke="url(#ko-grad)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        fill="var(--logo-fill)"
      />

      {/* K */}
      <path
        d="M17 16v16M17 24.2l6.4-8.2M17.9 23.4 24.2 32"
        stroke="url(#ko-grad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* O */}
      <circle cx="32" cy="24" r="4.6" stroke="url(#ko-grad)" strokeWidth="2.6" />

      {/* Signal pulse */}
      <path
        className="logo-pulse"
        d="M8 37.5h6.5l2.6-4.4 3 7.2 2.6-5h5"
        stroke="var(--logo-pulse)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

export default Logo;
