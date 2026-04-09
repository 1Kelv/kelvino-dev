/** @type {import('tailwindcss').Config} */
// I configure Tailwind with brand colours for Mylestone
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          mint: '#4ECDC4',
          sky: '#45B7D1',
          light: '#E8F8F7',
          dark: '#2A9D8F',
        },
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
