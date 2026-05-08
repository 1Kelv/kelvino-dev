import React from 'react';

interface MHeartIconProps {
  size?: number;
  className?: string;
}

// M-shaped heart: two sharp peaks with a deep open valley between them.
// Unlike a regular heart (shallow dip, round bumps), the top profile
// clearly resembles the letter M — high pointed peaks, valley drops deep.
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
      {/*
        Path traces clockwise from bottom point:
        - Bottom tip at (50, 92)
        - Up the left exterior to the left M-peak at (27, 7)
        - Sharp diagonal DOWN into the M-valley at (50, 48)
        - Sharp diagonal UP to the right M-peak at (73, 7)
        - Down the right exterior back to bottom tip

        Peak y=7, valley y=48 → 41px drop = very pronounced M notch
      */}
      <path d="
        M 50 92
        C 18 75, 2 58, 2 36
        C 2 14, 13 3, 27 7
        C 37 11, 44 30, 50 48
        C 56 30, 63 11, 73 7
        C 87 3, 98 14, 98 36
        C 98 58, 82 75, 50 92
        Z
      " />
    </svg>
  );
}
