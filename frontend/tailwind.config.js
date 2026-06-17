/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0a0e1a',
        darkcard: '#0f1729',
      }
    },
  },
  plugins: [],
}