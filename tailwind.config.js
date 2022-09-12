/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      'sans': ['Montserrat', 'sans-serif'],
      'display': ['Pacifico', 'cursive'],
      'rounded': ['Comfortaa', 'Montserrat', 'sans-serif'],
      'body': ['Ralway', 'sans-serif'],
      'mono': ['Fira Code', 'monospace'],
    },
    extend: {
      dropShadow: {
        'light': '10px 10px 8px rgba(0,0,0,0.9)',
        'dark': '5px 5px 4px rgba(210,210,210,0.5)'
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
