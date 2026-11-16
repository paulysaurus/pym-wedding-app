/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
      colors: {
        ivory: '#FAF8F5',
        champagne: '#EFECE6',
        gold: '#B69B66',
      }
    },
  },
  plugins: [],
}
