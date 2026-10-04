/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#090d16',
        panel: '#0d1322',
        subtle: '#151d30',
        border: '#1e293b',
      },
    },
  },
  plugins: [],
};