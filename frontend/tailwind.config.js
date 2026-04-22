/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563eb', // Blue
          yellow: '#facc15', // Yellow
          red: '#dc2626', // Red
          white: '#ffffff', // White
        }
      }
    },
  },
  plugins: [],
}
