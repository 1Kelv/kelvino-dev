import React from 'react';

interface MHeartIconProps {
  size?: number;
  className?: string;
}

// Heart silhouette with M-shaped top profile — two defined peaks with a deeper valley
export function MHeartIcon({ size = 32, className = '' }: MHeartIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="
        M 50 89
        C 22 73, 2 57, 2 36
        C 2 17, 14 6, 28 11
        C 37 15, 45 27, 50 35
        C 55 27, 63 15, 72 11
        C 86 6, 98 17, 98 36
        C 98 57, 78 73, 50 89
        Z
      " />
    </svg>
  );
}
