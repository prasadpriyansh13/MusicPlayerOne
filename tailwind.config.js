/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8A2BE2', // purplish-blue
          light: '#9D50BB',
          dark: '#6A0DAD',
        },
        secondary: {
          DEFAULT: '#FF6B81', // pinkish
          light: '#FF8A9D',
          dark: '#D84C65',
        },
        background: {
          light: '#FFFFFF',
          dark: '#121212',
        },
        text: {
          light: '#333333',
          dark: '#E0E0E0',
        }
      },
    },
  },
  plugins: [],
}

